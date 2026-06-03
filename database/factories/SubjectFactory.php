<?php

namespace Database\Factories;

use App\Models\Career;
use App\Models\Subject;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Subject>
 */
class SubjectFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => ucfirst(fake()->unique()->words(2, true)),
            'code' => strtoupper(fake()->unique()->bothify('MAT-###')),
            'semester' => fake()->numberBetween(1, 10),
            'is_active' => true,
            'career_id' => Career::factory(),
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
