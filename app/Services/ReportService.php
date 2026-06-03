<?php

namespace App\Services;

use App\Enums\ReportStatus;
use App\Enums\TransactionAction;
use App\Models\Publication;
use App\Models\PublicationReport;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class ReportService
{
    public function __construct(
        private readonly IdempotencyService $idempotencyService,
        private readonly AuditService $auditService,
    ) {}

    public function create(User $reporter, Publication $publication, string $reason, string $idempotencyKey): PublicationReport
    {
        $payload = [
            'publication_id' => $publication->id,
            'reason' => $reason,
        ];

        return $this->idempotencyService->resolve(
            $reporter,
            $idempotencyKey,
            TransactionAction::ReportCreate,
            $payload,
            function (Transaction $transaction) use ($reporter, $publication, $reason): PublicationReport {
                return DB::transaction(function () use ($reporter, $publication, $reason, $transaction): PublicationReport {
                    $report = PublicationReport::query()->create([
                        'publication_id' => $publication->id,
                        'reporter_id' => $reporter->id,
                        'reason' => $reason,
                        'status' => ReportStatus::Pending,
                        'transaction_id' => $transaction->id,
                    ]);

                    $this->auditService->log(
                        actor: $reporter,
                        action: 'publication.reported',
                        auditable: $report,
                        properties: ['publication_id' => $publication->id],
                    );

                    return $report->load(['publication', 'reporter']);
                });
            },
        );
    }

    public function pending(int $perPage = 15): LengthAwarePaginator
    {
        return PublicationReport::query()
            ->with(['publication', 'reporter'])
            ->where('status', ReportStatus::Pending)
            ->latest()
            ->paginate($perPage);
    }

    public function resolve(PublicationReport $report, User $reviewer, ReportStatus $status, ?string $adminNotes = null): PublicationReport
    {
        $report->update([
            'status' => $status,
            'reviewed_by' => $reviewer->id,
            'reviewed_at' => now(),
            'admin_notes' => $adminNotes,
        ]);

        $this->auditService->log(
            actor: $reviewer,
            action: 'report.resolved',
            auditable: $report,
            properties: ['status' => $status->value],
        );

        return $report->fresh(['publication', 'reporter', 'reviewer']);
    }
}
