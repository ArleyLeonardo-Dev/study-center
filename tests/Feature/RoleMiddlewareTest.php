<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleMiddlewareTest extends TestCase
{
    use RefreshDatabase;

    public function test_student_can_access_student_routes(): void
    {
        $student = User::factory()->student()->create();

        $response = $this->actingAs($student)->get(route('publications.create'));

        $response->assertOk();
    }

    public function test_student_cannot_access_admin_routes(): void
    {
        $student = User::factory()->student()->create();

        $response = $this->actingAs($student)->get(route('admin.dashboard'));

        $response->assertForbidden();
    }

    public function test_admin_can_access_admin_routes(): void
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)->get(route('admin.dashboard'));

        $response->assertOk();
    }

    public function test_admin_cannot_access_super_admin_routes(): void
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)->get(route('super-admin.dashboard'));

        $response->assertForbidden();
    }

    public function test_super_admin_can_access_super_admin_routes(): void
    {
        $superAdmin = User::factory()->superAdmin()->create();

        $response = $this->actingAs($superAdmin)->get(route('super-admin.dashboard'));

        $response->assertOk();
    }

    public function test_inactive_user_is_forbidden(): void
    {
        $student = User::factory()->student()->inactive()->create();

        $response = $this->actingAs($student)->get(route('publications.create'));

        $response->assertForbidden();
    }
}
