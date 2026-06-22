<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\User;
use App\Models\Category;
use App\Notifications\ReportStatusUpdated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $totalReports = Report::count();
        $totalUsers = User::where('role', 'warga')->count();
        $totalAdmins = User::where('role', 'admin')->count();
        
        $statusStats = [
            'menunggu' => Report::where('status', 'menunggu')->count(),
            'diproses' => Report::where('status', 'diproses')->count(),
            'selesai' => Report::where('status', 'selesai')->count(),
        ];

        // 1. Distribusi Kategori (Pie Chart)
        $categories = Category::withCount('reports')->get();
        $categoryStats = $categories->map(function($cat) {
            return [
                'name' => $cat->name,
                'value' => $cat->reports_count
            ];
        });

        // 2. Tren Laporan (6 Bulan Terakhir)
        // Group by month
        $months = collect();
        for ($i = 5; $i >= 0; $i--) {
            $monthStart = now()->subMonths($i)->startOfMonth();
            $monthEnd = now()->subMonths($i)->endOfMonth();
            
            $count = Report::whereBetween('created_at', [$monthStart, $monthEnd])->count();
            
            $months->push([
                'name' => $monthStart->translatedFormat('M y'), // e.g. "Jan 26"
                'total' => $count
            ]);
        }
        $trendStats = $months->toArray();

        // 3. Laporan Terbaru (Aktivitas Terakhir)
        $recentReports = Report::with(['user', 'category'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function($report) {
                return [
                    'id' => $report->id,
                    'title' => $report->title,
                    'status' => $report->status,
                    'date' => $report->created_at->diffForHumans(),
                    'user_name' => $report->user ? $report->user->name : 'Unknown',
                    'category_name' => $report->category ? $report->category->name : 'Lainnya'
                ];
            });

        return Inertia::render('Admin/Dashboard', [
            'totalReports' => $totalReports,
            'totalUsers' => $totalUsers,
            'totalAdmins' => $totalAdmins,
            'statusStats' => $statusStats,
            'categoryStats' => $categoryStats,
            'trendStats' => $trendStats,
            'recentReports' => $recentReports
        ]);
    }

    public function reports(Request $request)
    {
        $query = Report::with(['user', 'category'])->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhereHas('user', function($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%");
                  });
            });
        }

        return Inertia::render('Admin/ReportList', [
            'reports' => $query->paginate(10)->withQueryString(),
            'filters' => $request->only(['status', 'search'])
        ]);
    }

    public function show(Report $report)
    {
        $report->load(['user', 'category', 'comments.user']);
        return Inertia::render('Admin/DetailReport', ['report' => $report]);
    }

    public function updateStatus(Request $request, Report $report)
    {
        $validated = $request->validate([
            'status' => 'required|in:menunggu,diproses,selesai'
        ]);

        $report->update(['status' => $validated['status']]);

        // Kirim notifikasi ke pelapor
        if ($report->user) {
            $report->user->notify(new ReportStatusUpdated($report));
        }

        return back()->with('success', 'Status laporan berhasil diubah.');
    }

    public function destroy(Report $report)
    {
        if ($report->image) {
            Storage::disk('public')->delete($report->image);
        }
        $report->delete();

        return redirect()->route('admin.reports.index')->with('success', 'Laporan berhasil dihapus.');
    }

    public function users(Request $request)
    {
        $query = User::latest();

        if ($request->filled('role') && $request->role !== 'all') {
            $query->where('role', $request->role);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        return Inertia::render('Admin/UserManagement', [
            'users' => $query->paginate(10)->withQueryString(),
            'filters' => $request->only(['role', 'search']),
        ]);
    }

    public function storeUser(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|in:admin,warga',
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        return back()->with('success', 'Pengguna berhasil ditambahkan.');
    }

    public function updateUserRole(Request $request, User $user)
    {
        // Prevent admin from changing their own role
        if ($user->id === auth()->id()) {
            return back()->with('error', 'Anda tidak dapat mengubah role Anda sendiri.');
        }

        $validated = $request->validate([
            'role' => 'required|in:admin,warga',
        ]);

        $user->update(['role' => $validated['role']]);

        return back()->with('success', 'Role pengguna berhasil diubah.');
    }

    public function destroyUser(User $user)
    {
        // Prevent admin from deleting themselves
        if ($user->id === auth()->id()) {
            return back()->with('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
        }

        // Delete associated reports and their images
        foreach ($user->reports as $report) {
            if ($report->image) {
                Storage::disk('public')->delete($report->image);
            }
        }
        $user->reports()->delete();
        $user->delete();

        return back()->with('success', 'Pengguna berhasil dihapus.');
    }
}

