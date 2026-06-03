<?php

namespace Tests\Feature;

use App\Models\Publication;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class SearchPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_access_search_page(): void
    {
        $student = User::factory()->student()->create();
        Publication::factory()->approved()->create();

        $this->actingAs($student)
            ->get(route('search.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Search/Index')
                ->has('publications.data', 1)
            );
    }
}
