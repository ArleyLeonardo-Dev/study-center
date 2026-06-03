<?php

namespace Tests\Feature;

use App\Models\Publication;
use App\Models\PublicationReport;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class ReportPublicationTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_report_publication(): void
    {
        $admin = User::factory()->admin()->create();
        $publication = Publication::factory()->approved()->create();

        $this->actingAs($admin)
            ->post(route('publications.report', $publication), [
                'reason' => 'Contenido inapropiado para la plataforma académica.',
            ], [
                'Idempotency-Key' => (string) Str::uuid(),
            ])
            ->assertRedirect()
            ->assertSessionHas('success', 'Reporte enviado correctamente.');

        $this->assertDatabaseHas('publication_reports', [
            'publication_id' => $publication->id,
            'reporter_id' => $admin->id,
            'reason' => 'Contenido inapropiado para la plataforma académica.',
        ]);

        $this->assertSame(1, PublicationReport::query()->count());
    }
}
