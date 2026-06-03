<?php

namespace App\Services\Storage;

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PublicationStorageService
{
    public function __construct(
        private readonly PresignedUploadService $presignedUploadService,
    ) {}

    public function usesAws(): bool
    {
        return (bool) config('publications.aws_enabled');
    }

    /**
     * @return array{upload_url: string, storage_key: string, file_url: string, storage_disk: string}
     */
    public function createPresignedUpload(User $user, string $originalFilename, string $contentType): array
    {
        if (! $this->usesAws()) {
            throw new \RuntimeException('AWS storage is not enabled.');
        }

        return $this->presignedUploadService->createPresignedPutUrl(
            $user->id,
            $originalFilename,
            $contentType,
            's3',
        );
    }

    /**
     * @return array{
     *     storage_key: string,
     *     file_url: string,
     *     storage_disk: string,
     *     file_original_name: string,
     *     file_type: string,
     *     file_size: int
     * }
     */
    public function storeLocalUpload(UploadedFile $file, User $user): array
    {
        $disk = (string) config('publications.local_disk', 'public');
        $directory = (string) config('publications.local_directory', 'publications');
        $extension = $file->getClientOriginalExtension() ?: 'pdf';
        $storageKey = sprintf(
            '%s/%d/%s.%s',
            $directory,
            $user->id,
            Str::uuid(),
            $extension,
        );

        Storage::disk($disk)->putFileAs(
            dirname($storageKey),
            $file,
            basename($storageKey),
        );

        return [
            'storage_key' => $storageKey,
            'file_url' => Storage::disk($disk)->url($storageKey),
            'storage_disk' => $disk,
            'file_original_name' => $file->getClientOriginalName(),
            'file_type' => $file->getMimeType() ?? 'application/pdf',
            'file_size' => $file->getSize(),
        ];
    }
}
