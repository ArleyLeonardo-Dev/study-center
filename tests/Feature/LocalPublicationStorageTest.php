<?php

namespace Tests\Feature;

use App\Enums\PublicationStatus;
use App\Models\Career;
use App\Models\Professor;
use App\Models\Publication;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Tests\TestCase;

class LocalPublicationStorageTest extends TestCase
{
    use RefreshDatabase;

    public function test_student_can_upload_publication_to_local_storage_when_aws_is_disabled(): void
    {
        config(['publications.aws_enabled' => false]);

        Storage::fake('public');

        $student = User::factory()->student()->create();
        $career = Career::factory()->create();
        $subject = Subject::factory()->create(['career_id' => $career->id]);
        $professor = Professor::factory()->create();

        $file = UploadedFile::fake()->create('parcial.pdf', 512, 'application/pdf');

        $this->actingAs($student)
            ->post(route('publications.store'), [
                'title' => 'Parcial local',
                'description' => 'Subido al storage local',
                'subject_id' => $subject->id,
                'professor_id' => $professor->id,
                'career_id' => $career->id,
                'semester' => 2,
                'file' => $file,
            ], [
                'Idempotency-Key' => (string) Str::uuid(),
            ])
            ->assertRedirect(route('home'));

        $publication = Publication::query()->first();

        $this->assertNotNull($publication);
        $this->assertSame(PublicationStatus::Pending, $publication->status);
        $this->assertSame('public', $publication->storage_disk);
        $this->assertStringStartsWith('publications/'.$student->id.'/', $publication->storage_key);
        Storage::disk('public')->assertExists($publication->storage_key);
    }

    public function test_student_can_create_publication_without_professor(): void
    {
        config(['publications.aws_enabled' => true]);

        $student = User::factory()->student()->create();
        $career = Career::factory()->create();
        $subject = Subject::factory()->create(['career_id' => $career->id]);

        $this->actingAs($student)
            ->post(route('publications.store'), [
                'title' => 'Parcial sin profesor',
                'description' => 'Material anónimo',
                'subject_id' => $subject->id,
                'professor_id' => null,
                'career_id' => $career->id,
                'semester' => 4,
                'storage_key' => 'uploads/sin-profe.pdf',
                'file_url' => 'https://storage.example.com/sin-profe.pdf',
                'file_original_name' => 'sin-profe.pdf',
                'file_type' => 'application/pdf',
                'file_size' => 1024,
            ], [
                'Idempotency-Key' => (string) Str::uuid(),
            ])
            ->assertRedirect(route('home'));

        $publication = Publication::query()->first();

        $this->assertNotNull($publication);
        $this->assertNull($publication->professor_id);
    }

    public function test_presigned_url_is_rejected_when_aws_is_disabled(): void
    {
        config(['publications.aws_enabled' => false]);

        $student = User::factory()->student()->create();

        $this->actingAs($student)
            ->postJson(route('publications.presigned-url'), [
                'file_name' => 'parcial.pdf',
                'content_type' => 'application/pdf',
            ], [
                'Idempotency-Key' => (string) Str::uuid(),
            ])
            ->assertUnprocessable();
    }
}
