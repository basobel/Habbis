<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_equipment', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Typ ekwipunku
            $table->enum('type', ['avatar', 'pet_accessory', 'background', 'frame', 'badge'])->index();
            
            // ID przedmiotu (może być z tabeli items lub bezpośrednio)
            $table->string('item_id');
            $table->string('item_name');
            $table->text('item_description')->nullable();
            
            // Rzadkość przedmiotu
            $table->enum('rarity', ['common', 'uncommon', 'rare', 'epic', 'legendary'])->default('common');
            
            // Czy jest wyposażony
            $table->boolean('is_equipped')->default(false);
            
            // Kiedy został zdobyty
            $table->timestamp('acquired_at')->useCurrent();
            
            // Metadane przedmiotu (kolory, animacje, itp.)
            $table->json('metadata')->nullable();
            
            $table->timestamps();
            
            // Indeksy
            $table->index(['user_id', 'type', 'is_equipped']);
            $table->index(['user_id', 'rarity']);
            $table->unique(['user_id', 'item_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_equipment');
    }
};
