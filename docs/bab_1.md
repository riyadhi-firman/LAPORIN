# BAB I: PENDAHULUAN

## 1.1 Latar Belakang
Seiring dengan pesatnya perkembangan teknologi informasi, kebutuhan akan transparansi dan kecepatan pelayanan publik menjadi semakin krusial. Dalam konteks tata kelola pemerintahan atau lingkungan masyarakat, komunikasi dua arah antara warga dan pihak berwenang seringkali mengalami hambatan. Warga kerap kesulitan menemukan kanal yang tepat untuk melaporkan masalah infrastruktur, kebersihan, keamanan, atau fasilitas umum lainnya. Di sisi lain, instansi pemerintah atau pengurus lingkungan membutuhkan data yang terpusat dan terstruktur untuk merespons dan menindaklanjuti setiap keluhan secara efektif.

Oleh karena itu, diperlukan sebuah sistem pelaporan terpadu yang dapat diakses dengan mudah oleh warga kapan saja dan di mana saja. Aplikasi **LAPORIN** dikembangkan sebagai platform pelaporan masyarakat berbasis web modern yang menjembatani komunikasi tersebut. Dengan mengusung antarmuka yang intuitif serta fitur penandaan lokasi (geolokasi) dan unggah foto, aplikasi ini diharapkan dapat meningkatkan partisipasi aktif masyarakat sekaligus mempercepat respons penanganan masalah oleh pihak berwenang.

## 1.2 Rumusan Masalah
Berdasarkan latar belakang di atas, rumusan masalah dalam pengembangan sistem ini adalah:
1. Bagaimana merancang dan membangun sistem pelaporan masyarakat yang interaktif dan mudah diakses oleh warga?
2. Bagaimana sistem dapat membantu administrator (pihak berwenang) dalam memantau, memverifikasi, dan mengelola status setiap laporan yang masuk?
3. Bagaimana mengimplementasikan fitur geolokasi (peta interaktif) untuk memastikan akurasi lokasi kejadian yang dilaporkan?
4. Bagaimana memastikan transparansi tindak lanjut laporan agar pelapor dapat memantau perkembangan laporannya?

## 1.3 Tujuan Pengembangan
Tujuan dari pengembangan aplikasi LAPORIN adalah:
1. Membangun platform pelaporan masyarakat berbasis *Single Page Application* (SPA) yang responsif menggunakan *stack* teknologi Laravel dan React.
2. Menyediakan fitur manajemen laporan (CMS) yang komprehensif bagi Admin untuk mengubah status, memberikan tanggapan, dan menganalisis statistik pelaporan.
3. Mengintegrasikan layanan peta interaktif untuk visualisasi lokasi keluhan secara akurat.
4. Menciptakan sistem notifikasi *real-time* untuk memberikan pembaruan status laporan secara langsung kepada warga.

## 1.4 Manfaat
Pengembangan sistem ini diharapkan dapat memberikan manfaat sebagai berikut:
1. **Bagi Masyarakat:** Memudahkan proses penyampaian keluhan atau laporan tanpa harus datang ke kantor instansi, serta memberikan transparansi terkait sejauh mana laporan tersebut ditangani.
2. **Bagi Instansi/Pemerintah:** Memiliki sistem pendataan keluhan yang rapi, terpusat, dan dapat diekspor, sehingga mempermudah proses pengambilan keputusan dan alokasi perbaikan fasilitas.
3. **Bagi Pengembang:** Mengimplementasikan dan mengeksplorasi penggunaan framework modern (Laravel, Inertia.js, React, Tailwind CSS) dalam membangun aplikasi berskala *production-ready*.
