<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'username' => fake()->unique()->userName(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'avatar_url' => null,
            'level' => fake()->numberBetween(1, 50),
            'experience_points' => fake()->numberBetween(0, 10000),
            'premium_currency' => fake()->numberBetween(0, 1000),
            'regular_currency' => fake()->numberBetween(0, 5000),
            'is_premium' => fake()->boolean(20), // 20% chance of being premium
            'premium_expires_at' => fake()->optional(0.2)->dateTimeBetween('now', '+1 year'),
            'total_streak_days' => fake()->numberBetween(0, 365),
            'current_streak_days' => fake()->numberBetween(0, 30),
            'last_activity_at' => fake()->dateTimeBetween('-1 month', 'now'),
            'settings' => [
                'theme' => fake()->randomElement(['light', 'dark']),
                'notifications' => fake()->boolean(80),
                'language' => 'pl',
            ],
            'avatar_preferences' => [
                'style' => fake()->randomElement(['circle', 'square', 'rounded']),
                'background_color' => fake()->hexColor(),
                'text_color' => '#FFFFFF',
            ],
            'notifications_enabled' => fake()->boolean(80),
            'timezone' => fake()->randomElement(['Europe/Warsaw', 'UTC', 'America/New_York']),
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Indicate that the user should be premium.
     */
    public function premium(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_premium' => true,
            'premium_expires_at' => fake()->dateTimeBetween('now', '+1 year'),
        ]);
    }

    /**
     * Indicate that the user should be high level.
     */
    public function highLevel(): static
    {
        return $this->state(fn (array $attributes) => [
            'level' => fake()->numberBetween(20, 100),
            'experience_points' => fake()->numberBetween(5000, 50000),
        ]);
    }
}
