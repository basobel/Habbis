<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('guild_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('guild_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('role', ['leader', 'officer', 'member'])->default('member');
            $table->integer('contribution_points')->default(0);
            $table->timestamp('joined_at');
            $table->timestamp('last_contribution_at')->nullable();
            
            $table->timestamps();
            
            // Unique constraint
            $table->unique(['guild_id', 'user_id']);
            
            // Indexes
            $table->index(['guild_id', 'role']);
            $table->index(['user_id', 'contribution_points']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('guild_members');
    }
};
