# Research: Frontend UI + Full Responsive Dashboard

**Feature**: 003-frontend-ui
**Date**: 2026-01-23
**Status**: Complete

## Executive Summary

This document consolidates research findings for implementing the frontend UI with a teal/cyan/black glowing theme. All technical decisions are based on the existing codebase structure and constitution requirements.

---

## 1. Existing Codebase Analysis

### 1.1 Auth Components (Must Reuse)

| Component | Path | Status |
|-----------|------|--------|
| SignInForm | `frontend/components/auth/SignInForm.tsx` | Exists - needs styling only |
| SignUpForm | `frontend/components/auth/SignUpForm.tsx` | Exists - needs styling only |
| AuthProvider | `frontend/components/providers/AuthProvider.tsx` | Exists - provides session context |

**Decision**: Style existing forms by wrapping with theme components or adding Tailwind classes. Do NOT recreate.

### 1.2 Existing Pages

| Page | Path | Status |
|------|------|--------|
| Home | `frontend/app/page.tsx` | Exists - needs full redesign |
| Sign In | `frontend/app/(auth)/signin/page.tsx` | Exists - needs styling |
| Sign Up | `frontend/app/(auth)/signup/page.tsx` | Exists - needs styling |
| Dashboard | `frontend/app/(protected)/dashboard/page.tsx` | Exists - needs full implementation |

**Decision**: Enhance existing pages rather than creating new ones.

### 1.3 API Client

**Path**: `frontend/lib/api.ts`

Existing client provides:
- `apiClient<T>()` - Base function with JWT injection
- `apiGet<T>()` - GET with auth
- `apiPost<T>()` - POST with auth
- `apiPut<T>()` - PUT with auth
- `apiDelete<T>()` - DELETE with auth

**Missing**: PATCH method for toggle completion.

**Decision**: Add `apiPatch<T>()` method to existing api.ts file.

---

## 2. Backend API Contract

### 2.1 Task Endpoints (from Spec-2)

| Method | Endpoint | Response |
|--------|----------|----------|
| GET | `/api/{user_id}/tasks` | `TaskListResponse` |
| POST | `/api/{user_id}/tasks` | `TaskResponse` (201) |
| GET | `/api/{user_id}/tasks/{task_id}` | `TaskResponse` |
| PUT | `/api/{user_id}/tasks/{task_id}` | `TaskResponse` |
| DELETE | `/api/{user_id}/tasks/{task_id}` | 204 No Content |
| PATCH | `/api/{user_id}/tasks/{task_id}/complete` | `TaskResponse` |

### 2.2 Task Schema

```typescript
interface Task {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  is_complete: boolean;
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
}

interface TaskListResponse {
  tasks: Task[];
  count: number;
}

interface TaskCreate {
  title: string;
  description?: string;
}

interface TaskUpdate {
  title?: string;
  description?: string;
}
```

**Decision**: Create TypeScript interfaces matching backend schemas in `frontend/lib/types/task.ts`.

---

## 3. Design System Research

### 3.1 Theme Color Palette

**Requirement**: Soft teal–cyan–black glowing theme

| Token | Hex | Usage |
|-------|-----|-------|
| `bg-dark` | #0a0a0a | Main background |
| `bg-dark-elevated` | #1a1a2e | Card backgrounds |
| `accent-primary` | #00d4ff | Primary buttons, links |
| `accent-secondary` | #00b4d8 | Hover states |
| `accent-muted` | #0077b6 | Borders, subtle accents |
| `text-primary` | #ffffff | Main text |
| `text-secondary` | #a0a0a0 | Secondary text |
| `success` | #10b981 | Completed tasks |
| `error` | #ef4444 | Error states |

### 3.2 Tailwind CSS Implementation

**Approach**: Use Tailwind v4 with CSS custom properties for theming.

```css
/* globals.css additions */
:root {
  --color-bg-dark: #0a0a0a;
  --color-bg-elevated: #1a1a2e;
  --color-accent: #00d4ff;
  --color-accent-hover: #00b4d8;
  --color-accent-muted: #0077b6;
}
```

**Decision**: Define theme in `globals.css` and use Tailwind utilities with custom CSS variables.

### 3.3 Glass Effect Implementation

```css
/* Glass card effect */
.glass-card {
  @apply bg-white/5 backdrop-blur-md border border-white/10 rounded-xl;
}
```

**Tailwind classes for glass effect**:
- `bg-white/5` or `bg-slate-800/50` - Semi-transparent background
- `backdrop-blur-md` - Blur effect
- `border border-white/10` - Subtle border
- `rounded-xl` - Rounded corners (12px)

**Decision**: Create reusable `GlassCard` component with these classes.

### 3.4 Glow Effects

```css
/* Button glow on hover */
.btn-glow:hover {
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
}
```

**Tailwind approach**:
- `shadow-[0_0_20px_rgba(0,212,255,0.3)]` - Custom shadow for glow
- `transition-all duration-300` - Smooth transitions

**Decision**: Use Tailwind arbitrary values for glow shadows.

---

## 4. Component Architecture

### 4.1 New Components to Create

