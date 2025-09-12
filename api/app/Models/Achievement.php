<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Achievement extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'icon',
        'category',
        'rarity',
        'requirements',
        'rewards',
        'xp_reward',
        'premium_currency_reward',
        'is_hidden',
        'is_repeatable',
        'max_progress',
    ];

    protected $casts = [
        'requirements' => 'array',
        'rewards' => 'array',
        'is_hidden' => 'boolean',
        'is_repeatable' => 'boolean',
    ];

    // Relationships
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_achievements')
            ->withPivot(['progress', 'is_completed', 'completed_at', 'metadata'])
            ->withTimestamps();
    }

    // Helper methods
    public function isCompletedBy(User $user): bool
    {
        return $this->users()
            ->wherePivot('user_id', $user->id)
            ->wherePivot('is_completed', true)
            ->exists();
    }

    public function getProgressFor(User $user): int
    {
        $userAchievement = $this->users()
            ->wherePivot('user_id', $user->id)
            ->first();

        return $userAchievement ? $userAchievement->pivot->progress : 0;
    }

    public function getProgressPercentage(User $user): float
    {
        $progress = $this->getProgressFor($user);
        return min(100, ($progress / $this->max_progress) * 100);
    }

    public function checkCompletion(User $user): bool
    {
        $progress = $this->getProgressFor($user);
        return $progress >= $this->max_progress;
    }

    public function getRarityColor(): string
    {
        return match($this->rarity) {
            'common' => '#9CA3AF',
            'uncommon' => '#10B981',
            'rare' => '#3B82F6',
            'epic' => '#8B5CF6',
            'legendary' => '#F59E0B',
            default => '#9CA3AF',
        };
    }

    public function getRarityWeight(): int
    {
        return match($this->rarity) {
            'common' => 1,
            'uncommon' => 2,
            'rare' => 3,
            'epic' => 4,
            'legendary' => 5,
            default => 1,
        };
    }
}
