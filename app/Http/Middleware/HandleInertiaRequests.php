<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * @var string
     */
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? $this->formatUser($request->user()) : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'warning' => fn () => $request->session()->get('warning'),
                'info' => fn () => $request->session()->get('info'),
            ],
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function formatUser(object $user): array
    {
        $user->loadMissing(['career']);

        $role = $user->role instanceof UserRole
            ? $user->role
            : UserRole::tryFrom((int) $user->role);

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'email_verified_at' => $user->email_verified_at?->toIso8601String(),
            'role' => $role?->value,
            'avatar' => $user->avatar ?? null,
            'career' => $user->career
                ? [
                    'id' => $user->career->id,
                    'name' => $user->career->name,
                ]
                : null,
        ];
    }
}
