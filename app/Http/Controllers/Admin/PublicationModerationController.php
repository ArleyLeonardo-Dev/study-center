<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\RejectPublicationRequest;
use App\Models\Publication;
use App\Services\AuditService;
use App\Services\PublicationService;
use App\Support\PublicationBackNavigation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicationModerationController extends Controller
{
    public function __construct(
        private PublicationService $publicationService,
        private AuditService $auditService,
    ) {}

    public function pending(): Response
    {
        $this->authorize('viewAny', Publication::class);

        return Inertia::render('Admin/Publications/Pending', [
            'publications' => $this->publicationService->pending(),
        ]);
    }

    public function show(Request $request, Publication $publication): Response
    {
        $this->authorize('approve', $publication);

        $user = $request->user();

        $publication->loadMissing(['user', 'subject', 'professor', 'career']);

        return Inertia::render('Admin/Publications/Review', [
            'publication' => $publication,
            'can' => [
                'approve' => $user->can('approve', $publication),
                'reject' => $user->can('reject', $publication),
                'toggleVisibility' => $user->can('toggleVisibility', $publication),
                'report' => false,
            ],
        ]);
    }

    public function approve(Request $request, Publication $publication): RedirectResponse
    {
        $this->authorize('approve', $publication);

        $this->publicationService->approve($publication, $request->user());
        $this->auditService->log($request->user(), 'publication.approved', $publication);

        return redirect()
            ->route('admin.publications.pending')
            ->with('success', 'Publicación aprobada.');
    }

    public function reject(RejectPublicationRequest $request, Publication $publication): RedirectResponse
    {
        $this->publicationService->reject(
            $publication,
            $request->user(),
            $request->validated('rejection_reason'),
        );
        $this->auditService->log($request->user(), 'publication.rejected', $publication, [
            'reason' => $request->validated('rejection_reason'),
        ]);

        return redirect()
            ->route('admin.publications.pending')
            ->with('success', 'Publicación rechazada.');
    }

    public function visibility(Request $request, Publication $publication): RedirectResponse
    {
        $this->authorize('toggleVisibility', $publication);

        $validated = $request->validate([
            'is_visible' => ['required', 'boolean'],
            'from' => ['nullable', 'string', 'in:home,search,favorites,pending,reports,dashboard'],
        ]);

        $this->publicationService->toggleVisibility($publication, $request->user(), $validated['is_visible']);
        $this->auditService->log($request->user(), 'publication.visibility', $publication, $validated);

        return redirect()
            ->to(PublicationBackNavigation::redirectUrl($validated['from'] ?? null, $request->user()))
            ->with('success', 'Visibilidad actualizada.');
    }
}
