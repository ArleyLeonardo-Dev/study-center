<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class SearchPublicationRequest extends FormRequest
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
        return [
            'q' => ['nullable', 'string', 'max:255'],
            'career_id' => ['nullable', 'integer', 'exists:careers,id'],
            'subject_id' => ['nullable', 'integer', 'exists:subjects,id'],
            'semester' => ['nullable', 'integer', 'min:1', 'max:10'],
            'professor_id' => ['nullable', 'integer', 'exists:professors,id'],
            'page' => ['nullable', 'integer', 'min:1'],
        ];
    }
}
