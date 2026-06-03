<?php

namespace Database\Seeders;

use App\Models\Professor;
use Illuminate\Database\Seeder;

class ProfessorSeeder extends Seeder
{
    public function run(): void
    {
        $professors = [
            ['name' => 'Dr. Carlos Mendoza', 'email' => 'cmendoza@universidad.edu', 'department' => 'Ingeniería'],
            ['name' => 'Dra. Ana García', 'email' => 'agarcia@universidad.edu', 'department' => 'Ciencias'],
            ['name' => 'Prof. Luis Ramírez', 'email' => 'lramirez@universidad.edu', 'department' => 'Humanidades'],
        ];

        foreach ($professors as $professor) {
            Professor::query()->updateOrCreate(
                ['email' => $professor['email']],
                [
                    'name' => $professor['name'],
                    'department' => $professor['department'],
                    'is_active' => true,
                ],
            );
        }
    }
}
