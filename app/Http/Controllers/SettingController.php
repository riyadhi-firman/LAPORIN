<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Settings', [
            'appSettings' => [
                'app_name' => Setting::get('app_name', 'LaporIn'),
                'app_logo' => Setting::get('app_logo', null),
                'hero_title' => Setting::get('hero_title', 'Suara Anda Membangun Kota'),
                'hero_description' => Setting::get('hero_description', 'Hadir untuk menjembatani komunikasi antara warga dan pemerintah. Laporkan masalah infrastruktur, keamanan, hingga kebersihan dengan mudah.'),
                'contact_email' => Setting::get('contact_email', 'bantuan@laporin.com'),
                'contact_phone' => Setting::get('contact_phone', ''),
                'social_instagram' => Setting::get('social_instagram', ''),
                'social_facebook' => Setting::get('social_facebook', ''),
                'terms_text' => Setting::get('terms_text', 'Layanan ini disediakan sebagaimana adanya...'),
                'maintenance_mode' => Setting::get('maintenance_mode', 'false') === 'true',
            ]
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'app_name' => 'required|string|max:255',
            'app_logo' => 'nullable|image|max:2048', // 2MB max
            'hero_title' => 'nullable|string|max:255',
            'hero_description' => 'nullable|string|max:500',
            'contact_email' => 'nullable|email|max:255',
            'contact_phone' => 'nullable|string|max:50',
            'social_instagram' => 'nullable|url|max:255',
            'social_facebook' => 'nullable|url|max:255',
            'terms_text' => 'nullable|string',
            'maintenance_mode' => 'boolean',
        ]);

        $keys = [
            'app_name', 'hero_title', 'hero_description',
            'contact_email', 'contact_phone', 'social_instagram',
            'social_facebook', 'terms_text'
        ];

        foreach ($keys as $key) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $validated[$key] ?? '']
            );
        }

        Setting::updateOrCreate(
            ['key' => 'maintenance_mode'],
            ['value' => $request->boolean('maintenance_mode') ? 'true' : 'false']
        );

        if ($request->hasFile('app_logo')) {
            // Delete old logo if exists
            $oldLogo = Setting::get('app_logo');
            if ($oldLogo) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $oldLogo));
            }

            $path = $request->file('app_logo')->store('logos', 'public');
            
            Setting::updateOrCreate(
                ['key' => 'app_logo'],
                ['value' => '/storage/' . $path]
            );
        }

        return back()->with('success', 'Pengaturan aplikasi berhasil disimpan.');
    }
}
