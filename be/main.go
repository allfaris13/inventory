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

var db *sql.DB

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type User struct {
	ID       int    `json:"id"`
	Email    string `json:"email"`
	FullName string `json:"full_name"`
}

func initDB() {
	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: Tidak bisa memuat file .env, menggunakan environment variables sistem")
	}

	psqlInfo := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		os.Getenv("DB_HOST"), os.Getenv("DB_PORT"), os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"), os.Getenv("DB_NAME"), os.Getenv("DB_SSLMODE"))

	db, err = sql.Open("postgres", psqlInfo)
	if err != nil {
		log.Fatal("Gagal membuka koneksi ke database:", err)
	}

	err = db.Ping()
	if err != nil {
		log.Fatal("Database tidak merespon (Ping gagal):", err)
	}

	log.Println("Berhasil terhubung ke database!")
}

func handleLogin(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != "POST" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"status": "error", "message": "Format JSON salah"})
		return
	}

	var user User
	err := db.QueryRow("SELECT id, email, full_name FROM users WHERE email = $1 AND password = $2", 
		req.Email, req.Password).Scan(&user.ID, &user.Email, &user.FullName)

	w.Header().Set("Content-Type", "application/json")
	if err != nil {
		if err == sql.ErrNoRows {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(map[string]string{"status": "error", "message": "Email atau password salah"})
		} else {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"status": "error", "message": "Database error"})
		}
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":  "success",
		"message": "Login berhasil",
		"user":    user,
	})
}

func handleInventory(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	if r.Method != "GET" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	rows, err := db.Query("SELECT id, name, category, status, stock, location FROM inventory")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"status": "error", "message": err.Error()})
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
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(list)
}

func handleMaintenance(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
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
			list = append(list, map[string]interface{}{
				"id": id, "asset": asset, "task": task, "date": date, "status": status, "priority": priority,
			})
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(list)
	} else if r.Method == "POST" { // Reschedule
		var req struct {
			ID   int    `json:"id"`
			Date string `json:"date"`
		}
		json.NewDecoder(r.Body).Decode(&req)
		_, err := db.Exec("UPDATE maintenance SET schedule_date = $1 WHERE id = $2", req.Date, req.ID)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"status": "success"})
	}
}

func main() {
	initDB()
	defer db.Close()

	mux := http.NewServeMux()

	mux.HandleFunc("/api/ping", func(w http.ResponseWriter, r *http.Request) {
		enableCors(&w)
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprintf(w, `{"message": "pong from Go backend!"}`)
	})

	mux.HandleFunc("/api/login", handleLogin)
	mux.HandleFunc("/api/inventory", handleInventory)
	mux.HandleFunc("/api/maintenance", handleMaintenance)

	fmt.Println("Server backend berjalan di :8080...")
	log.Fatal(http.ListenAndServe(":8080", mux))
}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	(*w).Header().Set("Access-Control-Allow-Headers", "Content-Type")
}
