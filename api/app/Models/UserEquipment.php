<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserEquipment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'item_id',
        'item_name',
        'item_description',
        'rarity',
        'is_equipped',
        'acquired_at',
        'metadata',
    ];

    protected $casts = [
        'is_equipped' => 'boolean',
        'acquired_at' => 'datetime',
        'metadata' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Helper methods
    public function equip(): void
    {
        // Unequip other items of the same type
        static::where('user_id', $this->user_id)
            ->where('type', $this->type)
            ->where('id', '!=', $this->id)
            ->update(['is_equipped' => false]);
        
        // Equip this item
        $this->update(['is_equipped' => true]);
    }

    public function unequip(): void
    {
        $this->update(['is_equipped' => false]);
    }

    public function getRarityColor(): string
    {
        return match($this->rarity) {
            'common' => '#6B7280',
            'uncommon' => '#10B981',
            'rare' => '#3B82F6',
            'epic' => '#8B5CF6',
            'legendary' => '#F59E0B',
            default => '#6B7280',
        };
    }

    public function getRarityName(): string
    {
        return match($this->rarity) {
            'common' => 'Pospolity',
            'uncommon' => 'Niezbyt pospolity',
            'rare' => 'Rzadki',
            'epic' => 'Epicki',
            'legendary' => 'Legendarny',
            default => 'Nieznany',
        };
    }
}
