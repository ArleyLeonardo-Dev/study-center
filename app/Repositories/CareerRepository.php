<?php

namespace App\Repositories;

use App\Contracts\Repositories\CareerRepositoryInterface;
use App\Models\Career;
use Illuminate\Database\Eloquent\Collection;

class CareerRepository implements CareerRepositoryInterface
{
    public function findById(int $id): ?Career
    {
        return Career::query()->find($id);
    }

    public function findByCode(string $code): ?Career
    {
        return Career::query()->where('code', $code)->first();
    }

    public function allActive(): Collection
    {
        return Career::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get();
    }

    public function create(array $data): Career
    {
        return Career::query()->create($data);
    }

    public function update(Career $career, array $data): Career
    {
        $career->update($data);

        return $career->fresh();
    }
}
