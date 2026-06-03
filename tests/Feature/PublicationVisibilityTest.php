<?php

namespace Tests\Feature;

use App\Models\Publication;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicationVisibilityTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_hiding_publication_redirects_to_previous_panel(): void
    {
        $admin = User::factory()->admin()->create();
        $publication = Publication::factory()->approved()->create([
            'is_visible' => true,
        ]);

        $this->actingAs($admin)
            ->from(route('publications.show', [
                'publication' => $publication,
                'from' => 'reports',
            ]))
            ->patch(route('admin.publications.visibility', $publication), [
                'is_visible' => false,
                'from' => 'reports',
            ])
            ->assertRedirect(route('admin.reports.index'))
            ->assertSessionHas('success', 'Visibilidad actualizada.');

        $publication->refresh();

        $this->assertFalse($publication->is_visible);
    }

    public function test_admin_showing_publication_redirects_to_previous_panel(): void
    {
        $admin = User::factory()->admin()->create();
        $publication = Publication::factory()->approved()->create([
            'is_visible' => false,
        ]);

        $this->actingAs($admin)
            ->patch(route('admin.publications.visibility', $publication), [
                'is_visible' => true,
                'from' => 'dashboard',
            ])
            ->assertRedirect(route('admin.dashboard'));
    }
}
