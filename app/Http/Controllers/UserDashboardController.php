<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserDashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        $totalReports = $user->reports()->count();
        $statusStats = [
            'menunggu' => $user->reports()->where('status', 'menunggu')->count(),
            'diproses' => $user->reports()->where('status', 'diproses')->count(),
            'selesai' => $user->reports()->where('status', 'selesai')->count(),
        ];

        $recentReports = $user->reports()->latest()->take(5)->get();

        return Inertia::render('Warga/Dashboard', [
            'totalReports' => $totalReports,
            'statusStats' => $statusStats,
            'recentReports' => $recentReports
        ]);
    }
}
