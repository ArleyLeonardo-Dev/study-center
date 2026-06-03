<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class RequireIdempotencyKey
{
    /**
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $key = $request->header('Idempotency-Key');

        if ($key === null || $key === '') {
            return response()->json([
                'message' => 'Idempotency-Key header is required.',
            ], Response::HTTP_BAD_REQUEST);
        }

        if (! Str::isUuid($key)) {
            return response()->json([
                'message' => 'Idempotency-Key must be a valid UUID.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $request->attributes->set('idempotency_key', $key);

        return $next($request);
    }
}
