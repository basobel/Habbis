<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create demo users
        $users = [
            [
                'username' => 'demo_user',
                'email' => 'demo@habbis.com',
                'password' => Hash::make('password'),
                'level' => 5,
                'experience_points' => 2500,
                'premium_currency' => 100,
                'total_streak_days' => 15,
                'current_streak_days' => 3,
                'timezone' => 'UTC',
            ],
            [
                'username' => 'habit_master',
                'email' => 'master@habbis.com',
                'password' => Hash::make('password'),
                'level' => 12,
                'experience_points' => 8500,
                'premium_currency' => 500,
                'total_streak_days' => 45,
                'current_streak_days' => 12,
                'timezone' => 'America/New_York',
            ],
            [
                'username' => 'battle_champion',
                'email' => 'champion@habbis.com',
                'password' => Hash::make('password'),
                'level' => 8,
                'experience_points' => 4200,
                'premium_currency' => 250,
                'total_streak_days' => 8,
                'current_streak_days' => 1,
                'timezone' => 'Europe/London',
            ],
        ];

        foreach ($users as $userData) {
            User::create($userData);
        }
    }
}
