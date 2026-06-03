<?php

namespace App\Services;

use App\Contracts\Repositories\PublicationRepositoryInterface;
use App\Enums\PublicationStatus;
use App\Enums\TransactionAction;
use App\Models\Publication;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class PublicationService
{
    public function __construct(
        private readonly PublicationRepositoryInterface $publicationRepository,
        private readonly IdempotencyService $idempotencyService,
        private readonly AuditService $auditService,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(User $user, array $data, string $idempotencyKey): Publication
    {
        $result = $this->idempotencyService->resolve(
            $user,
            $idempotencyKey,
            TransactionAction::PublicationCreate,
            $data,
            function (Transaction $transaction) use ($user, $data): Publication {
                return DB::transaction(function () use ($user, $data, $transaction): Publication {
                    $publication = $this->publicationRepository->create([
                        ...$data,
                        'user_id' => $user->id,
                        'status' => PublicationStatus::Pending,
                        'is_visible' => true,
                        'transaction_id' => $transaction->id,
                    ]);

                    $this->auditService->log(
                        actor: $user,
                        action: 'publication.created',
                        auditable: $publication,
                        properties: ['title' => $publication->title],
                    );

                    return $publication->load(['subject', 'professor', 'career', 'user']);
                });
            },
        );

        if ($result instanceof Publication) {
            return $result;
        }

        $publicationId = is_array($result) ? ($result['id'] ?? null) : null;

        if ($publicationId === null) {
            throw new \RuntimeException('Unable to resolve publication from idempotent replay.');
        }

        return $this->publicationRepository->findById((int) $publicationId)
            ?? throw new \RuntimeException('Publication not found for idempotent replay.');
    }

    public function pending(int $perPage = 15): LengthAwarePaginator
    {
        return $this->publicationRepository->pending($perPage);
    }

    public function all(int $perPage = 15): LengthAwarePaginator
    {
        return $this->publicationRepository->all($perPage);
    }

    public function approve(Publication $publication, User $reviewer): Publication
    {
        $publication = $this->publicationRepository->updateStatus(
            $publication,
            PublicationStatus::Approved,
            $reviewer->id,
        );

        $this->auditService->log(
            actor: $reviewer,
            action: 'publication.approved',
            auditable: $publication,
        );

        return $publication;
    }

    public function reject(Publication $publication, User $reviewer, string $reason): Publication
    {
        $publication = $this->publicationRepository->updateStatus(
            $publication,
            PublicationStatus::Rejected,
            $reviewer->id,
            $reason,
        );

        $this->auditService->log(
            actor: $reviewer,
            action: 'publication.rejected',
            auditable: $publication,
            properties: ['reason' => $reason],
        );

        return $publication;
    }

    public function toggleVisibility(Publication $publication, User $actor, bool $isVisible): Publication
    {
        $publication = $this->publicationRepository->toggleVisibility($publication, $isVisible);

        $this->auditService->log(
            actor: $actor,
            action: $isVisible ? 'publication.visible' : 'publication.hidden',
            auditable: $publication,
        );

        return $publication;
    }
}
