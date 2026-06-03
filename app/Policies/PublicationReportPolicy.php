<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\PublicationReport;
use App\Models\User;

class PublicationReportPolicy
{
    public function viewAny(User $user): bool
    {
        return $this->canModerate($user);
    }

    public function resolve(User $user, PublicationReport $report): bool
    {
        return $this->canModerate($user);
    }

    private function canModerate(User $user): bool
    {
        $role = $user->role instanceof UserRole
            ? $user->role
            : UserRole::tryFrom((int) $user->role);

        return $role !== null && in_array($role, [UserRole::Admin, UserRole::SuperAdmin], true);
    }
}
