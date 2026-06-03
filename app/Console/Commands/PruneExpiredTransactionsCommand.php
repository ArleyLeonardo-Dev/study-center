<?php

namespace App\Console\Commands;

use App\Contracts\Repositories\TransactionRepositoryInterface;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('transactions:prune-expired')]
#[Description('Delete expired completed or failed transactions')]
class PruneExpiredTransactionsCommand extends Command
{
    public function __construct(
        private readonly TransactionRepositoryInterface $transactionRepository,
    ) {
        parent::__construct();
    }

    public function handle(): int
    {
        $deleted = $this->transactionRepository->pruneExpired();

        $this->info("Pruned {$deleted} expired transaction(s).");

        return self::SUCCESS;
    }
}
