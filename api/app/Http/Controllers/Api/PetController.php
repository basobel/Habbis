<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\CreatePetRequest;
use App\Http\Requests\Api\UpdatePetRequest;
use App\Models\Pet;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PetController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $pets = $request->user()->pets()->orderBy('created_at', 'desc')->get();

        return response()->json([
            'pets' => $pets,
        ]);
    }

    public function store(CreatePetRequest $request): JsonResponse
    {
        $pet = $request->user()->pets()->create([
            'name' => $request->name,
            'species' => $request->species,
            'attack' => $request->attack ?? 10,
            'defense' => $request->defense ?? 10,
            'speed' => $request->speed ?? 10,
            'health' => $request->health ?? 100,
            'max_health' => $request->max_health ?? 100,
            'customization' => $request->customization ?? [],
        ]);

        return response()->json([
            'message' => 'Pet created successfully',
            'pet' => $pet,
        ], 201);
    }

    public function show(Pet $pet): JsonResponse
    {
        $this->authorize('view', $pet);

        return response()->json([
            'pet' => $pet,
        ]);
    }

    public function update(UpdatePetRequest $request, Pet $pet): JsonResponse
    {
        $this->authorize('update', $pet);

        $pet->update($request->validated());

        return response()->json([
            'message' => 'Pet updated successfully',
            'pet' => $pet,
        ]);
    }

    public function destroy(Pet $pet): JsonResponse
    {
        $this->authorize('delete', $pet);

        $pet->delete();

        return response()->json([
            'message' => 'Pet deleted successfully',
        ]);
    }

    public function feed(Pet $pet): JsonResponse
    {
        $this->authorize('update', $pet);

        $pet->feed();

        return response()->json([
            'message' => 'Pet fed successfully',
            'pet' => $pet->fresh(),
        ]);
    }

    public function evolve(Pet $pet): JsonResponse
    {
        $this->authorize('update', $pet);

        $oldStage = $pet->evolution_stage;
        $pet->checkEvolution();

        if ($pet->evolution_stage > $oldStage) {
            return response()->json([
                'message' => 'Pet evolved successfully!',
                'pet' => $pet->fresh(),
                'evolution_occurred' => true,
            ]);
        }

        return response()->json([
            'message' => 'Pet is not ready for evolution yet',
            'pet' => $pet->fresh(),
            'evolution_occurred' => false,
        ]);
    }

    public function stats(Pet $pet): JsonResponse
    {
        $this->authorize('view', $pet);

        $stats = [
            'battle_power' => $pet->getBattlePower(),
            'is_healthy' => $pet->isHealthy(),
            'evolution_thresholds' => $pet->getEvolutionThresholds(),
            'next_evolution_level' => $pet->getEvolutionThresholds()[$pet->evolution_stage + 1] ?? null,
        ];

        return response()->json([
            'pet' => $pet,
            'stats' => $stats,
        ]);
    }
}
