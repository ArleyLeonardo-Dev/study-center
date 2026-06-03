<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('publication_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('publication_id')->constrained('publications')->cascadeOnDelete();
            $table->foreignId('reporter_id')->constrained('users')->cascadeOnDelete();
            $table->text('reason');
            $table->unsignedTinyInteger('status')->default(0);
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->text('admin_notes')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('publication_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('publication_reports');
    }
};
