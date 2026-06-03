<?php

namespace App\Repositories;

use App\Contracts\Repositories\ProfessorRepositoryInterface;
use App\Models\Professor;
use Illuminate\Database\Eloquent\Collection;

class ProfessorRepository implements ProfessorRepositoryInterface
{
    public function findById(int $id): ?Professor
    {
        return Professor::query()->find($id);
    }

    public function allActive(): Collection
    {
        return Professor::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get();
    }

    public function create(array $data): Professor
    {
        return Professor::query()->create($data);
    }

    public function update(Professor $professor, array $data): Professor
    {
        $professor->update($data);

        return $professor->fresh();
    }
}
