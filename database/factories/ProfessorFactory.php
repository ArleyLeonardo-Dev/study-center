<?php

namespace Database\Factories;

use App\Models\Professor;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Professor>
 */
class ProfessorFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'department' => fake()->randomElement(['Ingeniería', 'Ciencias', 'Humanidades']),
            'is_active' => true,
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
