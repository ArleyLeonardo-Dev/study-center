<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('publication_id')
                ->constrained('publications')
                ->cascadeOnDelete();

            // Soporte para respuestas anidadas
            $table->foreignId('parent_id')
                ->nullable()
                ->constrained('comments')
                ->cascadeOnDelete();

            $table->text('body');
            $table->boolean('is_visible')->default(true);
            // Permite moderar sin eliminar

            $table->timestamps();
            $table->softDeletes();

            $table->index('publication_id');
            $table->index('parent_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
