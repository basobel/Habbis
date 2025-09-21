<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_statistics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Podstawowe statystyki
            $table->integer('total_habits_completed')->default(0);
            $table->integer('total_habits_created')->default(0);
            $table->integer('total_days_active')->default(0);
            $table->integer('longest_streak')->default(0);
            $table->integer('current_streak')->default(0);
            
            // Statystyki czasowe
            $table->integer('habits_completed_today')->default(0);
            $table->integer('habits_completed_this_week')->default(0);
            $table->integer('habits_completed_this_month')->default(0);
            $table->integer('habits_completed_this_year')->default(0);
            
            // Statystyki kategorii
            $table->json('category_stats')->nullable(); // {health: 10, work: 5, personal: 3}
            
            // Statystyki czasu
            $table->json('time_stats')->nullable(); // {morning: 5, afternoon: 3, evening: 2}
            
            // Statystyki wydajności
            $table->decimal('completion_rate', 5, 2)->default(0.00); // Procent ukończenia
            $table->integer('perfect_days')->default(0); // Dni z 100% ukończeniem
            $table->integer('zero_days')->default(0); // Dni bez żadnych nawyków
            
            // Statystyki społecznościowe
            $table->integer('guild_contributions')->default(0);
            $table->integer('battles_won')->default(0);
            $table->integer('battles_lost')->default(0);
            $table->integer('pets_owned')->default(0);
            $table->integer('achievements_unlocked')->default(0);
            
            $table->timestamps();
            
            // Indeksy
            $table->index(['user_id', 'total_habits_completed']);
            $table->index(['user_id', 'current_streak']);
            $table->index(['user_id', 'completion_rate']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_statistics');
    }
};
