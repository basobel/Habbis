<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\CreateGuildRequest;
use App\Http\Requests\Api\UpdateGuildRequest;
use App\Http\Requests\Api\PromoteMemberRequest;
use App\Http\Requests\Api\KickMemberRequest;
use App\Models\Guild;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GuildController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $guilds = Guild::with(['leader', 'members'])
            ->where('is_public', true)
            ->orderBy('level', 'desc')
            ->orderBy('experience', 'desc')
            ->paginate(20);

        return response()->json([
            'guilds' => $guilds,
        ]);
    }

    public function store(CreateGuildRequest $request): JsonResponse
    {
        $guild = Guild::create([
            'name' => $request->name,
            'tag' => $request->tag,
            'description' => $request->description,
            'leader_id' => $request->user()->id,
            'is_public' => $request->is_public ?? true,
            'auto_accept_members' => $request->auto_accept_members ?? false,
            'min_level_required' => $request->min_level_required ?? 1,
            'min_streak_required' => $request->min_streak_required ?? 0,
        ]);

        // Add leader as member
        $guild->addMember($request->user(), 'leader');

        return response()->json([
            'message' => 'Guild created successfully',
            'guild' => $guild->load(['leader', 'members']),
        ], 201);
    }

    public function show(Guild $guild): JsonResponse
    {
        return response()->json([
            'guild' => $guild->load(['leader', 'members.user']),
        ]);
    }

    public function update(UpdateGuildRequest $request, Guild $guild): JsonResponse
    {
        $this->authorize('update', $guild);

        $guild->update($request->validated());

        return response()->json([
            'message' => 'Guild updated successfully',
            'guild' => $guild->fresh()->load(['leader', 'members']),
        ]);
    }

    public function destroy(Guild $guild): JsonResponse
    {
        $this->authorize('delete', $guild);

        $guild->delete();

        return response()->json([
            'message' => 'Guild deleted successfully',
        ]);
    }

    public function join(Request $request, Guild $guild): JsonResponse
    {
        $user = $request->user();

        if (!$guild->canJoin($user)) {
            return response()->json([
                'message' => 'You do not meet the requirements to join this guild',
            ], 400);
        }

        if ($guild->members()->where('user_id', $user->id)->exists()) {
            return response()->json([
                'message' => 'You are already a member of this guild',
            ], 400);
        }

        if ($guild->auto_accept_members) {
            $guild->addMember($user, 'member');
            $message = 'Successfully joined the guild';
        } else {
            // In a real implementation, you might create a join request here
            $message = 'Join request sent to guild leaders';
        }

        return response()->json([
            'message' => $message,
            'guild' => $guild->fresh()->load(['leader', 'members']),
        ]);
    }

    public function leave(Request $request, Guild $guild): JsonResponse
    {
        $user = $request->user();

        if (!$guild->members()->where('user_id', $user->id)->exists()) {
            return response()->json([
                'message' => 'You are not a member of this guild',
            ], 400);
        }

        if ($guild->isLeader($user)) {
            return response()->json([
                'message' => 'Guild leaders cannot leave. Transfer leadership first.',
            ], 400);
        }

        $guild->removeMember($user);

        return response()->json([
            'message' => 'Successfully left the guild',
        ]);
    }

    public function promote(PromoteMemberRequest $request, Guild $guild): JsonResponse
    {
        $this->authorize('update', $guild);

        $member = $guild->members()->where('user_id', $request->user_id)->first();
        
        if (!$member) {
            return response()->json([
                'message' => 'User is not a member of this guild',
            ], 400);
        }

        $member->update(['role' => $request->role]);

        return response()->json([
            'message' => 'Member promoted successfully',
            'guild' => $guild->fresh()->load(['leader', 'members']),
        ]);
    }

    public function kick(KickMemberRequest $request, Guild $guild): JsonResponse
    {
        $this->authorize('update', $guild);

        $member = $guild->members()->where('user_id', $request->user_id)->first();
        
        if (!$member) {
            return response()->json([
                'message' => 'User is not a member of this guild',
            ], 400);
        }

        if ($member->isLeader()) {
            return response()->json([
                'message' => 'Cannot kick the guild leader',
            ], 400);
        }

        $guild->removeMember($member->user);

        return response()->json([
            'message' => 'Member kicked successfully',
            'guild' => $guild->fresh()->load(['leader', 'members']),
        ]);
    }
}
