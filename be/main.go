package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
	User    *User  `json:"user,omitempty"`
}

type User struct {
	ID       int    `json:"id"`
	Email    string `json:"email"`
	FullName string `json:"full_name"`
}

type Branch struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Location string `json:"location"`
}

type UserWithRole struct {
	ID       int    `json:"id"`
	Email    string `json:"email"`
	FullName string `json:"full_name"`
	Role     string `json:"role"`
	BranchID int    `json:"branch_id"`
}

func connectDB() (*sql.DB, error) {
	var psqlInfo string
	
	if os.Getenv("POSTGRES_URL") != "" {
		psqlInfo = os.Getenv("POSTGRES_URL")
	} else if os.Getenv("DATABASE_URL") != "" {
		psqlInfo = os.Getenv("DATABASE_URL")
	} else if os.Getenv("DB_HOST") != "" {
		psqlInfo = fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
			os.Getenv("DB_HOST"), os.Getenv("DB_PORT"), os.Getenv("DB_USER"),
			os.Getenv("DB_PASSWORD"), os.Getenv("DB_NAME"), "disable")
	} else {
		return nil, fmt.Errorf("database configuration not found")
	}

	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		return nil, err
	}

	if err = db.Ping(); err != nil {
		return nil, err
	}

	return db, nil
}

func Handler(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	switch r.URL.Path {
	case "/api/ping":
		fmt.Fprintf(w, `{"message": "pong from Go Standalone Server"}`)

	case "/api/login":
		handleLogin(w, r)

	case "/api/inventory":
		handleInventory(w, r)

	case "/api/maintenance":
		handleMaintenance(w, r)

	case "/api/users":
		handleUsers(w, r)

	case "/api/branches":
		handleBranches(w, r)

	case "/api/borrowing":
		handleBorrowing(w, r)

	case "/api/dashboard-stats":
		handleDashboardStats(w, r)

	default:
		w.WriteHeader(http.StatusNotFound)
		fmt.Fprintf(w, `{"error": "Endpoint tidak ditemukan"}`)
	}
}

func handleLogin(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	db, err := connectDB()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	defer db.Close()
	var user User
	err = db.QueryRow("SELECT id, email, full_name FROM users WHERE email = $1 AND password = $2", 
		req.Email, req.Password).Scan(&user.ID, &user.Email, &user.FullName)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	json.NewEncoder(w).Encode(LoginResponse{Status: "success", Message: "Login berhasil", User: &user})
}

