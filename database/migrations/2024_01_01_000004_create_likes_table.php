<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('likes', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('publication_id')
                ->constrained('publications')
                ->cascadeOnDelete();

            $table->timestamp('created_at')->useCurrent();

            // Un usuario solo puede dar like una vez por publicación
            $table->unique(['user_id', 'publication_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('likes');
    }
};
