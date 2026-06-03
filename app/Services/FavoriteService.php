<?php

namespace App\Services;

use App\Enums\TransactionAction;
use App\Models\Favorite;
use App\Models\Publication;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class FavoriteService
{
    public function __construct(
        private readonly IdempotencyService $idempotencyService,
    ) {}

    public function toggle(User $user, Publication $publication, string $idempotencyKey): bool
    {
        $payload = [
            'publication_id' => $publication->id,
        ];

        $result = $this->idempotencyService->resolve(
            $user,
            $idempotencyKey,
            TransactionAction::FavoriteCreate,
            $payload,
            function (Transaction $transaction) use ($user, $publication): array {
                return DB::transaction(function () use ($user, $publication, $transaction): array {
                    $existing = Favorite::query()
                        ->where('user_id', $user->id)
                        ->where('publication_id', $publication->id)
                        ->first();

                    if ($existing !== null) {
                        $existing->delete();

                        return ['favorited' => false];
                    }

                    Favorite::query()->create([
                        'user_id' => $user->id,
                        'publication_id' => $publication->id,
                        'transaction_id' => $transaction->id,
                    ]);

                    return ['favorited' => true];
                });
            },
        );

        if (is_array($result)) {
            return (bool) ($result['favorited'] ?? false);
        }

        return false;
    }

    public function remove(User $user, Publication $publication): void
    {
        Favorite::query()
            ->where('user_id', $user->id)
            ->where('publication_id', $publication->id)
            ->delete();
    }
}
