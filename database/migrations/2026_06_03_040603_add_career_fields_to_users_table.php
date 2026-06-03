<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('users', 'career_id')) {
            Schema::table('users', function (Blueprint $table) {
                $table->foreignId('career_id')
                    ->nullable()
                    ->after('role')
                    ->constrained('careers')
                    ->nullOnDelete();
            });
        } else {
            Schema::table('users', function (Blueprint $table) {
                $table->foreign('career_id')
                    ->references('id')
                    ->on('careers')
                    ->nullOnDelete();
            });
        }

        if (! Schema::hasColumn('users', 'current_semester')) {
            Schema::table('users', function (Blueprint $table) {
                $table->unsignedTinyInteger('current_semester')
                    ->nullable()
                    ->after('career_id');
            });
        }
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'career_id')) {
                $table->dropForeign(['career_id']);
                $table->dropColumn('career_id');
            }

            if (Schema::hasColumn('users', 'current_semester')) {
                $table->dropColumn('current_semester');
            }
        });
    }
};
