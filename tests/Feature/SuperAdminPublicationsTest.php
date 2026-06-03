<?php

namespace Tests\Feature;

use App\Models\Publication;
use App\Models\User;
use App\Services\AuditService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class SuperAdminPublicationsTest extends TestCase
{
    use RefreshDatabase;

    public function test_super_admin_publications_index_shows_moderation_stats_and_activity(): void
    {
        $superAdmin = User::factory()->superAdmin()->create();
        $publication = Publication::factory()->pending()->create([
            'title' => 'Parcial de Física II',
        ]);

        app(AuditService::class)->log(
            $superAdmin,
            'publication.approved',
            $publication,
        );

        $this->actingAs($superAdmin)
            ->get(route('super-admin.publications.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('SuperAdmin/Publications/Index')
                ->where('stats.pending_count', 1)
                ->has('recentActivity', 1)
                ->where('recentActivity.0.publication_title', 'Parcial de Física II')
                ->where('recentActivity.0.action_label', 'Aprobado')
            );
    }
}
