<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserStatistic;
use App\Models\UserEquipment;
use App\Models\UserAvatar;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Get current user profile with full data
     */
    public function getProfile(): JsonResponse
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Load relationships
        $user->load([
            'currentStatistics',
            'equippedItems',
            'activeAvatar',
            'achievements' => function($query) {
                $query->wherePivot('is_completed', true);
            }
        ]);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'avatar_url' => $user->avatar_url,
                'avatar_icon' => $user->avatar_icon,
                'level' => $user->level,
                'experience_points' => $user->experience_points,
                'regular_currency' => $user->regular_currency,
                'premium_currency' => $user->premium_currency,
                'is_premium' => $user->isPremiumActive(),
                'premium_expires_at' => $user->premium_expires_at,
                'current_streak_days' => $user->current_streak_days,
                'total_streak_days' => $user->total_streak_days,
                'last_activity_at' => $user->last_activity_at,
                'settings' => $user->settings,
                'avatar_preferences' => $user->avatar_preferences,
                'statistics' => $user->currentStatistics->first() ?: null,
                'equipment' => $user->equippedItems ?: [],
                'active_avatar' => $user->activeAvatar->first() ?: null,
                'achievements' => $user->achievements,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ]
        ]);
    }

    /**
     * Update user profile
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $validator = Validator::make($request->all(), [
            'username' => 'sometimes|string|max:255|unique:users,username,' . $user->id,
            'email' => 'sometimes|email|max:255|unique:users,email,' . $user->id,
            'avatar_url' => 'sometimes|nullable|url',
            'avatar_icon' => 'sometimes|string|max:50',
            'settings' => 'sometimes|array',
            'avatar_preferences' => 'sometimes|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user->update($request->only([
            'username',
            'email',
            'avatar_url',
            'avatar_icon',
            'settings',
            'avatar_preferences'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data' => $user->fresh()
        ]);
    }

    /**
     * Upload avatar
     */
    public function uploadAvatar(Request $request): JsonResponse
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $validator = Validator::make($request->all(), [
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Delete old avatar if exists
        if ($user->avatar_url) {
            $oldPath = str_replace('/storage/', '', $user->avatar_url);
            Storage::disk('public')->delete($oldPath);
        }

        // Store new avatar
        $path = $request->file('avatar')->store('avatars', 'public');
        $avatarUrl = Storage::url($path);

        $user->update(['avatar_url' => $avatarUrl]);

        return response()->json([
            'success' => true,
            'message' => 'Avatar uploaded successfully',
            'data' => [
                'avatar_url' => $avatarUrl
            ]
        ]);
    }

    /**
     * Get user statistics
     */
    public function getStatistics(): JsonResponse
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $statistics = $user->currentStatistics->first();
        
        if (!$statistics) {
            // Create default statistics if none exist
            $statistics = UserStatistic::create([
                'user_id' => $user->id,
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $statistics
        ]);
    }

    /**
     * Get user equipment
     */
    public function getEquipment(): JsonResponse
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $equipment = $user->equipment()->orderBy('type')->orderBy('rarity')->get();

        return response()->json([
            'success' => true,
            'data' => $equipment
        ]);
    }

    /**
     * Equip item
     */
    public function equipItem(Request $request): JsonResponse
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $validator = Validator::make($request->all(), [
            'item_id' => 'required|exists:user_equipment,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $item = $user->equipment()->findOrFail($request->item_id);
        $item->equip();

        return response()->json([
            'success' => true,
            'message' => 'Item equipped successfully',
            'data' => $item
        ]);
    }

    /**
     * Get user avatars
     */
    public function getAvatars(): JsonResponse
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $avatars = $user->avatars()->orderBy('is_active', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $avatars
        ]);
    }

    /**
     * Set active avatar
     */
    public function setActiveAvatar(Request $request): JsonResponse
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $validator = Validator::make($request->all(), [
            'avatar_id' => 'required|exists:user_avatars,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $avatar = $user->avatars()->findOrFail($request->avatar_id);
        $avatar->activate();

        return response()->json([
            'success' => true,
            'message' => 'Avatar activated successfully',
            'data' => $avatar
        ]);
    }

    /**
     * Add currency (for testing/admin purposes)
     */
    public function addCurrency(Request $request): JsonResponse
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $validator = Validator::make($request->all(), [
            'type' => 'required|in:regular,premium',
            'amount' => 'required|integer|min:1|max:10000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        if ($request->type === 'regular') {
            $user->addRegularCurrency($request->amount);
        } else {
            $user->addPremiumCurrency($request->amount);
        }

        return response()->json([
            'success' => true,
            'message' => 'Currency added successfully',
            'data' => [
                'regular_currency' => $user->regular_currency,
                'premium_currency' => $user->premium_currency,
            ]
        ]);
    }
}
