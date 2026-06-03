<?php

namespace App\Models;

use App\Enums\TransactionAction;
use App\Enums\TransactionStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Transaction extends Model
{
    protected $fillable = [
        'idempotency_key',
        'user_id',
        'action',
        'status',
        'request_hash',
        'resource_type',
        'resource_id',
        'response',
        'error_message',
        'expires_at',
    ];

    protected function casts(): array
    {
        return [
            'action' => TransactionAction::class,
            'status' => TransactionStatus::class,
            'response' => 'array',
            'expires_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function resource(): MorphTo
    {
        return $this->morphTo(__FUNCTION__, 'resource_type', 'resource_id');
    }

    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }
}
