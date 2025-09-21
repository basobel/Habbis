<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_avatars', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Podstawowe informacje o awatarze
            $table->string('avatar_type')->default('default'); // default, custom, generated
            $table->string('avatar_url')->nullable();
            $table->string('avatar_name')->nullable();
            
            // Konfiguracja awatara
            $table->json('avatar_config')->nullable(); // Kolory, style, elementy
            
            // Czy jest aktywny
            $table->boolean('is_active')->default(true);
            
            // Czy jest domyślny
            $table->boolean('is_default')->default(false);
            
            // Kiedy został utworzony
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();
            
            // Indeksy
            $table->index(['user_id', 'is_active']);
            $table->index(['user_id', 'is_default']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_avatars');
    }
};
