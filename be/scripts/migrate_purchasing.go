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

	query := `CREATE TABLE IF NOT EXISTS purchasing_requests (
		id SERIAL PRIMARY KEY,
		tanggal_pengajuan TEXT,
		nama_barang TEXT NOT NULL,
		jumlah INTEGER,
		satuan TEXT,
		estimasi_harga BIGINT,
		total_estimasi BIGINT,
		kebutuhan TEXT,
		kategori TEXT,
		status TEXT DEFAULT 'Pending',
		tanggal_pembelian TEXT,
		harga_satuan_aktual BIGINT,
		sub_total BIGINT,
		biaya_layanan BIGINT DEFAULT 0,
		biaya_ongkir BIGINT DEFAULT 0,
		diskon BIGINT DEFAULT 0,
		total_akhir BIGINT,
		tujuan_pembelian TEXT,
		metode_pembelian TEXT,
		sumber_dana TEXT
	)`

	_, err = db.Exec(query)
	if err != nil {
		log.Fatalf("Error creating purchasing_requests table: %v", err)
	}
	fmt.Println("Table purchasing_requests successfully created!")
}
