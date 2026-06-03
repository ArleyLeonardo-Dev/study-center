<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class RejectPublicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        $publication = $this->route('publication');

        return $publication !== null
            && $this->user()?->can('reject', $publication) === true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'rejection_reason' => ['required', 'string', 'min:10', 'max:2000'],
        ];
    }
}
