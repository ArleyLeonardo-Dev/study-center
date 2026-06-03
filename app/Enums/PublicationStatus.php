<?php

namespace App\Enums;

enum PublicationStatus: int
{
    case Pending = 0;
    case Approved = 1;
    case Rejected = 2;

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Pendiente',
            self::Approved => 'Aprobada',
            self::Rejected => 'Rechazada',
        };
    }
}
