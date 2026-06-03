<?php

namespace App\Services;

use App\Contracts\Repositories\PublicationRepositoryInterface;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class SearchService
{
    public function __construct(
        private readonly PublicationRepositoryInterface $publicationRepository,
    ) {}

    /**
     * @param  array<string, mixed>  $filters
     */
    public function search(array $filters, ?User $user = null, int $perPage = 15): LengthAwarePaginator
    {
        return $this->publicationRepository->search($filters, $user, $perPage);
    }
}
