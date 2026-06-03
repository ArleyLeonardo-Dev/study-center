<?php

namespace Tests\Feature;

use App\Enums\PublicationStatus;
use App\Models\Career;
use App\Models\Professor;
use App\Models\Publication;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class PublicationWorkflowTest extends TestCase
{
    use RefreshDatabase;

    public function test_student_creates_pending_publication_and_admin_approves_it(): void
    {
        config(['publications.aws_enabled' => true]);

        $student = User::factory()->student()->create();
        $admin = User::factory()->admin()->create();
        $career = Career::factory()->create();
        $subject = Subject::factory()->create(['career_id' => $career->id]);
        $professor = Professor::factory()->create();

        $payload = [
            'title' => 'Apuntes de Álgebra',
            'description' => 'Resumen del parcial 1',
            'subject_id' => $subject->id,
            'professor_id' => $professor->id,
            'career_id' => $career->id,
            'semester' => 3,
            'storage_key' => 'uploads/apuntes.pdf',
            'file_url' => 'https://storage.example.com/apuntes.pdf',
            'file_original_name' => 'apuntes.pdf',
            'file_type' => 'application/pdf',
            'file_size' => 2048,
        ];

        $this->actingAs($student)
            ->post(route('publications.store'), $payload, [
                'Idempotency-Key' => (string) Str::uuid(),
            ])
            ->assertRedirect(route('home'));

        $publication = Publication::query()->first();

        $this->assertNotNull($publication);
        $this->assertSame(PublicationStatus::Pending, $publication->status);
        $this->assertSame($student->id, $publication->user_id);

        $this->actingAs($admin)
            ->from(route('admin.publications.show', $publication))
            ->patch(route('admin.publications.approve', $publication))
            ->assertRedirect(route('admin.publications.pending'));

        $publication->refresh();

        $this->assertSame(PublicationStatus::Approved, $publication->status);
        $this->assertSame($admin->id, $publication->reviewed_by);
        $this->assertNotNull($publication->reviewed_at);
    }
}
