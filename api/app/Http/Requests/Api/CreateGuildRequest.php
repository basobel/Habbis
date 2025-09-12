<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class CreateGuildRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:3', 'max:50', 'unique:guilds,name'],
            'tag' => ['required', 'string', 'min:2', 'max:10', 'unique:guilds,tag', 'alpha'],
            'description' => ['nullable', 'string', 'max:500'],
            'is_public' => ['nullable', 'boolean'],
            'auto_accept_members' => ['nullable', 'boolean'],
            'min_level_required' => ['nullable', 'integer', 'min:1', 'max:100'],
            'min_streak_required' => ['nullable', 'integer', 'min:0', 'max:365'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.unique' => 'A guild with this name already exists.',
            'tag.unique' => 'A guild with this tag already exists.',
            'tag.alpha' => 'Guild tag can only contain letters.',
        ];
    }
}
