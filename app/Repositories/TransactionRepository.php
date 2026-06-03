<?php

namespace App\Repositories;

use App\Contracts\Repositories\TransactionRepositoryInterface;
use App\Enums\TransactionAction;
use App\Enums\TransactionStatus;
use App\Models\Transaction;
use App\Models\User;

class TransactionRepository implements TransactionRepositoryInterface
{
    public function findByUserAndKey(User $user, string $idempotencyKey): ?Transaction
    {
        return Transaction::query()
            ->where('user_id', $user->id)
            ->where('idempotency_key', $idempotencyKey)
            ->first();
    }

    public function create(array $data): Transaction
    {
        return Transaction::query()->create($data);
    }

    public function update(Transaction $transaction, array $data): Transaction
    {
        $transaction->update($data);

        return $transaction->fresh();
    }

    public function lockForUserAndKey(User $user, string $idempotencyKey): ?Transaction
    {
        return Transaction::query()
            ->where('user_id', $user->id)
            ->where('idempotency_key', $idempotencyKey)
            ->lockForUpdate()
            ->first();
    }

    public function findByUserKeyAndAction(User $user, string $idempotencyKey, TransactionAction $action): ?Transaction
    {
        return Transaction::query()
            ->where('user_id', $user->id)
            ->where('idempotency_key', $idempotencyKey)
            ->where('action', $action)
            ->first();
    }

    public function pruneExpired(): int
    {
        return Transaction::query()
            ->where('expires_at', '<', now())
            ->whereIn('status', [TransactionStatus::Completed, TransactionStatus::Failed])
            ->delete();
    }
}
