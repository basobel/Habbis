<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Achievement;

class AchievementSeeder extends Seeder
{
    public function run(): void
    {
        $achievements = [
            // Habit Achievements
            [
                'name' => 'First Steps',
                'description' => 'Complete your first habit',
                'icon' => 'footsteps',
                'category' => 'habits',
                'rarity' => 'common',
                'requirements' => ['habits_completed' => 1],
                'rewards' => ['xp' => 100, 'premium_currency' => 10],
                'xp_reward' => 100,
                'premium_currency_reward' => 10,
                'is_hidden' => false,
                'is_repeatable' => false,
                'max_progress' => 1,
            ],
            [
                'name' => 'Streak Master',
                'description' => 'Maintain a 7-day streak',
                'icon' => 'flame',
                'category' => 'habits',
                'rarity' => 'uncommon',
                'requirements' => ['streak_days' => 7],
                'rewards' => ['xp' => 500, 'premium_currency' => 50],
                'xp_reward' => 500,
                'premium_currency_reward' => 50,
                'is_hidden' => false,
                'is_repeatable' => false,
                'max_progress' => 1,
            ],
            [
                'name' => 'Habit Hero',
                'description' => 'Complete 100 habits',
                'icon' => 'shield',
                'category' => 'habits',
                'rarity' => 'rare',
                'requirements' => ['habits_completed' => 100],
                'rewards' => ['xp' => 2000, 'premium_currency' => 200],
                'xp_reward' => 2000,
                'premium_currency_reward' => 200,
                'is_hidden' => false,
                'is_repeatable' => false,
                'max_progress' => 1,
            ],
            [
                'name' => 'Consistency King',
                'description' => 'Maintain a 30-day streak',
                'icon' => 'crown',
                'category' => 'habits',
                'rarity' => 'epic',
                'requirements' => ['streak_days' => 30],
                'rewards' => ['xp' => 5000, 'premium_currency' => 500],
                'xp_reward' => 5000,
                'premium_currency_reward' => 500,
                'is_hidden' => false,
                'is_repeatable' => false,
                'max_progress' => 1,
            ],

            // Battle Achievements
            [
                'name' => 'First Blood',
                'description' => 'Win your first battle',
                'icon' => 'sword',
                'category' => 'battles',
                'rarity' => 'common',
                'requirements' => ['battles_won' => 1],
                'rewards' => ['xp' => 200, 'premium_currency' => 20],
                'xp_reward' => 200,
                'premium_currency_reward' => 20,
                'is_hidden' => false,
                'is_repeatable' => false,
                'max_progress' => 1,
            ],
            [
                'name' => 'Battle Veteran',
                'description' => 'Win 50 battles',
                'icon' => 'medal',
                'category' => 'battles',
                'rarity' => 'rare',
                'requirements' => ['battles_won' => 50],
                'rewards' => ['xp' => 3000, 'premium_currency' => 300],
                'xp_reward' => 3000,
                'premium_currency_reward' => 300,
                'is_hidden' => false,
                'is_repeatable' => false,
                'max_progress' => 1,
            ],
            [
                'name' => 'Champion',
                'description' => 'Win 100 battles',
                'icon' => 'trophy',
                'category' => 'battles',
                'rarity' => 'epic',
                'requirements' => ['battles_won' => 100],
                'rewards' => ['xp' => 10000, 'premium_currency' => 1000],
                'xp_reward' => 10000,
                'premium_currency_reward' => 1000,
                'is_hidden' => false,
                'is_repeatable' => false,
                'max_progress' => 1,
            ],

            // Guild Achievements
            [
                'name' => 'Team Player',
                'description' => 'Join your first guild',
                'icon' => 'people',
                'category' => 'guild',
                'rarity' => 'common',
                'requirements' => ['guild_joined' => 1],
                'rewards' => ['xp' => 300, 'premium_currency' => 30],
                'xp_reward' => 300,
                'premium_currency_reward' => 30,
                'is_hidden' => false,
                'is_repeatable' => false,
                'max_progress' => 1,
            ],
            [
                'name' => 'Guild Leader',
                'description' => 'Create your own guild',
                'icon' => 'star',
                'category' => 'guild',
                'rarity' => 'uncommon',
                'requirements' => ['guild_created' => 1],
                'rewards' => ['xp' => 1000, 'premium_currency' => 100],
                'xp_reward' => 1000,
                'premium_currency_reward' => 100,
                'is_hidden' => false,
                'is_repeatable' => false,
                'max_progress' => 1,
            ],

            // Special Achievements
            [
                'name' => 'Early Bird',
                'description' => 'Complete a habit before 6 AM',
                'icon' => 'sunrise',
                'category' => 'special',
                'rarity' => 'uncommon',
                'requirements' => ['early_completion' => 1],
                'rewards' => ['xp' => 500, 'premium_currency' => 50],
                'xp_reward' => 500,
                'premium_currency_reward' => 50,
                'is_hidden' => true,
                'is_repeatable' => false,
                'max_progress' => 1,
            ],
            [
                'name' => 'Night Owl',
                'description' => 'Complete a habit after 11 PM',
                'icon' => 'moon',
                'category' => 'special',
                'rarity' => 'uncommon',
                'requirements' => ['late_completion' => 1],
                'rewards' => ['xp' => 500, 'premium_currency' => 50],
                'xp_reward' => 500,
                'premium_currency_reward' => 50,
                'is_hidden' => true,
                'is_repeatable' => false,
                'max_progress' => 1,
            ],
        ];

        foreach ($achievements as $achievement) {
            Achievement::create($achievement);
        }
    }
}
