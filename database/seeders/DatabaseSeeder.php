<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $categories = [
            'Infrastruktur',
            'Kebersihan Lingkungan',
            'Keamanan',
            'Fasilitas Umum',
            'Lainnya',
        ];

        foreach ($categories as $category) {
            \App\Models\Category::firstOrCreate([
                'slug' => \Illuminate\Support\Str::slug($category)
            ], [
                'name' => $category
            ]);
        }

        User::updateOrCreate(
            ['email' => 'admin@laporin.com'],
            [
                'name' => 'Admin LAPORIN',
                'password' => bcrypt('@Bismillah212@'),
                'role' => 'admin',
            ]
        );
    }
}
