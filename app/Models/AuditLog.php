<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class AuditLog extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'actor_id',
        'action',
        'auditable_type',
        'auditable_id',
        'properties',
        'ip_address',
        'user_agent',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'properties' => 'array',
            'created_at' => 'datetime',
        ];
    }

    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_id');
    }

    public function auditable(): MorphTo
    {
        return $this->morphTo(__FUNCTION__, 'auditable_type', 'auditable_id');
    }
}
