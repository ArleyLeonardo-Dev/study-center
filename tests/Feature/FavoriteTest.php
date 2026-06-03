<?php

namespace Tests\Feature;

use App\Models\Favorite;
use App\Models\Publication;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class FavoriteTest extends TestCase
{
    use RefreshDatabase;

    public function test_student_can_toggle_favorite_on_approved_publication(): void
    {
        $student = User::factory()->student()->create();
        $publication = Publication::factory()->approved()->create();
        $idempotencyKey = (string) Str::uuid();

        $this->actingAs($student)
            ->post(route('publications.favorite', $publication), [], [
                'Idempotency-Key' => $idempotencyKey,
            ])
            ->assertRedirect()
            ->assertSessionHas('success', 'Parcial agregado a favoritos.');

        $this->assertDatabaseHas('favorites', [
            'user_id' => $student->id,
            'publication_id' => $publication->id,
        ]);

        $this->actingAs($student)
            ->post(route('publications.favorite', $publication), [], [
                'Idempotency-Key' => (string) Str::uuid(),
            ])
            ->assertRedirect()
            ->assertSessionHas('success', 'Parcial removido de favoritos.');

        $this->assertDatabaseMissing('favorites', [
            'user_id' => $student->id,
            'publication_id' => $publication->id,
        ]);
    }

    public function test_duplicate_favorite_request_with_same_idempotency_key_does_not_duplicate_record(): void
    {
        $student = User::factory()->student()->create();
        $publication = Publication::factory()->approved()->create();
        $idempotencyKey = (string) Str::uuid();

        $headers = ['Idempotency-Key' => $idempotencyKey];

        $this->actingAs($student)
            ->post(route('publications.favorite', $publication), [], $headers)
            ->assertRedirect();

        $this->actingAs($student)
            ->post(route('publications.favorite', $publication), [], $headers)
            ->assertRedirect();

        $this->assertSame(
            1,
            Favorite::query()
                ->where('user_id', $student->id)
                ->where('publication_id', $publication->id)
                ->count(),
        );
    }

    public function test_favorites_index_lists_only_current_user_favorites(): void
    {
        $student = User::factory()->student()->create();
        $otherStudent = User::factory()->student()->create();

        $favorited = Publication::factory()->approved()->create(['title' => 'Parcial favorito']);
        $otherFavorite = Publication::factory()->approved()->create(['title' => 'Parcial ajeno']);
        Publication::factory()->approved()->create(['title' => 'Sin favorito']);

        Favorite::query()->create([
            'user_id' => $student->id,
            'publication_id' => $favorited->id,
        ]);

        Favorite::query()->create([
            'user_id' => $otherStudent->id,
            'publication_id' => $otherFavorite->id,
        ]);

        $this->actingAs($student)
            ->get(route('favorites.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Favorites/Index')
                ->has('publications.data', 1)
                ->where('publications.data.0.id', $favorited->id)
                ->where('publications.data.0.title', 'Parcial favorito')
                ->where('publications.data.0.is_favorited', true)
            );
    }

    public function test_hidden_or_unapproved_favorites_are_excluded_from_index(): void
    {
        $student = User::factory()->student()->create();

        $hidden = Publication::factory()->approved()->create([
            'title' => 'Parcial oculto',
            'is_visible' => false,
        ]);
        $pending = Publication::factory()->pending()->create(['title' => 'Parcial pendiente']);
        $visible = Publication::factory()->approved()->create(['title' => 'Parcial visible']);

        foreach ([$hidden, $pending, $visible] as $publication) {
            Favorite::query()->create([
                'user_id' => $student->id,
                'publication_id' => $publication->id,
            ]);
        }

        $this->actingAs($student)
            ->get(route('favorites.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Favorites/Index')
                ->has('publications.data', 1)
                ->where('publications.data.0.id', $visible->id)
            );
    }

    public function test_publication_show_includes_favorite_state_for_authenticated_user(): void
    {
        $student = User::factory()->student()->create();
        $publication = Publication::factory()->approved()->create();

        Favorite::query()->create([
            'user_id' => $student->id,
            'publication_id' => $publication->id,
        ]);

        $this->actingAs($student)
            ->get(route('publications.show', $publication))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Publications/Show')
                ->where('publication.id', $publication->id)
                ->where('publication.is_favorited', true)
            );
    }
}
