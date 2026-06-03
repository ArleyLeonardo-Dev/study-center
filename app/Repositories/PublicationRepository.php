<?php

namespace App\Repositories;

use App\Contracts\Repositories\PublicationRepositoryInterface;
use App\Enums\PublicationStatus;
use App\Enums\ReportStatus;
use App\Models\Favorite;
use App\Models\Publication;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class PublicationRepository implements PublicationRepositoryInterface
{
    public function findById(int $id): ?Publication
    {
        return Publication::query()->find($id);
    }

    public function create(array $data): Publication
    {
        return Publication::query()->create($data);
    }

    public function update(Publication $publication, array $data): Publication
    {
        $publication->update($data);

        return $publication->fresh();
    }

    public function search(array $filters, ?User $user = null, int $perPage = 15): LengthAwarePaginator
    {
        $query = Publication::query()
            ->with(['user', 'subject', 'professor', 'career'])
            ->withEngagementFor($user)
            ->approved()
            ->visible()
            ->latest();

        if (! empty($filters['q'])) {
            $keyword = $filters['q'];
            $query->where(function ($builder) use ($keyword): void {
                $builder->where('title', 'like', "%{$keyword}%")
                    ->orWhere('description', 'like', "%{$keyword}%");
            });
        }

        if (! empty($filters['career_id'])) {
            $query->where('career_id', $filters['career_id']);
        }

        if (! empty($filters['subject_id'])) {
            $query->where('subject_id', $filters['subject_id']);
        }

        if (! empty($filters['semester'])) {
            $query->where('semester', $filters['semester']);
        }

        if (! empty($filters['professor_id'])) {
            $query->where('professor_id', $filters['professor_id']);
        }

        return $query->paginate($perPage);
    }

    public function feedForUser(User $user, int $perPage = 15): LengthAwarePaginator
    {
        $user->loadMissing(['subjects', 'professors']);

        $subjectIds = $user->subjects->pluck('id');
        $professorIds = $user->professors->pluck('id');

        $query = Publication::query()
            ->with(['user', 'subject', 'professor', 'career'])
            ->withEngagementFor($user)
            ->approved()
            ->visible()
            ->latest();

        if ($subjectIds->isNotEmpty() || $professorIds->isNotEmpty()) {
            $query->where(function ($builder) use ($subjectIds, $professorIds): void {
                if ($subjectIds->isNotEmpty()) {
                    $builder->whereIn('subject_id', $subjectIds);
                }

                if ($professorIds->isNotEmpty()) {
                    $builder->orWhereIn('professor_id', $professorIds);
                }
            });
        }

        return $query->paginate($perPage);
    }

    public function pending(int $perPage = 15): LengthAwarePaginator
    {
        return Publication::query()
            ->with(['user', 'subject', 'professor', 'career'])
            ->where('status', PublicationStatus::Pending)
            ->latest()
            ->paginate($perPage);
    }

    public function all(int $perPage = 15): LengthAwarePaginator
    {
        return Publication::query()
            ->with(['user', 'subject', 'professor', 'career'])
            ->withEngagementFor()
            ->latest()
            ->paginate($perPage);
    }

    public function reported(int $perPage = 15): LengthAwarePaginator
    {
        return Publication::query()
            ->with(['user', 'subject', 'professor', 'career', 'reports'])
            ->whereHas('reports', fn ($query) => $query->where('status', ReportStatus::Pending))
            ->latest()
            ->paginate($perPage);
    }

    public function forUser(User $user, int $perPage = 15): LengthAwarePaginator
    {
        return Publication::query()
            ->with(['subject', 'professor', 'career'])
            ->where('user_id', $user->id)
            ->latest()
            ->paginate($perPage);
    }

    public function approvedForUser(User $user, int $perPage = 15): LengthAwarePaginator
    {
        return Publication::query()
            ->with(['subject', 'professor', 'career'])
            ->where('user_id', $user->id)
            ->approved()
            ->visible()
            ->latest()
            ->paginate($perPage);
    }

    public function favoritesForUser(User $user, int $perPage = 15): LengthAwarePaginator
    {
        return Publication::query()
            ->with(['user', 'subject', 'professor', 'career'])
            ->withEngagementFor($user)
            ->whereHas('favorites', fn ($query) => $query->where('user_id', $user->id))
            ->approved()
            ->visible()
            ->orderByDesc(
                Favorite::query()
                    ->select('created_at')
                    ->whereColumn('favorites.publication_id', 'publications.id')
                    ->where('user_id', $user->id)
                    ->limit(1),
            )
            ->paginate($perPage);
    }

    public function updateStatus(Publication $publication, PublicationStatus $status, ?int $reviewedBy = null, ?string $rejectionReason = null): Publication
    {
        $publication->update([
            'status' => $status,
            'reviewed_by' => $reviewedBy,
            'reviewed_at' => now(),
            'rejection_reason' => $rejectionReason,
        ]);

        return $publication->fresh();
    }

    public function toggleVisibility(Publication $publication, bool $isVisible): Publication
    {
        $publication->update(['is_visible' => $isVisible]);

        return $publication->fresh();
    }

    public function getStatsByStatus(): Collection
    {
        return Publication::query()
            ->select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->get();
    }
}
