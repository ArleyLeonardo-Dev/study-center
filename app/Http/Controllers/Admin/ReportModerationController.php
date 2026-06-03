<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ReportStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\ResolveReportRequest;
use App\Models\PublicationReport;
use App\Services\AuditService;
use App\Services\ReportService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ReportModerationController extends Controller
{
    public function __construct(
        private ReportService $reportService,
        private AuditService $auditService,
    ) {}

    public function index(): Response
    {
        $this->authorize('viewAny', PublicationReport::class);

        return Inertia::render('Admin/Publications/Reported', [
            'reports' => $this->reportService->pending(),
        ]);
    }

    public function resolve(ResolveReportRequest $request, PublicationReport $report): RedirectResponse
    {
        $status = ReportStatus::from($request->validated('status'));

        $this->reportService->resolve(
            $report,
            $request->user(),
            $status,
            $request->validated('admin_notes'),
        );

        $this->auditService->log($request->user(), 'report.resolved', $report, $request->validated());

        return back()->with('success', 'Reporte resuelto.');
    }
}
