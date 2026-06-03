<?php

namespace App\Enums;

enum ReportStatus: int
{
    case Pending = 0;
    case ResolvedDismissed = 1;
    case ResolvedHidden = 2;

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Pendiente',
            self::ResolvedDismissed => 'Desestimado',
            self::ResolvedHidden => 'Oculto',
        };
    }
}
