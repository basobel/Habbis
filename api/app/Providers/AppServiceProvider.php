<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\Habit;
use App\Models\Pet;
use App\Models\Battle;
use App\Models\Guild;
use App\Policies\HabitPolicy;
use App\Policies\PetPolicy;
use App\Policies\BattlePolicy;
use App\Policies\GuildPolicy;

class AppServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Habit::class => HabitPolicy::class,
        Pet::class => PetPolicy::class,
        Battle::class => BattlePolicy::class,
        Guild::class => GuildPolicy::class,
    ];

    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->registerPolicies();
    }

    /**
     * Register the application's policies.
     */
    public function registerPolicies(): void
    {
        foreach ($this->policies as $model => $policy) {
            Gate::policy($model, $policy);
        }
    }
}