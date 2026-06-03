<?php

namespace Database\Seeders;

use App\Models\Career;
use Illuminate\Database\Seeder;

class CareerSeeder extends Seeder
{
    public function run(): void
    {
        $careers = [
            ['name' => 'Ingeniería en Sistemas', 'code' => 'ISI'],
            ['name' => 'Licenciatura en Administración', 'code' => 'LAD'],
            ['name' => 'Contador Público', 'code' => 'CP'],
        ];

        foreach ($careers as $career) {
            Career::query()->updateOrCreate(
                ['code' => $career['code']],
                ['name' => $career['name'], 'is_active' => true],
            );
        }
    }
}
