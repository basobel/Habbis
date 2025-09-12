<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class PromoteMemberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('guild'));
    }

    public function rules(): array
    {
        return [
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'role' => ['required', 'string', 'in:leader,officer,member'],
        ];
    }

    public function messages(): array
    {
        return [
            'user_id.exists' => 'User not found.',
            'role.in' => 'Role must be one of: leader, officer, member.',
        ];
    }
}
