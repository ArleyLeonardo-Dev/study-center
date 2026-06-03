<?php

namespace Database\Factories;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    protected static ?string $password;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->userName().'@unicesar.edu.co',
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'role' => UserRole::Student,
            'is_active' => true,
            'remember_token' => Str::random(10),
        ];
    }

    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    public function student(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => UserRole::Student,
        ]);
    }

    public function master(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => UserRole::Master,
        ]);
    }

    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => UserRole::Admin,
        ]);
    }

    public function superAdmin(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => UserRole::SuperAdmin,
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
