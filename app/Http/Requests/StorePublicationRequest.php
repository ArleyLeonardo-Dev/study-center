<?php

namespace App\Http\Requests;

use App\Models\Publication;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StorePublicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Publication::class) ?? false;
    }

    protected function prepareForValidation(): void
    {
        if ($this->input('professor_id') === '' || $this->input('professor_id') === '0') {
            $this->merge(['professor_id' => null]);
        }
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'subject_id' => ['required', 'integer', 'exists:subjects,id'],
            'professor_id' => ['nullable', 'integer', 'exists:professors,id'],
            'career_id' => ['required', 'integer', 'exists:careers,id'],
            'semester' => ['required', 'integer', 'min:1', 'max:10'],
        ];

        if ($this->usesAws()) {
            $rules['storage_key'] = ['required', 'string', 'max:500'];
            $rules['file_url'] = ['required', 'string', 'url', 'max:2048'];
            $rules['file_original_name'] = ['required', 'string', 'max:255'];
            $rules['file_type'] = ['required', 'string', 'max:100'];
            $rules['file_size'] = ['required', 'integer', 'min:1'];
        } else {
            $rules['file'] = [
                'required',
                'file',
                'mimes:pdf',
                'max:'.config('publications.max_file_size_kb'),
            ];
        }

        return $rules;
    }

    private function usesAws(): bool
    {
        return (bool) config('publications.aws_enabled');
    }
}
