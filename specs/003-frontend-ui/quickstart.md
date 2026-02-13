# Quickstart: Frontend UI Development

**Feature**: 003-frontend-ui
**Date**: 2026-01-23

## Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running (Spec-2)
- Environment variables configured

---

## 1. Environment Setup

### 1.1 Frontend Environment

Create or update `frontend/.env.local`:

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Better Auth Secret (must match backend)
BETTER_AUTH_SECRET=your-32-character-secret-here
```

### 1.2 Backend Running

Ensure Spec-2 backend is running:

```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn app.main:app --reload --port 8000
```

---

## 2. Installation

```bash
cd frontend
npm install
```

---

## 3. Development Server

```bash
npm run dev
```

Access at: http://localhost:3000

---

## 4. Project Structure

```text
frontend/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── globals.css                 # Global styles + theme
│   ├── layout.tsx                  # Root layout
│   ├── (auth)/
│   │   ├── signin/page.tsx         # Sign in page
│   │   └── signup/page.tsx         # Sign up page
│   └── (protected)/
│       └── dashboard/page.tsx      # Task dashboard
├── components/
│   ├── auth/                       # Auth components (existing)
│   │   ├── SignInForm.tsx
│   │   └── SignUpForm.tsx
│   ├── providers/
│   │   └── AuthProvider.tsx        # Session context (existing)
│   ├── ui/                         # Design system (new)
│   │   ├── Button.tsx
│   │   ├── GlassCard.tsx
│   │   ├── TextInput.tsx
│   │   ├── TextArea.tsx
│   │   ├── Navbar.tsx
│   │   ├── EmptyState.tsx
│   │   └── LoadingState.tsx
│   └── tasks/                      # Task components (new)
│       ├── TaskCard.tsx
│       └── TaskForm.tsx
└── lib/
    ├── api.ts                      # API client with JWT
    ├── auth.ts                     # Auth config
    ├── auth-client.ts              # Better Auth client
    ├── types/
    │   └── task.ts                 # TypeScript interfaces
    └── hooks/
        └── useTasks.ts             # Task operations hook
```

---

## 5. Key Files to Modify

### Phase 1: Theme Setup

1. `frontend/app/globals.css` - Add theme CSS variables
2. Create `frontend/components/ui/` directory
3. Create design system components

### Phase 2: Pages

1. `frontend/app/page.tsx` - Redesign landing page
2. `frontend/app/(auth)/signin/page.tsx` - Apply theme
3. `frontend/app/(auth)/signup/page.tsx` - Apply theme
4. `frontend/app/(protected)/dashboard/page.tsx` - Full rebuild

### Phase 3: Task Components

1. Create `frontend/lib/types/task.ts`
2. Create `frontend/lib/hooks/useTasks.ts`
3. Enhance `frontend/lib/api.ts` (add PATCH, 401 handling)
4. Create `frontend/components/tasks/TaskCard.tsx`
5. Create `frontend/components/tasks/TaskForm.tsx`

---

## 6. Development Workflow

### 6.1 Component Development

```bash
# Start with design system components
frontend/components/ui/Button.tsx
frontend/components/ui/GlassCard.tsx
frontend/components/ui/TextInput.tsx

# Then task-specific components
frontend/components/tasks/TaskCard.tsx
frontend/components/tasks/TaskForm.tsx
```

### 6.2 Testing Pages

| Route | Description |
|-------|-------------|
| http://localhost:3000 | Landing page |
| http://localhost:3000/signin | Sign in |
| http://localhost:3000/signup | Sign up |
| http://localhost:3000/dashboard | Task dashboard (requires auth) |

### 6.3 Testing Responsive

Use browser DevTools:
- Mobile: 375px width
- Tablet: 768px width
- Desktop: 1440px width

---

## 7. Theme Reference

### 7.1 Colors

```css
/* Dark backgrounds */
--bg-dark: #0a0a0a;
--bg-elevated: #1a1a2e;

/* Accent colors */
--accent: #00d4ff;
--accent-hover: #00b4d8;
--accent-muted: #0077b6;

/* Text */
--text-primary: #ffffff;
--text-secondary: #a0a0a0;
```

### 7.2 Tailwind Classes

```tsx
// Glass card
className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl"

// Glow button
className="bg-cyan-500 hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all"

// Focus ring
className="focus:ring-2 focus:ring-cyan-500/50 focus:outline-none"
```

---

## 8. API Testing

### 8.1 Create Test User

```bash
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

### 8.2 Sign In

```bash
curl -X POST http://localhost:8000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# Response includes token
```

### 8.3 Create Task

```bash
TOKEN="your-jwt-token"
USER_ID="your-user-id"

curl -X POST "http://localhost:8000/api/${USER_ID}/tasks" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test task", "description": "Testing"}'
```

---

## 9. Common Issues

### 9.1 CORS Errors

Ensure backend has CORS configured for `http://localhost:3000`.

### 9.2 401 on Dashboard

- Check token is stored in `localStorage` under `auth_session`
- Verify token hasn't expired
- Ensure `BETTER_AUTH_SECRET` matches between frontend and backend

### 9.3 Styling Not Applied

- Run `npm run dev` (not `npm start`)
- Check Tailwind is processing `globals.css`
- Clear browser cache

---

## 10. Build for Production

```bash
npm run build
npm start
```

---

## 11. Validation Checklist

- [ ] Landing page shows themed hero with CTA buttons
- [ ] Sign in form has styled inputs and buttons
- [ ] Sign up form matches sign in styling
- [ ] Dashboard shows navbar with logout
- [ ] Tasks load on dashboard
- [ ] Can create new task
- [ ] Can toggle task completion
- [ ] Can edit task
- [ ] Can delete task
- [ ] Empty state shows when no tasks
- [ ] Error state shows with retry on failure
- [ ] All pages responsive at 320px, 768px, 1440px
- [ ] No layout shifts or FOUC
