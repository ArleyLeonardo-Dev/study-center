<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\PublicationModerationController;
use App\Http\Controllers\Admin\ReportModerationController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicationController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\SuperAdmin\AuditLogController;
use App\Http\Controllers\SuperAdmin\DashboardController as SuperAdminDashboardController;
use App\Http\Controllers\SuperAdmin\PublicationManagementController;
use App\Http\Controllers\SuperAdmin\UserManagementController;
use App\Http\Controllers\UserProfileController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/', [HomeController::class, 'index'])->name('home');

    Route::get('/search', [SearchController::class, 'index'])->name('search.index');

    Route::get('/favorites', [FavoriteController::class, 'index'])->name('favorites.index');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile', [ProfileController::class, 'update'])
        ->middleware('throttle:write-global')
        ->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])
        ->middleware('throttle:write-global')
        ->name('profile.destroy');

    Route::get('/users/{user}', [UserProfileController::class, 'show'])->name('users.show');

    Route::middleware('role:student')->group(function () {
        Route::get('/publications/create', [PublicationController::class, 'create'])->name('publications.create');

        Route::post('/publications/presigned-url', [PublicationController::class, 'presignedUrl'])
            ->middleware(['throttle:presigned-url', 'idempotency', 'throttle:write-global'])
            ->name('publications.presigned-url');

        Route::post('/publications', [PublicationController::class, 'store'])
            ->middleware(['throttle:publication-create', 'idempotency', 'throttle:write-global'])
            ->name('publications.store');
    });

    Route::get('/publications/{publication}', [PublicationController::class, 'show'])->name('publications.show');

    Route::post('/publications/{publication}/like', [LikeController::class, 'store'])
        ->middleware(['throttle:like', 'idempotency', 'throttle:write-global'])
        ->name('publications.like');

    Route::post('/publications/{publication}/favorite', [FavoriteController::class, 'store'])
        ->middleware(['throttle:like', 'idempotency', 'throttle:write-global'])
        ->name('publications.favorite');

    Route::delete('/publications/{publication}/like', [LikeController::class, 'destroy'])
        ->middleware(['throttle:like', 'throttle:write-global'])
        ->name('publications.unlike');

    Route::post('/publications/{publication}/comments', [CommentController::class, 'store'])
        ->middleware(['throttle:comment', 'idempotency', 'throttle:write-global'])
        ->name('publications.comments.store');

    Route::middleware('role:master,admin,super_admin')->group(function () {
        Route::post('/publications/{publication}/report', [ReportController::class, 'store'])
            ->middleware(['throttle:report', 'idempotency', 'throttle:write-global'])
            ->name('publications.report');
    });

    Route::middleware('role:admin,super_admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');

        Route::get('/publications/pending', [PublicationModerationController::class, 'pending'])
            ->name('publications.pending');

        Route::get('/publications/{publication}', [PublicationModerationController::class, 'show'])
            ->name('publications.show');

        Route::patch('/publications/{publication}/approve', [PublicationModerationController::class, 'approve'])
            ->middleware('throttle:write-global')
            ->name('publications.approve');

        Route::patch('/publications/{publication}/reject', [PublicationModerationController::class, 'reject'])
            ->middleware('throttle:write-global')
            ->name('publications.reject');

        Route::patch('/publications/{publication}/visibility', [PublicationModerationController::class, 'visibility'])
            ->middleware('throttle:write-global')
            ->name('publications.visibility');

        Route::get('/reports', [ReportModerationController::class, 'index'])->name('reports.index');

        Route::patch('/reports/{report}/resolve', [ReportModerationController::class, 'resolve'])
            ->middleware(['idempotency', 'throttle:write-global'])
            ->name('reports.resolve');
    });

    Route::middleware('role:super_admin')->prefix('super-admin')->name('super-admin.')->group(function () {
        Route::get('/', [SuperAdminDashboardController::class, 'index'])->name('dashboard');

        Route::get('/users', [UserManagementController::class, 'index'])->name('users.index');

        Route::patch('/users/{user}/role', [UserManagementController::class, 'updateRole'])
            ->middleware('throttle:write-global')
            ->name('users.role.update');

        Route::get('/audit-logs', [AuditLogController::class, 'index'])->name('audit-logs.index');

        Route::get('/publications', [PublicationManagementController::class, 'index'])->name('publications.index');
    });
});

require __DIR__.'/auth.php';
