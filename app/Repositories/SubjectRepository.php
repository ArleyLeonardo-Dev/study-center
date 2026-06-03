<?php

namespace App\Repositories;

use App\Contracts\Repositories\SubjectRepositoryInterface;
use App\Models\Subject;
use Illuminate\Database\Eloquent\Collection;

class SubjectRepository implements SubjectRepositoryInterface
{
    public function findById(int $id): ?Subject
    {
        return Subject::query()->find($id);
    }

    public function findByCode(string $code): ?Subject
    {
        return Subject::query()->where('code', $code)->first();
    }

    public function allActive(?int $careerId = null): Collection
    {
        $query = Subject::query()
            ->where('is_active', true)
            ->orderBy('semester')
            ->orderBy('name');

        if ($careerId !== null) {
            $query->where('career_id', $careerId);
        }

        return $query->get();
    }

    public function create(array $data): Subject
    {
        return Subject::query()->create($data);
    }

    public function update(Subject $subject, array $data): Subject
    {
        $subject->update($data);

        return $subject->fresh();
    }
}
