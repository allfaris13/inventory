package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
	User    *User  `json:"user,omitempty"`
}

type User struct {
	ID       int    `json:"id"`
	Email    string `json:"email"`
	FullName string `json:"full_name"`
	Role     string `json:"role"`
	BranchID int    `json:"branch_id"`
}

type Branch struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Location string `json:"location"`
}

type UserWithRole struct {
	ID       int    `json:"id"`
	Email    string `json:"email"`
	FullName string `json:"full_name"`
	Role     string `json:"role"`
	BranchID int    `json:"branch_id"`
}

func connectDB() (*sql.DB, error) {
	var psqlInfo string

	if os.Getenv("POSTGRES_URL") != "" {
		psqlInfo = os.Getenv("POSTGRES_URL")
	} else if os.Getenv("DATABASE_URL") != "" {
		psqlInfo = os.Getenv("DATABASE_URL")
	} else if os.Getenv("DB_HOST") != "" {
		psqlInfo = fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
			os.Getenv("DB_HOST"), os.Getenv("DB_PORT"), os.Getenv("DB_USER"),
			os.Getenv("DB_PASSWORD"), os.Getenv("DB_NAME"), "disable")
	} else {
		return nil, fmt.Errorf("database configuration not found")
	}

	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		return nil, err
	}

	if err = db.Ping(); err != nil {
		return nil, err
	}

	return db, nil
}

func Handler(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	switch r.URL.Path {
	case "/api/ping":
		fmt.Fprintf(w, `{"message": "pong from Go Standalone Server"}`)

	case "/api/login":
		handleLogin(w, r)

	case "/api/inventory":
		handleInventory(w, r)

	case "/api/maintenance":
		handleMaintenance(w, r)

	case "/api/users":
		handleUsers(w, r)

	case "/api/branches":
		handleBranches(w, r)

	case "/api/borrowing":
		handleBorrowing(w, r)

	case "/api/purchasing":
		handlePurchasing(w, r)

	case "/api/transactions":
		handleTransactions(w, r)

	case "/api/distribution":
		handleDistribution(w, r)

	case "/api/dashboard-stats":
		handleDashboardStats(w, r)

	case "/api/audit-trail":
		handleAuditTrail(w, r)

	case "/api/prepare/requests":
		handlePrepareRequests(w, r)

	case "/api/prepare/inventory":
		handlePrepareInventory(w, r)

	case "/api/prepare/distributions":
		handlePrepareDistributions(w, r)

	case "/api/warehouse-zones":
		handleWarehouseZones(w, r)

	case "/api/production-robots":
		handleProductionRobots(w, r)

	default:
		w.WriteHeader(http.StatusNotFound)
		fmt.Fprintf(w, `{"error": "Endpoint tidak ditemukan"}`)
	}
}

func handleLogin(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	db, err := connectDB()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	defer db.Close()
	var user User
	err = db.QueryRow("SELECT id, email, full_name, COALESCE(role, 'admin_cabang'), COALESCE(branch_id, 1) FROM users WHERE email = $1 AND password = $2",
		req.Email, req.Password).Scan(&user.ID, &user.Email, &user.FullName, &user.Role, &user.BranchID)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	json.NewEncoder(w).Encode(LoginResponse{Status: "success", Message: "Login berhasil", User: &user})
}

