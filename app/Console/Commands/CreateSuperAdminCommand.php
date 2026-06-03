<?php

namespace App\Console\Commands;

use App\Contracts\Repositories\UserRepositoryInterface;
use App\Enums\UserRole;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

#[Signature('user:create-super-admin {email} {name} {--password=}')]
#[Description('Create or update a super admin user')]
class CreateSuperAdminCommand extends Command
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository,
    ) {
        parent::__construct();
    }

    public function handle(): int
    {
        $email = $this->argument('email');
        $name = $this->argument('name');
        $password = $this->option('password') ?: Str::password(16);

        $validator = Validator::make([
            'email' => $email,
            'name' => $name,
            'password' => $password,
        ], [
            'email' => ['required', 'email'],
            'name' => ['required', 'string', 'max:255'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $error) {
                $this->error($error);
            }

            return self::FAILURE;
        }

        $existing = $this->userRepository->findByEmail($email);

        if ($existing !== null) {
            $user = $this->userRepository->update($existing, [
                'name' => $name,
                'password' => Hash::make($password),
                'role' => UserRole::SuperAdmin,
                'is_active' => true,
            ]);

            $this->info("Super admin updated: {$user->email}");
        } else {
            $user = $this->userRepository->create([
                'name' => $name,
                'email' => $email,
                'password' => Hash::make($password),
                'role' => UserRole::SuperAdmin,
                'is_active' => true,
            ]);

            $this->info("Super admin created: {$user->email}");
        }

        $this->line("Password: {$password}");

        return self::SUCCESS;
    }
}
