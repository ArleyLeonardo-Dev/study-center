<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Concerns\InteractsWithPublicationModerationDashboard;
use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    use InteractsWithPublicationModerationDashboard;

    public function index(): Response
    {
        return Inertia::render('Admin/Dashboard', $this->publicationModerationDashboardProps());
    }
}
