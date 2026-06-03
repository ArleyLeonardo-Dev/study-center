<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if ($user === null) {
            abort(Response::HTTP_UNAUTHORIZED, 'Unauthenticated.');
        }

        if (! $user->is_active) {
            abort(Response::HTTP_FORBIDDEN, 'Your account is inactive.');
        }

        $allowedRoles = array_map(
            fn (string $role): UserRole => $this->parseRole($role),
            $roles,
        );

        if (! $user->hasRole(...$allowedRoles)) {
            abort(Response::HTTP_FORBIDDEN, 'You do not have permission to access this resource.');
        }

        return $next($request);
    }

    private function parseRole(string $role): UserRole
    {
        if (is_numeric($role)) {
            return UserRole::from((int) $role);
        }

        return match (strtolower($role)) {
            'student' => UserRole::Student,
            'master' => UserRole::Master,
            'admin' => UserRole::Admin,
            'super_admin', 'superadmin' => UserRole::SuperAdmin,
            default => abort(Response::HTTP_FORBIDDEN, 'Invalid role specified.'),
        };
    }
}
