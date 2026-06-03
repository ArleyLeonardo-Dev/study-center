<?php

namespace App\Policies;

use App\Enums\PublicationStatus;
use App\Enums\UserRole;
use App\Models\Publication;
use App\Models\User;

class PublicationPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Publication $publication): bool
    {
        if ($this->canModerate($user)) {
            return true;
        }

        if ($publication->user_id === $user->id) {
            return true;
        }

        $status = $this->resolveStatus($publication);

        return $status === PublicationStatus::Approved
            && ($publication->is_visible ?? true);
    }

    public function create(User $user): bool
    {
        return $this->resolveRole($user) === UserRole::Student
            && $user->hasVerifiedEmail();
    }

    public function approve(User $user, Publication $publication): bool
    {
        return $this->canModerate($user);
    }

    public function reject(User $user, Publication $publication): bool
    {
        return $this->canModerate($user);
    }

    public function toggleVisibility(User $user, Publication $publication): bool
    {
        return $this->canModerate($user);
    }

    public function report(User $user, Publication $publication): bool
    {
        return $this->resolveRole($user)?->canReportPublications() ?? false;
    }

    private function canModerate(User $user): bool
    {
        $role = $this->resolveRole($user);

        return $role !== null && in_array($role, [UserRole::Admin, UserRole::SuperAdmin], true);
    }

    private function resolveRole(User $user): ?UserRole
    {
        return $user->role instanceof UserRole
            ? $user->role
            : UserRole::tryFrom((int) $user->role);
    }

    private function resolveStatus(Publication $publication): ?PublicationStatus
    {
        if ($publication->status instanceof PublicationStatus) {
            return $publication->status;
        }

        return PublicationStatus::tryFrom((int) $publication->status);
    }
}
