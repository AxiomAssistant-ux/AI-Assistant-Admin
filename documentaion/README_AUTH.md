# Authentication Integration Guide

This document describes the complete end-to-end authentication flow integrated with the backend API.

## Overview

The authentication system is fully integrated with the backend API endpoints and provides:

- User and Admin signup/signin
- JWT token management
- Protected routes
- Role-based access control
- Persistent authentication state
- Password reset functionality

## Architecture

### Key Components

1. **API Client** (`src/lib/api-client.ts`)
   - Generic HTTP client for making API requests
   - Handles JSON parsing and error responses
   - Supports Bearer token authentication

2. **Auth API** (`src/lib/auth-api.ts`)
   - Authentication-specific API functions
   - User/Admin signup and signin
   - Password management
   - Profile operations

3. **Auth Storage** (`src/lib/auth-storage.ts`)
   - LocalStorage management for tokens and user data
   - Token expiry checking
   - Secure token handling

4. **Auth Context** (`src/context/useAuthContext.tsx`)
   - Global authentication state
   - Sign in/up/out operations
   - User data management
   - Auto-redirect on authentication state changes

5. **Auth Guard** (`src/lib/auth-guard.tsx`)
   - Protected route component
   - Role-based access control
   - Automatic redirects for unauthorized access

## Setup

### 1. Environment Configuration

Create a `.env.local` file in the admin directory:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### 2. Backend Configuration

Ensure your backend is running on the configured URL (default: http://localhost:8000)

The following endpoints are used:
- `POST /auth/user/signup` - User registration
- `POST /auth/user/signin` - User login
- `POST /auth/admin/signup` - Admin registration
- `POST /auth/admin/signin` - Admin login
- `GET /auth/user/user-profile` - Get user profile

## Usage

### Sign In Flow

1. User navigates to `/auth/sign-in`
2. Enters email and password
3. Frontend calls `authApi.userSignIn()`
4. Backend returns JWT token and user data
5. Token and user saved to localStorage
6. User redirected to dashboard
7. All subsequent requests include Bearer token

### Sign Up Flow

1. User navigates to `/auth/sign-up`
2. Enters username, email, and password
3. Frontend calls `authApi.userSignUp()`
4. Backend creates user account
5. Automatically signs in the user
6. User redirected to dashboard

### Protected Routes

Wrap any component or layout with `AuthGuard`:

```tsx
import AuthGuard from '@/lib/auth-guard'

export default function ProtectedPage() {
  return (
    <AuthGuard>
      <YourComponent />
    </AuthGuard>
  )
}
```

For role-specific protection:

```tsx
<AuthGuard requireRole="admin">
  <AdminOnlyComponent />
</AuthGuard>
```

### Using Auth in Components

```tsx
'use client'
import { useAuth } from '@/context/useAuthContext'

export default function MyComponent() {
  const { user, token, isAuthenticated, signOut } = useAuth()

  return (
    <div>
      <p>Welcome, {user?.username}!</p>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}
```

### Making Authenticated API Calls

```tsx
import { apiClient } from '@/lib/api-client'
import { authStorage } from '@/lib/auth-storage'

// Get the token
const token = authStorage.getToken()

// Make authenticated request
const response = await apiClient.get('/auth/user/summaries', token)
```

## API Response Types

### UserOut
```typescript
{
  id: string
  username: string
  email: string
  role: 'admin' | 'user'
  agent_id: string | null
  created_at: string
}
```

### TokenOut
```typescript
{
  access_token: string
  token_type: string
  expires_in: number
  user: UserOut
}
```

## Security Features

1. **Token Expiry**: Tokens automatically expire based on backend configuration
2. **Secure Storage**: Tokens stored in localStorage with expiry timestamps
3. **Auto Logout**: Expired tokens trigger automatic logout
4. **Protected Routes**: Unauthorized access automatically redirects to signin
5. **Role-Based Access**: Admin and user roles enforced throughout the app

## Error Handling

The system handles various error scenarios:

- Invalid credentials
- Network errors
- Token expiry
- Unauthorized access
- Server errors

All errors are displayed to users with appropriate messages.

## Testing

### Test User Flow
1. Navigate to http://localhost:3000/auth/sign-up
2. Create a new user account
3. Verify automatic login and redirect
4. Check localStorage for token
5. Refresh page to verify persistent auth
6. Sign out and verify token removal

### Test Admin Flow
1. Use admin signup endpoint via Postman or directly
2. Sign in through `/auth/sign-in`
3. Verify admin role badge in profile dropdown
4. Check access to admin-only features

## Troubleshooting

### "Network error" on signin
- Verify backend is running on correct port
- Check NEXT_PUBLIC_API_BASE_URL in .env.local
- Verify CORS settings on backend

### "Token expired" messages
- Check token expiry time in backend
- Verify system clocks are synchronized
- Clear localStorage and re-authenticate

### Redirect loop
- Clear browser localStorage
- Verify AuthGuard is not nested incorrectly
- Check for conflicting navigation logic

## Next Steps

Additional features you can implement:

1. **Refresh Tokens**: Implement token refresh before expiry
2. **Remember Me**: Extended token duration for persistent login
3. **Password Reset**: Integrate with `/auth/password/*` endpoints
4. **Social Auth**: Add OAuth providers
5. **2FA**: Two-factor authentication
6. **Session Management**: Multiple device tracking

## Files Modified/Created

### Created:
- `src/lib/api-client.ts` - HTTP client
- `src/lib/auth-api.ts` - Auth API functions
- `src/lib/auth-storage.ts` - Token storage utilities
- `src/lib/auth-guard.tsx` - Protected route component
- `src/context/useAuthContext.tsx` - Auth context provider
- `.env.example` - Environment variables template

### Modified:
- `src/types/auth.ts` - Updated with backend types
- `src/app/(other)/auth/sign-in/components/SignIn.tsx` - Integrated API
- `src/app/(other)/auth/sign-up/components/SignUp.tsx` - Integrated API
- `src/components/wrapper/AppProvidersWrapper.tsx` - Added AuthProvider
- `src/app/(admin)/layout.tsx` - Added AuthGuard
- `src/components/layout/TopNavigationBar/components/ProfileDropdown.tsx` - Added auth state

## Support

For backend API documentation, refer to `/backend/project_readme.md`

