<?php

namespace App\Http\Requests;

use App\Enums\UserRole;
use App\Models\User;
use App\Rules\UnicesarEmail;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $emailRules = [
            'required',
            'string',
            'lowercase',
            'email',
            'max:255',
            Rule::unique(User::class)->ignore($this->user()?->id),
        ];

        if ($this->userIsStudent()) {
            $emailRules[] = new UnicesarEmail;
        }

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => $emailRules,
            'career_id' => ['nullable', 'integer', 'exists:careers,id'],
            'current_semester' => ['nullable', 'integer', 'min:1', 'max:10'],
            'subject_ids' => ['nullable', 'array'],
            'subject_ids.*' => ['integer', 'exists:subjects,id'],
            'professor_ids' => ['nullable', 'array'],
            'professor_ids.*' => ['integer', 'exists:professors,id'],
        ];
    }

    private function userIsStudent(): bool
    {
        $role = $this->user()?->role;

        if ($role instanceof UserRole) {
            return $role === UserRole::Student;
        }

        return UserRole::tryFrom((int) $role) === UserRole::Student;
    }
}
