<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('username')->unique();
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('avatar_url')->nullable();
            
            // Gamification fields
            $table->integer('level')->default(1);
            $table->bigInteger('experience_points')->default(0);
            $table->integer('premium_currency')->default(0);
            $table->integer('total_streak_days')->default(0);
            $table->integer('current_streak_days')->default(0);
            $table->timestamp('last_activity_at')->nullable();
            
            // Settings
            $table->json('settings')->nullable();
            $table->boolean('notifications_enabled')->default(true);
            $table->string('timezone')->default('UTC');
            
            $table->rememberToken();
            $table->timestamps();
            
            // Indexes for performance
            $table->index(['level', 'experience_points']);
            $table->index('last_activity_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
