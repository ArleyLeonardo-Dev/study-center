<?php

namespace App\Providers;

use App\Models\Comment;
use App\Models\Publication;
use App\Models\PublicationReport;
use App\Models\User;
use App\Policies\CommentPolicy;
use App\Policies\PublicationPolicy;
use App\Policies\PublicationReportPolicy;
use App\Policies\UserPolicy;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        Gate::policy(Publication::class, PublicationPolicy::class);
        Gate::policy(User::class, UserPolicy::class);
        Gate::policy(Comment::class, CommentPolicy::class);
        Gate::policy(PublicationReport::class, PublicationReportPolicy::class);

        RateLimiter::for('auth', function (Request $request) {
            return Limit::perMinute(10)->by($request->ip());
        });

        RateLimiter::for('publication-create', function (Request $request) {
            return Limit::perHour(10)->by($request->user()?->id ?: $request->ip());
        });

        RateLimiter::for('presigned-url', function (Request $request) {
            return Limit::perHour(20)->by($request->user()?->id ?: $request->ip());
        });

        RateLimiter::for('like', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        RateLimiter::for('comment', function (Request $request) {
            return Limit::perMinute(30)->by($request->user()?->id ?: $request->ip());
        });

        RateLimiter::for('report', function (Request $request) {
            return Limit::perHour(10)->by($request->user()?->id ?: $request->ip());
        });

        RateLimiter::for('write-global', function (Request $request) {
            return Limit::perMinute(120)->by($request->ip());
        });
    }
}
