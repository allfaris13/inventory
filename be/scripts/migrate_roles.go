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

	fmt.Println("Running Migration for Roles and Branches...")

	// 1. Create Branches Table
	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS branches (
		id SERIAL PRIMARY KEY,
		name TEXT NOT NULL,
		location TEXT
	)`)
	if err != nil {
		log.Fatalf("Error creating branches table: %v", err)
	}

	// 2. Create Users Table (with roles)
	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS users (
		id SERIAL PRIMARY KEY,
		email TEXT UNIQUE NOT NULL,
		password TEXT NOT NULL,
		full_name TEXT NOT NULL
	)`)
	if err != nil {
		log.Fatalf("Error creating users table: %v", err)
	}

	// Add missing columns to users
	_, err = db.Exec(`ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'admin_cabang'`)
	_, err = db.Exec(`ALTER TABLE users ADD COLUMN IF NOT EXISTS branch_id INTEGER REFERENCES branches(id)`)

	// 3. Update Inventory table to include branch_id
	_, err = db.Exec(`ALTER TABLE inventory ADD COLUMN IF NOT EXISTS branch_id INTEGER REFERENCES branches(id)`)
	if err != nil {
		fmt.Printf("Warning adding branch_id to inventory: %v\n", err)
	}

	// 4. Seed Branches
	_, err = db.Exec(`
		INSERT INTO branches (name, location)
		VALUES 
		('Pusat', 'Bandung Utama'),
		('Cabang Jakarta', 'Jakarta Selatan'),
		('Cabang Surabaya', 'Surabaya Timur'),
		('Cabang Medan', 'Medan Baru'),
		('Cabang Makassar', 'Makassar Kota')
		ON CONFLICT DO NOTHING
	`)
	if err != nil {
		fmt.Printf("Warning seeding branches: %v\n", err)
	}

	// 5. Seed Super Admin
	_, err = db.Exec(`
		INSERT INTO users (email, password, full_name, role, branch_id)
		VALUES ('admin@robogudang.com', 'admin123', 'Super Admin Pusat', 'super_admin', 1)
		ON CONFLICT (email) DO NOTHING
	`)
	if err != nil {
		fmt.Printf("Warning seeding super admin: %v\n", err)
	}

	fmt.Println("Migration and Seeding Roles completed successfully!")
}
