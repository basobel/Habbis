<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserStatistic extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'total_habits_completed',
        'total_habits_created',
        'total_days_active',
        'longest_streak',
        'current_streak',
        'habits_completed_today',
        'habits_completed_this_week',
        'habits_completed_this_month',
        'habits_completed_this_year',
        'category_stats',
        'time_stats',
        'completion_rate',
        'perfect_days',
        'zero_days',
        'guild_contributions',
        'battles_won',
        'battles_lost',
        'pets_owned',
        'achievements_unlocked',
    ];

    protected $casts = [
        'category_stats' => 'array',
        'time_stats' => 'array',
        'completion_rate' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Helper methods
    public function updateCategoryStats(string $category, int $increment = 1): void
    {
        $stats = $this->category_stats ?? [];
        $stats[$category] = ($stats[$category] ?? 0) + $increment;
        $this->update(['category_stats' => $stats]);
    }

    public function updateTimeStats(string $timeOfDay, int $increment = 1): void
    {
        $stats = $this->time_stats ?? [];
        $stats[$timeOfDay] = ($stats[$timeOfDay] ?? 0) + $increment;
        $this->update(['time_stats' => $stats]);
    }

    public function calculateCompletionRate(): float
    {
        if ($this->total_habits_created === 0) {
            return 0.0;
        }
        
        return round(($this->total_habits_completed / $this->total_habits_created) * 100, 2);
    }

    public function updateCompletionRate(): void
    {
        $this->update(['completion_rate' => $this->calculateCompletionRate()]);
    }
}
