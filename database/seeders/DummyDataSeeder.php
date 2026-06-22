<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Category;
use App\Models\Report;
use App\Models\Comment;
use Illuminate\Support\Str;
use Faker\Factory as Faker;

class DummyDataSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('id_ID'); // Gunakan lokalisasi Indonesia
        
        // 1. Buat beberapa Warga
        $wargaUsers = User::factory(10)->create([
            'role' => 'warga',
            'password' => bcrypt('password'),
        ]);

        $admin = User::where('role', 'admin')->first();
        $categories = Category::all();
        $statuses = ['menunggu', 'diproses', 'selesai'];

        // Center of Jakarta for dummy locations
        $baseLat = -6.200000;
        $baseLng = 106.816666;

        // Judul laporan realistis
        $titles = [
            'Jalan berlubang parah dan membahayakan pengendara',
            'Lampu penerangan jalan umum mati total',
            'Tumpukan sampah belum diangkut selama 3 hari',
            'Fasilitas taman bermain anak rusak berat',
            'Pohon tumbang menutupi sebagian jalan raya',
            'Saluran air tersumbat menyebabkan banjir saat hujan',
            'Tindak premanisme meresahkan warga sekitar',
            'Fasilitas halte bus hancur akibat vandalisme'
        ];

        $descriptions = [
            'Tolong segera ditindaklanjuti karena kondisi ini sangat membahayakan aktivitas warga sehari-hari. Sudah banyak korban yang hampir celaka karena hal ini tidak kunjung diperbaiki.',
            'Kami sebagai warga sangat terganggu dengan kondisi ini. Mohon kepada dinas terkait untuk segera turun ke lapangan dan melakukan perbaikan demi kenyamanan bersama.',
            'Sudah beberapa kali kami laporkan ke RT/RW namun belum ada tindakan nyata. Semoga melalui aplikasi ini pemerintah bisa merespons keluhan kami dengan lebih cepat.',
            'Kondisinya semakin hari semakin memburuk. Kalau dibiarkan terus, kerusakannya akan menjalar dan membutuhkan biaya perbaikan yang jauh lebih besar. Mohon segera dicek.'
        ];

        // 2. Buat Laporan untuk setiap warga
        foreach ($wargaUsers as $warga) {
            // Tiap warga punya 1-3 laporan
            for ($i = 0; $i < rand(1, 3); $i++) {
                $status = $statuses[array_rand($statuses)];
                
                // Random offset for coordinates
                $lat = $baseLat + (rand(-50, 50) / 1000);
                $lng = $baseLng + (rand(-50, 50) / 1000);

                $report = Report::create([
                    'user_id' => $warga->id,
                    'category_id' => $categories->random()->id,
                    'title' => $titles[array_rand($titles)],
                    'description' => $descriptions[array_rand($descriptions)],
                    'image' => 'reports/dummy.jpg', // we will create this file
                    'status' => $status,
                    'latitude' => $lat,
                    'longitude' => $lng,
                    'created_at' => $faker->dateTimeBetween('-6 months', 'now'),
                ]);

                // 3. Buat komentar untuk laporan ini (jika bukan menunggu)
                if ($status !== 'menunggu') {
                    // Komentar dari admin
                    Comment::create([
                        'report_id' => $report->id,
                        'user_id' => $admin->id ?? $warga->id,
                        'body' => 'Laporan telah kami terima dan sedang ditindaklanjuti. Terima kasih.',
                        'created_at' => $report->created_at->modify('+1 day'),
                    ]);

                    if ($status === 'selesai') {
                        // Balasan dari warga
                        Comment::create([
                            'report_id' => $report->id,
                            'user_id' => $warga->id,
                            'body' => 'Terima kasih atas respons cepatnya! Sangat membantu.',
                            'created_at' => $report->created_at->modify('+2 days'),
                        ]);
                    }
                }
            }
        }
        
        $this->command->info('Dummy data Warga, Reports, dan Comments berhasil digenerate!');
    }
}
