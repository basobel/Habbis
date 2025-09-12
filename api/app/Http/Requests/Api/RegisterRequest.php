<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'username' => ['required', 'string', 'min:3', 'max:20', 'unique:users,username', 'alpha_dash'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::min(8)->mixedCase()->numbers()->symbols()],
            'timezone' => ['nullable', 'string', 'timezone'],
            'pet_name' => ['nullable', 'string', 'min:1', 'max:20'],
            'pet_species' => ['nullable', 'string', 'in:dragon,phoenix,wolf,cat,dog,rabbit,bear'],
        ];
    }

    public function messages(): array
    {
        return [
            'username.alpha_dash' => 'Username can only contain letters, numbers, dashes and underscores.',
            'password.mixed_case' => 'Password must contain both uppercase and lowercase letters.',
            'pet_species.in' => 'Pet species must be one of: dragon, phoenix, wolf, cat, dog, rabbit, bear.',
        ];
    }
}
