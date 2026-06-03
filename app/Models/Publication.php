<?php

namespace App\Models;

use App\Enums\PublicationStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Publication extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'subject_id',
        'professor_id',
        'career_id',
        'semester',
        'title',
        'description',
        'file_url',
        'storage_disk',
        'storage_key',
        'file_original_name',
        'file_type',
        'file_size',
        'status',
        'is_visible',
        'reviewed_by',
        'reviewed_at',
        'rejection_reason',
        'transaction_id',
    ];

    protected function casts(): array
    {
        return [
            'semester' => 'integer',
            'file_size' => 'integer',
            'status' => PublicationStatus::class,
            'is_visible' => 'boolean',
            'reviewed_at' => 'datetime',
            'is_liked' => 'boolean',
            'is_favorited' => 'boolean',
            'likes_count' => 'integer',
            'comments_count' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    public function professor(): BelongsTo
    {
        return $this->belongsTo(Professor::class);
    }

    public function career(): BelongsTo
    {
        return $this->belongsTo(Career::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }

    public function likes(): HasMany
    {
        return $this->hasMany(Like::class);
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function reports(): HasMany
    {
        return $this->hasMany(PublicationReport::class);
    }

    public function scopeApproved($query)
    {
        return $query->where('status', PublicationStatus::Approved);
    }

    public function scopeVisible($query)
    {
        return $query->where('is_visible', true);
    }

    /**
     * @param  Builder<Publication>  $query
     * @return Builder<Publication>
     */
    public function scopeWithEngagementFor(Builder $query, ?User $user = null): Builder
    {
        $query->withCount(['likes', 'comments']);

        if ($user !== null) {
            $query->withExists([
                'likes as is_liked' => fn (Builder $likeQuery) => $likeQuery->where('user_id', $user->id),
                'favorites as is_favorited' => fn (Builder $favoriteQuery) => $favoriteQuery->where('user_id', $user->id),
            ]);
        }

        return $query;
    }

    public function loadEngagementFor(?User $user): self
    {
        $this->loadCount(['likes', 'comments']);

        if ($user !== null) {
            $this->setAttribute(
                'is_liked',
                $this->likes()->where('user_id', $user->id)->exists(),
            );
            $this->setAttribute(
                'is_favorited',
                $this->favorites()->where('user_id', $user->id)->exists(),
            );
        }

        return $this;
    }
}
