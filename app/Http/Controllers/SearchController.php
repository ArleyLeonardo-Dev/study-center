<?php

namespace App\Http\Controllers;

use App\Http\Requests\SearchPublicationRequest;
use App\Models\Career;
use App\Models\Professor;
use App\Models\Subject;
use App\Services\SearchService;
use Inertia\Inertia;
use Inertia\Response;

class SearchController extends Controller
{
    public function __construct(private SearchService $searchService) {}

    public function index(SearchPublicationRequest $request): Response
    {
        $filters = $request->validated();

        return Inertia::render('Search/Index', [
            'publications' => $this->searchService->search($filters, $request->user()),
            'filters' => $filters,
            'careers' => Career::query()->where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'subjects' => Subject::query()->orderBy('name')->get(['id', 'name', 'career_id']),
            'professors' => Professor::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }
}
