<?php

namespace App\Http\Controllers;

use App\Services\FeedService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __construct(private FeedService $feedService) {}

    public function index(Request $request): Response
    {
        $user = $request->user();
        $user->loadMissing(['subjects', 'career']);

        return Inertia::render('Home/Index', [
            'publications' => $this->feedService->forUser($user),
            'interests' => $user->subjects->map(fn ($subject) => [
                'id' => $subject->id,
                'name' => $subject->name,
            ])->values(),
        ]);
    }
}
