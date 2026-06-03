<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class UnicesarEmail implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value) || ! str_ends_with(strtolower($value), '@unicesar.edu.co')) {
            $fail('El correo debe ser institucional (@unicesar.edu.co).');
        }
    }
}
