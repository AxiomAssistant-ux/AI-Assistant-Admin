# 🚀 Complete Authentication Setup Guide

This guide will help you set up and test the complete end-to-end authentication flow.

## ✅ What's Been Implemented

### Backend Integration
- ✅ API client for HTTP requests
- ✅ Auth API functions for all backend endpoints
- ✅ Token storage with expiry management
- ✅ JWT Bearer token authentication

### Frontend Components
- ✅ Sign In page with validation
- ✅ Sign Up page with validation
- ✅ Auth Context for global state
- ✅ Protected routes with Auth Guard
- ✅ Profile dropdown with user info
- ✅ Auto-redirect on auth state changes

### Security Features
- ✅ Token expiry checking
- ✅ Secure localStorage management
- ✅ Role-based access control
- ✅ Automatic logout on token expiry
- ✅ Protected admin routes

## 📋 Setup Instructions

### Step 1: Environment Configuration

Create a `.env.local` file in the `admin` directory:

```bash
cd /Users/apple/Desktop/Agentic-AI-HR/admin
```

Create the file with:

```bash
echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:8000" > .env.local
```

Or manually create `.env.local` and add:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### Step 2: Start the Backend

Make sure your backend is running:

```bash
cd /Users/apple/Desktop/Agentic-AI-HR/backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend should be available at: http://localhost:8000

### Step 3: Start the Frontend

In a new terminal:

```bash
cd /Users/apple/Desktop/Agentic-AI-HR/admin
npm run dev
# or
yarn dev
# or
pnpm dev
```

Frontend will be available at: http://localhost:3000

## 🧪 Testing the Authentication Flow

### Test 1: User Sign Up

1. Navigate to: http://localhost:3000/auth/sign-up
2. Fill in the form:
   - Username: testuser (3-64 chars)
   - Email: test@example.com (valid email)
   - Password: Password123! (min 8 chars)
3. Click "Sign Up"
4. Should automatically sign in and redirect to dashboard
5. Check browser localStorage for auth token

### Test 2: User Sign In

1. Navigate to: http://localhost:3000/auth/sign-in
2. Enter your credentials:
   - Email: test@example.com
   - Password: Password123!
3. Click "Sign In"
4. Should redirect to dashboard with user info visible

### Test 3: Protected Routes

1. While signed in, navigate to: http://localhost:3000/dashboards
2. Should see dashboard content
3. Check profile dropdown (top right) - should show:
   - Your username
   - Your email
   - Your role badge

### Test 4: Sign Out

1. Click profile dropdown (top right)
2. Click "Logout"
3. Should redirect to sign-in page
4. Try accessing http://localhost:3000/dashboards
5. Should auto-redirect to sign-in page

### Test 5: Token Persistence

1. Sign in successfully
2. Refresh the page
3. Should remain signed in
4. Check browser DevTools → Application → Local Storage
5. Should see:
   - `auth_token`
   - `auth_user`
   - `auth_token_expiry`

### Test 6: Admin User (Optional)

Create an admin user via backend directly or Postman:

```bash
POST http://localhost:8000/auth/admin/signup
Content-Type: application/json

{
  "username": "admin",
  "email": "admin@example.com",
  "password": "AdminPass123!"
}
```

Then sign in at: http://localhost:3000/auth/sign-in
Profile dropdown should show "admin" badge.

## 🔍 Verifying Everything Works

### Check Browser Console

Open DevTools (F12) → Console. You should NOT see:
- ❌ CORS errors
- ❌ 401 Unauthorized errors
- ❌ Network errors

You might see:
- ✅ Successful API calls
- ✅ User data logs

### Check Network Tab

Open DevTools (F12) → Network → Fetch/XHR:

**On Sign In:**
- POST to `/auth/user/signin`
- Status: 200 OK
- Response includes: `access_token`, `user` object

**On Protected Pages:**
- Requests include `Authorization: Bearer <token>` header
- Status: 200 OK

### Check localStorage

Open DevTools (F12) → Application → Local Storage → http://localhost:3000:

Should see:
- `auth_token`: JWT token string
- `auth_user`: JSON string with user data
- `auth_token_expiry`: Timestamp

## 🐛 Troubleshooting

### "Network error" on sign in

**Problem:** Cannot connect to backend

**Solutions:**
1. Verify backend is running: http://localhost:8000
2. Check backend logs for errors
3. Verify `.env.local` has correct URL
4. Check CORS settings in backend

### "Failed to fetch"

**Problem:** CORS or network issue

**Solutions:**
1. Add to backend's `main.py`:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Redirect loop

**Problem:** Auth guard causing infinite redirects

**Solutions:**
1. Clear localStorage: DevTools → Application → Clear storage
2. Sign in again
3. Check browser console for errors

### "Token expired" immediately

**Problem:** System clock mismatch or backend issue

**Solutions:**
1. Check backend token expiry settings
2. Verify system clocks are synchronized
3. Check backend JWT configuration

## 📁 Files Created/Modified

### Created Files:
```
admin/
├── .env.local (create manually)
├── .env.example
├── SETUP_GUIDE.md (this file)
├── README_AUTH.md
└── src/
    ├── lib/
    │   ├── api-client.ts
    │   ├── auth-api.ts
    │   ├── auth-storage.ts
    │   └── auth-guard.tsx
    └── context/
        └── useAuthContext.tsx
```

### Modified Files:
```
admin/src/
├── types/auth.ts
├── app/(admin)/layout.tsx
├── app/(other)/auth/
│   ├── sign-in/components/SignIn.tsx
│   └── sign-up/components/SignUp.tsx
├── components/
│   ├── wrapper/AppProvidersWrapper.tsx
│   └── layout/TopNavigationBar/components/ProfileDropdown.tsx
```

## 🎯 API Endpoints Used

### User Authentication
- `POST /auth/user/signup` - Create user account
- `POST /auth/user/signin` - User login
- `GET /auth/user/user-profile` - Get user profile

### Admin Authentication
- `POST /auth/admin/signup` - Create admin account
- `POST /auth/admin/signin` - Admin login

### Password Reset (Ready to integrate)
- `POST /auth/password/forgot-password`
- `POST /auth/password/verify-reset-token`
- `POST /auth/password/reset-password`
- `POST /auth/password/reject-reset`

## 🚀 Next Steps

1. **Test the flow end-to-end**
2. **Customize the UI** as needed
3. **Add password reset** functionality
4. **Implement remember me** feature
5. **Add token refresh** logic
6. **Set up error tracking**
7. **Add loading states** for better UX
8. **Implement role-based UI** differences

## 📚 Additional Resources

- Backend API docs: `/backend/project_readme.md`
- Auth implementation: `README_AUTH.md`
- React Hook Form: https://react-hook-form.com/
- Next.js docs: https://nextjs.org/docs

## ✨ Features Included

- ✅ JWT token authentication
- ✅ User and admin roles
- ✅ Protected routes
- ✅ Persistent authentication
- ✅ Auto-redirect logic
- ✅ Error handling
- ✅ Loading states
- ✅ Form validation
- ✅ Profile management
- ✅ Secure token storage

## 🎉 You're All Set!

Your authentication system is now fully integrated and ready to use. Start by creating a test account and exploring the dashboard!

