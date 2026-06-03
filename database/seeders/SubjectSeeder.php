<?php

namespace Database\Seeders;

use App\Models\Career;
use App\Models\Subject;
use Illuminate\Database\Seeder;

class SubjectSeeder extends Seeder
{
    public function run(): void
    {
        $career = Career::query()->where('code', 'ISI')->first();

        if ($career === null) {
            return;
        }

        $subjects = [
            ['name' => 'Programación I', 'code' => 'PROG1', 'semester' => 1],
            ['name' => 'Estructuras de Datos', 'code' => 'ESTDAT', 'semester' => 3],
            ['name' => 'Bases de Datos', 'code' => 'BDAT', 'semester' => 5],
        ];

        foreach ($subjects as $subject) {
            Subject::query()->updateOrCreate(
                ['code' => $subject['code']],
                [
                    'name' => $subject['name'],
                    'semester' => $subject['semester'],
                    'career_id' => $career->id,
                    'is_active' => true,
                ],
            );
        }
    }
}
