package main

import (
	"database/sql"
	"fmt"
	"log"
	_ "github.com/lib/pq"
)

func main() {
	psqlInfo := "host=localhost port=5432 user=postgres password=12345678 dbname=inventory_apk sslmode=disable"
	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	fmt.Println("Running Migration for Borrowing Requests...")

	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS borrowing_requests (
		id SERIAL PRIMARY KEY,
		branch_id INTEGER REFERENCES branches(id),
		institution TEXT NOT NULL,
		pic TEXT NOT NULL,
		phone TEXT,
		purpose TEXT,
		jenjang TEXT,
		material_needs TEXT,
		quantity TEXT,
		pickup_date_time TIMESTAMP,
		status TEXT DEFAULT 'Pending', -- Pending, Approved, Borrowed, Returned, Rejected
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	)`)
	if err != nil {
		log.Fatalf("Error creating borrowing_requests table: %v", err)
	}

	fmt.Println("Migration for Borrowing Requests completed successfully!")
}
