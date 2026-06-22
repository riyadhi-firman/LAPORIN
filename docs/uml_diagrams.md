# Diagram UML Aplikasi LAPORIN

Berikut adalah pemodelan UML (Unified Modeling Language) yang mendeskripsikan interaksi, struktur, dan perilaku sistem aplikasi LAPORIN.

## 1. Use Case Diagram
Diagram ini memetakan interaksi antara Aktor (Warga dan Admin) dengan sistem.

```mermaid
flowchart LR
    %% Actors
    Warga((Warga))
    Admin((Admin))

    %% System Boundary
    subgraph Sistem LAPORIN
        direction TB
        UC1([Registrasi Akun])
        UC2([Login Aplikasi])
        UC3([Buat Laporan Baru])
        UC4([Lacak Riwayat Laporan])
        UC5([Tambah Komentar])
        
        UC6([Lihat Dashboard Analitik])
        UC7([Verifikasi/Ubah Status Laporan])
        UC8([Kelola Kategori Laporan])
        UC9([Kelola Pengguna])
        UC10([Kelola Pengaturan Aplikasi])
    end

    %% Warga Connections
    Warga --- UC1
    Warga --- UC2
    Warga --- UC3
    Warga --- UC4
    Warga --- UC5

    %% Admin Connections
    Admin --- UC2
    Admin --- UC5
    Admin --- UC6
    Admin --- UC7
    Admin --- UC8
    Admin --- UC9
    Admin --- UC10
```

## 2. Activity Diagram (Alur Pelaporan)
Diagram aktivitas ini menjelaskan langkah-langkah prosedural dari proses pembuatan laporan oleh Warga hingga diverifikasi oleh Admin.

```mermaid
stateDiagram-v2
    state Warga {
        [*] --> Login_Warga
        Login_Warga --> Isi_Formulir : Klik "Buat Laporan"
        Isi_Formulir --> Unggah_Foto
        Unggah_Foto --> Tentukan_Lokasi
        Tentukan_Lokasi --> Submit_Laporan
    }

    state Sistem {
        Submit_Laporan --> Simpan_Database
        Simpan_Database --> Kirim_Notif_Admin
        Kirim_Notif_Admin --> Status_Menunggu
    }

    state Admin {
        Status_Menunggu --> Login_Admin
        Login_Admin --> Buka_Daftar_Laporan
        Buka_Daftar_Laporan --> Evaluasi_Laporan
        Evaluasi_Laporan --> Validasi
        
        state Validasi <<choice>>
        Validasi --> Terima : Memenuhi Syarat
        Validasi --> Tolak : Tidak Valid / Palsu
        
        Terima --> Ubah_Diproses
        Tolak --> Ubah_Ditolak
        Ubah_Diproses --> Eksekusi_Lapangan
        Eksekusi_Lapangan --> Ubah_Selesai
    }
    
    state Sistem_Notif {
        Ubah_Ditolak --> Kirim_Notif_Warga
        Ubah_Diproses --> Kirim_Notif_Warga
        Ubah_Selesai --> Kirim_Notif_Warga
        Kirim_Notif_Warga --> [*]
    }
```

## 3. Sequence Diagram (Skenario Pembuatan Laporan)
Diagram sekuensial ini memvisualisasikan pertukaran pesan (aliran data) antara *browser* klien, *controller* server (Laravel), dan *database* saat Warga mengirim laporan.

```mermaid
sequenceDiagram
    actor W as Warga
    participant R as React Frontend (Inertia)
    participant C as ReportController (Laravel)
    participant D as MySQL Database

    W->>R: Mengisi form (Teks, Foto, Kategori, Lokasi)
    W->>R: Klik tombol "Kirim Laporan"
    R->>C: POST /warga/reports (Multipart Form-Data)
    activate C
    
    C->>C: Validasi Data (Teks wajib, Foto maks 2MB)
    alt Validasi Gagal
        C-->>R: Error 422 (Unprocessable Entity)
        R-->>W: Tampilkan pesan error pada form
    else Validasi Berhasil
        C->>C: Simpan file foto ke Storage (/public/reports)
        C->>D: INSERT INTO reports (...)
        activate D
        D-->>C: Data berhasil disimpan (Status: Menunggu)
        deactivate D
        C-->>R: Redirect ke /warga/reports dengan Session Success
        R-->>W: Tampilkan Toast "Laporan Berhasil Dibuat"
    end
    deactivate C
```

## 4. Sequence Diagram (Skenario Admin Mengubah Status)

```mermaid
sequenceDiagram
    actor A as Admin
    participant R as React Frontend (Inertia)
    participant C as ReportController (Laravel)
    participant D as MySQL Database

    A->>R: Klik tombol "Ubah Status" -> "Diproses"
    R->>C: PATCH /admin/reports/{id}/status (status="diproses")
    activate C
    
    C->>D: SELECT * FROM reports WHERE id={id}
    activate D
    D-->>C: Objek Laporan
    deactivate D
    
    C->>D: UPDATE reports SET status="diproses"
    activate D
    D-->>C: Update sukses
    deactivate D
    
    C->>D: INSERT INTO notifications (untuk Warga)
    activate D
    D-->>C: Notifikasi sukses
    deactivate D
    
    C-->>R: Redirect kembali dengan status sukses
    R-->>A: UI menampilkan badge status berwarna Kuning (Diproses)
    deactivate C
```
