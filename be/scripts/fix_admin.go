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

	fmt.Println("Fixing Admin user data...")

	// 1. Ensure branch_id 1 exists (Pusat)
	_, err = db.Exec("INSERT INTO branches (id, name, location) VALUES (1, 'Pusat', 'Bandung Utama') ON CONFLICT (id) DO NOTHING")
	if err != nil {
		log.Fatalf("Error ensuring branch 1: %v", err)
	}

	// 2. Update existing admin to have role and branch_id
	_, err = db.Exec("UPDATE users SET role = 'super_admin', branch_id = 1 WHERE email = 'admin@robogudang.com'")
	if err != nil {
		log.Fatalf("Error updating admin user: %v", err)
	}

	fmt.Println("Admin user updated successfully!")
}
