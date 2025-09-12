<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            PetSeeder::class,
            HabitSeeder::class,
            AchievementSeeder::class,
            GuildSeeder::class,
        ]);
    }
}
