<?php

namespace App\Http\Controllers;

use App\Enums\PublicationStatus;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class UserProfileController extends Controller
{
    public function show(User $user): Response
    {
        $this->authorize('view', $user);

        $publications = method_exists($user, 'publications')
            ? $user->publications()
                ->where('status', PublicationStatus::Approved->value)
                ->where(function ($query) {
                    $query->where('is_visible', true)->orWhereNull('is_visible');
                })
                ->latest()
                ->paginate(12)
            : collect();

        return Inertia::render('Users/Show', [
            'profile' => $user->only(['id', 'name', 'avatar', 'career_id', 'current_semester']),
            'publications' => $publications,
        ]);
    }
}
