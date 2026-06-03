<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReportRequest;
use App\Models\Publication;
use App\Services\ReportService;
use Illuminate\Http\RedirectResponse;

class ReportController extends Controller
{
    public function __construct(private ReportService $reportService) {}

    public function store(StoreReportRequest $request, Publication $publication): RedirectResponse
    {
        $this->reportService->create(
            $request->user(),
            $publication,
            $request->validated('reason'),
            $request->attributes->get('idempotency_key'),
        );

        return back()->with('success', 'Reporte enviado correctamente.');
    }
}
