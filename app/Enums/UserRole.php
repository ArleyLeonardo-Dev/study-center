<?php

namespace App\Enums;

enum UserRole: int
{
    case Student = 1;
    case Master = 2;
    case SuperAdmin = 3;
    case Admin = 4;

    public function label(): string
    {
        return match ($this) {
            self::Student => 'Estudiante',
            self::Master => 'Maestro',
            self::SuperAdmin => 'Super Admin',
            self::Admin => 'Admin',
        };
    }

    public function isAdminPanel(): bool
    {
        return in_array($this, [self::Admin, self::SuperAdmin], true);
    }

    public function isSuperAdmin(): bool
    {
        return $this === self::SuperAdmin;
    }

    public function canReportPublications(): bool
    {
        return in_array($this, [self::Master, self::Admin, self::SuperAdmin], true);
    }
}
