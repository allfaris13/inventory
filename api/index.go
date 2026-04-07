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

// Fungsi konek DB yang lebih aman
func connectDB() (*sql.DB, error) {
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	dbSSL := os.Getenv("DB_SSLMODE")

	// Fallback SSL mode
	if dbSSL == "" {
		dbSSL = "require"
	}

	psqlInfo := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		dbHost, dbPort, dbUser, dbPassword, dbName, dbSSL)

	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		return nil, err
	}

	err = db.Ping()
	if err != nil {
		return nil, err
	}

	return db, nil
}

func Handler(w http.ResponseWriter, r *http.Request) {
	// Enable CORS
	enableCors(&w)

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Selalu set content type di awal
	w.Header().Set("Content-Type", "application/json")

	switch r.URL.Path {
	case "/api/ping":
		fmt.Fprintf(w, `{"message": "pong from Vercel Go Serverless!"}`)

	case "/api/login":
		if r.Method != "POST" {
			w.WriteHeader(http.StatusMethodNotAllowed)
			fmt.Fprintf(w, `{"status": "error", "message": "Method not allowed"}`)
			return
		}

		var req LoginRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			fmt.Fprintf(w, `{"status": "error", "message": "Review payload JSON kamu"}`)
			return
		}

		db, err := connectDB()
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprintf(w, `{"status": "error", "message": "Gagal konek database: %v"}`, err)
			return
		}
		defer db.Close()

		var user User
		// Query password secara langsung (Note: Sangat disarankan pakai hashing kedepannya)
		err = db.QueryRow("SELECT id, email, full_name FROM users WHERE email = $1 AND password = $2", 
			req.Email, req.Password).Scan(&user.ID, &user.Email, &user.FullName)

		if err != nil {
			if err == sql.ErrNoRows {
				w.WriteHeader(http.StatusUnauthorized)
				fmt.Fprintf(w, `{"status": "error", "message": "Email atau password salah"}`)
			} else {
				w.WriteHeader(http.StatusInternalServerError)
				fmt.Fprintf(w, `{"status": "error", "message": "Query Error: %v"}`, err)
			}
			return
		}

		json.NewEncoder(w).Encode(LoginResponse{
			Status:  "success",
			Message: "Login berhasil",
			User:    &user,
		})

	default:
		w.WriteHeader(http.StatusNotFound)
		fmt.Fprintf(w, `{"error": "Path tidak ditemukan: %s"}`, r.URL.Path)
	}
}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	(*w).Header().Set("Access-Control-Allow-Headers", "Content-Type")
}