func handleInventory(w http.ResponseWriter, r *http.Request) {
	db, err := connectDB()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	defer db.Close()

	if r.Method == "GET" {
		rows, err := db.Query("SELECT id, name, category, status, stock, location, COALESCE(type, 'mentah') FROM inventory")
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		defer rows.Close()
		var list []map[string]interface{}
		for rows.Next() {
			var id, stock int
			var name, category, status, location, itemType string
			rows.Scan(&id, &name, &category, &status, &stock, &location, &itemType)
			list = append(list, map[string]interface{}{
				"id": id, "name": name, "category": category, "status": status, "stock": stock, "location": location, "type": itemType,
			})
		}
		if list == nil {
			list = []map[string]interface{}{}
		}
		json.NewEncoder(w).Encode(list)
	} else if r.Method == "POST" {
		var req struct {
			Name     string `json:"name"`
			Category string `json:"category"`
			Status   string `json:"status"`
			Stock    int    `json:"stock"`
			Location string `json:"location"`
			Type     string `json:"type"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		if req.Type == "" {
			req.Type = "mentah"
		}
		_, err = db.Exec("INSERT INTO inventory (name, category, status, stock, location, type) VALUES ($1, $2, $3, $4, $5, $6)",
			req.Name, req.Category, req.Status, req.Stock, req.Location, req.Type)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(map[string]string{"status": "success"})
	} else if r.Method == "PUT" {
		var req struct {
			ID       int    `json:"id"`
			Name     string `json:"name"`
			Category string `json:"category"`
			Status   string `json:"status"`
			Stock    int    `json:"stock"`
			Location string `json:"location"`
			Type     string `json:"type"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		if req.Type == "" {
			req.Type = "mentah"
		}
		_, err = db.Exec("UPDATE inventory SET name=$1, category=$2, status=$3, stock=$4, location=$5, type=$6 WHERE id=$7",
			req.Name, req.Category, req.Status, req.Stock, req.Location, req.Type, req.ID)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(map[string]string{"status": "success"})
	} else if r.Method == "DELETE" {
		id := r.URL.Query().Get("id")
		if id == "" {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		_, err = db.Exec("DELETE FROM inventory WHERE id=$1", id)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(map[string]string{"status": "success"})
	}
}

func handleMaintenance(w http.ResponseWriter, r *http.Request) {
	db, err := connectDB()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	defer db.Close()
	if r.Method == "GET" {
		rows, err := db.Query(`SELECT m.id, i.name as asset, m.task_name, m.schedule_date, m.status, m.priority 
			FROM maintenance m JOIN inventory i ON m.inventory_id = i.id`)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		defer rows.Close()
		var list []map[string]interface{}
		for rows.Next() {
			var id int
			var asset, task, date, status, priority string
			rows.Scan(&id, &asset, &task, &date, &status, &priority)
			list = append(list, map[string]interface{}{"id": id, "asset": asset, "task": task, "date": date, "status": status, "priority": priority})
		}
		json.NewEncoder(w).Encode(list)
	}
}

func handleBranches(w http.ResponseWriter, r *http.Request) {
	db, err := connectDB()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	defer db.Close()

	if r.Method == "GET" {
		rows, err := db.Query("SELECT id, name, location FROM branches")
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		defer rows.Close()
		var branches []Branch
		for rows.Next() {
			var b Branch
			if err := rows.Scan(&b.ID, &b.Name, &b.Location); err == nil {
				branches = append(branches, b)
			}
		}
		if branches == nil {
			branches = []Branch{}
		}
		json.NewEncoder(w).Encode(branches)
	}
}

func handleUsers(w http.ResponseWriter, r *http.Request) {
	db, err := connectDB()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	defer db.Close()

	if r.Method == "GET" {
		rows, err := db.Query("SELECT id, email, full_name, COALESCE(role, 'admin_cabang'), COALESCE(branch_id, 1) FROM users")
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		defer rows.Close()
		var users []UserWithRole
		for rows.Next() {
			var u UserWithRole
			if err := rows.Scan(&u.ID, &u.Email, &u.FullName, &u.Role, &u.BranchID); err == nil {
				users = append(users, u)
			}
		}
		if users == nil {
			users = []UserWithRole{}
		}
		json.NewEncoder(w).Encode(users)
	} else if r.Method == "POST" {
		var req struct {
			Email    string `json:"email"`
			Password string `json:"password"`
			FullName string `json:"full_name"`
			Role     string `json:"role"`
			BranchID int    `json:"branch_id"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		_, err = db.Exec("INSERT INTO users (email, password, full_name, role, branch_id) VALUES ($1, $2, $3, $4, $5)",
			req.Email, req.Password, req.FullName, req.Role, req.BranchID)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(map[string]string{"status": "success"})
	}
}

func handleBorrowing(w http.ResponseWriter, r *http.Request) {
	db, err := connectDB()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	defer db.Close()

	if r.Method == "GET" {
		rows, err := db.Query("SELECT id, institution, pic, material_needs, purpose, to_char(created_at, 'DD/MM/YYYY'), status FROM borrowing_requests")
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var list []map[string]interface{}
		for rows.Next() {
			var id int
			var institution, pic, materialNeeds, purpose, date, status string
			rows.Scan(&id, &institution, &pic, &materialNeeds, &purpose, &date, &status)
			
			list = append(list, map[string]interface{}{
				"real_id":     id,
				"id":          fmt.Sprintf("REQ-%04d", id),
				"institution": institution,
				"pic":         pic,
				"items":       []string{materialNeeds}, // Simplification
				"purpose":     purpose,
				"date":        date,
				"status":      status,
			})
		}
		if list == nil {
			list = []map[string]interface{}{}
		}
		json.NewEncoder(w).Encode(list)
	} else if r.Method == "PUT" {
		var req struct {
			ID     int    `json:"id"`
			Status string `json:"status"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		_, err = db.Exec("UPDATE borrowing_requests SET status=$1 WHERE id=$2", req.Status, req.ID)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(map[string]string{"status": "success"})
	}
}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	(*w).Header().Set("Access-Control-Allow-Headers", "Content-Type")
}

func main() {
	// Memuat file .env jika ada
	err := godotenv.Load()
	if err != nil {
		log.Println("Info: Tidak ada file .env yang dimuat, menggunakan environment variables bawaan")
	}

	http.HandleFunc("/", Handler)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server berjalan di http://localhost:%s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
