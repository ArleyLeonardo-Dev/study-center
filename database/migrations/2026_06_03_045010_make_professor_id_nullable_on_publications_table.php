<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('publications', function (Blueprint $table) {
            $table->dropForeign(['professor_id']);
        });

        Schema::table('publications', function (Blueprint $table) {
            $table->unsignedBigInteger('professor_id')->nullable()->change();

            $table->foreign('professor_id')
                ->references('id')
                ->on('professors')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('publications', function (Blueprint $table) {
            $table->dropForeign(['professor_id']);
        });

        Schema::table('publications', function (Blueprint $table) {
            $table->unsignedBigInteger('professor_id')->nullable(false)->change();

            $table->foreign('professor_id')
                ->references('id')
                ->on('professors')
                ->restrictOnDelete();
        });
    }
};
