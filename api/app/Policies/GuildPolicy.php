<?php

namespace App\Policies;

use App\Models\Guild;
use App\Models\User;

class GuildPolicy
{
    public function view(User $user, Guild $guild): bool
    {
        return $guild->is_public || $guild->members()->where('user_id', $user->id)->exists();
    }

    public function update(User $user, Guild $guild): bool
    {
        return $guild->isLeader($user) || $guild->isOfficer($user);
    }

    public function delete(User $user, Guild $guild): bool
    {
        return $guild->isLeader($user);
    }
}
