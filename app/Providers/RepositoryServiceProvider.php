<?php

namespace App\Providers;

use App\Contracts\Repositories\CareerRepositoryInterface;
use App\Contracts\Repositories\ProfessorRepositoryInterface;
use App\Contracts\Repositories\PublicationRepositoryInterface;
use App\Contracts\Repositories\SubjectRepositoryInterface;
use App\Contracts\Repositories\TransactionRepositoryInterface;
use App\Contracts\Repositories\UserRepositoryInterface;
use App\Repositories\CareerRepository;
use App\Repositories\ProfessorRepository;
use App\Repositories\PublicationRepository;
use App\Repositories\SubjectRepository;
use App\Repositories\TransactionRepository;
use App\Repositories\UserRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(PublicationRepositoryInterface::class, PublicationRepository::class);
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
        $this->app->bind(TransactionRepositoryInterface::class, TransactionRepository::class);
        $this->app->bind(CareerRepositoryInterface::class, CareerRepository::class);
        $this->app->bind(SubjectRepositoryInterface::class, SubjectRepository::class);
        $this->app->bind(ProfessorRepositoryInterface::class, ProfessorRepository::class);
    }
}
