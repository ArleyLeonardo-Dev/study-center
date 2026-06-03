<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SuperAdminUserRoleTest extends TestCase
{
    use RefreshDatabase;

    public function test_super_admin_can_update_user_role(): void
    {
        $superAdmin = User::factory()->superAdmin()->create();
        $student = User::factory()->student()->create();

        $response = $this
            ->actingAs($superAdmin)
            ->from(route('super-admin.users.index'))
            ->patch(route('super-admin.users.role.update', $student), [
                'role' => UserRole::Admin->value,
            ]);

        $response
            ->assertRedirect(route('super-admin.users.index'))
            ->assertSessionHas('success');

        $this->assertSame(UserRole::Admin, $student->fresh()->role);

        $this->assertDatabaseHas('audit_logs', [
            'actor_id' => $superAdmin->id,
            'action' => 'user.role_updated',
            'auditable_type' => User::class,
            'auditable_id' => $student->id,
        ]);
    }

    public function test_super_admin_cannot_change_own_role(): void
    {
        $superAdmin = User::factory()->superAdmin()->create();

        $this->actingAs($superAdmin)
            ->patch(route('super-admin.users.role.update', $superAdmin), [
                'role' => UserRole::Student->value,
            ])
            ->assertForbidden();

        $this->assertSame(UserRole::SuperAdmin, $superAdmin->fresh()->role);
        $this->assertSame(0, AuditLog::query()->count());
    }
}
