<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('publications', function (Blueprint $table) {
            $table->foreignId('transaction_id')
                ->nullable()
                ->unique()
                ->after('id')
                ->constrained('transactions')
                ->nullOnDelete();
        });

        Schema::table('likes', function (Blueprint $table) {
            $table->foreignId('transaction_id')
                ->nullable()
                ->unique()
                ->after('id')
                ->constrained('transactions')
                ->nullOnDelete();
        });

        Schema::table('comments', function (Blueprint $table) {
            $table->foreignId('transaction_id')
                ->nullable()
                ->unique()
                ->after('id')
                ->constrained('transactions')
                ->nullOnDelete();
        });

        Schema::table('publication_reports', function (Blueprint $table) {
            $table->foreignId('transaction_id')
                ->nullable()
                ->unique()
                ->after('id')
                ->constrained('transactions')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('publication_reports', function (Blueprint $table) {
            $table->dropConstrainedForeignId('transaction_id');
        });

        Schema::table('comments', function (Blueprint $table) {
            $table->dropConstrainedForeignId('transaction_id');
        });

        Schema::table('likes', function (Blueprint $table) {
            $table->dropConstrainedForeignId('transaction_id');
        });

        Schema::table('publications', function (Blueprint $table) {
            $table->dropConstrainedForeignId('transaction_id');
        });
    }
};
