<?php

namespace App\Services;

use App\Contracts\Repositories\TransactionRepositoryInterface;
use App\Enums\TransactionAction;
use App\Enums\TransactionStatus;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

class IdempotencyService
{
    private const int TTL_HOURS = 72;

    private const int PENDING_TIMEOUT_SECONDS = 30;

    public function __construct(
        private readonly TransactionRepositoryInterface $transactionRepository,
    ) {}

    public function resolve(
        User $user,
        string $idempotencyKey,
        TransactionAction $action,
        array $payload,
        callable $callback,
    ): mixed {
        if (! Str::isUuid($idempotencyKey)) {
            throw new UnprocessableEntityHttpException('Idempotency-Key must be a valid UUID.');
        }

        $requestHash = $this->hashPayload($payload);

        return DB::transaction(function () use ($user, $idempotencyKey, $action, $requestHash, $callback): mixed {
            $transaction = $this->transactionRepository->lockForUserAndKey($user, $idempotencyKey);

            if ($transaction !== null && $transaction->isExpired()) {
                $transaction->delete();
                $transaction = null;
            }

            if ($transaction === null) {
                $transaction = $this->begin($user, $idempotencyKey, $action, $requestHash);
            } elseif ($transaction->request_hash !== $requestHash) {
                throw new UnprocessableEntityHttpException('Idempotency-Key was reused with different payload.');
            } elseif ($transaction->status === TransactionStatus::Completed) {
                return $this->replay($transaction);
            } elseif ($transaction->status === TransactionStatus::Pending) {
                if ($transaction->created_at->diffInSeconds(now()) < self::PENDING_TIMEOUT_SECONDS) {
                    throw new ConflictHttpException('Request is already in progress.');
                }

                $transaction = $this->transactionRepository->update($transaction, [
                    'status' => TransactionStatus::Failed,
                    'error_message' => 'Timed out while pending.',
                ]);

                $transaction = $this->begin($user, $idempotencyKey, $action, $requestHash);
            }

            try {
                $result = $callback($transaction);

                $this->complete($transaction, $result);

                return $result;
            } catch (\Throwable $exception) {
                $this->fail($transaction, $exception->getMessage());

                throw $exception;
            }
        });
    }

    public function begin(User $user, string $idempotencyKey, TransactionAction $action, ?string $requestHash = null): Transaction
    {
        return $this->transactionRepository->create([
            'idempotency_key' => $idempotencyKey,
            'user_id' => $user->id,
            'action' => $action,
            'status' => TransactionStatus::Pending,
            'request_hash' => $requestHash,
            'expires_at' => now()->addHours(self::TTL_HOURS),
        ]);
    }

    /**
     * @param  array<string, mixed>|object  $result
     */
    public function complete(Transaction $transaction, mixed $result): Transaction
    {
        $resourceType = null;
        $resourceId = null;
        $response = $result;

        if (is_object($result) && method_exists($result, 'getKey')) {
            $resourceType = $result::class;
            $resourceId = $result->getKey();
            $response = ['id' => $resourceId];
        } elseif (is_array($result)) {
            $response = $result;
        }

        return $this->transactionRepository->update($transaction, [
            'status' => TransactionStatus::Completed,
            'resource_type' => $resourceType,
            'resource_id' => $resourceId,
            'response' => is_array($response) ? $response : ['data' => $response],
            'error_message' => null,
        ]);
    }

    public function fail(Transaction $transaction, string $message): Transaction
    {
        return $this->transactionRepository->update($transaction, [
            'status' => TransactionStatus::Failed,
            'error_message' => $message,
        ]);
    }

    public function replay(Transaction $transaction): mixed
    {
        return $transaction->response;
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    public function hashPayload(array $payload): string
    {
        ksort($payload);

        return hash('sha256', json_encode($payload, JSON_THROW_ON_ERROR));
    }
}
