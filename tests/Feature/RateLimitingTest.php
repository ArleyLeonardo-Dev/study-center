<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RateLimitingTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_route_is_rate_limited(): void
    {
        $user = User::factory()->create();

        for ($attempt = 0; $attempt < 10; $attempt++) {
            $this->post('/login', [
                'email' => $user->email,
                'password' => 'wrong-password',
            ])->assertStatus(302);
        }

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(429);
    }
}
