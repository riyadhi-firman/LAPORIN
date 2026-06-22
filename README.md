# LAPORIN - Platform Pelaporan Masyarakat 🚀

![LAPORIN Hero Banner](https://via.placeholder.com/1200x400/0f172a/ffffff?text=LAPORIN+-+Suara+Anda+Membangun+Kota)

**LAPORIN** adalah aplikasi berbasis web modern yang dirancang untuk menjembatani komunikasi antara warga dan pemerintah atau pihak berwenang. Melalui aplikasi ini, warga dapat melaporkan berbagai masalah lingkungan seperti kerusakan infrastruktur, masalah kebersihan, hingga fasilitas umum secara mudah, interaktif, dan transparan.

## ✨ Fitur Utama
1. **Sistem Autentikasi**: Login dan Registrasi aman untuk Warga dan Admin (Berbasis Laravel Breeze).
2. **Geolokasi Terintegrasi**: Warga dapat menandai titik lokasi masalah secara presisi menggunakan peta interaktif (Leaflet.js & OpenStreetMap).
3. **Manajemen Laporan Interaktif**:
   - Status laporan *real-time* (Menunggu, Diproses, Selesai, Ditolak).
   - Kolom diskusi/tanggapan dua arah antara Warga dan Admin.
4. **Dashboard Analitik Admin**: Visualisasi data laporan masuk berdasarkan kategori dan tren bulanan menggunakan Recharts.
5. **Notifikasi *In-App***: Pembaruan instan bagi warga jika laporannya ditanggapi atau statusnya berubah.
6. **Pengaturan Aplikasi Dinamis (CMS)**: Admin dapat mengubah identitas aplikasi (nama, logo), teks halaman depan, syarat & ketentuan, hingga menyalakan Mode Pemeliharaan (*Maintenance Mode*) tanpa menyentuh kode.
7. **Dukungan Dark Mode**: Tampilan UI yang menyesuaikan dengan preferensi sistem pengguna.

## 🛠️ Teknologi yang Digunakan
Aplikasi ini dibangun menggunakan arsitektur *Monolith* dengan performa SPA (*Single Page Application*) berkat *stack* teknologi:
- **Backend**: [Laravel 11](https://laravel.com/) (PHP)
- **Frontend**: [React.js](https://reactjs.org/) dengan TypeScript
- **Penghubung**: [Inertia.js](https://inertiajs.com/) (Menghilangkan kebutuhan pembuatan REST API manual)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & Komponen [Shadcn UI](https://ui.shadcn.com/)
- **Database**: MySQL

## 🚀 Panduan Instalasi (Development)

Untuk menjalankan proyek ini di mesin lokal Anda, ikuti langkah-langkah berikut:

### Prasyarat
- PHP 8.2 atau lebih baru
- Composer
- Node.js (v18+) & NPM
- MySQL Server

### Langkah-langkah
1. **Clone repositori ini**
   ```bash
   git clone git@github.com:riyadhi-firman/LAPORIN.git
   cd LAPORIN
   ```

2. **Instal dependensi Backend (PHP)**
   ```bash
   composer install
   ```

3. **Instal dependensi Frontend (Node)**
   ```bash
   npm install
   ```

4. **Konfigurasi Environment**
   Salin file `.env.example` menjadi `.env` lalu sesuaikan kredensial koneksi *database* Anda.
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Migrasi dan Seeding Database**
   Perintah ini akan membuat tabel-tabel sekaligus mengisi data awal (seperti Akun Admin *default*).
   ```bash
   php artisan migrate --seed
   ```

6. **Buat Tautan Storage (Untuk Upload Foto)**
   ```bash
   php artisan storage:link
   ```

7. **Jalankan Aplikasi**
   Buka dua jendela terminal terpisah dan jalankan kedua perintah berikut:
   
   Terminal 1 (Menjalankan server PHP):
   ```bash
   php artisan serve
   ```
   
   Terminal 2 (Men-compile aset frontend):
   ```bash
   npm run dev
   ```

8. Buka `http://localhost:8000` di *browser* Anda.

### Akses Default Admin
*(Pastikan Anda telah menjalankan perintah seed `php artisan migrate --seed`)*
- **Email:** `admin@laporin.com`
- **Password:** `password`

## 📖 Dokumentasi Lengkap
Dokumen rancangan sistem (Bab 1, Bab 3, dan Diagram UML) tersedia di dalam folder `/docs`.

---
*Dibuat untuk mempermudah pelaporan warga demi lingkungan yang lebih baik.*
