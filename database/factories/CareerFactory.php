<?php

namespace Database\Factories;

use App\Models\Career;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Career>
 */
class CareerFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->words(3, true);

        return [
            'name' => ucfirst($name),
            'code' => strtoupper(fake()->unique()->bothify('???-###')),
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
