package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

var db *sql.DB

func initDB() {
	// Memuat variabel dari .env
	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: Tidak bisa memuat file .env, menggunakan environment variables sistem")
	}

	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	dbSSL := os.Getenv("DB_SSLMODE")

	// Menyusun connection string PostgreSQL
	psqlInfo := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		dbHost, dbPort, dbUser, dbPassword, dbName, dbSSL)

	// Membuka koneksi database
	db, err = sql.Open("postgres", psqlInfo)
	if err != nil {
		log.Fatal("Gagal membuka koneksi ke database:", err)
	}

	// Mengetes koneksi (Ping)
	err = db.Ping()
	if err != nil {
		log.Fatal("Database tidak merespon (Ping gagal):", err)
	}

	log.Println("Berhasil terhubung ke database!")
}

func main() {
	initDB()
	defer db.Close()

	mux := http.NewServeMux()

	// Endpoint dasar
	mux.HandleFunc("/api/ping", func(w http.ResponseWriter, r *http.Request) {
		enableCors(&w)
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprintf(w, `{"message": "pong from Go backend!"}`)
	})

	// Endpoint untuk cek status database secara langsung via browser/API
	mux.HandleFunc("/api/db-check", func(w http.ResponseWriter, r *http.Request) {
		enableCors(&w)
		err := db.Ping()
		w.Header().Set("Content-Type", "application/json")
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprintf(w, `{"status": "error", "message": "Database terputus: %s"}`, err.Error())
			return
		}
		fmt.Fprintf(w, `{"status": "success", "message": "Database terhubung dengan aman!"}`)
	})

	fmt.Println("Server backend berjalan di :8080...")
	log.Fatal(http.ListenAndServe(":8080", mux))
}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	(*w).Header().Set("Access-Control-Allow-Headers", "Content-Type")
}
