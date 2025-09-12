<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Pet;
use App\Models\User;

class PetSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $species = ['dragon', 'phoenix', 'wolf', 'cat', 'dog', 'rabbit', 'bear'];

        foreach ($users as $user) {
            // Create primary pet
            Pet::create([
                'user_id' => $user->id,
                'name' => $user->username . "'s Pet",
                'species' => $species[array_rand($species)],
                'level' => max(1, $user->level - 2),
                'experience' => rand(0, 500),
                'evolution_stage' => 1,
                'attack' => rand(10, 25),
                'defense' => rand(10, 25),
                'speed' => rand(8, 20),
                'health' => rand(80, 120),
                'max_health' => rand(100, 150),
                'is_active' => true,
            ]);

            // Create additional pets for higher level users
            if ($user->level > 5) {
                Pet::create([
                    'user_id' => $user->id,
                    'name' => 'Secondary Pet',
                    'species' => $species[array_rand($species)],
                    'level' => max(1, $user->level - 5),
                    'experience' => rand(0, 200),
                    'evolution_stage' => 1,
                    'attack' => rand(8, 15),
                    'defense' => rand(8, 15),
                    'speed' => rand(6, 12),
                    'health' => rand(60, 100),
                    'max_health' => rand(80, 120),
                    'is_active' => false,
                ]);
            }
        }
    }
}
