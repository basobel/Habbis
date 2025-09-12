<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Achievement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AchievementController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $achievements = Achievement::with(['users' => function($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        }])
        ->orderBy('category')
        ->orderBy('rarity')
        ->get();

        return response()->json([
            'achievements' => $achievements,
        ]);
    }

    public function show(Achievement $achievement): JsonResponse
    {
        return response()->json([
            'achievement' => $achievement,
        ]);
    }

    public function userProgress(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $userAchievements = $user->achievements()
            ->withPivot(['progress', 'is_completed', 'completed_at', 'metadata'])
            ->get();

        $achievements = Achievement::all()->map(function ($achievement) use ($userAchievements) {
            $userAchievement = $userAchievements->firstWhere('id', $achievement->id);
            
            return [
                'id' => $achievement->id,
                'name' => $achievement->name,
                'description' => $achievement->description,
                'icon' => $achievement->icon,
                'category' => $achievement->category,
                'rarity' => $achievement->rarity,
                'progress' => $userAchievement ? $userAchievement->pivot->progress : 0,
                'is_completed' => $userAchievement ? $userAchievement->pivot->is_completed : false,
                'completed_at' => $userAchievement ? $userAchievement->pivot->completed_at : null,
                'progress_percentage' => $achievement->getProgressPercentage($user),
                'rarity_color' => $achievement->getRarityColor(),
            ];
        });

        $stats = [
            'total_achievements' => $achievements->count(),
            'completed_achievements' => $achievements->where('is_completed', true)->count(),
            'completion_percentage' => $achievements->count() > 0 
                ? round(($achievements->where('is_completed', true)->count() / $achievements->count()) * 100, 2)
                : 0,
            'by_category' => $achievements->groupBy('category')->map(function ($categoryAchievements) {
                return [
                    'total' => $categoryAchievements->count(),
                    'completed' => $categoryAchievements->where('is_completed', true)->count(),
                ];
            }),
            'by_rarity' => $achievements->groupBy('rarity')->map(function ($rarityAchievements) {
                return [
                    'total' => $rarityAchievements->count(),
                    'completed' => $rarityAchievements->where('is_completed', true)->count(),
                ];
            }),
        ];

        return response()->json([
            'achievements' => $achievements,
            'user_achievements' => $userAchievements,
            'stats' => $stats,
        ]);
    }
}
