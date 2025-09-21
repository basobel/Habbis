<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Notifications\ResetPasswordNotification;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'username',
        'email',
        'password',
        'avatar_url',
        'level',
        'experience_points',
        'premium_currency',
        'regular_currency',
        'is_premium',
        'premium_expires_at',
        'total_streak_days',
        'current_streak_days',
        'last_activity_at',
        'settings',
        'statistics',
        'equipment',
        'avatar_preferences',
        'notifications_enabled',
        'timezone',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_premium' => 'boolean',
        'premium_expires_at' => 'datetime',
        'settings' => 'array',
        'statistics' => 'array',
        'equipment' => 'array',
        'avatar_preferences' => 'array',
        'notifications_enabled' => 'boolean',
        'last_activity_at' => 'datetime',
    ];

    // Relationships
    public function pets(): HasMany
    {
        return $this->hasMany(Pet::class);
    }

    public function activePet(): HasMany
    {
        return $this->hasMany(Pet::class)->where('is_active', true);
    }

    public function habits(): HasMany
    {
        return $this->hasMany(Habit::class);
    }

    public function activeHabits(): HasMany
    {
        return $this->hasMany(Habit::class)->where('is_active', true);
    }

    public function habitLogs(): HasMany
    {
        return $this->hasMany(HabitLog::class);
    }

    public function achievements(): BelongsToMany
    {
        return $this->belongsToMany(Achievement::class, 'user_achievements')
            ->withPivot(['progress', 'is_completed', 'completed_at', 'metadata'])
            ->withTimestamps();
    }

    public function completedAchievements(): BelongsToMany
    {
        return $this->achievements()->wherePivot('is_completed', true);
    }

    public function guilds(): BelongsToMany
    {
        return $this->belongsToMany(Guild::class, 'guild_members')
            ->withPivot(['role', 'contribution_points', 'joined_at', 'last_contribution_at'])
            ->withTimestamps();
    }

    public function ownedGuilds(): HasMany
    {
        return $this->hasMany(Guild::class, 'leader_id');
    }

    public function userStatistics(): HasMany
    {
        return $this->hasMany(UserStatistic::class);
    }

    public function currentStatistics(): HasMany
    {
        return $this->hasMany(UserStatistic::class)->latest()->limit(1);
    }

    public function equipment(): HasMany
    {
        return $this->hasMany(UserEquipment::class);
    }

    public function equippedItems(): HasMany
    {
        return $this->hasMany(UserEquipment::class)->where('is_equipped', true);
    }

    public function avatars(): HasMany
    {
        return $this->hasMany(UserAvatar::class);
    }

    public function activeAvatar(): HasMany
    {
        return $this->hasMany(UserAvatar::class)->where('is_active', true);
    }

    // Helper methods
    public function addExperience(int $amount): void
    {
        $this->increment('experience_points', $amount);
        $this->checkLevelUp();
    }

    public function addPremiumCurrency(int $amount): void
    {
        $this->increment('premium_currency', $amount);
    }

    public function addRegularCurrency(int $amount): void
    {
        $this->increment('regular_currency', $amount);
    }

    public function spendPremiumCurrency(int $amount): bool
    {
        if ($this->premium_currency >= $amount) {
            $this->decrement('premium_currency', $amount);
            return true;
        }
        return false;
    }

    public function spendRegularCurrency(int $amount): bool
    {
        if ($this->regular_currency >= $amount) {
            $this->decrement('regular_currency', $amount);
            return true;
        }
        return false;
    }

    public function isPremiumActive(): bool
    {
        return $this->is_premium && 
               ($this->premium_expires_at === null || $this->premium_expires_at->isFuture());
    }

    public function activatePremium(int $days = 30): void
    {
        $this->update([
            'is_premium' => true,
            'premium_expires_at' => now()->addDays($days),
        ]);
    }

    public function deactivatePremium(): void
    {
        $this->update([
            'is_premium' => false,
            'premium_expires_at' => null,
        ]);
    }

    public function checkLevelUp(): void
    {
        $requiredXp = $this->calculateRequiredXpForLevel($this->level + 1);
        
        if ($this->experience_points >= $requiredXp) {
            $this->increment('level');
            $this->checkLevelUp(); // Recursive check for multiple level ups
        }
    }

    public function calculateRequiredXpForLevel(int $level): int
    {
        // Exponential growth formula: base * (level ^ 1.5)
        return (int) (100 * pow($level, 1.5));
    }

    public function getTotalHabitsCompleted(): int
    {
        return $this->habitLogs()->where('completed', true)->count();
    }

    public function getCurrentStreak(): int
    {
        return $this->current_streak_days;
    }

    public function updateStreak(bool $completedToday): void
    {
        if ($completedToday) {
            $this->increment('current_streak_days');
            $this->increment('total_streak_days');
        } else {
            $this->update(['current_streak_days' => 0]);
        }
    }

    /**
     * Send the password reset notification.
     */
    public function sendPasswordResetNotification($token): void
    {
        $this->notify(new ResetPasswordNotification($token));
    }
}
