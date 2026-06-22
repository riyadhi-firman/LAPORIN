<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Setting;
use Inertia\Inertia;

class CheckMaintenanceMode
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Allow access if it's an admin route, login route, or static assets
        if ($request->is('admin/*') || $request->is('admin') || $request->is('login') || $request->is('logout') || $request->is('build/*')) {
            return $next($request);
        }

        // Allow access if user is authenticated and has admin role
        if (auth()->check() && auth()->user()->role === 'admin') {
            return $next($request);
        }

        // Check if maintenance mode is enabled in the database
        $maintenanceMode = Setting::get('maintenance_mode', 'false') === 'true';

        if ($maintenanceMode) {
            // Render the Maintenance Inertia page
            return Inertia::render('Errors/Maintenance')->toResponse($request)->setStatusCode(503);
        }

        return $next($request);
    }
}
