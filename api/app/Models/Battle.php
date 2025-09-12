<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Battle extends Model
{
    use HasFactory;

    protected $fillable = [
        'challenger_pet_id',
        'defender_pet_id',
        'winner_pet_id',
        'battle_type',
        'status',
        'rounds_played',
        'max_rounds',
        'xp_reward',
        'premium_currency_reward',
        'items_rewarded',
        'battle_log',
        'final_stats',
        'started_at',
        'completed_at',
    ];

    protected $casts = [
        'items_rewarded' => 'array',
        'battle_log' => 'array',
        'final_stats' => 'array',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    // Relationships
    public function challengerPet(): BelongsTo
    {
        return $this->belongsTo(Pet::class, 'challenger_pet_id');
    }

    public function defenderPet(): BelongsTo
    {
        return $this->belongsTo(Pet::class, 'defender_pet_id');
    }

    public function winnerPet(): BelongsTo
    {
        return $this->belongsTo(Pet::class, 'winner_pet_id');
    }

    // Helper methods
    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function isInProgress(): bool
    {
        return $this->status === 'in_progress';
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function getWinner(): ?Pet
    {
        return $this->winnerPet;
    }

    public function getLoser(): ?Pet
    {
        if (!$this->winner_pet_id) {
            return null;
        }

        return $this->challenger_pet_id === $this->winner_pet_id 
            ? $this->defenderPet 
            : $this->challengerPet;
    }
}
