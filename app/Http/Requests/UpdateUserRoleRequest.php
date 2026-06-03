<?php

namespace App\Http\Requests;

use App\Enums\UserRole;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->route('user');

        return $user !== null
            && $this->user()?->can('updateRole', $user) === true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'role' => [
                'required',
                'integer',
                Rule::in(array_column(UserRole::cases(), 'value')),
            ],
        ];
    }
}
