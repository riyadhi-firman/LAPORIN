<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\Category;
use App\Http\Requests\StoreReportRequest;
use App\Http\Requests\UpdateReportRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ReportController extends Controller
{
    public function index()
    {
        $reports = auth()->user()->reports()->with('category')->latest()->paginate(10);
        return Inertia::render('Warga/ReportList', ['reports' => $reports]);
    }

    public function create()
    {
        $categories = Category::all();
        return Inertia::render('Warga/CreateReport', ['categories' => $categories]);
    }

    public function store(StoreReportRequest $request)
    {
        $data = $request->validated();
        
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('reports', 'public');
        }

        auth()->user()->reports()->create($data);

        return redirect()->route('dashboard')->with('success', 'Laporan berhasil dibuat.');
    }

    public function show(Report $report)
    {
        $this->authorizeAccess($report);
        $report->load(['category', 'comments.user']);
        return Inertia::render('Warga/DetailReport', ['report' => $report]);
    }

    public function edit(Report $report)
    {
        $this->authorizeAccess($report);
        $categories = Category::all();
        return Inertia::render('Warga/EditReport', [
            'report' => $report,
            'categories' => $categories
        ]);
    }

    public function update(UpdateReportRequest $request, Report $report)
    {
        $this->authorizeAccess($report);
        
        $data = $request->validated();

        if ($request->hasFile('image')) {
            if ($report->image) {
                Storage::disk('public')->delete($report->image);
            }
            $data['image'] = $request->file('image')->store('reports', 'public');
        }

        $report->update($data);

        return redirect()->route('dashboard')->with('success', 'Laporan berhasil diupdate.');
    }

    public function destroy(Report $report)
    {
        $this->authorizeAccess($report);
        
        if ($report->image) {
            Storage::disk('public')->delete($report->image);
        }
        $report->delete();

        return redirect()->route('dashboard')->with('success', 'Laporan berhasil dihapus.');
    }

    private function authorizeAccess(Report $report)
    {
        if ($report->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }
    }
}
