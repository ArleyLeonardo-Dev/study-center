<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('publications', function (Blueprint $table) {
            $table->renameColumn('file_path', 'file_url');
        });

        Schema::table('publications', function (Blueprint $table) {
            $table->string('storage_disk')->default('s3')->after('file_url');
            $table->string('storage_key')->nullable()->after('storage_disk');
            $table->boolean('is_visible')->default(true)->after('status');

            $table->string('file_original_name')->nullable()->change();
            $table->string('file_type')->nullable()->change();
            $table->unsignedBigInteger('file_size')->nullable()->change();
            $table->string('file_url')->nullable()->change();

            $table->index('title');
            $table->index('is_visible');
        });
    }

    public function down(): void
    {
        Schema::table('publications', function (Blueprint $table) {
            $table->dropIndex(['title']);
            $table->dropIndex(['is_visible']);

            $table->string('file_original_name')->nullable(false)->change();
            $table->string('file_type')->nullable(false)->change();
            $table->unsignedBigInteger('file_size')->nullable(false)->change();
            $table->string('file_url')->nullable(false)->change();

            $table->dropColumn(['storage_disk', 'storage_key', 'is_visible']);
        });

        Schema::table('publications', function (Blueprint $table) {
            $table->renameColumn('file_url', 'file_path');
        });
    }
};
