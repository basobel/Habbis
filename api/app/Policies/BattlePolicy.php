<?php

namespace App\Policies;

use App\Models\Battle;
use App\Models\User;

class BattlePolicy
{
    public function view(User $user, Battle $battle): bool
    {
        return $user->id === $battle->challengerPet->user_id || 
               $user->id === $battle->defenderPet->user_id;
    }

    public function update(User $user, Battle $battle): bool
    {
        return $user->id === $battle->challengerPet->user_id || 
               $user->id === $battle->defenderPet->user_id;
    }
}
