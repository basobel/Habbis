<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;

Route::get('/', function () {
    return response()->json([
        'message' => 'Habbis API',
        'version' => '1.0.0',
        'status' => 'running'
    ]);
});

// Password reset route for email links
Route::get('/password/reset/{token}', function (Request $request, $token) {
    $email = $request->query('email');
    
    if (!$email) {
        return response()->json(['error' => 'Email parameter is required'], 400);
    }

    $user = User::where('email', $email)->first();
    
    if (!$user) {
        return response()->json(['error' => 'User not found'], 404);
    }

    // Check if token is valid
    $passwordReset = \DB::table('password_reset_tokens')
        ->where('email', $email)
        ->where('token', $token)
        ->first();

    if (!$passwordReset) {
        return response()->json(['error' => 'Invalid or expired token'], 400);
    }

    // Check if token is expired
    if (now()->diffInMinutes($passwordReset->created_at) > 60) {
        return response()->json(['error' => 'Token has expired'], 400);
    }

    return response()->json([
        'message' => 'Token is valid',
        'email' => $email,
        'token' => $token
    ]);
})->name('password.reset');
