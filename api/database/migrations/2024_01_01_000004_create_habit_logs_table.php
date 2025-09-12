<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('habit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('habit_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->boolean('completed')->default(false);
            $table->integer('xp_gained')->default(0);
            $table->integer('premium_currency_gained')->default(0);
            $table->text('notes')->nullable();
            $table->json('metadata')->nullable(); // Additional tracking data
            
            $table->timestamps();
            
            // Unique constraint to prevent duplicate entries
            $table->unique(['habit_id', 'date']);
            
            // Indexes for performance
            $table->index(['user_id', 'date']);
            $table->index(['habit_id', 'completed']);
            $table->index('date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('habit_logs');
    }
};
