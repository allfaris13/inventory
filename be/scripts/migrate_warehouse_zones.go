package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func main() {
	// Try loading from current folder, then root
	err := godotenv.Load(".env")
	if err != nil {
		godotenv.Load("be/.env")
	}
	
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")
	sslmode := os.Getenv("DB_SSLMODE")

	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		host, port, user, password, dbname, sslmode)

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalf("Could not open db: %v", err)
	}
	defer db.Close()

	fmt.Println("Creating warehouse_zones table...")
	
	query := `
	CREATE TABLE IF NOT EXISTS warehouse_zones (
		id SERIAL PRIMARY KEY,
		name TEXT NOT NULL,
		total_racks INT DEFAULT 16,
		color TEXT DEFAULT '#10b981',
		description TEXT,
		branch_id INT,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);
	`
	
	_, err = db.Exec(query)
	if err != nil {
		log.Fatalf("Failed to create table: %v", err)
	}
	
	fmt.Println("Checking for initial seed data...")
	var count int
	db.QueryRow("SELECT COUNT(*) FROM warehouse_zones").Scan(&count)
	if count == 0 {
		fmt.Println("Seeding default zones...")
		_, err = db.Exec(`
			INSERT INTO warehouse_zones (name, total_racks, color, description) 
			VALUES 
			('Zona A', 24, '#10b981', 'Area Inventaris Mentah'),
			('Zona B', 16, '#f59e0b', 'Area Perakitan'),
			('Zona C', 16, '#3b82f6', 'Area Siap Kirim')
		`)
		if err != nil {
			fmt.Println("Error seeding: ", err)
		} else {
			fmt.Println("Default zones seeded successfully.")
		}
	}

	fmt.Println("Migration warehouse_zones SUCCESS.")
}
