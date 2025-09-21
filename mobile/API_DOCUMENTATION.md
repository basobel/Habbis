# API Documentation

## Overview

This document describes the API endpoints and services used in the Habbis mobile application.

## Base URL

- Development: `http://localhost:8000/api`
- Production: `https://api.habbis.com/api`

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

## Services

### AuthService (`src/services/api.ts`)

#### `login(credentials: LoginCredentials)`
- **Method:** POST
- **Endpoint:** `/auth/login`
- **Description:** Authenticate user and return token
- **Request Body:**
  ```typescript
  {
    email: string;
    password: string;
  }
  ```
- **Response:**
  ```typescript
  {
    message: string;
    user: User;
    token: string;
    email_verified: boolean;
  }
  ```

#### `register(userData: RegisterData)`
- **Method:** POST
- **Endpoint:** `/auth/register`
- **Description:** Register new user
- **Request Body:**
  ```typescript
  {
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
    timezone?: string;
    pet_name?: string;
    pet_species?: string;
  }
  ```

#### `getMe()`
- **Method:** GET
- **Endpoint:** `/auth/me`
- **Description:** Get current user data
- **Response:**
  ```typescript
  {
    user: User;
  }
  ```

#### `logout()`
- **Method:** POST
- **Endpoint:** `/auth/logout`
- **Description:** Logout user and invalidate token

### UserService (`src/services/userService.ts`)

#### `getProfile()`
- **Method:** GET
- **Endpoint:** `/user/profile`
- **Description:** Get detailed user profile with statistics
- **Response:**
  ```typescript
  {
    success: boolean;
    data: UserProfile;
  }
  ```

#### `updateProfile(data: UpdateProfileData)`
- **Method:** PUT
- **Endpoint:** `/user/profile`
- **Description:** Update user profile
- **Request Body:**
  ```typescript
  {
    username?: string;
    email?: string;
    avatar_url?: string;
    settings?: Partial<UserSettings>;
    avatar_preferences?: Partial<AvatarPreferences>;
  }
  ```

#### `uploadAvatar(imageUri: string)`
- **Method:** POST
- **Endpoint:** `/user/avatar`
- **Description:** Upload and set user avatar
- **Request Body:** FormData with image file

#### `getStatistics()`
- **Method:** GET
- **Endpoint:** `/user/statistics`
- **Description:** Get user statistics

#### `getEquipment()`
- **Method:** GET
- **Endpoint:** `/user/equipment`
- **Description:** Get user equipment

#### `equipItem(equipmentId: number)`
- **Method:** POST
- **Endpoint:** `/user/equipment/equip`
- **Description:** Equip an item

#### `getAvatars()`
- **Method:** GET
- **Endpoint:** `/user/avatars`
- **Description:** Get user avatars

#### `setActiveAvatar(avatarId: number)`
- **Method:** POST
- **Endpoint:** `/user/avatars/set-active`
- **Description:** Set active avatar

#### `addCurrency(data: AddCurrencyData)`
- **Method:** POST
- **Endpoint:** `/user/currency/add`
- **Description:** Add currency (for testing/admin purposes)
- **Request Body:**
  ```typescript
  {
    type: 'regular' | 'premium';
    amount: number;
  }
  ```

## Error Handling

All API calls use the `apiClient` which includes:

1. **Request Interceptor:** Adds authentication token
2. **Response Interceptor:** Handles 401 errors by clearing tokens

### Error Response Format

```typescript
{
  message: string;
  error?: string;
  errors?: Record<string, string[]>;
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## Type Definitions

### User
```typescript
interface User {
  id: number;
  username: string;
  email: string;
  avatar_url?: string;
  level: number;
  experience_points: number;
  regular_currency: number;
  premium_currency: number;
  is_premium: boolean;
  premium_expires_at?: string;
  current_streak_days: number;
  total_streak_days: number;
  last_activity_at?: string;
  settings?: UserSettings;
  notifications_enabled: boolean;
  timezone: string;
  created_at: string;
  updated_at: string;
}
```

### UserProfile
```typescript
interface UserProfile {
  id: number;
  username: string;
  email: string;
  avatar_url?: string;
  level: number;
  experience_points: number;
  regular_currency: number;
  premium_currency: number;
  is_premium: boolean;
  premium_expires_at?: string;
  current_streak_days: number;
  total_streak_days: number;
  last_activity_at?: string;
  settings?: UserSettings;
  avatar_preferences?: AvatarPreferences;
  statistics?: UserStatistics;
  equipment: UserEquipment[];
  avatars: UserAvatar[];
  active_avatar?: UserAvatar;
  achievements: Achievement[];
  created_at: string;
  updated_at: string;
}
```

## Usage Examples

### Login
```typescript
import { authApi } from '@/services/api';

const loginUser = async (email: string, password: string) => {
  try {
    const response = await authApi.login({ email, password });
    // Store token and user data
    return response;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};
```

### Get User Profile
```typescript
import { userService } from '@/services/userService';

const fetchUserProfile = async () => {
  try {
    const profile = await userService.getProfile();
    return profile;
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    throw error;
  }
};
```

## Security

- All API calls use HTTPS in production
- Tokens are stored securely using `expo-secure-store`
- Tokens are automatically refreshed when expired
- Sensitive data is not logged in production

## Rate Limiting

- Login attempts are rate limited
- API calls are throttled to prevent abuse
- Rate limits are higher for authenticated users

## Testing

API endpoints can be tested using:

1. **Unit Tests:** Test service functions
2. **Integration Tests:** Test API calls with mock data
3. **E2E Tests:** Test complete user flows

See `__tests__/` directory for test examples.
