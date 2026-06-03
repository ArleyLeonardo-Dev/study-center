<?php

namespace Tests\Feature\Auth;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_screen_can_be_rendered(): void
    {
        $response = $this->get('/register');

        $response->assertStatus(200);
    }

    public function test_new_users_can_register_with_unicesar_email(): void
    {
        $response = $this->post('/register', [
            'name' => 'Test User',
            'email' => 'test@unicesar.edu.co',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('verification.notice'));

        $this->assertDatabaseHas('users', [
            'email' => 'test@unicesar.edu.co',
            'role' => UserRole::Student->value,
        ]);

        $this->assertNull(
            User::query()->where('email', 'test@unicesar.edu.co')->first()?->email_verified_at,
        );
    }

    public function test_registration_rejects_non_unicesar_email(): void
    {
        $response = $this->from('/register')->post('/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertGuest();
        $response
            ->assertRedirect('/register')
            ->assertSessionHasErrors('email');
    }
}
