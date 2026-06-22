<?php

namespace App\Notifications;

use App\Models\Report;
use App\Models\Comment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewCommentAdded extends Notification
{
    use Queueable;

    public $report;
    public $comment;

    public function __construct(Report $report, Comment $comment)
    {
        $this->report = $report;
        $this->comment = $comment;
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        $senderName = $this->comment->user->name;
        $isAdmin = $this->comment->user->role === 'admin';
        
        return [
            'report_id' => $this->report->id,
            'title' => $isAdmin ? 'Tanggapan Resmi Admin' : 'Komentar Baru',
            'message' => $senderName . ' memberikan komentar pada laporan "' . \Str::limit($this->report->title, 30) . '"',
            // if notifiable is admin, go to admin route, else go to user route
            'url' => $notifiable->role === 'admin' 
                ? route('admin.reports.show', $this->report->id)
                : route('reports.show', $this->report->id)
        ];
    }
}
