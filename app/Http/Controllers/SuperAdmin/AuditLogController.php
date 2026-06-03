<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Services\AuditService;
use Inertia\Inertia;
use Inertia\Response;

class AuditLogController extends Controller
{
    public function __construct(private AuditService $auditService) {}

    public function index(): Response
    {
        return Inertia::render('SuperAdmin/Audit/Index', [
            'logs' => $this->auditService->paginate(),
        ]);
    }
}
