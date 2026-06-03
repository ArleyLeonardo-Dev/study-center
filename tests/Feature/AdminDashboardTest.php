<?php

namespace Tests\Feature;

use App\Models\Publication;
use App\Models\User;
use App\Services\AuditService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminDashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_dashboard_shows_stats_and_recent_publication_activity(): void
    {
        $admin = User::factory()->admin()->create();
        $publication = Publication::factory()->pending()->create([
            'title' => 'Parcial de Cálculo I',
        ]);

        app(AuditService::class)->log(
            $admin,
            'publication.approved',
            $publication,
        );

        $this->actingAs($admin)
            ->get(route('admin.dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Dashboard')
                ->where('stats.pending_count', 1)
                ->has('recentActivity', 1)
                ->where('recentActivity.0.publication_title', 'Parcial de Cálculo I')
                ->where('recentActivity.0.action_label', 'Aprobado')
            );
    }
}
