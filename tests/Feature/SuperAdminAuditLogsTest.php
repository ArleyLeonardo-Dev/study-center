<?php

namespace Tests\Feature;

use App\Models\User;
use App\Services\AuditService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class SuperAdminAuditLogsTest extends TestCase
{
    use RefreshDatabase;

    public function test_super_admin_can_view_audit_logs(): void
    {
        $superAdmin = User::factory()->superAdmin()->create();
        $target = User::factory()->student()->create();

        app(AuditService::class)->log(
            $superAdmin,
            'user.role_updated',
            $target,
            ['role' => 1],
        );

        $this->actingAs($superAdmin)
            ->get(route('super-admin.audit-logs.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('SuperAdmin/Audit/Index')
                ->has('logs.data', 1)
                ->where('logs.data.0.action', 'user.role_updated')
                ->where('logs.data.0.actor.name', $superAdmin->name)
            );
    }
}
