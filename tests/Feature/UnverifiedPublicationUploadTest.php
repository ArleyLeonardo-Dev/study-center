<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UnverifiedPublicationUploadTest extends TestCase
{
    use RefreshDatabase;

    public function test_unverified_student_cannot_access_publication_create(): void
    {
        $student = User::factory()->student()->unverified()->create([
            'email' => 'estudiante@unicesar.edu.co',
        ]);

        $this->actingAs($student)
            ->get(route('publications.create'))
            ->assertRedirect(route('verification.notice'));
    }

    public function test_verified_student_can_access_publication_create(): void
    {
        $student = User::factory()->student()->create([
            'email' => 'estudiante@unicesar.edu.co',
        ]);

        $this->actingAs($student)
            ->get(route('publications.create'))
            ->assertOk();
    }
}
