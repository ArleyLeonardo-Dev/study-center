<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->uuid('idempotency_key');
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('action');
            $table->unsignedTinyInteger('status')->default(0);
            $table->string('request_hash')->nullable();
            $table->string('resource_type')->nullable();
            $table->unsignedBigInteger('resource_id')->nullable();
            $table->json('response')->nullable();
            $table->text('error_message')->nullable();
            $table->timestamp('expires_at');
            $table->timestamps();

            $table->unique(['user_id', 'idempotency_key']);
            $table->index(['status', 'expires_at']);
            $table->index(['resource_type', 'resource_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
