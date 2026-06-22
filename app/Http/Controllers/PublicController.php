<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

class PublicController extends Controller
{
    public function index()
    {
        $stats = [
            'total_reports' => Report::count(),
            'total_resolved' => Report::where('status', 'selesai')->count(),
            'total_processing' => Report::where('status', 'diproses')->count(),
        ];

        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'stats' => $stats
        ]);
    }

    public function terms()
    {
        return Inertia::render('Terms');
    }
}
