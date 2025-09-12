<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class CreateHabitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:1', 'max:100'],
            'description' => ['nullable', 'string', 'max:500'],
            'difficulty' => ['required', 'string', 'in:easy,medium,hard,expert'],
            'target_frequency' => ['nullable', 'integer', 'min:1', 'max:10'],
            'target_days' => ['nullable', 'array', 'min:1', 'max:7'],
            'target_days.*' => ['integer', 'min:1', 'max:7'],
            'premium_currency_reward' => ['nullable', 'integer', 'min:0', 'max:100'],
            'reminder_times' => ['nullable', 'array', 'max:5'],
            'reminder_times.*' => ['string', 'regex:/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/'],
            'color' => ['nullable', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'icon' => ['nullable', 'string', 'max:50'],
        ];
    }

    public function messages(): array
    {
        return [
            'target_days.*.integer' => 'Each target day must be a number between 1-7 (1=Monday, 7=Sunday).',
            'reminder_times.*.regex' => 'Reminder times must be in HH:MM format (24-hour).',
            'color.regex' => 'Color must be a valid hex color code (e.g., #FF5733).',
        ];
    }
}
