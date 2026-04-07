package handler

import (
	"database/sql"
	"fmt"
	"net/http"
	"os"
	"sync"

	_ "github.com/lib/pq"
)

var (
	db     *sql.DB
	dbOnce sync.Once
)

// Fungsi untuk mendapatkan koneksi database (Singleton)
func getDB() (*sql.DB, error) {
	var err error
	dbOnce.Do(func() {
		dbHost := os.Getenv("DB_HOST")
		dbPort := os.Getenv("DB_PORT")
		dbUser := os.Getenv("DB_USER")
		dbPassword := os.Getenv("DB_PASSWORD")
		dbName := os.Getenv("DB_NAME")
		dbSSL := os.Getenv("DB_SSLMODE")

		psqlInfo := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
			dbHost, dbPort, dbUser, dbPassword, dbName, dbSSL)

		db, err = sql.Open("postgres", psqlInfo)
		if err != nil {
			fmt.Printf("Gagal membuka koneksi ke database: %v\n", err)
			return
		}

		err = db.Ping()
		if err != nil {
			fmt.Printf("Database tidak merespon (Ping gagal): %v\n", err)
			return
		}
	})
	return db, err
}

// Handler utama untuk menangani semua request ke /api/*
func Handler(w http.ResponseWriter, r *http.Request) {
	// Enable CORS
	enableCors(&w)

	// Handle OPTIONS (Preflight)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	// Routing sederhana berdasarkan path
	switch r.URL.Path {
	case "/api/ping":
		fmt.Fprintf(w, `{"message": "pong from Vercel Go Serverless!"}`)
	case "/api/db-check":
		conn, err := getDB()
		if err != nil || conn == nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprintf(w, `{"status": "error", "message": "Database terputus"}`)
			return
		}
		if err := conn.Ping(); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprintf(w, `{"status": "error", "message": "Database tidak merespon"}`)
			return
		}
		fmt.Fprintf(w, `{"status": "success", "message": "Database terhubung aman di Vercel!"}`)
	default:
		w.WriteHeader(http.StatusNotFound)
		fmt.Fprintf(w, `{"error": "Endpoint tidak ditemukan"}`)
	}
}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	(*w).Header().Set("Access-Control-Allow-Headers", "Content-Type")
}
