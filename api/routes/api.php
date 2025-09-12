<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\HabitController;
use App\Http\Controllers\Api\PetController;
use App\Http\Controllers\Api\BattleController;
use App\Http\Controllers\Api\GuildController;
use App\Http\Controllers\Api\AchievementController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::prefix('auth')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);
        Route::post('refresh', [AuthController::class, 'refresh']);
    });

    // User profile
    Route::get('profile', function (Request $request) {
        return $request->user()->load(['pets', 'activeHabits', 'completedAchievements']);
    });

    // Habits
    Route::apiResource('habits', HabitController::class);
    Route::post('habits/{habit}/complete', [HabitController::class, 'complete']);
    Route::post('habits/{habit}/skip', [HabitController::class, 'skip']);
    Route::get('habits/stats/overview', [HabitController::class, 'stats']);

    // Pets
    Route::apiResource('pets', PetController::class);
    Route::post('pets/{pet}/feed', [PetController::class, 'feed']);
    Route::post('pets/{pet}/evolve', [PetController::class, 'evolve']);
    Route::get('pets/{pet}/stats', [PetController::class, 'stats']);

    // Battles
    Route::apiResource('battles', BattleController::class)->only(['index', 'show', 'store']);
    Route::post('battles/{battle}/challenge', [BattleController::class, 'challenge']);
    Route::post('battles/{battle}/accept', [BattleController::class, 'accept']);
    Route::post('battles/{battle}/decline', [BattleController::class, 'decline']);
    Route::post('battles/{battle}/make-move', [BattleController::class, 'makeMove']);

    // Guilds
    Route::apiResource('guilds', GuildController::class);
    Route::post('guilds/{guild}/join', [GuildController::class, 'join']);
    Route::post('guilds/{guild}/leave', [GuildController::class, 'leave']);
    Route::post('guilds/{guild}/promote', [GuildController::class, 'promote']);
    Route::post('guilds/{guild}/kick', [GuildController::class, 'kick']);

    // Achievements
    Route::get('achievements', [AchievementController::class, 'index']);
    Route::get('achievements/{achievement}', [AchievementController::class, 'show']);
    Route::get('achievements/user/progress', [AchievementController::class, 'userProgress']);

    // Leaderboards
    Route::get('leaderboards/users', function () {
        return \App\Models\User::orderBy('experience_points', 'desc')
            ->limit(100)
            ->get(['id', 'username', 'level', 'experience_points']);
    });

    Route::get('leaderboards/pets', function () {
        return \App\Models\Pet::with('user:id,username')
            ->orderBy('level', 'desc')
            ->limit(100)
            ->get(['id', 'name', 'species', 'level', 'user_id']);
    });

    Route::get('leaderboards/guilds', function () {
        return \App\Models\Guild::orderBy('experience', 'desc')
            ->limit(50)
            ->get(['id', 'name', 'tag', 'level', 'experience', 'member_count']);
    });
});
