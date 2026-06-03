<?php

namespace App\Contracts\Repositories;

use App\Enums\PublicationStatus;
use App\Models\Publication;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface PublicationRepositoryInterface
{
    public function findById(int $id): ?Publication;

    public function create(array $data): Publication;

    public function update(Publication $publication, array $data): Publication;

    /**
     * @param  array<string, mixed>  $filters
     */
    public function search(array $filters, ?User $user = null, int $perPage = 15): LengthAwarePaginator;

    public function feedForUser(User $user, int $perPage = 15): LengthAwarePaginator;

    public function pending(int $perPage = 15): LengthAwarePaginator;

    public function all(int $perPage = 15): LengthAwarePaginator;

    public function reported(int $perPage = 15): LengthAwarePaginator;

    public function forUser(User $user, int $perPage = 15): LengthAwarePaginator;

    public function approvedForUser(User $user, int $perPage = 15): LengthAwarePaginator;

    public function favoritesForUser(User $user, int $perPage = 15): LengthAwarePaginator;

    public function updateStatus(Publication $publication, PublicationStatus $status, ?int $reviewedBy = null, ?string $rejectionReason = null): Publication;

    public function toggleVisibility(Publication $publication, bool $isVisible): Publication;

    public function getStatsByStatus(): Collection;
}
