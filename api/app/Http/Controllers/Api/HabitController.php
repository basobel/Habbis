<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\CreateHabitRequest;
use App\Http\Requests\Api\UpdateHabitRequest;
use App\Http\Requests\Api\CompleteHabitRequest;
use App\Models\Habit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HabitController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $habits = $request->user()
            ->habits()
            ->with(['logs' => function($query) {
                $query->whereDate('date', today());
            }])
            ->when($request->active, function($query) {
                $query->where('is_active', true);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'habits' => $habits,
        ]);
    }

    public function store(CreateHabitRequest $request): JsonResponse
    {
        $habit = $request->user()->habits()->create([
            'name' => $request->name,
            'description' => $request->description,
            'difficulty' => $request->difficulty,
            'target_frequency' => $request->target_frequency ?? 1,
            'target_days' => $request->target_days ?? [1,2,3,4,5,6,7],
            'base_xp_reward' => $this->calculateBaseXpReward($request->difficulty),
            'streak_bonus_xp' => $this->calculateStreakBonusXp($request->difficulty),
            'premium_currency_reward' => $request->premium_currency_reward ?? 0,
            'reminder_times' => $request->reminder_times ?? [],
            'color' => $request->color ?? '#3B82F6',
            'icon' => $request->icon ?? 'star',
        ]);

        return response()->json([
            'message' => 'Habit created successfully',
            'habit' => $habit,
        ], 201);
    }

    public function show(Habit $habit): JsonResponse
    {
        $this->authorize('view', $habit);

        $habit->load(['logs' => function($query) {
            $query->orderBy('date', 'desc')->limit(30);
        }]);

        return response()->json([
            'habit' => $habit,
            'streak_status' => $habit->getStreakStatus(),
            'completion_rate' => $habit->getCompletionRate(),
        ]);
    }

    public function update(UpdateHabitRequest $request, Habit $habit): JsonResponse
    {
        $this->authorize('update', $habit);

        $habit->update($request->validated());

        return response()->json([
            'message' => 'Habit updated successfully',
            'habit' => $habit,
        ]);
    }

    public function destroy(Habit $habit): JsonResponse
    {
        $this->authorize('delete', $habit);

        $habit->delete();

        return response()->json([
            'message' => 'Habit deleted successfully',
        ]);
    }

    public function complete(CompleteHabitRequest $request, Habit $habit): JsonResponse
    {
        $this->authorize('update', $habit);

        if ($habit->isCompletedToday()) {
            return response()->json([
                'message' => 'Habit already completed today',
                'habit_log' => $habit->todayLog()->where('completed', true)->first(),
            ], 400);
        }

        $habitLog = $habit->completeHabit($request->notes);

        return response()->json([
            'message' => 'Habit completed successfully!',
            'habit_log' => $habitLog,
            'rewards' => [
                'xp_gained' => $habitLog->xp_gained,
                'premium_currency_gained' => $habitLog->premium_currency_gained,
            ],
            'streak_status' => $habit->fresh()->getStreakStatus(),
        ]);
    }

    public function skip(Request $request, Habit $habit): JsonResponse
    {
        $this->authorize('update', $habit);

        if ($habit->todayLog()->exists()) {
            return response()->json([
                'message' => 'Habit already logged today',
            ], 400);
        }

        $habitLog = $habit->skipHabit($request->reason);

        return response()->json([
            'message' => 'Habit skipped',
            'habit_log' => $habitLog,
            'streak_status' => $habit->fresh()->getStreakStatus(),
        ]);
    }

    public function stats(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $stats = [
            'total_habits' => $user->habits()->count(),
            'active_habits' => $user->activeHabits()->count(),
            'total_completions' => $user->getTotalHabitsCompleted(),
            'current_streak' => $user->getCurrentStreak(),
            'longest_streak' => $user->habits()->max('longest_streak') ?? 0,
            'completion_rate' => $this->calculateOverallCompletionRate($user),
            'weekly_progress' => $this->getWeeklyProgress($user),
            'monthly_progress' => $this->getMonthlyProgress($user),
        ];

        return response()->json([
            'stats' => $stats,
        ]);
    }

    private function calculateBaseXpReward(string $difficulty): int
    {
        return match($difficulty) {
            'easy' => 10,
            'medium' => 20,
            'hard' => 40,
            'expert' => 80,
            default => 10,
        };
    }

    private function calculateStreakBonusXp(string $difficulty): int
    {
        return match($difficulty) {
            'easy' => 2,
            'medium' => 5,
            'hard' => 10,
            'expert' => 20,
            default => 2,
        };
    }

    private function calculateOverallCompletionRate(User $user): float
    {
        $totalHabits = $user->habits()->count();
        if ($totalHabits === 0) return 0.0;

        $totalCompletions = $user->habits()->sum('total_completions');
        $totalDays = $user->created_at->diffInDays(now()) + 1;
        $totalPossibleCompletions = $totalHabits * $totalDays;

        return round(($totalCompletions / $totalPossibleCompletions) * 100, 2);
    }

    private function getWeeklyProgress(User $user): array
    {
        $startOfWeek = now()->startOfWeek();
        $endOfWeek = now()->endOfWeek();

        $logs = $user->habitLogs()
            ->whereBetween('date', [$startOfWeek, $endOfWeek])
            ->where('completed', true)
            ->get()
            ->groupBy(function($log) {
                return $log->date->format('Y-m-d');
            });

        $progress = [];
        for ($i = 0; $i < 7; $i++) {
            $date = $startOfWeek->copy()->addDays($i);
            $dayKey = $date->format('Y-m-d');
            $progress[] = [
                'date' => $dayKey,
                'day_name' => $date->format('l'),
                'completions' => $logs->get($dayKey, collect())->count(),
            ];
        }

        return $progress;
    }

    private function getMonthlyProgress(User $user): array
    {
        $startOfMonth = now()->startOfMonth();
        $endOfMonth = now()->endOfMonth();

        $logs = $user->habitLogs()
            ->whereBetween('date', [$startOfMonth, $endOfMonth])
            ->where('completed', true)
            ->get()
            ->groupBy(function($log) {
                return $log->date->format('Y-m-d');
            });

        $progress = [];
        $currentDate = $startOfMonth->copy();
        
        while ($currentDate->lte($endOfMonth)) {
            $dayKey = $currentDate->format('Y-m-d');
            $progress[] = [
                'date' => $dayKey,
                'completions' => $logs->get($dayKey, collect())->count(),
            ];
            $currentDate->addDay();
        }

        return $progress;
    }
}
