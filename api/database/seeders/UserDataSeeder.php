<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\UserStatistic;
use App\Models\UserEquipment;
use App\Models\UserAvatar;

class UserDataSeeder extends Seeder
{
    public function run(): void
    {
        // Create test users with full data
        $users = User::factory(10)->create();

        foreach ($users as $user) {
            // Create user statistics
            UserStatistic::create([
                'user_id' => $user->id,
                'total_habits_completed' => rand(0, 100),
                'total_habits_created' => rand(5, 20),
                'total_days_active' => rand(1, 365),
                'longest_streak' => rand(1, 30),
                'current_streak' => rand(0, 15),
                'habits_completed_today' => rand(0, 5),
                'habits_completed_this_week' => rand(0, 25),
                'habits_completed_this_month' => rand(0, 100),
                'habits_completed_this_year' => rand(0, 500),
                'category_stats' => [
                    'health' => rand(0, 20),
                    'work' => rand(0, 15),
                    'personal' => rand(0, 10),
                    'learning' => rand(0, 8),
                ],
                'time_stats' => [
                    'morning' => rand(0, 10),
                    'afternoon' => rand(0, 8),
                    'evening' => rand(0, 12),
                ],
                'completion_rate' => rand(50, 95),
                'perfect_days' => rand(0, 10),
                'zero_days' => rand(0, 5),
                'guild_contributions' => rand(0, 100),
                'battles_won' => rand(0, 20),
                'battles_lost' => rand(0, 10),
                'pets_owned' => rand(1, 5),
                'achievements_unlocked' => rand(0, 15),
            ]);

            // Create user equipment
            $equipmentTypes = ['avatar', 'pet_accessory', 'background', 'frame', 'badge'];
            $rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
            
            for ($i = 0; $i < rand(3, 8); $i++) {
                $type = $equipmentTypes[array_rand($equipmentTypes)];
                $rarity = $rarities[array_rand($rarities)];
                $itemId = 'item_' . $type . '_' . $user->id . '_' . $i;
                
                UserEquipment::create([
                    'user_id' => $user->id,
                    'type' => $type,
                    'item_id' => $itemId,
                    'item_name' => ucfirst($type) . ' ' . ucfirst($rarity) . ' ' . ($i + 1),
                    'item_description' => 'A ' . $rarity . ' ' . $type . ' item',
                    'rarity' => $rarity,
                    'is_equipped' => $i === 0, // First item is equipped
                    'metadata' => [
                        'color' => $this->getRandomColor(),
                        'style' => $this->getRandomStyle(),
                    ],
                ]);
            }

            // Create user avatars
            for ($i = 0; $i < rand(1, 3); $i++) {
                UserAvatar::create([
                    'user_id' => $user->id,
                    'avatar_type' => $i === 0 ? 'default' : 'custom',
                    'avatar_url' => $i === 0 ? null : 'https://ui-avatars.com/api/?name=' . urlencode($user->username) . '&background=' . $this->getRandomColor() . '&color=fff&size=128',
                    'avatar_name' => $i === 0 ? 'Default Avatar' : 'Custom Avatar ' . ($i + 1),
                    'avatar_config' => [
                        'background_color' => $this->getRandomColor(),
                        'text_color' => '#FFFFFF',
                        'style' => 'circle',
                        'size' => 128,
                    ],
                    'is_active' => $i === 0,
                    'is_default' => $i === 0,
                ]);
            }

            // Add some currency
            $user->update([
                'regular_currency' => rand(100, 1000),
                'premium_currency' => rand(0, 100),
                'is_premium' => rand(0, 1) === 1,
            ]);
        }
    }

    private function getRandomColor(): string
    {
        $colors = ['#7C3AED', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16'];
        return $colors[array_rand($colors)];
    }

    private function getRandomStyle(): string
    {
        $styles = ['circle', 'square', 'rounded', 'diamond'];
        return $styles[array_rand($styles)];
    }
}
