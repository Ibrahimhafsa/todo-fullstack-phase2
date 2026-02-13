# Implementation Plan: Frontend UI + Full Responsive Dashboard

**Branch**: `003-frontend-ui` | **Date**: 2026-01-23 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-frontend-ui/spec.md`

## Summary

Implement a modern, responsive frontend UI for the Todo application with a teal/cyan/black glowing theme. The implementation focuses on styling existing components, creating a reusable design system, and building the task dashboard with full CRUD functionality. All work is strictly within the `/frontend` directory, reusing existing auth components.

## Technical Context

**Language/Version**: TypeScript 5.x
**Primary Dependencies**: Next.js 16.1.4, React 19.2.3, Tailwind CSS 4.x
**Storage**: N/A (frontend-only; backend handles persistence)
**Testing**: Manual testing via browser
**Target Platform**: Web browsers (Chrome, Firefox, Safari, Edge)
**Project Type**: Web application (frontend only for this spec)
**Performance Goals**: Sub-3s page loads, <1s UI updates
**Constraints**: Mobile-first, 320px-2560px viewport support
**Scale/Scope**: Single-user dashboard, ~50 tasks maximum

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| XI. Frontend Workspace Isolation | ✅ PASS | All work in `/frontend` only |
| XII. Design System Compliance | ✅ PASS | Teal/cyan/black theme, Tailwind-only |
| XIII. Responsive Layout Requirements | ✅ PASS | Mobile-first, 320px-2560px |
| XIV. UX State Management | ✅ PASS | Loading, empty, error states defined |
| XV. Frontend-Backend Integration | ✅ PASS | JWT in all requests, 401 redirect |
| No `/frontend-DO-NOT-TOUCH` edits | ✅ PASS | Backup folder untouched |
| No auth component duplication | ✅ PASS | Reusing existing SignInForm, SignUpForm |
| No backend modifications | ✅ PASS | Frontend-only changes |

**Constitution Check Result**: All gates passed. Proceeding with implementation.

## Project Structure

### Documentation (this feature)

```text
specs/003-frontend-ui/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output - TypeScript interfaces
├── quickstart.md        # Phase 1 output - Development guide
├── contracts/
│   └── task-api.md      # Phase 1 output - API client contract
├── checklists/
│   └── requirements.md  # Quality validation checklist
└── tasks.md             # Phase 2 output (via /sp.tasks)
```

### Source Code (frontend only)

```text
frontend/
├── app/
│   ├── page.tsx                    # Landing page (ENHANCE)
│   ├── globals.css                 # Theme CSS (ENHANCE)
│   ├── layout.tsx                  # Root layout (MINOR EDIT)
│   ├── (auth)/
│   │   ├── signin/page.tsx         # Sign in (STYLE ONLY)
│   │   └── signup/page.tsx         # Sign up (STYLE ONLY)
│   └── (protected)/
│       └── dashboard/page.tsx      # Dashboard (FULL REBUILD)
├── components/
│   ├── auth/                       # EXISTING - no changes to logic
│   │   ├── SignInForm.tsx          # Add Tailwind classes
│   │   └── SignUpForm.tsx          # Add Tailwind classes
│   ├── providers/
│   │   └── AuthProvider.tsx        # EXISTING - no changes
│   ├── ui/                         # NEW - Design system
│   │   ├── Button.tsx              # Themed button
│   │   ├── GlassCard.tsx           # Glass container
│   │   ├── TextInput.tsx           # Styled input
│   │   ├── TextArea.tsx            # Styled textarea
│   │   ├── Navbar.tsx              # Header component
│   │   ├── EmptyState.tsx          # Empty state display
│   │   └── LoadingState.tsx        # Loading indicator
│   └── tasks/                      # NEW - Task components
│       ├── TaskCard.tsx            # Task display card
│       └── TaskForm.tsx            # Create/edit form
└── lib/
    ├── api.ts                      # ENHANCE - add PATCH, 401 handling
    ├── auth.ts                     # EXISTING - no changes
    ├── auth-client.ts              # EXISTING - no changes
    ├── types/
    │   └── task.ts                 # NEW - TypeScript interfaces
    └── hooks/
        └── useTasks.ts             # NEW - Task operations hook
