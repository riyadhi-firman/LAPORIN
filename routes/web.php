<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\UserDashboardController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ExportController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\PublicController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\SettingController;

Route::get('/', [PublicController::class, 'index'])->name('welcome');
Route::get('/terms', [PublicController::class, 'terms'])->name('terms');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Notifications
    Route::post('/notifications/{id}/mark-as-read', [NotificationController::class, 'markAsRead'])->name('notifications.mark-as-read');
    Route::post('/notifications/mark-all-as-read', [NotificationController::class, 'markAllAsRead'])->name('notifications.mark-all-as-read');

    // Comments
    Route::post('/reports/{report}/comments', [CommentController::class, 'store'])->name('comments.store');

    // Shared dashboard redirect based on role
    Route::get('/dashboard', function () {
        if (auth()->user()->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }
        return app(UserDashboardController::class)->index();
    })->name('dashboard');

    // Warga routes
    Route::middleware('role:warga')->group(function () {
        Route::post('/reports/{report}/comments', [CommentController::class, 'store'])->name('comments.store');
        Route::resource('reports', ReportController::class);
    });

    // Admin Routes
    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
        
        Route::get('/reports', [AdminDashboardController::class, 'reports'])->name('reports.index');
        Route::get('/reports/export', [ExportController::class, 'exportCsv'])->name('reports.export');
        Route::get('/reports/{report}', [AdminDashboardController::class, 'show'])->name('reports.show');
        Route::put('/reports/{report}/status', [AdminDashboardController::class, 'updateStatus'])->name('reports.update-status');
        Route::delete('/reports/{report}', [AdminDashboardController::class, 'destroy'])->name('reports.destroy');

        Route::get('/users', [AdminDashboardController::class, 'users'])->name('users.index');
        Route::post('/users', [AdminDashboardController::class, 'storeUser'])->name('users.store');
        Route::put('/users/{user}/role', [AdminDashboardController::class, 'updateUserRole'])->name('users.update-role');
        Route::delete('/users/{user}', [AdminDashboardController::class, 'destroyUser'])->name('users.destroy');

        Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
        Route::post('/settings', [SettingController::class, 'update'])->name('settings.update');
    });
});

require __DIR__.'/auth.php';
