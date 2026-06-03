<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Enums\PublicationStatus;
use App\Enums\ReportStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Publication;
use App\Models\PublicationReport;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('SuperAdmin/Dashboard', [
            'telemetry' => [
                'users_by_role' => collect(UserRole::cases())->mapWithKeys(fn (UserRole $role) => [
                    $role->label() => User::query()->where('role', $role->value)->count(),
                ])->all(),
                'publications_by_status' => collect(PublicationStatus::cases())->mapWithKeys(fn (PublicationStatus $status) => [
                    $status->label() => Publication::query()->where('status', $status->value)->count(),
                ])->all(),
                'pending_reports' => PublicationReport::query()
                    ->where('status', ReportStatus::Pending->value)
                    ->count(),
                'recent_activity' => AuditLog::query()
                    ->with('actor:id,name')
                    ->latest('created_at')
                    ->limit(10)
                    ->get()
                    ->map(fn (AuditLog $log): array => [
                        'action' => $log->action,
                        'actor_name' => $log->actor?->name ?? 'Sistema',
                        'created_at' => $log->created_at?->toIso8601String() ?? now()->toIso8601String(),
                    ])
                    ->all(),
            ],
        ]);
    }
}
