# queue-express

Sistem manajemen antrian real-time menggunakan Express.js, Sequelize, dan Socket.IO. Mendukung antrian walk-in dan reservasi dengan fitur dashboard, pemanggilan antrian, dan pelacakan performa staff.

## Fitur Utama

- Login dan logout staff
- Tambah antrian (Walk-in & Reservasi)
- Pemanggilan antrian otomatis dengan skema 2 Reservasi : 1 Walk-in
- Tandai antrian selesai dan simpan durasi pelayanan
- Dashboard statistik (antrian aktif, staff aktif, top staff)
- Tampilan display dengan update real-time via Socket.IO

## Teknologi yang Digunakan

- Backend: Node.js + Express
- Database: MySQL + Sequelize ORM
- Realtime: Socket.IO
- Autentikasi: JWT

## Cara Install & Menjalankan

1. Clone repository
   ```bash
   git clone https://github.com/yogatir/queue-express.git
   cd queue-express

2. Install dependencies
    ```npm install

3. Jalankan migrasi database
    ```npx sequelize-cli db:migrate

4. Populate database dengan records
    ```npx sequelize-cli db:seed:all

5. Jalankan server
    ```npm run dev

---

## Daftar Endpoint API

### Auth & Staff

| Method | Endpoint       | Deskripsi                                  |
|--------|----------------|--------------------------------------------|
| POST   | `/staff/login` | Login staff dan mendapatkan token JWT      |
| GET    | `/staff`       | Ambil semua data profil staff              |

---


### 📋 Antrian (Queue)

| Method | Endpoint               | Deskripsi                                             |
|--------|------------------------|-------------------------------------------------------|
| GET    | `/queue`               | Ambil semua data antrian                              |
| POST   | `/queue`               | Tambah antrian baru                                   |
| POST   | `/queue/call`          | Panggil antrian berikutnya berdasarkan aturan 2:1     |
| PUT    | `/queue/:id/done`      | Tandai antrian sebagai selesai, update durasi log     |
| GET    | `/queue/display`       | Ambil antrian yang sedang dipanggil untuk display     |

---

### Dashboard

| Method | Endpoint       | Deskripsi                                       |
|--------|----------------|-------------------------------------------------|
| GET    | `/dashboard`   | Ambil data dashboard: statistik, top staff, dll |

---

### Lisensi

Proyek ini menggunakan lisensi MIT. Bebas digunakan untuk keperluan pribadi maupun komersial.

### Pengembang

Dibuat oleh Yoga Tirta
GitHub: https://github.com/yogatir