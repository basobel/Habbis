<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('pet'));
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'min:1', 'max:20'],
            'species' => ['sometimes', 'string', 'in:dragon,phoenix,wolf,cat,dog,rabbit,bear'],
            'attack' => ['nullable', 'integer', 'min:1', 'max:100'],
            'defense' => ['nullable', 'integer', 'min:1', 'max:100'],
            'speed' => ['nullable', 'integer', 'min:1', 'max:100'],
            'health' => ['nullable', 'integer', 'min:1', 'max:1000'],
            'max_health' => ['nullable', 'integer', 'min:1', 'max:1000'],
            'customization' => ['nullable', 'array'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'species.in' => 'Pet species must be one of: dragon, phoenix, wolf, cat, dog, rabbit, bear.',
        ];
    }
}
