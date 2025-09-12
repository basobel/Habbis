<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Habit extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'difficulty',
        'target_frequency',
        'target_days',
        'reward_config',
        'base_xp_reward',
        'streak_bonus_xp',
        'premium_currency_reward',
        'current_streak',
        'longest_streak',
        'total_completions',
        'last_completed_at',
        'is_active',
        'reminders_enabled',
        'reminder_times',
        'color',
        'icon',
    ];

    protected $casts = [
        'target_days' => 'array',
        'reward_config' => 'array',
        'reminder_times' => 'array',
        'is_active' => 'boolean',
        'reminders_enabled' => 'boolean',
        'last_completed_at' => 'date',
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function logs(): HasMany
    {
        return $this->hasMany(HabitLog::class);
    }

    public function todayLog(): HasMany
    {
        return $this->hasMany(HabitLog::class)->whereDate('date', today());
    }

    // Helper methods
    public function isCompletedToday(): bool
    {
        return $this->todayLog()->where('completed', true)->exists();
    }

    public function completeHabit(string $notes = null): HabitLog
    {
        $today = today();
        
        // Check if already completed today
        $existingLog = $this->todayLog()->where('completed', true)->first();
        if ($existingLog) {
            return $existingLog;
        }

        // Calculate rewards
        $xpReward = $this->calculateXpReward();
        $currencyReward = $this->premium_currency_reward;

        // Create log entry
        $log = $this->logs()->create([
            'user_id' => $this->user_id,
            'date' => $today,
            'completed' => true,
            'xp_gained' => $xpReward,
            'premium_currency_gained' => $currencyReward,
            'notes' => $notes,
        ]);

        // Update habit stats
        $this->updateHabitStats(true);

        // Award rewards to user and pet
        $this->awardRewards($xpReward, $currencyReward);

        return $log;
    }

    public function skipHabit(string $reason = null): HabitLog
    {
        $today = today();
        
        // Check if already logged today
        $existingLog = $this->todayLog()->first();
        if ($existingLog) {
            return $existingLog;
        }

        // Create log entry for skipped habit
        $log = $this->logs()->create([
            'user_id' => $this->user_id,
            'date' => $today,
            'completed' => false,
            'xp_gained' => 0,
            'premium_currency_gained' => 0,
            'notes' => $reason,
        ]);

        // Update habit stats
        $this->updateHabitStats(false);

        return $log;
    }

    public function calculateXpReward(): int
    {
        $baseXp = $this->base_xp_reward;
        $streakBonus = $this->current_streak * $this->streak_bonus_xp;
        $difficultyMultiplier = $this->getDifficultyMultiplier();
        
        return (int) (($baseXp + $streakBonus) * $difficultyMultiplier);
    }

    public function getDifficultyMultiplier(): float
    {
        return match($this->difficulty) {
            'easy' => 1.0,
            'medium' => 1.5,
            'hard' => 2.0,
            'expert' => 3.0,
            default => 1.0,
        };
    }

    public function updateHabitStats(bool $completed): void
    {
        if ($completed) {
            $this->increment('current_streak');
            $this->increment('total_completions');
            $this->update([
                'last_completed_at' => today(),
                'longest_streak' => max($this->longest_streak, $this->current_streak + 1)
            ]);
        } else {
            $this->update(['current_streak' => 0]);
        }
    }

    public function awardRewards(int $xpReward, int $currencyReward): void
    {
        // Award to user
        $this->user->addExperience($xpReward);
        $this->user->addPremiumCurrency($currencyReward);

        // Award to active pet
        $activePet = $this->user->activePet()->first();
        if ($activePet) {
            $activePet->addExperience($xpReward);
        }
    }

    public function getStreakStatus(): array
    {
        $today = today();
        $completedToday = $this->isCompletedToday();
        
        if ($completedToday) {
            return [
                'status' => 'on_track',
                'message' => "Great! You're on a {$this->current_streak} day streak!",
                'streak_count' => $this->current_streak
            ];
        }

        $yesterday = $today->subDay();
        $completedYesterday = $this->logs()
            ->whereDate('date', $yesterday)
            ->where('completed', true)
            ->exists();

        if ($completedYesterday) {
            return [
                'status' => 'at_risk',
                'message' => "Don't break your {$this->current_streak} day streak!",
                'streak_count' => $this->current_streak
            ];
        }

        return [
            'status' => 'broken',
            'message' => 'Streak broken. Start fresh today!',
            'streak_count' => 0
        ];
    }

    public function getCompletionRate(): float
    {
        if ($this->total_completions === 0) {
            return 0.0;
        }

        $totalDays = $this->created_at->diffInDays(now()) + 1;
        return round(($this->total_completions / $totalDays) * 100, 2);
    }
}
