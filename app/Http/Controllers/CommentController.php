<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCommentRequest;
use App\Models\Publication;
use App\Services\CommentService;
use Illuminate\Http\RedirectResponse;

class CommentController extends Controller
{
    public function __construct(private CommentService $commentService) {}

    public function store(StoreCommentRequest $request, Publication $publication): RedirectResponse
    {
        $this->authorize('view', $publication);

        $this->commentService->create(
            $request->user(),
            $publication,
            $request->validated(),
            $request->attributes->get('idempotency_key'),
        );

        return back()->with('success', 'Comentario publicado.');
    }
}
