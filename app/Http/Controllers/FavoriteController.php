<?php

namespace App\Http\Controllers;

use App\Contracts\Repositories\PublicationRepositoryInterface;
use App\Models\Publication;
use App\Services\FavoriteService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FavoriteController extends Controller
{
    public function __construct(
        private FavoriteService $favoriteService,
        private PublicationRepositoryInterface $publicationRepository,
    ) {}

    public function index(Request $request): Response
    {
        return Inertia::render('Favorites/Index', [
            'publications' => $this->publicationRepository->favoritesForUser($request->user()),
        ]);
    }

    public function store(Request $request, Publication $publication): RedirectResponse
    {
        $this->authorize('view', $publication);

        $favorited = $this->favoriteService->toggle(
            $request->user(),
            $publication,
            $request->attributes->get('idempotency_key'),
        );

        return back()->with('success', $favorited ? 'Parcial agregado a favoritos.' : 'Parcial removido de favoritos.');
    }
}
