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

	fmt.Println("Running Migration for Distribution and Audit...")

	// 1. Create Distribution Requests Table
	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS distribution_requests (
		id SERIAL PRIMARY KEY,
		branch_id INTEGER REFERENCES branches(id),
		item_id INTEGER REFERENCES inventory(id),
		quantity INTEGER NOT NULL,
		status TEXT DEFAULT 'pending', -- pending, approved, rejected, shipped, received
		requester_id INTEGER REFERENCES users(id),
		approved_by INTEGER REFERENCES users(id),
		request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		processed_date TIMESTAMP
	)`)
	if err != nil {
		log.Fatalf("Error creating distribution_requests table: %v", err)
	}

	// 2. Add user_id to transactions for Audit Trail
	_, err = db.Exec(`ALTER TABLE transactions ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id)`)
	if err != nil {
		fmt.Printf("Warning adding user_id to transactions: %v\n", err)
	}

	// 3. Add branch_id to transactions
	_, err = db.Exec(`ALTER TABLE transactions ADD COLUMN IF NOT EXISTS branch_id INTEGER REFERENCES branches(id)`)
	if err != nil {
		fmt.Printf("Warning adding branch_id to transactions: %v\n", err)
	}

	fmt.Println("Migration completed successfully!")
}
