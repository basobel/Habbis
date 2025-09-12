<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Habit;
use App\Models\User;

class HabitSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $habitTemplates = [
            [
                'name' => 'Morning Exercise',
                'description' => 'Start the day with 30 minutes of physical activity',
                'difficulty' => 'medium',
                'target_frequency' => 1,
                'target_days' => [1, 2, 3, 4, 5],
                'base_xp_reward' => 20,
                'streak_bonus_xp' => 5,
                'premium_currency_reward' => 0,
                'color' => '#10B981',
                'icon' => 'fitness',
            ],
            [
                'name' => 'Read for 30 minutes',
                'description' => 'Read books, articles, or educational content',
                'difficulty' => 'easy',
                'target_frequency' => 1,
                'target_days' => [1, 2, 3, 4, 5, 6, 7],
                'base_xp_reward' => 15,
                'streak_bonus_xp' => 3,
                'premium_currency_reward' => 0,
                'color' => '#3B82F6',
                'icon' => 'book',
            ],
            [
                'name' => 'Meditate',
                'description' => 'Practice mindfulness and meditation',
                'difficulty' => 'easy',
                'target_frequency' => 1,
                'target_days' => [1, 2, 3, 4, 5, 6, 7],
                'base_xp_reward' => 10,
                'streak_bonus_xp' => 2,
                'premium_currency_reward' => 0,
                'color' => '#8B5CF6',
                'icon' => 'leaf',
            ],
            [
                'name' => 'Learn a new skill',
                'description' => 'Spend time learning something new',
                'difficulty' => 'hard',
                'target_frequency' => 1,
                'target_days' => [1, 3, 5],
                'base_xp_reward' => 40,
                'streak_bonus_xp' => 10,
                'premium_currency_reward' => 5,
                'color' => '#F59E0B',
                'icon' => 'bulb',
            ],
            [
                'name' => 'Write in journal',
                'description' => 'Reflect on your day and write thoughts',
                'difficulty' => 'easy',
                'target_frequency' => 1,
                'target_days' => [1, 2, 3, 4, 5, 6, 7],
                'base_xp_reward' => 12,
                'streak_bonus_xp' => 2,
                'premium_currency_reward' => 0,
                'color' => '#EF4444',
                'icon' => 'pencil',
            ],
        ];

        foreach ($users as $user) {
            // Create 2-4 random habits for each user
            $numHabits = rand(2, 4);
            $selectedHabits = array_rand($habitTemplates, $numHabits);
            
            if (!is_array($selectedHabits)) {
                $selectedHabits = [$selectedHabits];
            }

            foreach ($selectedHabits as $habitIndex) {
                $template = $habitTemplates[$habitIndex];
                
                Habit::create([
                    'user_id' => $user->id,
                    'name' => $template['name'],
                    'description' => $template['description'],
                    'difficulty' => $template['difficulty'],
                    'target_frequency' => $template['target_frequency'],
                    'target_days' => $template['target_days'],
                    'base_xp_reward' => $template['base_xp_reward'],
                    'streak_bonus_xp' => $template['streak_bonus_xp'],
                    'premium_currency_reward' => $template['premium_currency_reward'],
                    'current_streak' => rand(0, 10),
                    'longest_streak' => rand(5, 20),
                    'total_completions' => rand(10, 50),
                    'is_active' => true,
                    'reminders_enabled' => true,
                    'reminder_times' => ['09:00', '18:00'],
                    'color' => $template['color'],
                    'icon' => $template['icon'],
                ]);
            }
        }
    }
}
