<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\Comment;
use App\Models\User;
use App\Notifications\NewCommentAdded;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request, Report $report)
    {
        $validated = $request->validate([
            'body' => 'required|string|max:1000',
        ]);

        $comment = $report->comments()->create([
            'user_id' => auth()->id(),
            'body' => $validated['body'],
        ]);

        $comment->load('user');

        // Jika admin yang komen, notif ke pembuat laporan
        if (auth()->user()->role === 'admin') {
            if ($report->user && $report->user_id !== auth()->id()) {
                $report->user->notify(new NewCommentAdded($report, $comment));
            }
        } 
        // Jika warga yang komen, notif ke admin
        else {
            $admins = User::where('role', 'admin')->get();
            foreach ($admins as $admin) {
                $admin->notify(new NewCommentAdded($report, $comment));
            }
        }

        return back()->with('success', 'Komentar berhasil ditambahkan.');
    }
}
