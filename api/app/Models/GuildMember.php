<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GuildMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'guild_id',
        'user_id',
        'role',
        'contribution_points',
        'joined_at',
        'last_contribution_at',
    ];

    protected $casts = [
        'joined_at' => 'datetime',
        'last_contribution_at' => 'datetime',
    ];

    // Relationships
    public function guild(): BelongsTo
    {
        return $this->belongsTo(Guild::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Helper methods
    public function isLeader(): bool
    {
        return $this->role === 'leader';
    }

    public function isOfficer(): bool
    {
        return $this->role === 'officer';
    }

    public function isMember(): bool
    {
        return $this->role === 'member';
    }

    public function addContribution(int $points): void
    {
        $this->increment('contribution_points', $points);
        $this->update(['last_contribution_at' => now()]);
    }

    public function canPromote(): bool
    {
        return $this->isLeader();
    }

    public function canKick(): bool
    {
        return $this->isLeader() || $this->isOfficer();
    }
}
