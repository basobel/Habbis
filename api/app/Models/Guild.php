<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Guild extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'tag',
        'description',
        'leader_id',
        'level',
        'experience',
        'member_count',
        'max_members',
        'settings',
        'banner_url',
        'icon_url',
        'is_public',
        'auto_accept_members',
        'min_level_required',
        'min_streak_required',
    ];

    protected $casts = [
        'settings' => 'array',
        'is_public' => 'boolean',
        'auto_accept_members' => 'boolean',
    ];

    // Relationships
    public function leader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'leader_id');
    }

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'guild_members')
            ->withPivot(['role', 'contribution_points', 'joined_at', 'last_contribution_at'])
            ->withTimestamps();
    }

    public function memberRecords(): HasMany
    {
        return $this->hasMany(GuildMember::class);
    }

    // Helper methods
    public function addMember(User $user, string $role = 'member'): void
    {
        $this->members()->attach($user->id, [
            'role' => $role,
            'contribution_points' => 0,
            'joined_at' => now(),
        ]);

        $this->increment('member_count');
    }

    public function removeMember(User $user): void
    {
        $this->members()->detach($user->id);
        $this->decrement('member_count');
    }

    public function isLeader(User $user): bool
    {
        return $this->leader_id === $user->id;
    }

    public function isOfficer(User $user): bool
    {
        return $this->members()
            ->wherePivot('user_id', $user->id)
            ->wherePivot('role', 'officer')
            ->exists();
    }

    public function canJoin(User $user): bool
    {
        return $user->level >= $this->min_level_required 
            && $user->current_streak_days >= $this->min_streak_required
            && $this->member_count < $this->max_members;
    }

    public function addExperience(int $amount): void
    {
        $this->increment('experience', $amount);
        $this->checkLevelUp();
    }

    public function checkLevelUp(): void
    {
        $requiredXp = $this->calculateRequiredXpForLevel($this->level + 1);
        
        if ($this->experience >= $requiredXp) {
            $this->increment('level');
            $this->checkLevelUp(); // Recursive check for multiple level ups
        }
    }

    public function calculateRequiredXpForLevel(int $level): int
    {
        return (int) (1000 * pow($level, 1.5));
    }
}
