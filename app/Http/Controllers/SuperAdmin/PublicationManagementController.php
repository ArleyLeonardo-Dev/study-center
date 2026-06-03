<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Concerns\InteractsWithPublicationModerationDashboard;
use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class PublicationManagementController extends Controller
{
    use InteractsWithPublicationModerationDashboard;

    public function index(): Response
    {
        return Inertia::render(
            'SuperAdmin/Publications/Index',
            $this->publicationModerationDashboardProps(),
        );
    }
}
