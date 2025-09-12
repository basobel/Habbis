<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('species'); // dragon, phoenix, wolf, etc.
            $table->integer('level')->default(1);
            $table->bigInteger('experience')->default(0);
            $table->integer('evolution_stage')->default(1);
            
            // Battle stats
            $table->integer('attack')->default(10);
            $table->integer('defense')->default(10);
            $table->integer('speed')->default(10);
            $table->integer('health')->default(100);
            $table->integer('max_health')->default(100);
            
            // Appearance
            $table->string('skin_id')->nullable(); // Premium skins
            $table->json('customization')->nullable(); // Color, accessories, etc.
            $table->string('avatar_url')->nullable();
            
            // Status
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_fed_at')->nullable();
            $table->timestamp('last_battled_at')->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->index(['user_id', 'is_active']);
            $table->index(['species', 'level']);
            $table->index('evolution_stage');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pets');
    }
};
