<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('subjects', function (Blueprint $table) {
            $table->foreignId('career_id')
                ->nullable()
                ->after('id')
                ->constrained('careers')
                ->nullOnDelete();
        });

        Schema::table('publications', function (Blueprint $table) {
            $table->foreignId('career_id')
                ->nullable()
                ->after('professor_id')
                ->constrained('careers')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('publications', function (Blueprint $table) {
            $table->dropConstrainedForeignId('career_id');
        });

        Schema::table('subjects', function (Blueprint $table) {
            $table->dropConstrainedForeignId('career_id');
        });
    }
};
