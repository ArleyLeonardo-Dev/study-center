<?php

namespace App\Services;

use App\Enums\TransactionAction;
use App\Models\Comment;
use App\Models\Publication;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CommentService
{
    public function __construct(
        private readonly IdempotencyService $idempotencyService,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(User $user, Publication $publication, array $data, string $idempotencyKey): Comment
    {
        $payload = [
            'publication_id' => $publication->id,
            'body' => $data['body'] ?? '',
            'parent_id' => $data['parent_id'] ?? null,
        ];

        $result = $this->idempotencyService->resolve(
            $user,
            $idempotencyKey,
            TransactionAction::CommentCreate,
            $payload,
            function (Transaction $transaction) use ($user, $publication, $data): Comment {
                return DB::transaction(function () use ($user, $publication, $data, $transaction): Comment {
                    return Comment::query()->create([
                        'user_id' => $user->id,
                        'publication_id' => $publication->id,
                        'parent_id' => $data['parent_id'] ?? null,
                        'body' => $data['body'],
                        'is_visible' => true,
                        'transaction_id' => $transaction->id,
                    ])->load('user');
                });
            },
        );

        if ($result instanceof Comment) {
            return $result;
        }

        $commentId = is_array($result) ? ($result['id'] ?? null) : null;

        if ($commentId === null) {
            throw new \RuntimeException('Unable to resolve comment from idempotent replay.');
        }

        return Comment::query()->with('user')->findOrFail((int) $commentId);
    }
}
