<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('guilds', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('tag', 10)->unique(); // Short guild tag
            $table->text('description')->nullable();
            $table->foreignId('leader_id')->constrained('users')->onDelete('cascade');
            
            // Guild stats
            $table->integer('level')->default(1);
            $table->bigInteger('experience')->default(0);
            $table->integer('member_count')->default(1);
            $table->integer('max_members')->default(50);
            
            // Guild settings
            $table->json('settings')->nullable();
            $table->string('banner_url')->nullable();
            $table->string('icon_url')->nullable();
            $table->boolean('is_public')->default(true);
            $table->boolean('auto_accept_members')->default(false);
            
            // Requirements
            $table->integer('min_level_required')->default(1);
            $table->integer('min_streak_required')->default(0);
            
            $table->timestamps();
            
            // Indexes
            $table->index(['level', 'experience']);
            $table->index('is_public');
            $table->index('leader_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('guilds');
    }
};
