<?php

namespace App\Http\Requests;

use App\Enums\ReportStatus;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ResolveReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        $report = $this->route('report');

        return $report !== null
            && $this->user()?->can('resolve', $report) === true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'status' => [
                'required',
                'integer',
                Rule::in([
                    ReportStatus::ResolvedDismissed->value,
                    ReportStatus::ResolvedHidden->value,
                ]),
            ],
            'admin_notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
