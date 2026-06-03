<?php

namespace Tests\Feature;

use App\Enums\ReportStatus;
use App\Models\Publication;
use App\Models\PublicationReport;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminReportedPublicationsTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_pending_reports(): void
    {
        $admin = User::factory()->admin()->create();
        $reporter = User::factory()->create();
        $publication = Publication::factory()->create();

        PublicationReport::query()->create([
            'publication_id' => $publication->id,
            'reporter_id' => $reporter->id,
            'reason' => 'Contenido inapropiado',
            'status' => ReportStatus::Pending,
        ]);

        $this->actingAs($admin)
            ->get(route('admin.reports.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Publications/Reported')
                ->has('reports.data', 1)
                ->where('reports.data.0.reason', 'Contenido inapropiado')
            );
    }
}
