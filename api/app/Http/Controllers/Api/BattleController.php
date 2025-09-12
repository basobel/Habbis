<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\CreateBattleRequest;
use App\Http\Requests\Api\MakeMoveRequest;
use App\Models\Battle;
use App\Models\Pet;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BattleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $battles = $request->user()
            ->pets()
            ->with(['challengerBattles', 'defenderBattles', 'wonBattles'])
            ->get()
            ->flatMap(function ($pet) {
                return $pet->challengerBattles
                    ->merge($pet->defenderBattles)
                    ->merge($pet->wonBattles);
            })
            ->unique('id')
            ->sortByDesc('created_at')
            ->values();

        return response()->json([
            'battles' => $battles,
        ]);
    }

    public function store(CreateBattleRequest $request): JsonResponse
    {
        $challengerPet = Pet::findOrFail($request->challenger_pet_id);
        $defenderPet = Pet::findOrFail($request->defender_pet_id);

        // Verify ownership
        if ($challengerPet->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $battle = Battle::create([
            'challenger_pet_id' => $challengerPet->id,
            'defender_pet_id' => $defenderPet->id,
            'battle_type' => $request->battle_type ?? 'pvp',
            'status' => 'pending',
            'max_rounds' => $request->max_rounds ?? 10,
        ]);

        return response()->json([
            'message' => 'Battle created successfully',
            'battle' => $battle->load(['challengerPet', 'defenderPet']),
        ], 201);
    }

    public function show(Battle $battle): JsonResponse
    {
        $this->authorize('view', $battle);

        return response()->json([
            'battle' => $battle->load(['challengerPet', 'defenderPet', 'winnerPet']),
        ]);
    }

    public function challenge(Request $request, Battle $battle): JsonResponse
    {
        $this->authorize('update', $battle);

        if ($battle->status !== 'pending') {
            return response()->json(['message' => 'Battle is not available for challenge'], 400);
        }

        $battle->update([
            'status' => 'in_progress',
            'started_at' => now(),
        ]);

        return response()->json([
            'message' => 'Battle challenge accepted',
            'battle' => $battle->fresh(),
        ]);
    }

    public function accept(Request $request, Battle $battle): JsonResponse
    {
        $this->authorize('update', $battle);

        if ($battle->status !== 'pending') {
            return response()->json(['message' => 'Battle is not available for acceptance'], 400);
        }

        $battle->update([
            'status' => 'in_progress',
            'started_at' => now(),
        ]);

        return response()->json([
            'message' => 'Battle accepted',
            'battle' => $battle->fresh(),
        ]);
    }

    public function decline(Request $request, Battle $battle): JsonResponse
    {
        $this->authorize('update', $battle);

        $battle->update([
            'status' => 'cancelled',
            'completed_at' => now(),
        ]);

        return response()->json([
            'message' => 'Battle declined',
            'battle' => $battle->fresh(),
        ]);
    }

    public function makeMove(MakeMoveRequest $request, Battle $battle): JsonResponse
    {
        $this->authorize('update', $battle);

        if ($battle->status !== 'in_progress') {
            return response()->json(['message' => 'Battle is not in progress'], 400);
        }

        // Simple battle logic - in a real implementation, this would be more complex
        $challengerPet = $battle->challengerPet;
        $defenderPet = $battle->defenderPet;

        $damage = $challengerPet->attack - $defenderPet->defense;
        $damage = max(1, $damage); // Minimum 1 damage

        $defenderPet->takeDamage($damage);

        $battle->increment('rounds_played');

        $battleLog = $battle->battle_log ?? [];
        $battleLog[] = [
            'round' => $battle->rounds_played,
            'attacker' => $challengerPet->id,
            'defender' => $defenderPet->id,
            'action' => 'attack',
            'damage' => $damage,
            'health_remaining' => $defenderPet->health,
            'timestamp' => now()->toISOString(),
        ];

        $battle->update(['battle_log' => $battleLog]);

        // Check if battle is over
        if ($defenderPet->health <= 0) {
            $battle->update([
                'status' => 'completed',
                'winner_pet_id' => $challengerPet->id,
                'completed_at' => now(),
            ]);

            // Award rewards
            $challengerPet->addExperience(50);
            $challengerPet->user->addPremiumCurrency(10);
        }

        return response()->json([
            'message' => 'Move made successfully',
            'battle' => $battle->fresh(),
            'damage_dealt' => $damage,
        ]);
    }
}
