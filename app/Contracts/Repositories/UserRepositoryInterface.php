<?php

namespace App\Contracts\Repositories;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface UserRepositoryInterface
{
    public function findById(int $id): ?User;

    public function findByEmail(string $email): ?User;

    public function create(array $data): User;

    public function update(User $user, array $data): User;

    public function updateRole(User $user, UserRole $role): User;

    public function syncInterests(User $user, array $subjectIds, array $professorIds): User;

    public function paginate(int $perPage = 15): LengthAwarePaginator;

    public function countByRole(): Collection;
}
