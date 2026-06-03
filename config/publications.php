<?php

return [

    /*
    |--------------------------------------------------------------------------
    | AWS Storage
    |--------------------------------------------------------------------------
    |
    | When enabled, publication files are uploaded directly to S3 via
    | presigned URLs. When disabled, files are stored on the local disk
    | configured below and the path is saved in the database.
    |
    */

    'aws_enabled' => filter_var(env('AWS_ENABLED', false), FILTER_VALIDATE_BOOLEAN),

    'local_disk' => env('PUBLICATIONS_LOCAL_DISK', 'public'),

    'local_directory' => 'publications',

    'max_file_size_kb' => (int) env('PUBLICATIONS_MAX_FILE_SIZE_KB', 10240),

];
