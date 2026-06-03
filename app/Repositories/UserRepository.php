<?php

namespace App\Repositories;

use App\Contracts\Repositories\UserRepositoryInterface;
use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class UserRepository implements UserRepositoryInterface
{
    public function findById(int $id): ?User
    {
        return User::query()->find($id);
    }

    public function findByEmail(string $email): ?User
    {
        return User::query()->where('email', $email)->first();
    }

    public function create(array $data): User
    {
        return User::query()->create($data);
    }

    public function update(User $user, array $data): User
    {
        $user->update($data);

        return $user->fresh();
    }

    public function updateRole(User $user, UserRole $role): User
    {
        $user->update(['role' => $role]);

        return $user->fresh();
    }

    public function syncInterests(User $user, array $subjectIds, array $professorIds): User
    {
        $user->subjects()->sync($subjectIds);
        $user->professors()->sync($professorIds);

        return $user->load(['subjects', 'professors']);
    }

    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return User::query()
            ->with('career')
            ->latest()
            ->paginate($perPage);
    }

    public function countByRole(): Collection
    {
        return User::query()
            ->select('role', DB::raw('count(*) as total'))
            ->groupBy('role')
            ->get();
    }
}
