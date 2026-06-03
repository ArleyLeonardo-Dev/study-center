<?php

namespace Tests\Feature;

use App\Models\Career;
use App\Models\Professor;
use App\Models\Publication;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class IdempotencyTest extends TestCase
{
    use RefreshDatabase;

    public function test_duplicate_post_with_same_idempotency_key_does_not_create_duplicate_publication(): void
    {
        config(['publications.aws_enabled' => true]);

        $student = User::factory()->student()->create();
        $career = Career::factory()->create();
        $subject = Subject::factory()->create(['career_id' => $career->id]);
        $professor = Professor::factory()->create();

        $payload = [
            'title' => 'Guía de Estudio',
            'description' => 'Material compartido',
            'subject_id' => $subject->id,
            'professor_id' => $professor->id,
            'career_id' => $career->id,
            'semester' => 2,
            'storage_key' => 'uploads/guia.pdf',
            'file_url' => 'https://storage.example.com/guia.pdf',
            'file_original_name' => 'guia.pdf',
            'file_type' => 'application/pdf',
            'file_size' => 4096,
        ];

        $idempotencyKey = (string) Str::uuid();
        $headers = ['Idempotency-Key' => $idempotencyKey];

        $this->actingAs($student)
            ->post(route('publications.store'), $payload, $headers)
            ->assertRedirect(route('home'));

        $this->actingAs($student)
            ->post(route('publications.store'), $payload, $headers)
            ->assertRedirect(route('home'));

        $this->assertSame(1, Publication::query()->count());
    }

    public function test_request_without_idempotency_key_is_rejected(): void
    {
        $student = User::factory()->student()->create();

        $this->actingAs($student)
            ->post(route('publications.store'), [
                'title' => 'Sin clave',
            ])
            ->assertStatus(400);
    }
}
