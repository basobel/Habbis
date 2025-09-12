<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('battles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('challenger_pet_id')->constrained('pets')->onDelete('cascade');
            $table->foreignId('defender_pet_id')->constrained('pets')->onDelete('cascade');
            $table->foreignId('winner_pet_id')->nullable()->constrained('pets')->onDelete('cascade');
            
            // Battle configuration
            $table->enum('battle_type', ['pvp', 'pve', 'tournament', 'guild']);
            $table->enum('status', ['pending', 'in_progress', 'completed', 'cancelled']);
            $table->integer('rounds_played')->default(0);
            $table->integer('max_rounds')->default(10);
            
            // Rewards
            $table->integer('xp_reward')->default(0);
            $table->integer('premium_currency_reward')->default(0);
            $table->json('items_rewarded')->nullable();
            
            // Battle log
            $table->json('battle_log')->nullable(); // Detailed turn-by-turn log
            $table->json('final_stats')->nullable(); // Final pet stats after battle
            
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
            
            // Indexes
            $table->index(['challenger_pet_id', 'status']);
            $table->index(['defender_pet_id', 'status']);
            $table->index(['battle_type', 'status']);
            $table->index('started_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('battles');
    }
};
