<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\LoginRequest;
use App\Http\Requests\Api\RegisterRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        // Rate limiting temporarily disabled for development

        $user = User::create([
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'timezone' => $request->timezone ?? 'UTC',
            'level' => 1,
            'experience_points' => 0,
            'premium_currency' => 100, // Welcome bonus
            'notifications_enabled' => true,
        ]);

        // Create default pet for new user
        $user->pets()->create([
            'name' => $request->pet_name ?? 'My Pet',
            'species' => $request->pet_species ?? 'dragon',
            'level' => 1,
            'experience_points' => 0,
            'is_active' => true,
        ]);

        // Send email verification
        $user->sendEmailVerificationNotification();

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'User registered successfully!',
            'user' => $user->load('pets'),
            'token' => $token,
            'email_verified' => false, // User needs to verify email
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        // Rate limiting temporarily disabled for development
        $credentials = $request->only('email', 'password');

        if (!Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $user = Auth::user();
        
        // Check if email is verified (temporarily disabled for development)
        // if (!$user->hasVerifiedEmail()) {
        //     Auth::logout();
        //     throw ValidationException::withMessages([
        //         'email' => ['Please verify your email address before logging in.'],
        //     ]);
        // }

        $user->update(['last_activity_at' => now()]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user->load(['pets', 'activeHabits']),
            'token' => $token,
            'email_verified' => true,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load(['pets', 'activeHabits', 'completedAchievements']);

        return response()->json([
            'user' => $user,
        ]);
    }

    public function refresh(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->tokens()->delete();

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Token refreshed successfully',
            'token' => $token,
        ]);
    }
}
