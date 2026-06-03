<?php

namespace App\Models;

use App\Enums\ReportStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PublicationReport extends Model
{
    protected $fillable = [
        'publication_id',
        'reporter_id',
        'reason',
        'status',
        'reviewed_by',
        'reviewed_at',
        'admin_notes',
        'transaction_id',
    ];

    protected function casts(): array
    {
        return [
            'status' => ReportStatus::class,
            'reviewed_at' => 'datetime',
        ];
    }

    public function publication(): BelongsTo
    {
        return $this->belongsTo(Publication::class);
    }

    public function reporter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }
}
