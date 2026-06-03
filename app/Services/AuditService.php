<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\Publication;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

class AuditService
{
    /**
     * @param  array<string, mixed>|null  $properties
     */
    public function log(
        ?User $actor,
        string $action,
        ?Model $auditable = null,
        ?array $properties = null,
    ): AuditLog {
        return AuditLog::query()->create([
            'actor_id' => $actor?->id,
            'action' => $action,
            'auditable_type' => $auditable !== null ? $auditable::class : null,
            'auditable_id' => $auditable?->getKey(),
            'properties' => $properties,
            'ip_address' => request()?->ip(),
            'user_agent' => request()?->userAgent(),
            'created_at' => now(),
        ]);
    }

    public function paginate(int $perPage = 20): LengthAwarePaginator
    {
        return AuditLog::query()
            ->with('actor:id,name')
            ->latest('created_at')
            ->paginate($perPage);
    }

    /**
     * @return Collection<int, array{
     *     id: int,
     *     publication_title: string,
     *     action: string,
     *     action_label: string,
     *     created_at: string|null
     * }>
     */
    public function recentPublicationActivity(int $limit = 15): Collection
    {
        return AuditLog::query()
            ->where('auditable_type', Publication::class)
            ->whereIn('action', [
                'publication.created',
                'publication.approved',
                'publication.rejected',
                'publication.visible',
                'publication.hidden',
            ])
            ->with([
                'auditable' => fn ($query) => $query->withTrashed()->select('id', 'title'),
            ])
            ->latest('created_at')
            ->limit($limit)
            ->get()
            ->map(fn (AuditLog $log): array => [
                'id' => $log->id,
                'publication_title' => $log->auditable?->title ?? 'Parcial no disponible',
                'action' => $log->action,
                'action_label' => $this->publicationActionLabel($log->action),
                'created_at' => $log->created_at?->toIso8601String(),
            ]);
    }

    public function publicationActionLabel(string $action): string
    {
        return match ($action) {
            'publication.created' => 'Publicado',
            'publication.approved' => 'Aprobado',
            'publication.rejected' => 'Rechazada',
            'publication.visible' => 'Visible',
            'publication.hidden' => 'Oculta',
            default => $action,
        };
    }
}