| Component | Path | Purpose |
|-----------|------|---------|
| `Navbar` | `components/ui/Navbar.tsx` | Header with title + logout |
| `GlassCard` | `components/ui/GlassCard.tsx` | Glassy container |
| `Button` | `components/ui/Button.tsx` | Themed button variants |
| `TextInput` | `components/ui/TextInput.tsx` | Styled input |
| `TextArea` | `components/ui/TextArea.tsx` | Styled textarea |
| `TaskCard` | `components/tasks/TaskCard.tsx` | Task display card |
| `TaskForm` | `components/tasks/TaskForm.tsx` | Create/edit form |
| `EmptyState` | `components/ui/EmptyState.tsx` | No data message |
| `LoadingState` | `components/ui/LoadingState.tsx` | Loading indicator |

### 4.2 Directory Structure

```text
frontend/
├── app/
│   ├── page.tsx                    # Landing page (enhance)
│   ├── (auth)/
│   │   ├── signin/page.tsx         # Sign in (enhance)
│   │   └── signup/page.tsx         # Sign up (enhance)
│   └── (protected)/
│       └── dashboard/page.tsx      # Dashboard (full rebuild)
├── components/
│   ├── auth/                       # Existing - style only
│   ├── providers/                  # Existing - no changes
│   ├── ui/                         # New - design system
│   │   ├── Button.tsx
│   │   ├── GlassCard.tsx
│   │   ├── TextInput.tsx
│   │   ├── TextArea.tsx
│   │   ├── Navbar.tsx
│   │   ├── EmptyState.tsx
│   │   └── LoadingState.tsx
│   └── tasks/                      # New - task components
│       ├── TaskCard.tsx
│       └── TaskForm.tsx
└── lib/
    ├── api.ts                      # Enhance - add PATCH
    ├── types/
    │   └── task.ts                 # New - TypeScript interfaces
    └── hooks/
        └── useTasks.ts             # New - task data hook
```

**Decision**: Create `ui/` for design system components and `tasks/` for task-specific components.

---

## 5. State Management

### 5.1 Task Data Hook

**Pattern**: Custom React hook for task CRUD operations.

```typescript
// lib/hooks/useTasks.ts
interface UseTasksReturn {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  createTask: (data: TaskCreate) => Promise<void>;
  updateTask: (id: number, data: TaskUpdate) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  toggleComplete: (id: number) => Promise<void>;
  retry: () => void;
}
```

**Decision**: Create `useTasks` hook to encapsulate all task operations and state.

### 5.2 Optimistic Updates

**Pattern**: Update UI immediately, revert on error.

```typescript
const toggleComplete = async (id: number) => {
  // Optimistic update
  setTasks(prev => prev.map(t =>
    t.id === id ? { ...t, is_complete: !t.is_complete } : t
  ));

  try {
    await apiPatch(`/api/${userId}/tasks/${id}/complete`);
  } catch (error) {
    // Revert on failure
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, is_complete: !t.is_complete } : t
    ));
    throw error;
  }
};
```

**Decision**: Implement optimistic updates for toggle, update, and delete operations.

---

## 6. 401 Handling

### 6.1 Global Error Interception

**Requirement**: Redirect to sign-in on 401 response.

**Approach**: Enhance `apiClient` to detect 401 and redirect.

```typescript
if (response.status === 401) {
  // Clear session and redirect
  localStorage.removeItem("auth_session");
  if (typeof window !== "undefined") {
    window.location.href = "/signin";
  }
  throw new Error("Session expired");
}
```

**Decision**: Add 401 handling to existing `apiClient` function.

---

## 7. Responsive Breakpoints

### 7.1 Breakpoint Strategy

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | 320px-767px | Single column, full-width cards |
| Tablet | 768px-1023px | Single column, centered container |
| Desktop | 1024px+ | Centered container, max-width 4xl |

### 7.2 Implementation

```tsx
// Responsive container
<div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* Content */}
</div>

// Responsive task grid (if needed)
<div className="grid grid-cols-1 gap-4">
  {/* Task cards */}
</div>
```

**Decision**: Use Tailwind's responsive prefixes with mobile-first approach.

---

## 8. Alternatives Considered

### 8.1 State Management

| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| React State + Hook | Simple, no deps | Local to component | **Chosen** |
| Zustand | Global state | Extra dependency | Rejected |
| TanStack Query | Caching, revalidation | Complexity overkill | Rejected |

**Rationale**: Single dashboard page with simple CRUD doesn't warrant global state management complexity.

### 8.2 Component Library

| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| Custom Tailwind | Full control, matches theme | More code | **Chosen** |
| shadcn/ui | Pre-built, accessible | Theme customization needed | Rejected |
| Headless UI | Accessible primitives | Still need styling | Rejected |

**Rationale**: Custom components ensure exact theme compliance and reduce bundle size.

---

## 9. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Existing component conflicts | Low | Medium | Style via wrapper/props, not file replacement |
| 401 redirect loops | Medium | High | Check auth before redirect, clear session |
| Performance with many tasks | Low | Medium | Virtual list if 100+ tasks (future) |

---

## 10. Conclusion

All technical decisions have been made. No [NEEDS CLARIFICATION] items remain. Ready to proceed to Phase 1 artifacts.

**Next Steps**:
1. Generate `data-model.md` with frontend TypeScript interfaces
2. Generate `contracts/` with API client methods
3. Generate `quickstart.md` with development setup
