<?php

namespace App\Services;

use App\Contracts\Repositories\UserRepositoryInterface;
use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;

class UserRoleService
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository,
        private readonly AuditService $auditService,
    ) {}

    public function updateRole(User $actor, User $target, UserRole $role): User
    {
        if (! $actor->role->isSuperAdmin()) {
            throw new AuthorizationException('Only super admins can change user roles.');
        }

        $previousRole = $target->role;

        $user = $this->userRepository->updateRole($target, $role);

        $this->auditService->log(
            actor: $actor,
            action: 'user.role_updated',
            auditable: $user,
            properties: [
                'previous_role' => $previousRole->value,
                'new_role' => $role->value,
            ],
        );

        return $user;
    }
}
