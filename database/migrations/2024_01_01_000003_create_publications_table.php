<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('publications', function (Blueprint $table) {
            $table->id();

            // Estudiante que sube el archivo
            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            // Metadata académica al momento de la subida
            $table->foreignId('subject_id')
                ->constrained('subjects')
                ->restrictOnDelete();

            $table->foreignId('professor_id')
                ->constrained('professors')
                ->restrictOnDelete();

            $table->tinyInteger('semester');
            // Semestre cursado por el estudiante (1–10)

            // Contenido
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('file_path');
            $table->string('file_original_name');
            $table->string('file_type');
            $table->unsignedBigInteger('file_size');
            // Tamaño en bytes

            // Validación por super_admin
            $table->tinyInteger('status')->default(0);
            // 0 = pending | 1 = approved | 2 = rejected

            $table->foreignId('reviewed_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamp('reviewed_at')->nullable();
            $table->text('rejection_reason')->nullable();

            $table->timestamps();
            $table->softDeletes();

            // Índices para consultas frecuentes
            $table->index('status');
            $table->index('user_id');
            $table->index(['subject_id', 'semester']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('publications');
    }
};
