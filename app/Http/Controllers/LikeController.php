<?php

namespace App\Http\Controllers;

use App\Models\Publication;
use App\Services\LikeService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    public function __construct(private LikeService $likeService) {}

    public function store(Request $request, Publication $publication): RedirectResponse
    {
        $this->authorize('view', $publication);

        $liked = $this->likeService->toggle(
            $request->user(),
            $publication,
            $request->attributes->get('idempotency_key'),
        );

        return back()->with('success', $liked ? 'Like agregado.' : 'Like removido.');
    }

    public function destroy(Request $request, Publication $publication): RedirectResponse
    {
        $this->authorize('view', $publication);

        $this->likeService->remove($request->user(), $publication);

        return back()->with('success', 'Like removido.');
    }
}
