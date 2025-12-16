# ⚡ Quick Start - Authentication Flow

## 🚀 5-Minute Setup

### 1. Environment Setup (30 seconds)

Create `.env.local` in the `admin` folder:

```bash
cd admin
echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:8000" > .env.local
```

### 2. Start Backend (1 minute)

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

Verify: http://localhost:8000/docs

### 3. Start Frontend (1 minute)

```bash
cd admin
npm install  # if not already done
npm run dev
```

Verify: http://localhost:3000

### 4. Test Authentication (2 minutes)

#### Sign Up:
1. Go to: http://localhost:3000/auth/sign-up
2. Create account:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `Password123!`
3. Auto-redirects to dashboard ✅

#### Sign In:
1. Sign out (profile dropdown → logout)
2. Go to: http://localhost:3000/auth/sign-in
3. Sign in with same credentials
4. Redirects to dashboard ✅

#### Check Auth:
1. Profile dropdown shows your username and email ✅
2. localStorage has auth token ✅
3. Refresh page - still signed in ✅

## ✅ That's It!

Your complete authentication system is working!

## 🔑 Key URLs

- **Sign Up**: http://localhost:3000/auth/sign-up
- **Sign In**: http://localhost:3000/auth/sign-in
- **Dashboard**: http://localhost:3000/dashboards
- **API Docs**: http://localhost:8000/docs

## 📖 Full Documentation

See `SETUP_GUIDE.md` for detailed testing and troubleshooting.

## 🎯 What's Integrated

✅ User signup/signin  
✅ Admin signup/signin  
✅ JWT tokens  
✅ Protected routes  
✅ Persistent auth  
✅ Auto-redirect  
✅ Profile dropdown  
✅ Token expiry  
✅ Form validation  
✅ Error handling  

## 🎉 Start Building!

Authentication is done - now you can focus on your app features!

