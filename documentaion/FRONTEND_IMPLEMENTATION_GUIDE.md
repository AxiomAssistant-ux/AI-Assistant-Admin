# 🚀 Frontend Implementation Guide

## Welcome to Agentic AI HR Frontend

This comprehensive guide will help new developers understand the codebase structure, architecture, and development workflow. Read this document thoroughly before starting development.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Setup Instructions](#setup-instructions)
5. [Architecture Overview](#architecture-overview)
6. [Key Concepts](#key-concepts)
7. [Development Workflow](#development-workflow)
8. [Common Patterns](#common-patterns)
9. [API Integration](#api-integration)
10. [Authentication System](#authentication-system)
11. [Routing Structure](#routing-structure)
12. [State Management](#state-management)
13. [Styling & UI](#styling--ui)
14. [Best Practices](#best-practices)
15. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

**Agentic AI HR** is a Next.js 14-based admin dashboard application for managing HR operations, agents, users, subscriptions, and more. The frontend communicates with a FastAPI backend through RESTful APIs.

### Key Features
- 🔐 User and Admin authentication
- 👥 User and Agent management
- 📊 Dashboard with analytics
- 💳 Subscription and billing management
- 🎫 Coupon management
- 📞 Call records tracking
- 📚 Knowledge base management
- 📄 Document management

---

## 🛠 Technology Stack

### Core Framework
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript 5** - Type safety

### UI Libraries
- **Bootstrap 5** - CSS framework
- **React Bootstrap** - Bootstrap components for React
- **Sass/SCSS** - CSS preprocessor
- **React Toastify** - Toast notifications

### Form Management
- **React Hook Form** - Form state management
- **Yup** - Schema validation
- **@hookform/resolvers** - Form validation integration

### State Management
- **React Context API** - Global state management
- **localStorage** - Client-side persistence

### HTTP Client
- **Fetch API** - Native browser API for HTTP requests

### Additional Libraries
- **ApexCharts** - Data visualization
- **React Quill** - Rich text editor
- **React Dropzone** - File uploads
- **React Flatpickr** - Date picker
- **GridJS** - Data tables
- **FullCalendar** - Calendar component
- **Simplebar** - Custom scrollbars

---

## 📁 Project Structure

```
admin/
├── public/                          # Static assets
│   ├── favicon.ico
│   └── *.svg                       # SVG icons
│
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (admin)/                # Admin routes (protected)
│   │   │   ├── layout.tsx          # Admin layout with AuthGuard
│   │   │   ├── dashboards/         # Dashboard pages
│   │   │   ├── agents/             # Agent management
│   │   │   ├── user-management/    # User management
│   │   │   ├── subscription-plans/ # Subscription management
│   │   │   ├── coupons/            # Coupon management
│   │   │   ├── call-records/       # Call records
│   │   │   ├── documents/          # Document management
│   │   │   ├── create-agent/       # Create agent page
│   │   │   ├── base-ui/            # UI component examples
│   │   │   ├── forms/              # Form examples
│   │   │   ├── tables/             # Table examples
│   │   │   └── (layouts)/          # Layout variations
│   │   │
│   │   ├── (other)/                # Public routes
│   │   │   ├── auth/               # Authentication pages
│   │   │   │   ├── sign-in/        # User sign in
│   │   │   │   ├── sign-up/        # User sign up
│   │   │   │   ├── admin/          # Admin auth pages
│   │   │   │   ├── reset-password/ # Password reset
│   │   │   │   └── lock-screen/    # Lock screen
│   │   │   └── error-pages/        # Error pages
│   │   │
│   │   ├── layout.tsx              # Root layout
│   │   └── not-found.tsx           # 404 page
│   │
│   ├── components/                 # Reusable components
│   │   ├── layout/                 # Layout components
│   │   │   ├── TopNavigationBar/   # Top navigation
│   │   │   ├── VerticalNavigationBar/ # Sidebar
│   │   │   └── Footer.tsx          # Footer
│   │   │
│   │   ├── wrapper/                # Wrapper components
│   │   │   ├── AppProvidersWrapper.tsx # Context providers
│   │   │   └── SimplebarReactClient.tsx # Scrollbar wrapper
│   │   │
│   │   ├── from/                   # Form input components
│   │   │   ├── TextFormInput.tsx
│   │   │   ├── PasswordFormInput.tsx
│   │   │   ├── TextAreaFormInput.tsx
│   │   │   ├── DropzoneFormInput.tsx
│   │   │   └── ChoicesFormInput.tsx
│   │   │
│   │   ├── table/                  # Table components
│   │   │   ├── DataTable.tsx
│   │   │   └── types.ts
│   │   │
│   │   ├── VectorMap/              # Map components
│   │   ├── ThemeCustomizer.tsx     # Theme customization
│   │   ├── PageTitle.tsx           # Page title component
│   │   ├── Spinner.tsx             # Loading spinner
│   │   └── ...                     # Other components
│   │
│   ├── context/                     # React Context providers
│   │   ├── useAuthContext.tsx      # Authentication state
│   │   ├── useLayoutContext.tsx    # Layout state (sidebar, theme)
│   │   ├── useNotificationContext.tsx # Notifications
│   │   ├── useVoicesContext.tsx    # Voice settings
│   │   ├── useEmailContext.tsx     # Email state
│   │   └── constants.ts            # App constants
│   │
│   ├── lib/                        # Core libraries
│   │   ├── api-client.ts           # HTTP client
│   │   ├── auth-api.ts             # Auth API endpoints
│   │   ├── auth-storage.ts         # Token storage
│   │   ├── auth-guard.tsx          # Route protection
│   │   ├── admin-user-api.ts       # User management API
│   │   ├── admin-agent-api.ts      # Agent management API
│   │   ├── subscription-api.ts     # Subscription API
│   │   ├── coupon-api.ts           # Coupon API
│   │   ├── knowledge-base-api.ts   # Knowledge base API
│   │   └── summary-api.ts          # Summary API
│   │
│   ├── types/                      # TypeScript type definitions
│   │   ├── auth.ts                 # Auth types
│   │   ├── admin-user.ts           # User types
│   │   ├── admin-agent.ts          # Agent types
│   │   ├── billing.ts              # Billing types
│   │   ├── knowledge-base.ts       # Knowledge base types
│   │   ├── summary.ts              # Summary types
│   │   ├── component-props.ts      # Component prop types
│   │   └── ...                     # Other types
│   │
│   ├── hooks/                      # Custom React hooks
│   │   ├── useLocalStorage.ts      # localStorage hook
│   │   ├── useModal.ts             # Modal state hook
│   │   ├── useToggle.ts            # Toggle state hook
│   │   ├── useQueryParams.ts       # URL query params hook
│   │   ├── useViewPort.ts          # Viewport size hook
│   │   └── useFileUploader.ts      # File upload hook
│   │
│   ├── utils/                      # Utility functions
│   │   ├── date.ts                 # Date utilities
│   │   ├── layout.ts               # Layout utilities
│   │   ├── promise.ts              # Promise utilities
│   │   └── change-casing.ts        # String utilities
│   │
│   ├── helpers/                    # Helper functions
│   │   ├── data.ts                 # Data helpers
│   │   ├── billing.ts              # Billing helpers
│   │   └── Manu.ts                 # Menu helpers
│   │
│   ├── assets/                     # Static assets
│   │   ├── images/                 # Image files
│   │   ├── scss/                   # SCSS stylesheets
│   │   │   ├── style.scss          # Main stylesheet
│   │   │   ├── components/         # Component styles
│   │   │   ├── pages/              # Page-specific styles
│   │   │   ├── plugins/            # Plugin styles
│   │   │   └── structure/          # Layout styles
│   │   └── data/                   # Static data
│   │       ├── menu-items.ts       # Menu configuration
│   │       └── topbar.ts           # Topbar configuration
│   │
│   └── middleware.ts               # Next.js middleware
│
├── .env.local                      # Environment variables (not in git)
├── .env.example                    # Environment template
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript config
├── next.config.mjs                 # Next.js config
│
└── Documentation/
    ├── FRONTEND_IMPLEMENTATION_GUIDE.md  # This file
    ├── AUTH_IMPLEMENTATION_SUMMARY.md    # Auth docs
    ├── README_AUTH.md                   # Auth technical docs
    ├── QUICK_START.md                   # Quick start guide
    └── SETUP_GUIDE.md                   # Setup guide
```

---

## ⚙️ Setup Instructions

### Prerequisites
- **Node.js** 18+ (recommended: 20+)
- **pnpm** 10+ (or npm/yarn)
- **Git**

### Initial Setup

1. **Clone the repository** (if not already done)
```bash
git clone <repository-url>
cd Agentic-AI-HR/admin
```

2. **Install dependencies**
```bash
pnpm install
# or
npm install
# or
yarn install
```

3. **Configure environment variables**
```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local and set:
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

4. **Start the development server**
```bash
pnpm dev
# or
npm run dev
```

5. **Open the application**
```
http://localhost:3000
```

### Environment Variables

Create a `.env.local` file in the `admin/` directory:

```env
# Backend API URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1

# Optional: Add other environment variables as needed
```

---

## 🏗 Architecture Overview

### Application Flow

```
┌─────────────────────────────────────────────────────────┐
│                    Root Layout                           │
│              (app/layout.tsx)                            │
│  ┌──────────────────────────────────────────────────┐   │
│  │         AppProvidersWrapper                      │   │
│  │  ┌────────────────────────────────────────────┐  │   │
│  │  │  AuthProvider                              │  │   │
│  │  │  LayoutProvider                            │  │   │
│  │  │  NotificationProvider                      │  │   │
│  │  │  VoicesProvider                            │  │   │
│  │  └────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────┴─────────────────┐
        │                                     │
        ▼                                     ▼
┌──────────────┐                    ┌──────────────┐
│  (admin)/    │                    │  (other)/    │
│  Protected   │                    │  Public      │
│  Routes      │                    │  Routes      │
│              │                    │              │
│  - AuthGuard │                    │  - Auth      │
│  - Layout    │                    │  - Errors    │
└──────────────┘                    └──────────────┘
```

### Key Architectural Patterns

1. **App Router Structure** - Next.js 14 App Router with route groups
2. **Context API** - Global state management via React Context
3. **API Layer** - Centralized API client with type safety
4. **Component Composition** - Reusable, composable components
5. **Type Safety** - Full TypeScript coverage

---

## 🔑 Key Concepts

### 1. Route Groups

Next.js uses parentheses `()` for route groups that don't affect the URL:

- `(admin)/` - Admin routes (protected, requires authentication)
- `(other)/` - Public routes (auth pages, error pages)

**Example:**
- `app/(admin)/dashboards/page.tsx` → URL: `/dashboards`
- `app/(other)/auth/sign-in/page.tsx` → URL: `/auth/sign-in`

### 2. Server vs Client Components

- **Server Components** (default) - Rendered on server, no interactivity
- **Client Components** - Use `'use client'` directive for interactivity

**When to use Client Components:**
- Event handlers (onClick, onChange)
- React hooks (useState, useEffect)
- Browser APIs (localStorage, window)
- Context consumers

### 3. Layouts

- **Root Layout** (`app/layout.tsx`) - Wraps entire app
- **Admin Layout** (`app/(admin)/layout.tsx`) - Wraps protected routes
- **Nested Layouts** - Can have multiple layouts

### 4. TypeScript Path Aliases

The project uses `@/` alias for `src/`:

```typescript
// Instead of:
import { apiClient } from '../../../lib/api-client'

// Use:
import { apiClient } from '@/lib/api-client'
```

---

## 🔄 Development Workflow

### Creating a New Page

1. **Create the page file**
```typescript
// app/(admin)/my-feature/page.tsx
'use client'

export default function MyFeaturePage() {
  return <div>My Feature</div>
}
```

2. **Add to menu** (if needed)
```typescript
// assets/data/menu-items.ts
{
  id: 'my-feature',
  label: 'My Feature',
  link: '/my-feature',
  icon: 'icon-name'
}
```

### Creating a New Component

1. **Create component file**
```typescript
// components/MyComponent.tsx
'use client'

interface MyComponentProps {
  title: string
}

export default function MyComponent({ title }: MyComponentProps) {
  return <div>{title}</div>
}
```

2. **Use the component**
```typescript
import MyComponent from '@/components/MyComponent'

<MyComponent title="Hello" />
```

### Creating a New API Endpoint

1. **Add to API file** (or create new one)
```typescript
// lib/my-feature-api.ts
import { apiClient } from './api-client'

export const myFeatureApi = {
  getData: async (token: string) => {
    return apiClient.get('/my-feature/data', token)
  },
  
  createData: async (data: any, token: string) => {
    return apiClient.post('/my-feature/data', data, token)
  }
}
```

2. **Use in component**
```typescript
import { myFeatureApi } from '@/lib/my-feature-api'
import { useAuth } from '@/context/useAuthContext'

const { token } = useAuth()
const response = await myFeatureApi.getData(token!)
```

### Adding New Types

```typescript
// types/my-feature.ts
export interface MyFeatureData {
  id: string
  name: string
  createdAt: string
}

export interface CreateMyFeatureRequest {
  name: string
}
```

---

## 🎨 Common Patterns

### 1. Form Handling Pattern

```typescript
'use client'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).required()
})

export default function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data: any) => {
    // Handle submission
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      
      <input type="password" {...register('password')} />
      {errors.password && <span>{errors.password.message}</span>}
      
      <button type="submit">Submit</button>
    </form>
  )
}
```

### 2. API Call Pattern

```typescript
'use client'

import { useState } from 'react'
import { toast } from 'react-toastify'
import { myFeatureApi } from '@/lib/my-feature-api'
import { useAuth } from '@/context/useAuthContext'

export default function MyComponent() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const { token } = useAuth()

  const fetchData = async () => {
    if (!token) return

    setLoading(true)
    try {
      const response = await myFeatureApi.getData(token)
      
      if (response.error) {
        toast.error(response.error)
        return
      }

      setData(response.data)
      toast.success('Data loaded successfully')
    } catch (error) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {loading && <Spinner />}
      {data && <div>{/* Render data */}</div>}
      <button onClick={fetchData}>Load Data</button>
    </div>
  )
}
```

### 3. Protected Route Pattern

```typescript
// app/(admin)/my-feature/page.tsx
'use client'

import { useAuth } from '@/context/useAuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function MyFeaturePage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/sign-in')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) return <Spinner />
  if (!isAuthenticated) return null

  return <div>Protected Content</div>
}
```

### 4. Context Usage Pattern

```typescript
'use client'

import { useAuth } from '@/context/useAuthContext'
import { useLayout } from '@/context/useLayoutContext'

export default function MyComponent() {
  const { user, token, signOut } = useAuth()
  const { theme, toggleTheme } = useLayout()

  return (
    <div>
      <p>Welcome, {user?.username}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}
```

---

## 🔌 API Integration

### API Client Structure

The `api-client.ts` provides a centralized HTTP client:

```typescript
import { apiClient } from '@/lib/api-client'

// GET request
const response = await apiClient.get('/endpoint', token)

// POST request
const response = await apiClient.post('/endpoint', { data }, token)

// PUT request
const response = await apiClient.put('/endpoint', { data }, token)

// PATCH request
const response = await apiClient.patch('/endpoint', { data }, token)

// DELETE request
const response = await apiClient.delete('/endpoint', token)
```

### Response Format

All API responses follow this structure:

```typescript
interface ApiResponse<T> {
  data?: T        // Success data
  error?: string  // Error message
  status: number  // HTTP status code
}
```

### Error Handling

```typescript
const response = await apiClient.get('/endpoint', token)

if (response.error) {
  // Handle error
  toast.error(response.error)
  return
}

// Use response.data
console.log(response.data)
```

### API Files Organization

Each feature has its own API file:
- `auth-api.ts` - Authentication endpoints
- `admin-user-api.ts` - User management
- `admin-agent-api.ts` - Agent management
- `subscription-api.ts` - Subscription management
- `coupon-api.ts` - Coupon management
- `knowledge-base-api.ts` - Knowledge base
- `summary-api.ts` - Summary endpoints

---

## 🔐 Authentication System

### Overview

The app uses JWT-based authentication with separate flows for users and admins.

### Authentication Flow

```
1. User submits credentials
   ↓
2. Frontend validates input
   ↓
3. API call to backend
   ↓
4. Backend returns JWT token + user data
   ↓
5. Token saved to localStorage
   ↓
6. Auth context updated
   ↓
7. User redirected to dashboard
```

### Using Authentication

```typescript
import { useAuth } from '@/context/useAuthContext'

function MyComponent() {
  const {
    user,              // Current user object
    token,             // JWT token
    isAuthenticated,   // Boolean auth status
    isLoading,         // Loading state
    signIn,            // Sign in function
    signOut,           // Sign out function
    refreshUser        // Refresh user data
  } = useAuth()

  // Check authentication
  if (!isAuthenticated) {
    return <div>Please sign in</div>
  }

  // Use token for API calls
  const response = await apiClient.get('/endpoint', token)
}
```

### Protected Routes

Routes in `(admin)/` are automatically protected by `AuthGuard`:

```typescript
// app/(admin)/layout.tsx
<AuthGuard signInPath="/auth/admin/sign-in">
  {children}
</AuthGuard>
```

### Auth Storage

Tokens are stored securely using `auth-storage.ts`:

```typescript
import { authStorage } from '@/lib/auth-storage'

// Save auth data
authStorage.saveAuth(tokenData)

// Get token
const token = authStorage.getToken()

// Get user
const user = authStorage.getUser()

// Check if token expired
if (authStorage.isTokenExpired()) {
  // Handle expiry
}

// Clear auth
authStorage.clearAuth()
```

### User vs Admin Authentication

- **User Routes**: `/auth/sign-in`, `/auth/sign-up`
- **Admin Routes**: `/auth/admin/sign-in`, `/auth/admin/sign-up`

Both use the same `useAuth()` context but call different backend endpoints.

---

## 🗺 Routing Structure

### Route Organization

```
/                           → Root (redirects to dashboard)
/auth/sign-in              → User sign in
/auth/sign-up              → User sign up
/auth/admin/sign-in        → Admin sign in
/auth/admin/sign-up        → Admin sign up
/auth/reset-password       → Password reset
/dashboards                → Main dashboard (protected)
/agents                    → Agent management (protected)
/user-management           → User management (protected)
/subscription-plans        → Subscription management (protected)
/coupons                   → Coupon management (protected)
/call-records              → Call records (protected)
/documents                 → Document management (protected)
/create-agent              → Create agent (protected)
```

### Creating New Routes

1. **Protected Route** (requires auth):
```typescript
// app/(admin)/my-route/page.tsx
'use client'

export default function MyRoutePage() {
  return <div>My Route</div>
}
```

2. **Public Route**:
```typescript
// app/(other)/my-public-route/page.tsx
'use client'

export default function MyPublicRoutePage() {
  return <div>Public Route</div>
}
```

### Dynamic Routes

```typescript
// app/(admin)/users/[id]/page.tsx
'use client'

export default function UserDetailPage({ params }: { params: { id: string } }) {
  return <div>User ID: {params.id}</div>
}
```

### Navigation

```typescript
import { useRouter } from 'next/navigation'

const router = useRouter()

// Navigate
router.push('/dashboards')
router.replace('/auth/sign-in')
router.back()
```

---

## 📊 State Management

### Context Providers

The app uses multiple context providers:

1. **AuthProvider** - Authentication state
2. **LayoutProvider** - Layout state (sidebar, theme)
3. **NotificationProvider** - Notification state
4. **VoicesProvider** - Voice settings
5. **EmailProvider** - Email state

### Using Contexts

```typescript
import { useAuth } from '@/context/useAuthContext'
import { useLayout } from '@/context/useLayoutContext'

function MyComponent() {
  const auth = useAuth()
  const layout = useLayout()
  
  // Use context values
}
```

### Local State

For component-specific state, use React hooks:

```typescript
import { useState, useEffect } from 'react'

function MyComponent() {
  const [count, setCount] = useState(0)
  const [data, setData] = useState(null)

  useEffect(() => {
    // Side effects
  }, [count])

  return <div>{count}</div>
}
```

### Persistence

For persistent state, use `useLocalStorage` hook:

```typescript
import { useLocalStorage } from '@/hooks/useLocalStorage'

function MyComponent() {
  const [value, setValue] = useLocalStorage('myKey', 'defaultValue')
  
  return <div>{value}</div>
}
```

---

## 🎨 Styling & UI

### Styling Approach

- **Bootstrap 5** - Main CSS framework
- **React Bootstrap** - Bootstrap components
- **SCSS** - CSS preprocessor
- **Custom SCSS** - Component-specific styles

### Using Bootstrap

```typescript
import { Button, Card, Container } from 'react-bootstrap'

function MyComponent() {
  return (
    <Container>
      <Card>
        <Card.Body>
          <Button variant="primary">Click Me</Button>
        </Card.Body>
      </Card>
    </Container>
  )
}
```

### Custom Styling

```typescript
// Component styles
import styles from './MyComponent.module.scss'

<div className={styles.myClass}>Content</div>

// Or inline styles
<div style={{ color: 'red' }}>Content</div>

// Or Bootstrap classes
<div className="d-flex justify-content-between">Content</div>
```

### SCSS Structure

```
assets/scss/
├── style.scss              # Main entry point
├── components/             # Component styles
├── pages/                  # Page-specific styles
├── plugins/                # Third-party plugin styles
└── structure/             # Layout styles
```

### Theme Customization

The app includes a theme customizer component. Theme settings are managed through `useLayoutContext`.

---

## ✅ Best Practices

### 1. Type Safety

Always use TypeScript types:

```typescript
// ✅ Good
interface User {
  id: string
  name: string
}

function displayUser(user: User) {
  // ...
}

// ❌ Bad
function displayUser(user: any) {
  // ...
}
```

### 2. Error Handling

Always handle errors:

```typescript
// ✅ Good
try {
  const response = await apiClient.get('/endpoint', token)
  if (response.error) {
    toast.error(response.error)
    return
  }
  // Use response.data
} catch (error) {
  toast.error('An unexpected error occurred')
}

// ❌ Bad
const response = await apiClient.get('/endpoint', token)
// No error handling
```

### 3. Loading States

Show loading indicators:

```typescript
// ✅ Good
const [loading, setLoading] = useState(false)

if (loading) return <Spinner />

// ❌ Bad
// No loading state
```

### 4. Component Organization

Keep components focused and reusable:

```typescript
// ✅ Good - Single responsibility
function UserCard({ user }: { user: User }) {
  return <Card>{user.name}</Card>
}

// ❌ Bad - Too many responsibilities
function UserCard({ user }: { user: User }) {
  // Fetches data, handles form, displays user, etc.
}
```

### 5. Code Formatting

Use Prettier for consistent formatting:

```bash
pnpm format
```

### 6. File Naming

- Components: `PascalCase.tsx` (e.g., `UserCard.tsx`)
- Utilities: `camelCase.ts` (e.g., `dateUtils.ts`)
- Types: `camelCase.ts` (e.g., `userTypes.ts`)
- Hooks: `camelCase.ts` with `use` prefix (e.g., `useLocalStorage.ts`)

### 7. Import Organization

```typescript
// 1. React imports
import { useState, useEffect } from 'react'

// 2. Next.js imports
import { useRouter } from 'next/navigation'

// 3. Third-party imports
import { toast } from 'react-toastify'
import { Button } from 'react-bootstrap'

// 4. Internal imports (using @ alias)
import { apiClient } from '@/lib/api-client'
import { useAuth } from '@/context/useAuthContext'
import MyComponent from '@/components/MyComponent'
```

### 8. Comments

Add comments for complex logic:

```typescript
// ✅ Good
// Calculate total price including tax
const total = price * (1 + taxRate)

// ❌ Bad
// No comments for complex calculations
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "Module not found" errors

**Problem**: Import path is incorrect

**Solution**: 
- Check if file exists
- Verify path alias `@/` is correct
- Ensure file extension is included if needed

#### 2. Authentication not working

**Problem**: Token not being saved or retrieved

**Solution**:
- Check `.env.local` has correct API URL
- Verify backend is running
- Check browser console for errors
- Clear localStorage and try again

#### 3. API calls failing

**Problem**: CORS errors or network issues

**Solution**:
- Verify backend is running on correct port
- Check `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
- Verify token is being sent in headers
- Check backend CORS configuration

#### 4. TypeScript errors

**Problem**: Type mismatches

**Solution**:
- Check type definitions in `types/` directory
- Ensure API response types match backend
- Use type assertions carefully

#### 5. Styling not applying

**Problem**: CSS not loading

**Solution**:
- Check if SCSS is compiled
- Verify import in `layout.tsx`
- Check for CSS class name typos
- Clear `.next` cache: `rm -rf .next`

#### 6. Build errors

**Problem**: Build fails

**Solution**:
```bash
# Clear cache and rebuild
rm -rf .next node_modules
pnpm install
pnpm build
```

### Debugging Tips

1. **Check browser console** - Look for errors
2. **Check Network tab** - Verify API calls
3. **Check React DevTools** - Inspect component state
4. **Add console.logs** - Debug data flow
5. **Check terminal** - Look for build/runtime errors

### Getting Help

1. Check existing documentation:
   - `AUTH_IMPLEMENTATION_SUMMARY.md`
   - `QUICK_START.md`
   - `SETUP_GUIDE.md`

2. Review similar code in the codebase

3. Check Next.js documentation: https://nextjs.org/docs

---

## 📚 Additional Resources

### Documentation Files

- **AUTH_IMPLEMENTATION_SUMMARY.md** - Complete auth implementation details
- **QUICK_START.md** - Quick start guide
- **SETUP_GUIDE.md** - Detailed setup instructions
- **README_AUTH.md** - Authentication technical documentation
- **ROUTES_SUMMARY.md** - Route structure summary

### External Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Bootstrap Documentation](https://getbootstrap.com/docs)
- [React Bootstrap Documentation](https://react-bootstrap.github.io)

---

## 🎓 Learning Path for New Developers

### Week 1: Foundation
1. ✅ Read this guide completely
2. ✅ Set up development environment
3. ✅ Explore the codebase structure
4. ✅ Run the application locally
5. ✅ Understand authentication flow

### Week 2: Core Concepts
1. ✅ Study Next.js App Router
2. ✅ Understand React Context API
3. ✅ Learn API integration patterns
4. ✅ Practice form handling
5. ✅ Study routing structure

### Week 3: Development
1. ✅ Make small changes to existing pages
2. ✅ Create a simple new component
3. ✅ Add a new API endpoint integration
4. ✅ Create a new page
5. ✅ Practice debugging

### Week 4: Advanced
1. ✅ Understand state management patterns
2. ✅ Learn advanced Next.js features
3. ✅ Optimize performance
4. ✅ Write clean, maintainable code
5. ✅ Contribute to the codebase

---

## 🚀 Quick Reference

### Common Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run linter
pnpm format           # Format code

# Dependencies
pnpm install          # Install dependencies
pnpm add <package>    # Add new package
pnpm remove <package> # Remove package
```

### Common Imports

```typescript
// React
import { useState, useEffect } from 'react'

// Next.js
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

// Context
import { useAuth } from '@/context/useAuthContext'
import { useLayout } from '@/context/useLayoutContext'

// API
import { apiClient } from '@/lib/api-client'
import { authApi } from '@/lib/auth-api'

// UI
import { Button, Card, Container } from 'react-bootstrap'
import { toast } from 'react-toastify'

// Utils
import { useLocalStorage } from '@/hooks/useLocalStorage'
```

### File Templates

#### Page Template
```typescript
'use client'

import { useAuth } from '@/context/useAuthContext'
import { Container } from 'react-bootstrap'

export default function MyPage() {
  const { user, token } = useAuth()

  return (
    <Container>
      <h1>My Page</h1>
    </Container>
  )
}
```

#### Component Template
```typescript
'use client'

interface MyComponentProps {
  title: string
}

export default function MyComponent({ title }: MyComponentProps) {
  return <div>{title}</div>
}
```

#### API File Template
```typescript
import { apiClient } from './api-client'
import type { MyType } from '@/types/my-types'

export const myApi = {
  getData: async (token: string): Promise<ApiResponse<MyType>> => {
    return apiClient.get('/my-endpoint', token)
  },
  
  createData: async (data: CreateRequest, token: string): Promise<ApiResponse<MyType>> => {
    return apiClient.post('/my-endpoint', data, token)
  }
}
```

---

## 📝 Notes

- Always test your changes locally before committing
- Follow the existing code style and patterns
- Write clear, descriptive commit messages
- Keep components small and focused
- Use TypeScript types for all data
- Handle errors gracefully
- Show loading states for async operations
- Use toast notifications for user feedback

---

## 🎉 You're Ready!

You now have a comprehensive understanding of the frontend codebase. Start exploring, make changes, and don't hesitate to ask questions or refer back to this guide.

**Happy coding! 🚀**

---

**Last Updated**: November 2025  
**Version**: 1.0.0  
**Maintained By**: Mr Owais