```

**Structure Decision**: Frontend-only implementation using Next.js App Router. All new components go in `components/ui/` (design system) and `components/tasks/` (feature-specific). Existing auth components styled via Tailwind classes without changing logic.

## Complexity Tracking

> No constitution violations requiring justification.

| Aspect | Complexity | Justification |
|--------|-----------|---------------|
| Custom design system | Medium | Required for unique theme; no library matches spec |
| Optimistic updates | Low | Standard React pattern for responsiveness |
| Hook-based state | Low | Simpler than global state for single-page CRUD |

## Implementation Phases

### Phase 1: Theme & Design System Setup

**Goal**: Establish visual foundation

1. Update `globals.css` with theme CSS variables
2. Create `components/ui/Button.tsx`
3. Create `components/ui/GlassCard.tsx`
4. Create `components/ui/TextInput.tsx`
5. Create `components/ui/TextArea.tsx`
6. Create `components/ui/LoadingState.tsx`
7. Create `components/ui/EmptyState.tsx`
8. Create `components/ui/Navbar.tsx`

**Checkpoint**: All UI primitives render correctly in isolation.

### Phase 2: Landing & Auth Pages

**Goal**: Apply theme to entry points

1. Redesign `app/page.tsx` with hero and CTAs
2. Style `app/(auth)/signin/page.tsx` wrapper
3. Style `app/(auth)/signup/page.tsx` wrapper
4. Add Tailwind classes to `SignInForm.tsx`
5. Add Tailwind classes to `SignUpForm.tsx`

**Checkpoint**: Landing page and auth flows visually complete.

### Phase 3: API & Data Layer

**Goal**: Enable task operations

1. Create `lib/types/task.ts` interfaces
2. Enhance `lib/api.ts` with PATCH method
3. Add 401 redirect handling to `apiClient`
4. Create `lib/hooks/useTasks.ts` hook

**Checkpoint**: Can fetch, create, update, delete tasks via console.

### Phase 4: Task Components

**Goal**: Build task UI elements

1. Create `components/tasks/TaskCard.tsx`
2. Create `components/tasks/TaskForm.tsx`

**Checkpoint**: Task card and form render correctly.

### Phase 5: Dashboard Assembly

**Goal**: Complete dashboard page

1. Rebuild `app/(protected)/dashboard/page.tsx`
2. Integrate Navbar with logout
3. Integrate TaskForm for creation
4. Integrate TaskCard list
5. Implement loading state
6. Implement empty state
7. Implement error state with retry

**Checkpoint**: Full CRUD workflow operational.

### Phase 6: Responsive Polish

**Goal**: Ensure cross-device compatibility

1. Test and adjust at 320px (mobile)
2. Test and adjust at 768px (tablet)
3. Test and adjust at 1440px (desktop)
4. Fix any layout shifts
5. Verify touch targets (44x44px minimum)

**Checkpoint**: All breakpoints render correctly.

## Dependencies

```text
Phase 1 ──► Phase 2 ──► Phase 5
   │            │           ▲
   │            │           │
   └──► Phase 3 ──► Phase 4 ┘
                    │
                    └──► Phase 6
```

- Phase 2 depends on Phase 1 (needs UI components)
- Phase 4 depends on Phase 3 (needs types and API)
- Phase 5 depends on Phases 2, 3, 4
- Phase 6 depends on Phase 5

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Existing component conflicts | Style via wrapper/className, not file replacement |
| 401 redirect loops | Clear session before redirect, check auth state |
| Tailwind v4 syntax changes | Reference official docs, test each utility |

## Artifacts Generated

| File | Purpose |
|------|---------|
| `research.md` | Technical decisions and alternatives |
| `data-model.md` | TypeScript interfaces |
| `contracts/task-api.md` | API client methods |
| `quickstart.md` | Development setup guide |

## Next Steps

Run `/sp.tasks` to generate implementation tasks from this plan.
