<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('habits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('difficulty', ['easy', 'medium', 'hard', 'expert']);
            $table->integer('target_frequency')->default(1); // times per day
            $table->json('target_days')->nullable(); // [1,2,3,4,5] for weekdays
            
            // Rewards configuration
            $table->json('reward_config')->nullable(); // XP, currency, items
            $table->integer('base_xp_reward')->default(10);
            $table->integer('streak_bonus_xp')->default(5);
            $table->integer('premium_currency_reward')->default(0);
            
            // Tracking
            $table->integer('current_streak')->default(0);
            $table->integer('longest_streak')->default(0);
            $table->integer('total_completions')->default(0);
            $table->date('last_completed_at')->nullable();
            
            // Settings
            $table->boolean('is_active')->default(true);
            $table->boolean('reminders_enabled')->default(true);
            $table->json('reminder_times')->nullable(); // ["09:00", "18:00"]
            $table->string('color')->default('#3B82F6');
            $table->string('icon')->default('star');
            
            $table->timestamps();
            
            // Indexes
            $table->index(['user_id', 'is_active']);
            $table->index('difficulty');
            $table->index('last_completed_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('habits');
    }
};
