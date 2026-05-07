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
	_, err = db.Exec("ALTER TABLE inventory ADD COLUMN type TEXT DEFAULT 'mentah'")
	if err != nil {
		fmt.Println("Error or already exists:", err)
	} else {
		fmt.Println("Added type column to inventory table.")
	}
}
