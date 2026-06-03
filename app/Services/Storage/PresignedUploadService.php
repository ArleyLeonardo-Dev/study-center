<?php

namespace App\Services\Storage;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PresignedUploadService
{
    /**
     * @return array{upload_url: string, storage_key: string, file_url: string, storage_disk: string}
     */
    public function createPresignedPutUrl(
        int $userId,
        string $originalFilename,
        string $contentType,
        ?string $disk = null,
        int $expiresMinutes = 15,
    ): array {
        $disk = $disk ?? config('filesystems.default', 's3');
        $extension = pathinfo($originalFilename, PATHINFO_EXTENSION);
        $storageKey = sprintf(
            'publications/%d/%s.%s',
            $userId,
            Str::uuid(),
            $extension !== '' ? $extension : 'bin',
        );

        $filesystem = Storage::disk($disk);

        if (! method_exists($filesystem, 'temporaryUploadUrl')) {
            throw new \RuntimeException("Disk [{$disk}] does not support presigned upload URLs.");
        }

        $uploadUrl = $filesystem->temporaryUploadUrl(
            $storageKey,
            now()->addMinutes($expiresMinutes),
            ['ContentType' => $contentType],
        );

        return [
            'upload_url' => is_array($uploadUrl) ? ($uploadUrl['url'] ?? '') : $uploadUrl,
            'storage_key' => $storageKey,
            'file_url' => $filesystem->url($storageKey),
            'storage_disk' => $disk,
        ];
    }
}
