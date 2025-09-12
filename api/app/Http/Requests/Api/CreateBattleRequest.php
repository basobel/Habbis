<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class CreateBattleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'challenger_pet_id' => ['required', 'integer', 'exists:pets,id'],
            'defender_pet_id' => ['required', 'integer', 'exists:pets,id'],
            'battle_type' => ['nullable', 'string', 'in:pvp,pve,tournament,guild'],
            'max_rounds' => ['nullable', 'integer', 'min:1', 'max:50'],
        ];
    }

    public function messages(): array
    {
        return [
            'challenger_pet_id.exists' => 'Challenger pet not found.',
            'defender_pet_id.exists' => 'Defender pet not found.',
            'battle_type.in' => 'Battle type must be one of: pvp, pve, tournament, guild.',
        ];
    }
}
