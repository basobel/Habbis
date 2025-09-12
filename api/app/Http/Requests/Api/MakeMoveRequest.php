<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class MakeMoveRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('battle'));
    }

    public function rules(): array
    {
        return [
            'action' => ['required', 'string', 'in:attack,defend,special'],
            'target' => ['nullable', 'integer', 'exists:pets,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'action.in' => 'Action must be one of: attack, defend, special.',
            'target.exists' => 'Target pet not found.',
        ];
    }
}
