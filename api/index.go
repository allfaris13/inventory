package handler

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"os"

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
		fmt.Fprintf(w, `{"message": "pong from Vercel Go Serverless"}`)

	case "/api/login":
		handleVercelLogin(w, r)

	case "/api/inventory":
		handleVercelInventory(w, r)

	case "/api/maintenance":
		handleVercelMaintenance(w, r)

	default:
		w.WriteHeader(http.StatusNotFound)
		fmt.Fprintf(w, `{"error": "Endpoint tidak ditemukan"}`)
	}
}

func handleVercelLogin(w http.ResponseWriter, r *http.Request) {
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

func handleVercelInventory(w http.ResponseWriter, r *http.Request) {
	db, err := connectDB()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	defer db.Close()
	rows, err := db.Query("SELECT id, name, category, status, stock, location FROM inventory")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	defer rows.Close()
	var list []map[string]interface{}
	for rows.Next() {
		var id, stock int
		var name, category, status, location string
		rows.Scan(&id, &name, &category, &status, &stock, &location)
		list = append(list, map[string]interface{}{
			"id": id, "name": name, "category": category, "status": status, "stock": stock, "location": location,
		})
	}
	json.NewEncoder(w).Encode(list)
}

func handleVercelMaintenance(w http.ResponseWriter, r *http.Request) {
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

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	(*w).Header().Set("Access-Control-Allow-Headers", "Content-Type")
}
