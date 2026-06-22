# Panduan Instalasi LAPORIN (Sistem Pengaduan Warga Berbasis Web)

Berikut adalah panduan instalasi lengkap *step-by-step* untuk menjalankan aplikasi LAPORIN pada environment WSL Ubuntu Anda.

## 1. Persiapan Environment

Aplikasi ini membutuhkan:
- PHP 8.3 atau lebih baru
- Node.js versi terbaru (LTS)
- Composer
- MySQL Database
- Ekstensi PHP (`php-mysql`, `php-xml`, `php-mbstring`, `php-curl`, `php-zip`, `php-sqlite3`)

### A. Instalasi PHP 8.3+ & Composer
Jika Anda belum menginstall PHP 8.3 dan Composer di WSL Ubuntu:
```bash
sudo apt update
sudo apt install -y software-properties-common curl
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update
sudo apt install -y php8.3 php8.3-cli php8.3-fpm php8.3-mysql php8.3-xml php8.3-mbstring php8.3-curl php8.3-zip unzip

# Install Composer
curl -sS https://getcomposer.org/installer -o composer-setup.php
sudo php composer-setup.php --install-dir=/usr/local/bin --filename=composer
rm composer-setup.php
```

### B. Instalasi Node.js (Terbaru/LTS)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### C. Instalasi & Setup MySQL
```bash
sudo apt install -y mysql-server
sudo service mysql start

# Amankan instalasi MySQL (Ikuti prompt)
sudo mysql_secure_installation

# Masuk ke MySQL console sebagai root untuk membuat database laporin
sudo mysql -u root -p
```
Dalam console MySQL:
```sql
CREATE DATABASE laporin;
CREATE USER 'root'@'localhost' IDENTIFIED BY '';
GRANT ALL PRIVILEGES ON laporin.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```
*(Catatan: Sesuaikan username & password sesuai konfigurasi lokal Anda)*

## 2. Inisialisasi Project (Tahapan yang akan dijalankan oleh agen)

Karena agen melakukan setup secara otomatis, agen akan menjalankan perintah berikut di dalam direktori `/home/firmankw/LAPORIN`:
```bash
composer create-project laravel/laravel .
composer require laravel/breeze --dev
php artisan breeze:install react --typescript
```

## 3. Setup Database (Migrasi & Seeding)

Pastikan file `.env` sudah dikonfigurasi dengan:
```ini
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laporin
DB_USERNAME=root
DB_PASSWORD=
```
Lalu jalankan migrasi database dan *seeding* akun admin default:
```bash
php artisan migrate:fresh --seed
```
*Akun Admin Default:*
- Email: `admin@laporin.com`
- Password: `password`

## 4. Cara Menjalankan Aplikasi

Aplikasi berjalan sebagai dua proses (Backend PHP & Frontend Vite React). Buka **dua terminal terpisah** di dalam direktori `LAPORIN`.

**Terminal 1 (Backend Laravel):**
```bash
php artisan serve
```
*(Akan berjalan di http://localhost:8000)*

**Terminal 2 (Frontend Vite):**
```bash
npm install
npm run dev
```

Kini aplikasi Anda siap digunakan dan bisa diakses melalui http://localhost:8000.
