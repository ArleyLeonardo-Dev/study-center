<?php

namespace App\Contracts\Repositories;

use App\Enums\TransactionAction;
use App\Models\Transaction;
use App\Models\User;

interface TransactionRepositoryInterface
{
    public function findByUserAndKey(User $user, string $idempotencyKey): ?Transaction;

    public function create(array $data): Transaction;

    public function update(Transaction $transaction, array $data): Transaction;

    public function lockForUserAndKey(User $user, string $idempotencyKey): ?Transaction;

    public function findByUserKeyAndAction(User $user, string $idempotencyKey, TransactionAction $action): ?Transaction;

    public function pruneExpired(): int;
}
