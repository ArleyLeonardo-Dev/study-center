<?php

namespace Database\Factories;

use App\Enums\PublicationStatus;
use App\Models\Career;
use App\Models\Professor;
use App\Models\Publication;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Publication>
 */
class PublicationFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory()->student(),
            'subject_id' => Subject::factory(),
            'professor_id' => Professor::factory(),
            'career_id' => Career::factory(),
            'semester' => fake()->numberBetween(1, 10),
            'title' => fake()->sentence(4),
            'description' => fake()->paragraph(),
            'file_url' => fake()->url(),
            'storage_disk' => 's3',
            'storage_key' => 'uploads/'.fake()->uuid().'.pdf',
            'file_original_name' => fake()->word().'.pdf',
            'file_type' => 'application/pdf',
            'file_size' => fake()->numberBetween(1024, 5_000_000),
            'status' => PublicationStatus::Pending,
            'is_visible' => true,
        ];
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => PublicationStatus::Pending,
            'reviewed_by' => null,
            'reviewed_at' => null,
            'rejection_reason' => null,
        ]);
    }

    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => PublicationStatus::Approved,
            'reviewed_by' => User::factory()->admin(),
            'reviewed_at' => now(),
            'rejection_reason' => null,
        ]);
    }

    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => PublicationStatus::Rejected,
            'reviewed_by' => User::factory()->admin(),
            'reviewed_at' => now(),
            'rejection_reason' => 'Contenido no cumple con las normas.',
        ]);
    }
}
