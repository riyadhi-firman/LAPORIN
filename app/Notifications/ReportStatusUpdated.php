<?php

namespace App\Notifications;

use App\Models\Report;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReportStatusUpdated extends Notification
{
    use Queueable;

    public $report;

    public function __construct(Report $report)
    {
        $this->report = $report;
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'report_id' => $this->report->id,
            'title' => 'Status Laporan Diperbarui',
            'message' => 'Laporan Anda "' . \Str::limit($this->report->title, 30) . '" kini berstatus: ' . strtoupper($this->report->status),
            'url' => route('reports.show', $this->report->id)
        ];
    }
}
