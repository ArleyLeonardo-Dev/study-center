<?php

namespace App\Enums;

enum TransactionStatus: int
{
    case Pending = 0;
    case Completed = 1;
    case Failed = 2;
}
