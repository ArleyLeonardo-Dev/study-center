<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePublicationRequest;
use App\Models\Career;
use App\Models\Professor;
use App\Models\Publication;
use App\Models\Subject;
use App\Services\PublicationService;
use App\Services\Storage\PublicationStorageService;
use App\Support\PublicationBackNavigation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class PublicationController extends Controller
{
    public function __construct(
        private PublicationService $publicationService,
        private PublicationStorageService $publicationStorageService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('Publications/Index', [
            'publications' => Publication::query()->latest()->paginate(15),
        ]);
    }

    public function create(Request $request): Response
    {
        $this->authorize('create', Publication::class);

        return Inertia::render('Publications/Create', [
            'careers' => Career::query()->where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'subjects' => Subject::query()->orderBy('name')->get(['id', 'name', 'career_id']),
            'professors' => Professor::query()->orderBy('name')->get(['id', 'name']),
            'usesAwsStorage' => $this->publicationStorageService->usesAws(),
        ]);
    }

    public function store(StorePublicationRequest $request): RedirectResponse
    {
        $payload = $request->validated();

        if (! $this->publicationStorageService->usesAws()) {
            $payload = [
                ...$payload,
                ...$this->publicationStorageService->storeLocalUpload(
                    $request->file('file'),
                    $request->user(),
                ),
            ];

            unset($payload['file']);
        } else {
            $payload['storage_disk'] = 's3';
        }

        $this->publicationService->create(
            $request->user(),
            $payload,
            $request->attributes->get('idempotency_key'),
        );

        return redirect()
            ->route('home')
            ->with('success', 'Publicación enviada para revisión.');
    }

    public function show(Request $request, Publication $publication): Response
    {
        $this->authorize('view', $publication);

        $user = $request->user();

        $publication->loadMissing(['user', 'subject', 'professor', 'career']);
        $publication->loadEngagementFor($user);

        $comments = $publication->comments()
            ->whereNull('parent_id')
            ->where('is_visible', true)
            ->with(['user', 'replies.user'])
            ->latest()
            ->get();

        return Inertia::render('Publications/Show', [
            'publication' => $publication,
            'comments' => $comments,
            'can' => [
                'approve' => $user->can('approve', $publication),
                'reject' => $user->can('reject', $publication),
                'toggleVisibility' => $user->can('toggleVisibility', $publication),
                'report' => $user->can('report', $publication),
            ],
            'back' => PublicationBackNavigation::resolve($request->query('from'), $user),
        ]);
    }

    public function presignedUrl(Request $request): JsonResponse
    {
        $this->authorize('create', Publication::class);

        if (! $this->publicationStorageService->usesAws()) {
            return response()->json([
                'message' => 'AWS storage is not enabled.',
            ], HttpResponse::HTTP_UNPROCESSABLE_ENTITY);
        }

        $validated = $request->validate([
            'file_name' => ['required', 'string', 'max:255'],
            'content_type' => ['required', 'string', 'max:100'],
        ]);

        $payload = $this->publicationStorageService->createPresignedUpload(
            $request->user(),
            $validated['file_name'],
            $validated['content_type'],
        );

        return response()->json($payload);
    }
}
