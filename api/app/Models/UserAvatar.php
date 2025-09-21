<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserAvatar extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'avatar_type',
        'avatar_url',
        'avatar_name',
        'avatar_config',
        'is_active',
        'is_default',
    ];

    protected $casts = [
        'avatar_config' => 'array',
        'is_active' => 'boolean',
        'is_default' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Helper methods
    public function activate(): void
    {
        // Deactivate other avatars
        static::where('user_id', $this->user_id)
            ->where('id', '!=', $this->id)
            ->update(['is_active' => false]);
        
        // Activate this avatar
        $this->update(['is_active' => true]);
    }

    public function getAvatarUrl(): string
    {
        if ($this->avatar_url) {
            return $this->avatar_url;
        }
        
        // Generate default avatar URL based on username
        $username = $this->user->username ?? 'user';
        return "https://ui-avatars.com/api/?name=" . urlencode($username) . "&background=7C3AED&color=fff&size=128";
    }

    public function getAvatarConfig(): array
    {
        return $this->avatar_config ?? [
            'background_color' => '#7C3AED',
            'text_color' => '#FFFFFF',
            'style' => 'circle',
            'size' => 128,
        ];
    }
}
