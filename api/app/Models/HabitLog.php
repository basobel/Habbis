<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HabitLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'habit_id',
        'user_id',
        'date',
        'completed',
        'xp_gained',
        'premium_currency_gained',
        'notes',
        'metadata',
    ];

    protected $casts = [
        'completed' => 'boolean',
        'date' => 'date',
        'metadata' => 'array',
    ];

    // Relationships
    public function habit(): BelongsTo
    {
        return $this->belongsTo(Habit::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopeCompleted($query)
    {
        return $query->where('completed', true);
    }

    public function scopeForDate($query, $date)
    {
        return $query->whereDate('date', $date);
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeForHabit($query, $habitId)
    {
        return $query->where('habit_id', $habitId);
    }

    // Helper methods
    public function isCompleted(): bool
    {
        return $this->completed;
    }

    public function getTotalReward(): int
    {
        return $this->xp_gained + $this->premium_currency_gained;
    }

    public function getFormattedDate(): string
    {
        return $this->date->format('M j, Y');
    }

    public function getDayOfWeek(): string
    {
        return $this->date->format('l');
    }

    public function isToday(): bool
    {
        return $this->date->isToday();
    }

    public function isYesterday(): bool
    {
        return $this->date->isYesterday();
    }

    public function isThisWeek(): bool
    {
        return $this->date->isCurrentWeek();
    }

    public function isThisMonth(): bool
    {
        return $this->date->isCurrentMonth();
    }
}
