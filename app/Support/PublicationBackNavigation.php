<?php

namespace App\Support;

use App\Enums\UserRole;
use App\Models\User;

class PublicationBackNavigation
{
    /**
     * @return array<string, array{href: string, label: string, activeNav: string}>
     */
    public static function destinations(): array
    {
        return [
            'home' => [
                'href' => route('home'),
                'label' => 'Inicio',
                'activeNav' => 'feed',
            ],
            'search' => [
                'href' => route('search.index'),
                'label' => 'Explorar',
                'activeNav' => 'search',
            ],
            'favorites' => [
                'href' => route('favorites.index'),
                'label' => 'Favoritos',
                'activeNav' => 'favorites',
            ],
            'pending' => [
                'href' => route('admin.publications.pending'),
                'label' => 'Pendientes',
                'activeNav' => 'publications',
            ],
            'reports' => [
                'href' => route('admin.reports.index'),
                'label' => 'Reportadas',
                'activeNav' => 'publications',
            ],
            'dashboard' => [
                'href' => route('admin.dashboard'),
                'label' => 'Publicaciones',
                'activeNav' => 'publications',
            ],
        ];
    }

    /**
     * @return array{href: string, label: string, activeNav: string, from: string}
     */
    public static function resolve(?string $from, User $user): array
    {
        $destinations = self::destinations();

        if (is_string($from) && isset($destinations[$from])) {
            return [
                ...$destinations[$from],
                'from' => $from,
            ];
        }

        $defaultFrom = $user->hasRole(UserRole::Admin, UserRole::SuperAdmin)
            ? 'dashboard'
            : 'home';

        return [
            ...$destinations[$defaultFrom],
            'from' => $defaultFrom,
        ];
    }

    public static function redirectUrl(?string $from, User $user): string
    {
        return self::resolve($from, $user)['href'];
    }
}
