<?php

namespace App\Contracts\Repositories;

use App\Models\Professor;
use Illuminate\Database\Eloquent\Collection;

interface ProfessorRepositoryInterface
{
    public function findById(int $id): ?Professor;

    public function allActive(): Collection;

    public function create(array $data): Professor;

    public function update(Professor $professor, array $data): Professor;
}
