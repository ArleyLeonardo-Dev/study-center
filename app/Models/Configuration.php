<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Configuration extends Model
{
    protected $fillable = [
        'name',
        'value',
        'description',
    ];

    public static function getValue(string $name, ?string $default = null): ?string
    {
        return static::query()->where('name', $name)->value('value') ?? $default;
    }

    public static function setValue(string $name, string $value, ?string $description = null): self
    {
        return static::query()->updateOrCreate(
            ['name' => $name],
            array_filter([
                'value' => $value,
                'description' => $description,
            ], fn (?string $v): bool => $v !== null),
        );
    }
}
