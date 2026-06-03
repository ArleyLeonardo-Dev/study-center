<?php

namespace App\Http\Requests\Auth;

use App\Models\User;
use App\Rules\UnicesarEmail;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                'unique:'.User::class,
                new UnicesarEmail,
            ],
            'career_id' => ['nullable', 'integer', 'exists:careers,id'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'email.unique' => 'Este correo ya está registrado.',
        ];
    }
}
