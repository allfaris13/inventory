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

	// Create Tables
	queries := []string{
		`CREATE TABLE IF NOT EXISTS inventory (
			id SERIAL PRIMARY KEY,
			name TEXT NOT NULL,
			category TEXT,
			status TEXT,
			stock INTEGER,
			location TEXT,
			last_maintenance TIMESTAMP,
			image_url TEXT
		)`,
		`CREATE TABLE IF NOT EXISTS maintenance (
			id SERIAL PRIMARY KEY,
			inventory_id INTEGER REFERENCES inventory(id),
			task_name TEXT NOT NULL,
			schedule_date DATE NOT NULL,
			status TEXT DEFAULT 'Scheduled',
			priority TEXT,
			technician TEXT
		)`,
		`CREATE TABLE IF NOT EXISTS transactions (
			id SERIAL PRIMARY KEY,
			inventory_id INTEGER REFERENCES inventory(id),
			type TEXT, -- IN, OUT, ADJUST
			quantity INTEGER,
			reason TEXT,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`,
	}

	for _, q := range queries {
		_, err := db.Exec(q)
		if err != nil {
			log.Fatalf("Error creating table: %v", err)
		}
	}

	// Seed Data for Inventory
	_, err = db.Exec(`
		INSERT INTO inventory (name, category, status, stock, location, last_maintenance)
		VALUES 
		('Sensor Lidar A-1', 'Sensor', 'Active', 12, 'Zona A-12', '2024-03-20'),
		('Lengan Robot UR5', 'Actuator', 'Maintenance', 2, 'Zona B-04', '2024-04-01'),
		('Modul Kamera 4K', 'Sensor', 'Active', 45, 'Zona C-01', '2024-03-15')
		ON CONFLICT DO NOTHING
	`)
	if err != nil {
		log.Printf("Warning seeding inventory: %v", err)
	}

	// Seed Data for Maintenance
	_, err = db.Exec(`
		INSERT INTO maintenance (inventory_id, task_name, schedule_date, status, priority, technician)
		VALUES 
		(1, 'Kalibrasi Lidar', '2024-04-15', 'Scheduled', 'High', 'Budi Tekno'),
		(2, 'Pelumasan Sendi', '2024-04-10', 'In Progress', 'Critical', 'Andi Robot'),
		(3, 'Cek Lensa', '2024-04-20', 'Scheduled', 'Low', 'Siti Optik')
		ON CONFLICT DO NOTHING
	`)
	if err != nil {
		log.Printf("Warning seeding maintenance: %v", err)
	}

	fmt.Println("Database initialized and seeded successfully!")
}