func handleInventory(w http.ResponseWriter, r *http.Request) {
	db, err := connectDB()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	defer db.Close()

	if r.Method == "GET" {
		rows, err := db.Query("SELECT id, name, category, status, stock, location, COALESCE(type, 'mentah'), COALESCE(unit_price, 'Rp 0'), COALESCE(supplier, 'Vendor Utama'), COALESCE(specifications, '{}') FROM inventory")
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		defer rows.Close()
		var list []map[string]interface{}
		for rows.Next() {
			var id, stock int
			var name, category, status, location, itemType, unitPrice, supplier, specs string
			rows.Scan(&id, &name, &category, &status, &stock, &location, &itemType, &unitPrice, &supplier, &specs)
			list = append(list, map[string]interface{}{
				"id": id, "name": name, "category": category, "status": status, "stock": stock, "location": location, "type": itemType,
				"unitPrice": unitPrice, "supplier": supplier, "specifications": specs,
			})
		}
		if list == nil {
			list = []map[string]interface{}{}
		}
		json.NewEncoder(w).Encode(list)
	} else if r.Method == "POST" {
		var req struct {
			Name           string      `json:"name"`
			Category       string      `json:"category"`
			Status         string      `json:"status"`
			Stock          int         `json:"stock"`
			Location       string      `json:"location"`
			Type           string      `json:"type"`
			UnitPrice      string      `json:"unitPrice"`
			Supplier       string      `json:"supplier"`
			Specifications interface{} `json:"specifications"`
			Components     []struct {
				ID  int `json:"id"`
				Qty int `json:"qty"`
			} `json:"components"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		if req.Type == "" {
			req.Type = "mentah"
		}
		if req.UnitPrice == "" {
			req.UnitPrice = "Rp 0"
		}
		if req.Supplier == "" {
			req.Supplier = "Vendor Utama"
		}

		tx, err := db.Begin()
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		defer tx.Rollback()

		specsJSON, _ := json.Marshal(req.Specifications)
		var newID int
		err = tx.QueryRow("INSERT INTO inventory (name, category, status, stock, location, type, unit_price, supplier, specifications) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
			req.Name, req.Category, req.Status, req.Stock, req.Location, req.Type, req.UnitPrice, req.Supplier, string(specsJSON)).Scan(&newID)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		if req.Type == "matang" && len(req.Components) > 0 {
			for _, comp := range req.Components {
				totalDeduct := comp.Qty * req.Stock
				_, err = tx.Exec("UPDATE inventory SET stock = GREATEST(0, stock - $1) WHERE id = $2",
					totalDeduct, comp.ID)
				if err != nil {
					w.WriteHeader(http.StatusInternalServerError)
					return
				}
			}
		}

		err = tx.Commit()
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(map[string]string{"status": "success"})
	} else if r.Method == "PUT" {
		var req struct {
			ID             int         `json:"id"`
			Name           string      `json:"name"`
			Category       string      `json:"category"`
			Status         string      `json:"status"`
			Stock          int         `json:"stock"`
			Location       string      `json:"location"`
			Type           string      `json:"type"`
			UnitPrice      string      `json:"unitPrice"`
			Supplier       string      `json:"supplier"`
			Specifications interface{} `json:"specifications"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		if req.Type == "" {
			req.Type = "mentah"
		}
		if req.UnitPrice == "" {
			req.UnitPrice = "Rp 0"
		}
		if req.Supplier == "" {
			req.Supplier = "Vendor Utama"
		}

		specsJSON, _ := json.Marshal(req.Specifications)
		_, err = db.Exec("UPDATE inventory SET name=$1, category=$2, status=$3, stock=$4, location=$5, type=$6, unit_price=$7, supplier=$8, specifications=$9 WHERE id=$10",
			req.Name, req.Category, req.Status, req.Stock, req.Location, req.Type, req.UnitPrice, req.Supplier, string(specsJSON), req.ID)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(map[string]string{"status": "success"})
	} else if r.Method == "DELETE" {
		id := r.URL.Query().Get("id")
		if id == "" {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		_, err = db.Exec("DELETE FROM inventory WHERE id=$1", id)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(map[string]string{"status": "success"})
	}
}

func handleMaintenance(w http.ResponseWriter, r *http.Request) {
	db, err := connectDB()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	defer db.Close()
	if r.Method == "GET" {
		rows, err := db.Query(`SELECT m.id, i.name as asset, m.task_name, m.schedule_date, m.status, m.priority 
			FROM maintenance m JOIN inventory i ON m.inventory_id = i.id`)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		defer rows.Close()
		var list []map[string]interface{}
		for rows.Next() {
			var id int
			var asset, task, date, status, priority string
			rows.Scan(&id, &asset, &task, &date, &status, &priority)
			list = append(list, map[string]interface{}{"id": id, "asset": asset, "task": task, "date": date, "status": status, "priority": priority})
		}
		json.NewEncoder(w).Encode(list)
	}
}

func handleBranches(w http.ResponseWriter, r *http.Request) {
	db, err := connectDB()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	defer db.Close()

	if r.Method == "GET" {
		rows, err := db.Query("SELECT id, name, location FROM branches")
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		defer rows.Close()
		var branches []Branch
		for rows.Next() {
			var b Branch
			if err := rows.Scan(&b.ID, &b.Name, &b.Location); err == nil {
				branches = append(branches, b)
			}
		}
		if branches == nil {
			branches = []Branch{}
		}
		json.NewEncoder(w).Encode(branches)
	}
}

func handleUsers(w http.ResponseWriter, r *http.Request) {
	db, err := connectDB()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	defer db.Close()

	if r.Method == "GET" {
		rows, err := db.Query("SELECT id, email, full_name, COALESCE(role, 'admin_cabang'), COALESCE(branch_id, 1) FROM users")
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		defer rows.Close()
		var users []UserWithRole
		for rows.Next() {
			var u UserWithRole
			if err := rows.Scan(&u.ID, &u.Email, &u.FullName, &u.Role, &u.BranchID); err == nil {
				users = append(users, u)
			}
		}
		if users == nil {
			users = []UserWithRole{}
		}
		json.NewEncoder(w).Encode(users)
	} else if r.Method == "POST" {
		var req struct {
			Email    string `json:"email"`
			Password string `json:"password"`
			FullName string `json:"full_name"`
			Role     string `json:"role"`
			BranchID int    `json:"branch_id"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		_, err = db.Exec("INSERT INTO users (email, password, full_name, role, branch_id) VALUES ($1, $2, $3, $4, $5)",
			req.Email, req.Password, req.FullName, req.Role, req.BranchID)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(map[string]string{"status": "success"})
	}
}

func handleBorrowing(w http.ResponseWriter, r *http.Request) {
	db, err := connectDB()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	defer db.Close()

	// Ensure branches table exists
	_, _ = db.Exec(`CREATE TABLE IF NOT EXISTS branches (
		id SERIAL PRIMARY KEY,
		name TEXT NOT NULL,
		location TEXT
	)`)

	// Ensure borrowing_requests table exists
	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS borrowing_requests (
		id SERIAL PRIMARY KEY,
		branch_id INTEGER REFERENCES branches(id),
		institution TEXT NOT NULL,
		pic TEXT NOT NULL,
		phone TEXT,
		purpose TEXT,
		jenjang TEXT,
		material_needs TEXT,
		quantity TEXT,
		pickup_date_time TIMESTAMP,
		status TEXT DEFAULT 'Pending',
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	)`)
	if err != nil {
		log.Printf("Error ensuring borrowing_requests table: %v", err)
	}

	_, _ = db.Exec("ALTER TABLE borrowing_requests ADD COLUMN IF NOT EXISTS phone TEXT")
	_, _ = db.Exec("ALTER TABLE borrowing_requests ADD COLUMN IF NOT EXISTS jenjang TEXT")
	_, _ = db.Exec("ALTER TABLE borrowing_requests ADD COLUMN IF NOT EXISTS quantity TEXT")
	_, _ = db.Exec("ALTER TABLE borrowing_requests ADD COLUMN IF NOT EXISTS pickup_date_time TIMESTAMP")
	_, _ = db.Exec("ALTER TABLE borrowing_requests ADD COLUMN IF NOT EXISTS borrower_type TEXT DEFAULT 'pengajar'")

	// Populate fallback data for older existing records so they display beautifully
	_, _ = db.Exec("UPDATE borrowing_requests SET phone = '0812-3456-7890' WHERE phone IS NULL OR phone = ''")
	_, _ = db.Exec("UPDATE borrowing_requests SET jenjang = 'Basic / Tema' WHERE jenjang IS NULL OR jenjang = ''")
	_, _ = db.Exec("UPDATE borrowing_requests SET borrower_type = 'pengajar' WHERE borrower_type IS NULL OR borrower_type = ''")

	// Seed dummy borrowing requests if table is empty
	var count int
	err = db.QueryRow("SELECT COUNT(*) FROM borrowing_requests").Scan(&count)
		if err == nil && count == 0 {
			_, err = db.Exec(`
				INSERT INTO borrowing_requests (institution, pic, phone, purpose, jenjang, material_needs, quantity, status, created_at)
				VALUES 
				('SMA Negeri 1 Jakarta', 'Budi Sudarsono', '0812-3456-7890', 'Pelatihan Robotik Nasional', 'Tema', 'Lengan Robot UR5', '2 Unit', 'Pending', NOW() - INTERVAL '1 DAY'),
				('Universitas Indonesia', 'Dr. Eng. Hermawan', '0821-9876-5432', 'Riset Robot Vision Otonom', 'Advanced', 'Modul Kamera 4K', '5 Pcs', 'Borrowed', NOW() - INTERVAL '3 DAYS'),
				('SMK SMTI Yogyakarta', 'Yusuf Setiawan', '0878-5555-1234', 'Ujian Kompetensi Keahlian', 'Basic', 'Saklar On/Off Mini', '10 Pcs', 'Returned', NOW() - INTERVAL '5 DAYS')
			`)
			if err != nil {
				log.Printf("Error seeding borrowing_requests table: %v", err)
			}
		}

	if r.Method == "GET" {
		rows, err := db.Query("SELECT id, institution, pic, COALESCE(phone, ''), purpose, COALESCE(jenjang, ''), COALESCE(material_needs, ''), COALESCE(quantity, ''), COALESCE(to_char(pickup_date_time, 'DD/MM/YYYY HH24:MI'), ''), to_char(created_at, 'DD/MM/YYYY'), status, COALESCE(borrower_type, 'pengajar') FROM borrowing_requests ORDER BY id DESC")
		if err != nil {
			log.Printf("SQL Error (GET /api/borrowing): %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}
		defer rows.Close()

		var list []map[string]interface{}
		for rows.Next() {
			var id int
			var institution, pic, phone, purpose, jenjang, materialNeeds, quantity, pickupDateTime, date, status, borrowerType string
			rows.Scan(&id, &institution, &pic, &phone, &purpose, &jenjang, &materialNeeds, &quantity, &pickupDateTime, &date, &status, &borrowerType)

			list = append(list, map[string]interface{}{
				"real_id":          id,
				"id":               fmt.Sprintf("REQ-%04d", id),
				"institution":      institution,
				"pic":              pic,
				"phone":            phone,
				"purpose":          purpose,
				"jenjang":          jenjang,
				"items":            []string{materialNeeds}, // Simplification
				"quantity":         quantity,
				"pickup_date_time": pickupDateTime,
				"date":             date,
				"status":           status,
				"borrower_type":    borrowerType,
			})
		}
		if list == nil {
			list = []map[string]interface{}{}
		}
		json.NewEncoder(w).Encode(list)
	} else if r.Method == "POST" {
		var req struct {
			Institution    string `json:"institution"`
			Pic            string `json:"pic"`
			Phone          string `json:"phone"`
			Purpose        string `json:"purpose"`
			Jenjang        string `json:"jenjang"`
			MaterialNeeds  string `json:"material_needs"`
			Quantity       string `json:"quantity"`
			PickupDateTime string `json:"pickup_datetime"`
			BorrowerType   string `json:"borrower_type"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		var pickupVal interface{}
		if req.PickupDateTime == "" {
			pickupVal = nil
		} else {
			pickupVal = req.PickupDateTime
		}
		if req.BorrowerType == "" {
			req.BorrowerType = "pengajar"
		}
		_, err = db.Exec("INSERT INTO borrowing_requests (institution, pic, phone, purpose, jenjang, material_needs, quantity, pickup_date_time, status, borrower_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Pending', $9)", req.Institution, req.Pic, req.Phone, req.Purpose, req.Jenjang, req.MaterialNeeds, req.Quantity, pickupVal, req.BorrowerType)
		if err != nil {
			log.Printf("SQL Error (POST /api/borrowing): %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}
		json.NewEncoder(w).Encode(map[string]string{"status": "success"})
	} else if r.Method == "PUT" {
		var req struct {
			ID     int    `json:"id"`
			Status string `json:"status"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		_, err = db.Exec("UPDATE borrowing_requests SET status=$1 WHERE id=$2", req.Status, req.ID)
		if err != nil {
			log.Printf("SQL Error (PUT /api/borrowing): %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}
		json.NewEncoder(w).Encode(map[string]string{"status": "success"})
	}
}

func handlePurchasing(w http.ResponseWriter, r *http.Request) {
	db, err := connectDB()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	defer db.Close()

	if r.Method == "GET" {
		rows, err := db.Query("SELECT id, tanggal_pengajuan, nama_barang, jumlah, satuan, estimasi_harga, total_estimasi, kebutuhan, kategori, status, COALESCE(tanggal_pembelian, ''), COALESCE(harga_satuan_aktual, 0), COALESCE(sub_total, 0), COALESCE(biaya_layanan, 0), COALESCE(biaya_ongkir, 0), COALESCE(diskon, 0), COALESCE(total_akhir, 0), COALESCE(tujuan_pembelian, ''), COALESCE(metode_pembelian, ''), COALESCE(sumber_dana, '') FROM purchasing_requests ORDER BY id DESC")
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var list []map[string]interface{}
		for rows.Next() {
			var id, jumlah int
			var estimasiHarga, totalEstimasi, hargaSatuanAktual, subTotal, biayaLayanan, biayaOngkir, diskon, totalAkhir int64
			var tanggalPengajuan, namaBarang, satuan, kebutuhan, kategori, status, tanggalPembelian, tujuanPembelian, metodePembelian, sumberDana string
			rows.Scan(&id, &tanggalPengajuan, &namaBarang, &jumlah, &satuan, &estimasiHarga, &totalEstimasi, &kebutuhan, &kategori, &status, &tanggalPembelian, &hargaSatuanAktual, &subTotal, &biayaLayanan, &biayaOngkir, &diskon, &totalAkhir, &tujuanPembelian, &metodePembelian, &sumberDana)

			list = append(list, map[string]interface{}{
				"real_id":          id,
				"id":               fmt.Sprintf("RAB-%03d", id),
				"tanggalPengajuan": tanggalPengajuan,
				"namaBarang":       namaBarang,
				"jumlah":           jumlah,
				"satuan":           satuan,
				"estimasiHarga":    estimasiHarga,
				"totalEstimasi":    totalEstimasi,
				"kebutuhan":        kebutuhan,
				"kategori":         kategori,
				"status":           status,
				"tanggalPembelian": tanggalPembelian,
				"hargaSatuan":      hargaSatuanAktual,
				"subTotal":         subTotal,
				"biayaLayanan":     biayaLayanan,
				"biayaOngkir":      biayaOngkir,
				"diskon":           diskon,
				"totalAkhir":       totalAkhir,
				"tujuanPembelian":  tujuanPembelian,
				"metodePembelian":  metodePembelian,
				"sumberDana":       sumberDana,
			})
		}
		if list == nil {
			list = []map[string]interface{}{}
		}
		json.NewEncoder(w).Encode(list)
	} else if r.Method == "POST" {
		var req struct {
			TanggalPengajuan string `json:"tanggalPengajuan"`
			NamaBarang       string `json:"namaBarang"`
			Jumlah           int    `json:"jumlah"`
			Satuan           string `json:"satuan"`
			EstimasiHarga    int64  `json:"estimasiHarga"`
			Kebutuhan        string `json:"kebutuhan"`
			Kategori         string `json:"kategori"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		totalEstimasi := int64(req.Jumlah) * req.EstimasiHarga
		_, err = db.Exec("INSERT INTO purchasing_requests (tanggal_pengajuan, nama_barang, jumlah, satuan, estimasi_harga, total_estimasi, kebutuhan, kategori, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Pending')",
			req.TanggalPengajuan, req.NamaBarang, req.Jumlah, req.Satuan, req.EstimasiHarga, totalEstimasi, req.Kebutuhan, req.Kategori)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(map[string]string{"status": "success"})
	} else if r.Method == "PUT" {
		var req struct {
			RealID           int    `json:"real_id"`
			TanggalPembelian string `json:"tanggalPembelian"`
			NamaBarang       string `json:"namaBarang"`
			Jumlah           int    `json:"jumlah"`
			Satuan           string `json:"satuan"`
			HargaSatuan      int64  `json:"hargaSatuan"`
			BiayaLayanan     int64  `json:"biayaLayanan"`
			BiayaOngkir      int64  `json:"biayaOngkir"`
			Diskon           int64  `json:"diskon"`
			TujuanPembelian  string `json:"tujuanPembelian"`
			MetodePembelian  string `json:"metodePembelian"`
			SumberDana       string `json:"sumberDana"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		subTotal := int64(req.Jumlah) * req.HargaSatuan
		totalAkhir := subTotal + req.BiayaLayanan + req.BiayaOngkir - req.Diskon

		_, err = db.Exec(`UPDATE purchasing_requests SET 
			status='Realized', 
			tanggal_pembelian=$1, 
			nama_barang=$2,
			jumlah=$3,
			satuan=$4,
			harga_satuan_aktual=$5, 
			sub_total=$6, 
			biaya_layanan=$7, 
			biaya_ongkir=$8, 
			diskon=$9, 
			total_akhir=$10, 
			tujuan_pembelian=$11, 
			metode_pembelian=$12, 
			sumber_dana=$13,
			estimasi_harga=$5,
			total_estimasi=$6 
			WHERE id=$14`,
			req.TanggalPembelian, req.NamaBarang, req.Jumlah, req.Satuan, req.HargaSatuan, subTotal, req.BiayaLayanan, req.BiayaOngkir, req.Diskon, totalAkhir, req.TujuanPembelian, req.MetodePembelian, req.SumberDana, req.RealID)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(map[string]string{"status": "success"})
	} else if r.Method == "DELETE" {
		id := r.URL.Query().Get("id")
		if id == "" {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		action := r.URL.Query().Get("action")
		var err error
		if action == "reset" {
			_, err = db.Exec(`UPDATE purchasing_requests SET 
				status='Pending', 
				tanggal_pembelian=NULL, 
				harga_satuan_aktual=0, 
				sub_total=0, 
				biaya_layanan=0, 
				biaya_ongkir=0, 
				diskon=0, 
				total_akhir=0, 
				tujuan_pembelian='', 
				metode_pembelian='', 
				sumber_dana='' 
				WHERE id=$1`, id)
		} else {
			_, err = db.Exec("DELETE FROM purchasing_requests WHERE id=$1", id)
		}
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(map[string]string{"status": "success"})
	}
}

func handleDashboardStats(w http.ResponseWriter, r *http.Request) {
	db, err := connectDB()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	defer db.Close()

	if r.Method == "GET" {
		var totalAssets sql.NullInt64
		err = db.QueryRow("SELECT SUM(stock) FROM inventory").Scan(&totalAssets)
		if err != nil && err != sql.ErrNoRows {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		var lowStock int
		err = db.QueryRow("SELECT COUNT(*) FROM inventory WHERE stock < 10").Scan(&lowStock)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		rows, err := db.Query("SELECT name, stock FROM inventory WHERE stock < 10 LIMIT 5")
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var criticalItems []map[string]interface{}
		for rows.Next() {
			var name string
			var stock int
			rows.Scan(&name, &stock)
			criticalItems = append(criticalItems, map[string]interface{}{
				"name":   name,
				"stock":  stock,
				"limit":  10,
				"status": "Tinggi",
			})
		}
		if criticalItems == nil {
			criticalItems = []map[string]interface{}{}
		}

		// Mock chart data for now
		chartData := []map[string]interface{}{
			{"name": "Sen", "masuk": 120, "keluar": 80},
			{"name": "Sel", "masuk": 150, "keluar": 90},
			{"name": "Rab", "masuk": 180, "keluar": 120},
			{"name": "Kam", "masuk": 110, "keluar": 150},
			{"name": "Jum", "masuk": 200, "keluar": 170},
			{"name": "Sab", "masuk": 250, "keluar": 210},
			{"name": "Min", "masuk": 100, "keluar": 90},
		}

		json.NewEncoder(w).Encode(map[string]interface{}{
			"totalAssets":   totalAssets.Int64,
			"lowStock":      lowStock,
			"criticalItems": criticalItems,
			"chartData":     chartData,
		})
	}
}

func handleTransactions(w http.ResponseWriter, r *http.Request) {
	db, err := connectDB()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	defer db.Close()

	// Ensure dynamic columns exist
	_, _ = db.Exec("ALTER TABLE transactions ADD COLUMN IF NOT EXISTS target TEXT DEFAULT 'Gudang'")
	_, _ = db.Exec("ALTER TABLE transactions ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Selesai'")
	_, _ = db.Exec("ALTER TABLE transactions ADD COLUMN IF NOT EXISTS location TEXT DEFAULT ''")

	if r.Method == "GET" {
		rows, err := db.Query(`
			SELECT t.id, t.inventory_id, t.type, t.quantity, COALESCE(t.reason, ''), 
			       to_char(t.created_at, 'DD/MM/YYYY'), i.name, COALESCE(t.target, 'Gudang'), 
			       COALESCE(t.status, 'Selesai'), COALESCE(t.location, '')
			FROM transactions t
			JOIN inventory i ON t.inventory_id = i.id
			ORDER BY t.id DESC
		`)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}
		defer rows.Close()

		var list []map[string]interface{}
		for rows.Next() {
			var id, inventoryID, quantity int
			var txnType, reason, date, itemName, target, status, location string
			err = rows.Scan(&id, &inventoryID, &txnType, &quantity, &reason, &date, &itemName, &target, &status, &location)
			if err != nil {
				continue
			}

			// Format response keys to match Transactions.tsx expectations
			m := map[string]interface{}{
				"id":           id,
				"inventory_id": inventoryID,
				"type":         txnType,
				"quantity":     quantity,
				"date":         date,
				"item":         itemName,
				"target":       target,
				"status":       status,
				"location":     location,
			}
			if txnType == "Masuk" {
				m["vendor"] = reason
				m["recipient"] = ""
			} else {
				m["vendor"] = ""
				m["recipient"] = reason
			}
			list = append(list, m)
		}
		if list == nil {
			list = []map[string]interface{}{}
		}
		json.NewEncoder(w).Encode(list)

	} else if r.Method == "POST" {
		var req struct {
			InventoryID int    `json:"inventory_id"`
			Type        string `json:"type"`
			Quantity    int    `json:"quantity"`
			Reason      string `json:"reason"`
			Target      string `json:"target"`
			Status      string `json:"status"`
			Location    string `json:"location"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		if req.Target == "" {
			if req.Type == "Masuk" {
				req.Target = "Gudang"
			} else {
				req.Target = "Teknisi"
			}
		}
		if req.Status == "" {
			req.Status = "Selesai"
		}

		tx, err := db.Begin()
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		defer tx.Rollback()

		// Insert Transaction
		_, err = tx.Exec(`
			INSERT INTO transactions (inventory_id, type, quantity, reason, target, status, location)
			VALUES ($1, $2, $3, $4, $5, $6, $7)
		`, req.InventoryID, req.Type, req.Quantity, req.Reason, req.Target, req.Status, req.Location)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		// Adjust Inventory Stock
		if req.Type == "Masuk" {
			_, err = tx.Exec(`
				UPDATE inventory 
				SET stock = stock + $1, 
				    location = COALESCE(NULLIF($2, ''), location) 
				WHERE id = $3
			`, req.Quantity, req.Location, req.InventoryID)
		} else {
			_, err = tx.Exec(`
				UPDATE inventory 
				SET stock = GREATEST(0, stock - $1) 
				WHERE id = $2
			`, req.Quantity, req.InventoryID)
		}
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		err = tx.Commit()
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(map[string]string{"status": "success"})
	}
}

func handleDistribution(w http.ResponseWriter, r *http.Request) {
	db, err := connectDB()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	defer db.Close()

	if r.Method == "GET" {
		branchID := r.URL.Query().Get("branch_id")
		var rows *sql.Rows
		var err error

		if branchID != "" {
			// Filter by branch_id for cabang dashboard
			rows, err = db.Query(`
				SELECT dr.id, b.name as branch_name, i.name as item_name, dr.quantity, 
				       dr.status, to_char(dr.request_date, 'YYYY-MM-DD HH24:MI:SS') as request_date
				FROM distribution_requests dr
				JOIN branches b ON dr.branch_id = b.id
				JOIN inventory i ON dr.item_id = i.id
				WHERE dr.branch_id = $1
				ORDER BY dr.id DESC
			`, branchID)
		} else {
			// Fetch all for super_admin
			rows, err = db.Query(`
				SELECT dr.id, b.name as branch_name, i.name as item_name, dr.quantity, 
				       dr.status, to_char(dr.request_date, 'YYYY-MM-DD HH24:MI:SS') as request_date
				FROM distribution_requests dr
				JOIN branches b ON dr.branch_id = b.id
				JOIN inventory i ON dr.item_id = i.id
				ORDER BY dr.id DESC
			`)
		}

		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}
		defer rows.Close()

		var list []map[string]interface{}
		for rows.Next() {
			var id, quantity int
			var branchName, itemName, status, requestDate string
			err = rows.Scan(&id, &branchName, &itemName, &quantity, &status, &requestDate)
			if err != nil {
				log.Printf("Error scanning distribution row: %v", err)
				continue
			}

			list = append(list, map[string]interface{}{
				"id":           id,
				"branch_name":  branchName,
				"item_name":    itemName,
				"quantity":     quantity,
				"status":       status,
				"request_date": requestDate,
			})
		}

		if list == nil {
			list = []map[string]interface{}{}
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(list)
	} else if r.Method == "POST" {
		var req struct {
			Action      string `json:"action"`
			ItemID      int    `json:"item_id"`
			Quantity    int    `json:"quantity"`
			BranchID    int    `json:"branch_id"`
			RequesterID int    `json:"requester_id"`
			RequestID   int    `json:"request_id"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request"})
			return
		}

		if req.Action == "request" {
			// Create a new distribution request
			_, err = db.Exec(`
				INSERT INTO distribution_requests (branch_id, item_id, quantity, requester_id, status)
				VALUES ($1, $2, $3, $4, 'pending')
			`, req.BranchID, req.ItemID, req.Quantity, req.RequesterID)

			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				log.Printf("Error creating distribution request: %v", err)
				json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
				return
			}

			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusCreated)
			json.NewEncoder(w).Encode(map[string]string{"status": "success", "message": "Permintaan distribusi dibuat"})
		} else if req.Action == "approve" {
			// Approve a distribution request
			var itemID, quantity int
			err = db.QueryRow("SELECT item_id, quantity FROM distribution_requests WHERE id = $1", req.RequestID).Scan(&itemID, &quantity)
			if err != nil {
				w.WriteHeader(http.StatusNotFound)
				json.NewEncoder(w).Encode(map[string]string{"error": "Request tidak ditemukan"})
				return
			}

			// Check if stock is available
			var currentStock int
			err = db.QueryRow("SELECT stock FROM inventory WHERE id = $1", itemID).Scan(&currentStock)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				json.NewEncoder(w).Encode(map[string]string{"error": "Item tidak ditemukan"})
				return
			}

			if currentStock < quantity {
				w.WriteHeader(http.StatusBadRequest)
				json.NewEncoder(w).Encode(map[string]string{"error": "Stok tidak cukup untuk approval"})
				return
			}

			// Start transaction
			tx, err := db.Begin()
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			defer tx.Rollback()

			// Update distribution request status
			_, err = tx.Exec("UPDATE distribution_requests SET status = 'approved', processed_date = CURRENT_TIMESTAMP WHERE id = $1", req.RequestID)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				return
			}

			// Update inventory stock
			_, err = tx.Exec("UPDATE inventory SET stock = stock - $1 WHERE id = $2", quantity, itemID)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				return
			}

			err = tx.Commit()
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				return
			}

			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(map[string]string{"status": "success", "message": "Permintaan disetujui"})
		} else if req.Action == "reject" {
			// Reject a distribution request
			_, err = db.Exec("UPDATE distribution_requests SET status = 'rejected', processed_date = CURRENT_TIMESTAMP WHERE id = $1", req.RequestID)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
				return
			}

			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(map[string]string{"status": "success", "message": "Permintaan ditolak"})
		} else {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"error": "Aksi tidak dikenali"})
		}
	}
}

func handleAuditTrail(w http.ResponseWriter, r *http.Request) {
	db, err := connectDB()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	defer db.Close()

	// Seed some dummy transactions if empty to populate the audit log
	var count int
	_ = db.QueryRow("SELECT COUNT(*) FROM transactions").Scan(&count)
	if count == 0 {
		var invID int
		err = db.QueryRow("SELECT id FROM inventory LIMIT 1").Scan(&invID)
		if err != nil {
			_ = db.QueryRow("INSERT INTO inventory (name, category, status, stock, location, type) VALUES ('Sensor Lidar A-1', 'Sensor', 'Active', 12, 'Zona A-12', 'mentah') RETURNING id").Scan(&invID)
		}
		
		_, _ = db.Exec(`
			INSERT INTO transactions (inventory_id, type, quantity, reason, target, status, location, created_at)
			VALUES 
			($1, 'Masuk', 15, 'Restock bulanan dari Supplier CoreTek', 'Gudang Pusat', 'Selesai', 'Zona A-12', NOW() - INTERVAL '2 HOURS'),
			($1, 'Keluar', 3, 'Perakitan unit Robot HPP Edu-Kit', 'Cabang Bandung', 'Selesai', 'Zona B-04', NOW() - INTERVAL '1 DAY'),
			($1, 'Masuk', 10, 'Pengembalian sisa komponen pelatihan', 'Cabang Surabaya', 'Selesai', 'Zona C-01', NOW() - INTERVAL '2 DAYS'),
			($1, 'Keluar', 5, 'Maintenance Sendi Lengan Robot', 'Cabang Medan', 'Selesai', 'Zona B-04', NOW() - INTERVAL '3 DAYS')
		`, invID)
	}

	if r.Method == "GET" {
		rows, err := db.Query(`
			SELECT combined.id, combined.type, combined.quantity, combined.reason, combined.created_at, combined.item_name, combined.target, COALESCE(u.full_name, 'Operator') as user_name
			FROM (
				SELECT t.id, LOWER(t.type) as type, t.quantity, COALESCE(t.reason, 'Input Gudang Pusat') as reason, 
				       t.created_at, i.name as item_name, COALESCE(t.target, 'Gudang Pusat') as target, NULL::INT as user_id
				FROM transactions t
				JOIN inventory i ON t.inventory_id = i.id

				UNION ALL

				SELECT d.id, 'keluar' as type, d.quantity, 'Distribusi ke Cabang' as reason, 
				       d.request_date as created_at, i.name as item_name, b.name as target, d.requester_id as user_id
				FROM distribution_requests d
				JOIN inventory i ON d.item_id = i.id
				JOIN branches b ON d.branch_id = b.id
				WHERE d.status = 'approved'

				UNION ALL

				SELECT pd.id, 'keluar' as type, pd.quantity, COALESCE(pd.notes, 'Distribusi ke Sekolah') as reason, 
				       pd.dist_date as created_at, i.name as item_name, pd.school_name as target, pd.prepare_id as user_id
				FROM prepare_distributions pd
				JOIN inventory i ON pd.item_id = i.id
			) combined
			LEFT JOIN users u ON combined.user_id = u.id
			ORDER BY combined.created_at DESC
		`)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}
		defer rows.Close()

		var list []map[string]interface{}
		for rows.Next() {
			var id, quantity int
			var txnType, reason, itemName, target, userName string
			var dateVal interface{}
			
			err = rows.Scan(&id, &txnType, &quantity, &reason, &dateVal, &itemName, &target, &userName)
			if err != nil {
				continue
			}

			dateStr := ""
			if d, ok := dateVal.(string); ok {
				dateStr = d
			} else if t, ok := dateVal.([]uint8); ok {
				dateStr = string(t)
			} else {
				dateStr = fmt.Sprintf("%v", dateVal)
			}

			mappedType := "penyesuaian"
			if txnType == "masuk" || txnType == "in" {
				mappedType = "masuk"
			} else if txnType == "keluar" || txnType == "out" {
				mappedType = "keluar"
			}

			list = append(list, map[string]interface{}{
				"id":          id,
				"type":        mappedType,
				"quantity":    quantity,
				"reason":      reason,
				"date":        dateStr,
				"user_name":   userName,
				"branch_name": target,
				"item_name":   itemName,
			})
		}
		if list == nil {
			list = []map[string]interface{}{}
		}
		json.NewEncoder(w).Encode(list)
	}
}
func handlePrepareRequests(w http.ResponseWriter, r *http.Request) {
	db, err := connectDB()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	defer db.Close()

	_, _ = db.Exec(`CREATE TABLE IF NOT EXISTS prepare_requests (
		id SERIAL PRIMARY KEY,
		item_id INTEGER NOT NULL REFERENCES inventory(id),
		quantity INTEGER NOT NULL,
		requester_id INTEGER NOT NULL REFERENCES users(id),
		status TEXT DEFAULT 'pending',
		request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		process_date TIMESTAMP
	)`)

	if r.Method == "GET" {
		requesterID := r.URL.Query().Get("requester_id")
		var rows *sql.Rows
		var err error
		if requesterID != "" {
			rows, err = db.Query(`SELECT pr.id, pr.quantity, pr.status, to_char(pr.request_date, 'DD/MM/YYYY HH24:MI'), i.name, u.full_name 
				FROM prepare_requests pr
				JOIN inventory i ON pr.item_id = i.id
				JOIN users u ON pr.requester_id = u.id
				WHERE pr.requester_id = $1 ORDER BY pr.id DESC`, requesterID)
		} else {
			rows, err = db.Query(`SELECT pr.id, pr.quantity, pr.status, to_char(pr.request_date, 'DD/MM/YYYY HH24:MI'), i.name, u.full_name 
				FROM prepare_requests pr
				JOIN inventory i ON pr.item_id = i.id
				JOIN users u ON pr.requester_id = u.id
				ORDER BY pr.id DESC`)
		}
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}
		defer rows.Close()
		var list []map[string]interface{}
		for rows.Next() {
			var id, qty int
			var status, date, itemName, fullName string
			rows.Scan(&id, &qty, &status, &date, &itemName, &fullName)
			list = append(list, map[string]interface{}{
				"id": id, "item_name": itemName, "quantity": qty, "status": status, "request_date": date, "requester": fullName,
			})
		}
		if list == nil { list = []map[string]interface{}{} }
		json.NewEncoder(w).Encode(list)
	} else if r.Method == "POST" {
		var req struct {
			ItemID      int `json:"item_id"`
			Quantity    int `json:"quantity"`
			RequesterID int `json:"requester_id"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		_, err = db.Exec("INSERT INTO prepare_requests (item_id, quantity, requester_id) VALUES ($1, $2, $3)", req.ItemID, req.Quantity, req.RequesterID)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(map[string]string{"status": "success"})
	} else if r.Method == "PUT" {
		var req struct {
			RequestID int    `json:"request_id"`
			Action    string `json:"action"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		if req.Action == "approve" {
			var itemID, qty, reqID int
			err = db.QueryRow("SELECT item_id, quantity, requester_id FROM prepare_requests WHERE id=$1", req.RequestID).Scan(&itemID, &qty, &reqID)
			if err != nil {
				w.WriteHeader(http.StatusNotFound)
				return
			}
			tx, err := db.Begin()
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			defer tx.Rollback()

			_, err = tx.Exec("UPDATE inventory SET stock = GREATEST(0, stock - $1) WHERE id = $2", qty, itemID)
			if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

			_, _ = tx.Exec(`CREATE TABLE IF NOT EXISTS prepare_inventory (
				id SERIAL PRIMARY KEY,
				prepare_id INTEGER NOT NULL REFERENCES users(id),
				item_id INTEGER NOT NULL REFERENCES inventory(id),
				stock INTEGER DEFAULT 0,
				UNIQUE(prepare_id, item_id)
			)`)

			_, err = tx.Exec(`INSERT INTO prepare_inventory (prepare_id, item_id, stock) VALUES ($1, $2, $3)
				ON CONFLICT (prepare_id, item_id) DO UPDATE SET stock = prepare_inventory.stock + EXCLUDED.stock`, reqID, itemID, qty)
			if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

			_, err = tx.Exec("UPDATE prepare_requests SET status = 'approved', process_date = NOW() WHERE id = $1", req.RequestID)
			if err != nil { w.WriteHeader(http.StatusInternalServerError); return }
			
			tx.Commit()
			json.NewEncoder(w).Encode(map[string]string{"status": "success", "message": "Stok dialihkan ke Prepare"})
		} else {
			_, err = db.Exec("UPDATE prepare_requests SET status = 'rejected', process_date = NOW() WHERE id = $1", req.RequestID)
			if err != nil { w.WriteHeader(http.StatusInternalServerError); return }
			json.NewEncoder(w).Encode(map[string]string{"status": "success", "message": "Request ditolak"})
		}
	}
}

