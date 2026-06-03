<?php

namespace App\Services;

use App\Contracts\Repositories\PublicationRepositoryInterface;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class FeedService
{
    public function __construct(
        private readonly PublicationRepositoryInterface $publicationRepository,
    ) {}

    public function forUser(User $user, int $perPage = 15): LengthAwarePaginator
    {
        return $this->publicationRepository->feedForUser($user, $perPage);
    }
}
