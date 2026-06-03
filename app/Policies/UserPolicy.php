<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return $this->isSuperAdmin($user);
    }

    public function view(User $actor, User $user): bool
    {
        return $actor->id === $user->id || $this->isSuperAdmin($actor);
    }

    public function updateRole(User $actor, User $user): bool
    {
        return $this->isSuperAdmin($actor) && $actor->id !== $user->id;
    }

    private function isSuperAdmin(User $user): bool
    {
        $role = $user->role instanceof UserRole
            ? $user->role
            : UserRole::tryFrom((int) $user->role);

        return $role?->isSuperAdmin() ?? false;
    }
}
