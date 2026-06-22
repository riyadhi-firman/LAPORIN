<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'notifications' => $request->user() ? $request->user()->unreadNotifications()->take(5)->get() : [],
                'unread_count' => $request->user() ? $request->user()->unreadNotifications()->count() : 0,
            ],
            'app_settings' => [
                'app_name' => \App\Models\Setting::get('app_name', 'LaporIn'),
                'app_logo' => \App\Models\Setting::get('app_logo', null),
                'hero_title' => \App\Models\Setting::get('hero_title', 'Suara Anda Membangun Kota'),
                'hero_description' => \App\Models\Setting::get('hero_description', 'Hadir untuk menjembatani komunikasi antara warga dan pemerintah. Laporkan masalah infrastruktur, keamanan, hingga kebersihan dengan mudah.'),
                'contact_email' => \App\Models\Setting::get('contact_email', 'bantuan@laporin.com'),
                'contact_phone' => \App\Models\Setting::get('contact_phone', ''),
                'social_instagram' => \App\Models\Setting::get('social_instagram', ''),
                'social_facebook' => \App\Models\Setting::get('social_facebook', ''),
                'terms_text' => \App\Models\Setting::get('terms_text', 'Layanan ini disediakan sebagaimana adanya...'),
                'maintenance_mode' => \App\Models\Setting::get('maintenance_mode', 'false') === 'true',
            ],
        ];
    }
}
