package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq"
)

func main() {
	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		// Gunakan koneksi lokal default jika ENV tidak terbaca
		connStr = "postgres://postgres:postgres@localhost:5432/inventory?sslmode=disable"
	}

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	fmt.Println("Migrating database...")

	// Tambah kolom SKU jika belum ada
	_, err = db.Exec("ALTER TABLE inventory ADD COLUMN IF NOT EXISTS sku TEXT")
	if err != nil {
		fmt.Printf("Error adding sku: %v\n", err)
	} else {
		fmt.Println("Column 'sku' verified/added.")
	}

	// Tambah kolom Location jika belum ada
	_, err = db.Exec("ALTER TABLE inventory ADD COLUMN IF NOT EXISTS location TEXT")
	if err != nil {
		fmt.Printf("Error adding location: %v\n", err)
	} else {
		fmt.Println("Column 'location' verified/added.")
	}

	fmt.Println("Migration completed!")
}
