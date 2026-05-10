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

	queries := []string{
		"ALTER TABLE inventory ADD COLUMN IF NOT EXISTS unit_price TEXT DEFAULT 'Rp 0'",
		"ALTER TABLE inventory ADD COLUMN IF NOT EXISTS supplier TEXT DEFAULT 'Vendor Utama'",
		"ALTER TABLE inventory ADD COLUMN IF NOT EXISTS specifications TEXT DEFAULT '{}'",
	}

	for _, q := range queries {
		_, err = db.Exec(q)
		if err != nil {
			fmt.Printf("Error running: %s - %v\n", q, err)
		} else {
			fmt.Printf("Executed: %s\n", q)
		}
	}
}
