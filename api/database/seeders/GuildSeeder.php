<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Guild;
use App\Models\User;
use App\Models\GuildMember;

class GuildSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        
        if ($users->count() < 2) {
            return; // Need at least 2 users to create guilds
        }

        $guilds = [
            [
                'name' => 'Habit Heroes',
                'tag' => 'HH',
                'description' => 'A guild for dedicated habit builders',
                'leader_id' => $users->first()->id,
                'level' => 3,
                'experience' => 1500,
                'member_count' => 1,
                'max_members' => 25,
                'is_public' => true,
                'auto_accept_members' => false,
                'min_level_required' => 3,
                'min_streak_required' => 5,
            ],
            [
                'name' => 'Battle Masters',
                'tag' => 'BM',
                'description' => 'Elite warriors and pet trainers',
                'leader_id' => $users->skip(1)->first()->id,
                'level' => 5,
                'experience' => 3000,
                'member_count' => 1,
                'max_members' => 30,
                'is_public' => true,
                'auto_accept_members' => true,
                'min_level_required' => 5,
                'min_streak_required' => 10,
            ],
            [
                'name' => 'Rising Stars',
                'tag' => 'RS',
                'description' => 'New players looking to grow together',
                'leader_id' => $users->last()->id,
                'level' => 1,
                'experience' => 200,
                'member_count' => 1,
                'max_members' => 20,
                'is_public' => true,
                'auto_accept_members' => true,
                'min_level_required' => 1,
                'min_streak_required' => 0,
            ],
        ];

        foreach ($guilds as $guildData) {
            $guild = Guild::create($guildData);
            
            // Add leader as guild member
            GuildMember::create([
                'guild_id' => $guild->id,
                'user_id' => $guild->leader_id,
                'role' => 'leader',
                'contribution_points' => rand(100, 500),
                'joined_at' => now(),
                'last_contribution_at' => now(),
            ]);
        }
    }
}
