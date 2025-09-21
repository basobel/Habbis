<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Dodajemy regularną walutę (punkty/coiny)
            $table->integer('regular_currency')->default(0)->after('premium_currency');
            
            // Dodajemy pole premium status
            $table->boolean('is_premium')->default(false)->after('regular_currency');
            $table->timestamp('premium_expires_at')->nullable()->after('is_premium');
            
            // Dodajemy pole dla statystyk
            $table->json('statistics')->nullable()->after('settings');
            
            // Dodajemy pole dla ekwipunku
            $table->json('equipment')->nullable()->after('statistics');
            
            // Dodajemy pole dla preferencji awatara
            $table->json('avatar_preferences')->nullable()->after('equipment');
            
            // Indeksy dla wydajności
            $table->index(['is_premium', 'premium_expires_at']);
            $table->index('regular_currency');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'regular_currency',
                'is_premium',
                'premium_expires_at',
                'statistics',
                'equipment',
                'avatar_preferences'
            ]);
        });
    }
};
