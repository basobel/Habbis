<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGuildRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('guild'));
    }

    public function rules(): array
    {
        $guildId = $this->route('guild')->id;
        
        return [
            'name' => ['sometimes', 'string', 'min:3', 'max:50', "unique:guilds,name,{$guildId}"],
            'tag' => ['sometimes', 'string', 'min:2', 'max:10', "unique:guilds,tag,{$guildId}", 'alpha'],
            'description' => ['nullable', 'string', 'max:500'],
            'is_public' => ['sometimes', 'boolean'],
            'auto_accept_members' => ['sometimes', 'boolean'],
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
