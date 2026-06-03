<?php

namespace App\Http\Controllers\Concerns;

use App\Enums\PublicationStatus;
use App\Enums\ReportStatus;
use App\Models\Publication;
use App\Models\PublicationReport;
use App\Services\AuditService;
use Illuminate\Support\Collection;

trait InteractsWithPublicationModerationDashboard
{
    /**
     * @return array{
     *     stats: array{
     *         pending_count: int,
     *         reported_count: int,
     *         approved_count: int,
     *         hidden_count: int
     *     },
     *     recentActivity: Collection<int, array{
     *         id: int,
     *         publication_title: string,
     *         action: string,
     *         action_label: string,
     *         created_at: string|null
     *     }>
     * }
     */
    protected function publicationModerationDashboardProps(): array
    {
        return [
            'stats' => [
                'pending_count' => Publication::query()
                    ->where('status', PublicationStatus::Pending)
                    ->count(),
                'reported_count' => PublicationReport::query()
                    ->where('status', ReportStatus::Pending)
                    ->count(),
                'approved_count' => Publication::query()
                    ->where('status', PublicationStatus::Approved)
                    ->count(),
                'hidden_count' => Publication::query()
                    ->where('status', PublicationStatus::Approved)
                    ->where('is_visible', false)
                    ->count(),
            ],
            'recentActivity' => app(AuditService::class)->recentPublicationActivity(),
        ];
    }
}
