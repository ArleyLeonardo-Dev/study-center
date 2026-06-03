<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateUserRoleRequest;
use App\Models\User;
use App\Services\UserRoleService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class UserManagementController extends Controller
{
    public function __construct(
        private UserRoleService $userRoleService,
    ) {}

    public function index(): Response
    {
        $this->authorize('viewAny', User::class);

        return Inertia::render('SuperAdmin/Users/Index', [
            'users' => User::query()->latest()->paginate(20),
            'roles' => collect(UserRole::cases())->map(fn (UserRole $role) => [
                'value' => $role->value,
                'label' => $role->label(),
            ]),
        ]);
    }

    public function updateRole(UpdateUserRoleRequest $request, User $user): RedirectResponse
    {
        $role = UserRole::from($request->validated('role'));

        $this->userRoleService->updateRole($request->user(), $user, $role);

        return back()->with('success', 'Rol actualizado correctamente.');
    }
}