func handlePrepareInventory(w http.ResponseWriter, r *http.Request) {
	db, err := connectDB()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	defer db.Close()

	_, _ = db.Exec(`CREATE TABLE IF NOT EXISTS prepare_inventory (
		id SERIAL PRIMARY KEY,
		prepare_id INTEGER NOT NULL REFERENCES users(id),
		item_id INTEGER NOT NULL REFERENCES inventory(id),
		stock INTEGER DEFAULT 0,
		UNIQUE(prepare_id, item_id)
	)`)

	if r.Method == "GET" {
		prepareID := r.URL.Query().Get("prepare_id")
		if prepareID == "" {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		rows, err := db.Query(`SELECT pi.item_id, i.name, pi.stock 
			FROM prepare_inventory pi
			JOIN inventory i ON pi.item_id = i.id
			WHERE pi.prepare_id = $1 AND pi.stock > 0`, prepareID)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		defer rows.Close()
		var list []map[string]interface{}
		for rows.Next() {
			var itemID, stock int
			var itemName string
			rows.Scan(&itemID, &itemName, &stock)
			list = append(list, map[string]interface{}{"item_id": itemID, "item_name": itemName, "stock": stock})
		}
		if list == nil { list = []map[string]interface{}{} }
		json.NewEncoder(w).Encode(list)
	}
}

func handlePrepareDistributions(w http.ResponseWriter, r *http.Request) {
	db, err := connectDB()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	defer db.Close()

	_, _ = db.Exec(`CREATE TABLE IF NOT EXISTS prepare_distributions (
		id SERIAL PRIMARY KEY,
		prepare_id INTEGER NOT NULL REFERENCES users(id),
		item_id INTEGER NOT NULL REFERENCES inventory(id),
		quantity INTEGER NOT NULL,
		school_name TEXT NOT NULL,
		notes TEXT,
		dist_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	)`)

	if r.Method == "GET" {
		prepareID := r.URL.Query().Get("prepare_id")
		var rows *sql.Rows
		var err error
		if prepareID != "" {
			rows, err = db.Query(`SELECT pd.id, pd.quantity, pd.school_name, to_char(pd.dist_date, 'DD/MM/YYYY HH24:MI'), i.name 
				FROM prepare_distributions pd
				JOIN inventory i ON pd.item_id = i.id
				WHERE pd.prepare_id = $1 ORDER BY pd.id DESC`, prepareID)
		} else {
			rows, err = db.Query(`SELECT pd.id, pd.quantity, pd.school_name, to_char(pd.dist_date, 'DD/MM/YYYY HH24:MI'), i.name, u.full_name
				FROM prepare_distributions pd
				JOIN inventory i ON pd.item_id = i.id
				JOIN users u ON pd.prepare_id = u.id
				ORDER BY pd.id DESC`)
		}
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		defer rows.Close()
		var list []map[string]interface{}
		for rows.Next() {
			var id, qty int
			var school, date, item string
			var preparer string
			
			if prepareID != "" {
				rows.Scan(&id, &qty, &school, &date, &item)
			} else {
				rows.Scan(&id, &qty, &school, &date, &item, &preparer)
			}
			
			res := map[string]interface{}{
				"id": id, "item_name": item, "quantity": qty, "school_name": school, "dist_date": date,
			}
			if prepareID == "" {
				res["preparer"] = preparer
			}
			list = append(list, res)
		}
		if list == nil { list = []map[string]interface{}{} }
		json.NewEncoder(w).Encode(list)
	} else if r.Method == "POST" {
		var req struct {
			PrepareID  int    `json:"prepare_id"`
			ItemID     int    `json:"item_id"`
			Quantity   int    `json:"quantity"`
			SchoolName string `json:"school_name"`
			Notes      string `json:"notes"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		tx, err := db.Begin()
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		defer tx.Rollback()

		res, err := tx.Exec("UPDATE prepare_inventory SET stock = stock - $1 WHERE prepare_id = $2 AND item_id = $3 AND stock >= $1", req.Quantity, req.PrepareID, req.ItemID)
		if err != nil { w.WriteHeader(http.StatusInternalServerError); return }
		
		aff, _ := res.RowsAffected()
		if aff == 0 {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"error": "Stok di Prepare tidak cukup!"})
			return
		}

		_, err = tx.Exec("INSERT INTO prepare_distributions (prepare_id, item_id, quantity, school_name, notes) VALUES ($1, $2, $3, $4, $5)", req.PrepareID, req.ItemID, req.Quantity, req.SchoolName, req.Notes)
		if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

		tx.Commit()
		json.NewEncoder(w).Encode(map[string]string{"status": "success"})
	}
}
func handleWarehouseZones(w http.ResponseWriter, r *http.Request) {
	db, err := connectDB()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Database connection failure"})
		return
	}
	defer db.Close()

	if r.Method == "GET" {
		rows, err := db.Query("SELECT id, name, total_racks, color, COALESCE(description, ''), COALESCE(branch_id, 0) FROM warehouse_zones ORDER BY id ASC")
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var zones []map[string]interface{}
		for rows.Next() {
			var id, racks, branchId int
			var name, color, desc string
			rows.Scan(&id, &name, &racks, &color, &desc, &branchId)
			zones = append(zones, map[string]interface{}{
				"id": id, "name": name, "total_racks": racks, "color": color, "description": desc, "branch_id": branchId,
			})
		}
		if zones == nil { zones = []map[string]interface{}{} }
		json.NewEncoder(w).Encode(zones)

	} else if r.Method == "POST" {
		var req struct {
			Name       string `json:"name"`
			TotalRacks int    `json:"total_racks"`
			Color      string `json:"color"`
			Desc       string `json:"description"`
		}
		json.NewDecoder(r.Body).Decode(&req)
		if req.Color == "" { req.Color = "#10b981" }
		if req.TotalRacks == 0 { req.TotalRacks = 16 }

		_, err := db.Exec("INSERT INTO warehouse_zones (name, total_racks, color, description) VALUES ($1, $2, $3, $4)", req.Name, req.TotalRacks, req.Color, req.Desc)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}
		json.NewEncoder(w).Encode(map[string]string{"status": "created"})

	} else if r.Method == "PUT" {
		var req struct {
			ID         int    `json:"id"`
			Name       string `json:"name"`
			TotalRacks int    `json:"total_racks"`
			Color      string `json:"color"`
			Desc       string `json:"description"`
		}
		json.NewDecoder(r.Body).Decode(&req)
		_, err := db.Exec("UPDATE warehouse_zones SET name=$1, total_racks=$2, color=$3, description=$4 WHERE id=$5", req.Name, req.TotalRacks, req.Color, req.Desc, req.ID)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(map[string]string{"status": "updated"})

	} else if r.Method == "DELETE" {
		id := r.URL.Query().Get("id")
		_, err := db.Exec("DELETE FROM warehouse_zones WHERE id=$1", id)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(map[string]string{"status": "deleted"})
	}
}

func handleProductionRobots(w http.ResponseWriter, r *http.Request) {
	db, err := connectDB()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	defer db.Close()

	// Auto migration inside handler
	_, _ = db.Exec(`CREATE TABLE IF NOT EXISTS production_robots (
		id SERIAL PRIMARY KEY,
		name TEXT NOT NULL,
		model TEXT,
		image TEXT,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	)`)
	_, _ = db.Exec(`CREATE TABLE IF NOT EXISTS robot_bom (
		id SERIAL PRIMARY KEY,
		robot_id INTEGER REFERENCES production_robots(id) ON DELETE CASCADE,
		name TEXT NOT NULL,
		sku TEXT,
		quantity INTEGER DEFAULT 1,
		unit_price INTEGER DEFAULT 0,
		category TEXT
	)`)

	if r.Method == "GET" {
		rows, err := db.Query("SELECT id, name, COALESCE(model, ''), COALESCE(image, '') FROM production_robots ORDER BY id DESC")
		if err != nil {
			log.Printf("Error querying robots: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		type BOM struct {
			Name      string `json:"name"`
			SKU       string `json:"sku"`
			Quantity  int    `json:"quantity"`
			UnitPrice int    `json:"unitPrice"`
			Category  string `json:"category"`
		}
		type Robot struct {
			ID         string `json:"id"`
			RealID     int    `json:"real_id"`
			Name       string `json:"name"`
			Model      string `json:"model"`
			Image      string `json:"image"`
			Components []BOM  `json:"components"`
		}

		var result []Robot
		for rows.Next() {
			var rb Robot
			var id int
			rows.Scan(&id, &rb.Name, &rb.Model, &rb.Image)
			rb.RealID = id
			rb.ID = fmt.Sprintf("RBT-%03d", id)
			rb.Components = []BOM{}

			crows, err := db.Query("SELECT name, sku, quantity, unit_price, category FROM robot_bom WHERE robot_id = $1", id)
			if err == nil {
				for crows.Next() {
					var b BOM
					crows.Scan(&b.Name, &b.SKU, &b.Quantity, &b.UnitPrice, &b.Category)
					rb.Components = append(rb.Components, b)
				}
				crows.Close()
			}
			result = append(result, rb)
		}
		if result == nil { result = []Robot{} }
		json.NewEncoder(w).Encode(result)

	} else if r.Method == "POST" {
		var req struct {
			Name       string `json:"name"`
			Model      string `json:"model"`
			Image      string `json:"image"`
			Components []struct {
				Name      string `json:"name"`
				SKU       string `json:"sku"`
				Quantity  int    `json:"quantity"`
				UnitPrice int    `json:"unitPrice"`
				Category  string `json:"category"`
			} `json:"components"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		var newRobotID int
		err = db.QueryRow("INSERT INTO production_robots (name, model, image) VALUES ($1, $2, $3) RETURNING id", req.Name, req.Model, req.Image).Scan(&newRobotID)
		if err != nil {
			log.Printf("Insert Robot Error: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": "Failed to save robot parent"})
			return
		}

		for _, c := range req.Components {
			_, _ = db.Exec("INSERT INTO robot_bom (robot_id, name, sku, quantity, unit_price, category) VALUES ($1, $2, $3, $4, $5, $6)", 
				newRobotID, c.Name, c.SKU, c.Quantity, c.UnitPrice, c.Category)
		}

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(map[string]string{"status": "success", "id": fmt.Sprintf("%d", newRobotID)})
	}
}


func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	(*w).Header().Set("Access-Control-Set-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	(*w).Header().Set("Access-Control-Allow-Headers", "Content-Type")
}

func main() {
	// Memuat file .env jika ada
	err := godotenv.Load()
	if err != nil {
		log.Println("Info: Tidak ada file .env yang dimuat, menggunakan environment variables bawaan")
	}

	http.HandleFunc("/", Handler)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server berjalan di http://localhost:%s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
