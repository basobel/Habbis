<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('achievements', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description');
            $table->string('icon')->nullable();
            $table->enum('category', ['habits', 'battles', 'guild', 'social', 'special']);
            $table->enum('rarity', ['common', 'uncommon', 'rare', 'epic', 'legendary']);
            
            // Requirements (JSON for flexibility)
            $table->json('requirements'); // e.g., {"habits_completed": 100, "streak_days": 30}
            
            // Rewards
            $table->json('rewards'); // e.g., {"xp": 1000, "premium_currency": 50, "items": []}
            $table->integer('xp_reward')->default(0);
            $table->integer('premium_currency_reward')->default(0);
            
            // Settings
            $table->boolean('is_hidden')->default(false); // Hidden until unlocked
            $table->boolean('is_repeatable')->default(false);
            $table->integer('max_progress')->default(1);
            
            $table->timestamps();
            
            // Indexes
            $table->index(['category', 'rarity']);
            $table->index('is_hidden');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('achievements');
    }
};
