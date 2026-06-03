<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Subject extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'code',
        'semester',
        'is_active',
        'career_id',
    ];

    protected function casts(): array
    {
        return [
            'semester' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function career(): BelongsTo
    {
        return $this->belongsTo(Career::class);
    }

    public function publications(): HasMany
    {
        return $this->hasMany(Publication::class);
    }

    public function interestedUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_subject')->withTimestamps();
    }
}
