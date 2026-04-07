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
	
	// Gunakan POSTGRES_URL atau DATABASE_URL (khusus Vercel/Neon)
	if os.Getenv("POSTGRES_URL") != "" {
		psqlInfo = os.Getenv("POSTGRES_URL")
	} else if os.Getenv("DATABASE_URL") != "" {
		psqlInfo = os.Getenv("DATABASE_URL")
	} else if os.Getenv("DB_HOST") != "" {
		// Fallback ke variabel individual (Lokal)
		psqlInfo = fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
			os.Getenv("DB_HOST"), os.Getenv("DB_PORT"), os.Getenv("DB_USER"),
			os.Getenv("DB_PASSWORD"), os.Getenv("DB_NAME"), "disable")
	} else {
		return nil, fmt.Errorf("Variabel database (POSTGRES_URL, DATABASE_URL, atau DB_HOST) tidak ditemukan.")
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
		fmt.Fprintf(w, `{"message": "pong from Vercel Go Serverless (Cloud DB Ready!)"}`)

	case "/api/login":
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
			fmt.Fprintf(w, `{"status": "error", "message": "Backend Error: %v"}`, err)
			return
		}
		defer db.Close()

		var user User
		err = db.QueryRow("SELECT id, email, full_name FROM users WHERE email = $1 AND password = $2", 
			req.Email, req.Password).Scan(&user.ID, &user.Email, &user.FullName)

		if err != nil {
			if err == sql.ErrNoRows {
				w.WriteHeader(http.StatusUnauthorized)
				fmt.Fprintf(w, `{"status": "error", "message": "Email atau password database Cloud salah"}`)
			} else {
				w.WriteHeader(http.StatusInternalServerError)
				fmt.Fprintf(w, `{"status": "error", "message": "Query Error: %v"}`, err)
			}
			return
		}

		json.NewEncoder(w).Encode(LoginResponse{
			Status:  "success",
			Message: "Login berhasil di Cloud!",
			User:    &user,
		})

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
