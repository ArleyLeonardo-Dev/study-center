<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SuperAdminCommandTest extends TestCase
{
    use RefreshDatabase;

    public function test_command_creates_super_admin_user(): void
    {
        $this->artisan('user:create-super-admin', [
            'email' => 'super@example.com',
            'name' => 'Super Admin',
            '--password' => 'password123',
        ])->assertSuccessful();

        $user = User::query()->where('email', 'super@example.com')->first();

        $this->assertNotNull($user);
        $this->assertSame(UserRole::SuperAdmin, $user->role);
        $this->assertTrue($user->is_active);
    }

    public function test_command_updates_existing_user_to_super_admin(): void
    {
        $user = User::factory()->student()->create([
            'email' => 'existing@example.com',
            'name' => 'Existing User',
        ]);

        $this->artisan('user:create-super-admin', [
            'email' => 'existing@example.com',
            'name' => 'Updated Admin',
            '--password' => 'password123',
        ])->assertSuccessful();

        $user->refresh();

        $this->assertSame(UserRole::SuperAdmin, $user->role);
        $this->assertSame('Updated Admin', $user->name);
    }
}
