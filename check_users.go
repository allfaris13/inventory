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

	rows, err := db.Query("SELECT id, email, password, full_name, COALESCE(role, 'admin_cabang'), COALESCE(branch_id, 1) FROM users")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	fmt.Println("Users in database:")
	for rows.Next() {
		var id, branchID int
		var email, password, fullName, role string
		if err := rows.Scan(&id, &email, &password, &fullName, &role, &branchID); err != nil {
			log.Fatal(err)
		}
		fmt.Printf("ID: %d | Email: %s | Password: %s | Name: %s | Role: %s | BranchID: %d\n", id, email, password, fullName, role, branchID)
	}
}
