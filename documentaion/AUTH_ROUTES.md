# 🔐 Authentication Routes Guide

## Overview

The application now has **separate authentication routes** for Users and Admins.

---

## 🎯 Frontend Routes

### User Authentication Routes

#### **User Sign In**
- **URL**: `/auth/sign-in`
- **Backend Endpoint**: `POST /auth/user/signin`
- **Features**:
  - User login form
  - Email + password validation
  - "User" badge indicator
  - Link to admin sign-in
  - Link to user sign-up

#### **User Sign Up**
- **URL**: `/auth/sign-up`
- **Backend Endpoint**: `POST /auth/user/signup`
- **Features**:
  - User registration form
  - Username, email, password validation
  - "User" badge indicator
  - Link to admin sign-up
  - Link to user sign-in

---

### Admin Authentication Routes

#### **Admin Sign In**
- **URL**: `/auth/admin/sign-in`
- **Backend Endpoint**: `POST /auth/admin/signin`
- **Features**:
  - Admin login form
  - Email + password validation
  - "Admin" badge indicator (red)
  - Link back to user sign-in
  - Link to admin sign-up

#### **Admin Sign Up**
- **URL**: `/auth/admin/sign-up`
- **Backend Endpoint**: `POST /auth/admin/signup`
- **Features**:
  - Admin registration form
  - Username, email, password validation
  - "Admin" badge indicator (red)
  - Link back to user sign-up
  - Link to admin sign-in

---

## 🎨 Visual Differences

### User Pages
- **Badge**: Blue "User" badge
- **Button**: Primary blue button
- **Styling**: Standard user interface
- **Navigation**: Links to admin pages at bottom

### Admin Pages
- **Badge**: Red "Admin" badge
- **Button**: Red/danger button
- **Styling**: Admin-focused interface
- **Navigation**: Links back to user pages

---

## 🔄 Navigation Flow

### From User to Admin
```
User Sign In (/auth/sign-in)
    ↓ Click "Admin Sign In →"
Admin Sign In (/auth/admin/sign-in)

User Sign Up (/auth/sign-up)
    ↓ Click "Create Admin Account →"
Admin Sign Up (/auth/admin/sign-up)
```

### From Admin to User
```
Admin Sign In (/auth/admin/sign-in)
    ↓ Click "← Back to User Sign In"
User Sign In (/auth/sign-in)

Admin Sign Up (/auth/admin/sign-up)
    ↓ Click "← Create User Account Instead"
User Sign Up (/auth/sign-up)
```

---

## 🔌 Backend Endpoints Mapping

| Frontend Route | Backend Endpoint | Purpose |
|---------------|------------------|---------|
| `/auth/sign-in` | `POST /auth/user/signin` | User login |
| `/auth/sign-up` | `POST /auth/user/signup` | User registration |
| `/auth/admin/sign-in` | `POST /auth/admin/signin` | Admin login |
| `/auth/admin/sign-up` | `POST /auth/admin/signup` | Admin registration |

---

## 🧪 Testing Guide

### Test User Flow

1. **Navigate to User Sign Up**
   ```
   http://localhost:3000/auth/sign-up
   ```

2. **Create User Account**
   - Username: `testuser`
   - Email: `user@example.com`
   - Password: `Password123!`

3. **Verify User Login**
   - Should auto-login after signup
   - Profile shows "user" role badge

4. **Test User Sign In**
   - Sign out
   - Go to: `http://localhost:3000/auth/sign-in`
   - Sign in with user credentials

### Test Admin Flow

1. **Navigate to Admin Sign Up**
   ```
   http://localhost:3000/auth/admin/sign-up
   ```

2. **Create Admin Account**
   - Username: `admin`
   - Email: `admin@example.com`
   - Password: `AdminPass123!`

3. **Verify Admin Login**
   - Should auto-login after signup
   - Profile shows "admin" role badge

4. **Test Admin Sign In**
   - Sign out
   - Go to: `http://localhost:3000/auth/admin/sign-in`
   - Sign in with admin credentials

### Test Navigation

1. **User → Admin Navigation**
   - Go to `/auth/sign-in`
   - Click "Admin Sign In →"
   - Should navigate to `/auth/admin/sign-in`

2. **Admin → User Navigation**
   - Go to `/auth/admin/sign-in`
   - Click "← Back to User Sign In"
   - Should navigate to `/auth/sign-in`

---

## 📁 File Structure

```
admin/src/app/(other)/auth/
├── sign-in/                          # User sign-in
│   ├── components/
│   │   └── SignIn.tsx               # User login component
│   └── page.tsx                      # User login page
│
├── sign-up/                          # User sign-up
│   ├── components/
│   │   └── SignUp.tsx               # User registration component
│   └── page.tsx                      # User registration page
│
└── admin/                            # Admin routes
    ├── sign-in/                      # Admin sign-in
    │   ├── components/
    │   │   └── AdminSignIn.tsx      # Admin login component
    │   └── page.tsx                  # Admin login page
    │
    └── sign-up/                      # Admin sign-up
        ├── components/
        │   └── AdminSignUp.tsx      # Admin registration component
        └── page.tsx                  # Admin registration page
```

---

## 🎯 Key Differences

### User Authentication
- **Target Users**: Regular platform users
- **Endpoint**: `/auth/user/*`
- **Visual**: Blue badges and buttons
- **Access**: Dashboard with user permissions

### Admin Authentication
- **Target Users**: Platform administrators
- **Endpoint**: `/auth/admin/*`
- **Visual**: Red badges and buttons
- **Access**: Dashboard with admin permissions

---

## ✅ Features Implemented

- ✅ Separate user and admin routes
- ✅ Visual distinction (badges, colors)
- ✅ Proper backend endpoint mapping
- ✅ Cross-navigation between user/admin
- ✅ Clear labeling and UX
- ✅ Role-based redirects after login
- ✅ Same authentication context
- ✅ Consistent validation rules

---

## 🚀 Quick URLs

### Development URLs

**User Routes:**
- User Sign In: http://localhost:3000/auth/sign-in
- User Sign Up: http://localhost:3000/auth/sign-up

**Admin Routes:**
- Admin Sign In: http://localhost:3000/auth/admin/sign-in
- Admin Sign Up: http://localhost:3000/auth/admin/sign-up

**After Authentication:**
- Dashboard: http://localhost:3000/dashboards

---

## 📝 Notes

1. **Same Auth Context**: Both user and admin routes use the same `useAuth()` context
2. **Backend Determines Role**: The backend assigns the role (user/admin) based on which signup endpoint is used
3. **Visual Feedback**: Badges and button colors help users identify which type of account they're creating/accessing
4. **Navigation Links**: Each auth type has links to the other for easy switching
5. **Token Storage**: Same token storage mechanism for both users and admins
6. **Role Display**: Profile dropdown shows the role badge after authentication

---

## 🎉 Complete Flow Example

### Creating Admin Account
```
1. Visit: /auth/admin/sign-up
2. See red "Admin" badge
3. Fill form with admin credentials
4. Click red "Admin Sign Up" button
5. Backend POST to /auth/admin/signup
6. Auto-login with admin token
7. Redirect to /dashboards
8. Profile shows red "admin" badge
```

### Creating User Account
```
1. Visit: /auth/sign-up
2. See blue "User" badge
3. Fill form with user credentials
4. Click blue "Sign Up" button
5. Backend POST to /auth/user/signup
6. Auto-login with user token
7. Redirect to /dashboards
8. Profile shows blue "user" badge
```

---

**Status**: ✅ Complete and Working  
**Last Updated**: November 13, 2025

