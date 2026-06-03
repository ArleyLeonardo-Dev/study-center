<?php

namespace Tests\Feature;

use App\Models\Like;
use App\Models\Publication;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PublicationShowTest extends TestCase
{
    use RefreshDatabase;

    public function test_student_can_view_approved_publication_detail_page(): void
    {
        $student = User::factory()->student()->create();
        $publication = Publication::factory()->approved()->create();

        $this->actingAs($student)
            ->get(route('publications.show', $publication))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Publications/Show')
                ->where('publication.id', $publication->id)
                ->where('can.approve', false)
                ->where('can.reject', false)
                ->where('can.toggleVisibility', false)
                ->where('can.report', false)
            );
    }

    public function test_publication_show_includes_like_state_for_authenticated_user(): void
    {
        $student = User::factory()->student()->create();
        $publication = Publication::factory()->approved()->create();

        Like::query()->create([
            'user_id' => $student->id,
            'publication_id' => $publication->id,
        ]);

        $this->actingAs($student)
            ->get(route('publications.show', $publication))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Publications/Show')
                ->where('publication.id', $publication->id)
                ->where('publication.likes_count', 1)
                ->where('publication.is_liked', true)
            );
    }

    public function test_home_feed_includes_like_state_for_authenticated_user(): void
    {
        $student = User::factory()->student()->create();
        $publication = Publication::factory()->approved()->create();

        Like::query()->create([
            'user_id' => $student->id,
            'publication_id' => $publication->id,
        ]);

        $this->actingAs($student)
            ->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Home/Index')
                ->where('publications.data.0.likes_count', 1)
                ->where('publications.data.0.is_liked', true)
            );
    }

    public function test_home_feed_links_to_publication_detail(): void
    {
        $student = User::factory()->student()->create();
        $publication = Publication::factory()->approved()->create();

        $this->actingAs($student)
            ->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Home/Index')
                ->has('publications.data', 1)
                ->where('publications.data.0.id', $publication->id)
            );
    }

    public function test_admin_can_view_publication_with_moderation_abilities(): void
    {
        $admin = User::factory()->admin()->create();
        $publication = Publication::factory()->pending()->create();

        $this->actingAs($admin)
            ->get(route('publications.show', $publication))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Publications/Show')
                ->where('publication.id', $publication->id)
                ->where('can.approve', true)
                ->where('can.reject', true)
                ->where('can.toggleVisibility', true)
            );
    }

    public function test_publication_show_back_navigation_from_reports_for_admin(): void
    {
        $admin = User::factory()->admin()->create();
        $publication = Publication::factory()->approved()->create();

        $this->actingAs($admin)
            ->get(route('publications.show', [
                'publication' => $publication,
                'from' => 'reports',
            ]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Publications/Show')
                ->where('back.label', 'Reportadas')
                ->where('back.activeNav', 'publications')
            );
    }

    public function test_publication_show_back_navigation_from_pending_for_admin(): void
    {
        $admin = User::factory()->admin()->create();
        $publication = Publication::factory()->pending()->create();

        $this->actingAs($admin)
            ->get(route('publications.show', [
                'publication' => $publication,
                'from' => 'pending',
            ]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Publications/Show')
                ->where('back.label', 'Pendientes')
            );
    }

    public function test_publication_show_defaults_back_navigation_to_home_for_student(): void
    {
        $student = User::factory()->student()->create();
        $publication = Publication::factory()->approved()->create();

        $this->actingAs($student)
            ->get(route('publications.show', $publication))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Publications/Show')
                ->where('back.label', 'Inicio')
                ->where('back.activeNav', 'feed')
            );
    }
}
