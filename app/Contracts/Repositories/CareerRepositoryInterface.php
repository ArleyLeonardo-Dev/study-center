<?php

namespace App\Contracts\Repositories;

use App\Models\Career;
use Illuminate\Database\Eloquent\Collection;

interface CareerRepositoryInterface
{
    public function findById(int $id): ?Career;

    public function findByCode(string $code): ?Career;

    public function allActive(): Collection;

    public function create(array $data): Career;

    public function update(Career $career, array $data): Career;
}
