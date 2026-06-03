<?php

namespace App\Contracts\Repositories;

use App\Models\Subject;
use Illuminate\Database\Eloquent\Collection;

interface SubjectRepositoryInterface
{
    public function findById(int $id): ?Subject;

    public function findByCode(string $code): ?Subject;

    public function allActive(?int $careerId = null): Collection;

    public function create(array $data): Subject;

    public function update(Subject $subject, array $data): Subject;
}
