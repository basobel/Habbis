<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pet extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'species',
        'level',
        'experience',
        'evolution_stage',
        'attack',
        'defense',
        'speed',
        'health',
        'max_health',
        'skin_id',
        'customization',
        'avatar_url',
        'is_active',
        'last_fed_at',
        'last_battled_at',
    ];

    protected $casts = [
        'customization' => 'array',
        'is_active' => 'boolean',
        'last_fed_at' => 'datetime',
        'last_battled_at' => 'datetime',
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function challengerBattles(): HasMany
    {
        return $this->hasMany(Battle::class, 'challenger_pet_id');
    }

    public function defenderBattles(): HasMany
    {
        return $this->hasMany(Battle::class, 'defender_pet_id');
    }

    public function wonBattles(): HasMany
    {
        return $this->hasMany(Battle::class, 'winner_pet_id');
    }

    // Helper methods
    public function addExperience(int $amount): void
    {
        $this->increment('experience', $amount);
        $this->checkLevelUp();
        $this->checkEvolution();
    }

    public function checkLevelUp(): void
    {
        $requiredXp = $this->calculateRequiredXpForLevel($this->level + 1);
        
        if ($this->experience >= $requiredXp) {
            $this->levelUp();
        }
    }

    public function levelUp(): void
    {
        $this->increment('level');
        
        // Increase stats on level up
        $this->increment('attack', 2);
        $this->increment('defense', 2);
        $this->increment('speed', 1);
        $this->increment('max_health', 10);
        $this->update(['health' => $this->max_health]); // Full heal on level up
        
        // Check for further level ups
        $this->checkLevelUp();
    }

    public function checkEvolution(): void
    {
        $evolutionThresholds = $this->getEvolutionThresholds();
        
        foreach ($evolutionThresholds as $stage => $level) {
            if ($this->level >= $level && $this->evolution_stage < $stage) {
                $this->evolve($stage);
            }
        }
    }

    public function evolve(int $stage): void
    {
        $this->update(['evolution_stage' => $stage]);
        
        // Evolution bonuses
        $this->increment('attack', 5);
        $this->increment('defense', 5);
        $this->increment('speed', 3);
        $this->increment('max_health', 20);
        $this->update(['health' => $this->max_health]);
    }

    public function calculateRequiredXpForLevel(int $level): int
    {
        // Pet XP grows faster than user XP
        return (int) (50 * pow($level, 1.3));
    }

    public function getEvolutionThresholds(): array
    {
        return [
            2 => 10,  // First evolution at level 10
            3 => 25,  // Second evolution at level 25
            4 => 50,  // Third evolution at level 50
            5 => 75,  // Final evolution at level 75
        ];
    }

    public function getBattlePower(): int
    {
        return ($this->attack + $this->defense + $this->speed + $this->max_health) / 4;
    }

    public function isHealthy(): bool
    {
        return $this->health > ($this->max_health * 0.5);
    }

    public function feed(): void
    {
        $this->update([
            'last_fed_at' => now(),
            'health' => min($this->max_health, $this->health + 20)
        ]);
    }

    public function takeDamage(int $damage): void
    {
        $this->decrement('health', $damage);
        $this->update(['health' => max(0, $this->health)]);
    }

    public function heal(int $amount): void
    {
        $this->increment('health', $amount);
        $this->update(['health' => min($this->max_health, $this->health)]);
    }
}
