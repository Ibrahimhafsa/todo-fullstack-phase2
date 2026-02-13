# Tasks: Frontend UI + Full Responsive Dashboard

**Input**: Design documents from `/specs/003-frontend-ui/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/task-api.md

**Tests**: Not requested - manual browser testing only

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend**: `frontend/` directory only
- **Components**: `frontend/components/`
- **Pages**: `frontend/app/`
- **Lib**: `frontend/lib/`

**⚠️ CRITICAL RULES**:
- All work MUST be in `/frontend` only
- NEVER edit `/frontend-DO-NOT-TOUCH`
- NEVER duplicate existing auth components

---

## Phase 1: Setup (Design System Foundation)

**Purpose**: Create theme and reusable UI components

- [x] T001 Update theme CSS variables in `frontend/app/globals.css` with teal/cyan/black glow colors
- [x] T002 [P] Create Button component in `frontend/components/ui/Button.tsx` with primary/secondary/danger/ghost variants
- [x] T003 [P] Create GlassCard component in `frontend/components/ui/GlassCard.tsx` with backdrop blur and rounded-xl
- [x] T004 [P] Create TextInput component in `frontend/components/ui/TextInput.tsx` with focus ring and error state
- [x] T005 [P] Create TextArea component in `frontend/components/ui/TextArea.tsx` with focus ring and error state
- [x] T006 [P] Create LoadingState component in `frontend/components/ui/LoadingState.tsx` with themed spinner
- [x] T007 [P] Create EmptyState component in `frontend/components/ui/EmptyState.tsx` with title, description, and action
- [x] T008 [P] Create Navbar component in `frontend/components/ui/Navbar.tsx` with app title and logout button

**Checkpoint**: All UI primitives render correctly in isolation.

---

## Phase 2: Foundational (API & Types)

**Purpose**: Core infrastructure that MUST be complete before task CRUD stories

**⚠️ CRITICAL**: No task CRUD work can begin until this phase is complete

- [x] T009 Create Task TypeScript interfaces in `frontend/lib/types/task.ts` (Task, TaskCreate, TaskUpdate, TaskListResponse)
- [x] T010 Add apiPatch method to `frontend/lib/api.ts` for PATCH requests
- [x] T011 Add 401 redirect handling to apiClient in `frontend/lib/api.ts` (redirect to /signin on 401)
- [x] T012 Create useTasks hook in `frontend/lib/hooks/useTasks.ts` with fetch, create, update, delete, toggleComplete operations

**Checkpoint**: Can fetch and manipulate tasks via console; 401 redirects to signin.

---

## Phase 3: User Story 1 - Landing Page (Priority: P1) 🎯 MVP

**Goal**: Attractive landing page with app title, hero, and CTA buttons

**Independent Test**: Load / and verify hero section, app title, Sign In/Sign Up buttons visible and styled

### Implementation for User Story 1

- [x] T013 [US1] Redesign landing page in `frontend/app/page.tsx` with themed hero section and description
- [x] T014 [US1] Add styled CTA buttons (Sign In, Sign Up) using Button component in `frontend/app/page.tsx`
- [x] T015 [US1] Add responsive layout (stacked buttons on mobile) in `frontend/app/page.tsx`
- [x] T016 [US1] Ensure proper navigation to /signin and /signup routes in `frontend/app/page.tsx`

**Checkpoint**: Landing page looks professional with working navigation to auth pages.

---

## Phase 4: User Story 2 - Sign In Page (Priority: P1)

**Goal**: Beautifully styled sign-in form matching app theme

**Independent Test**: Navigate to /signin, see styled form, test auth flow

### Implementation for User Story 2

- [x] T017 [US2] Update signin page wrapper in `frontend/app/(auth)/signin/page.tsx` with GlassCard and centered layout
- [x] T018 [US2] Add Tailwind classes to SignInForm in `frontend/components/auth/SignInForm.tsx` for themed inputs and button
- [x] T019 [US2] Style error message display in `frontend/components/auth/SignInForm.tsx` with themed colors
- [x] T020 [US2] Ensure responsive layout (centered, touch-friendly) in `frontend/app/(auth)/signin/page.tsx`

**Checkpoint**: Sign-in page looks premium, form works correctly, errors display properly.

---

## Phase 5: User Story 3 - Sign Up Page (Priority: P1)

**Goal**: Beautifully styled sign-up form matching app theme

**Independent Test**: Navigate to /signup, see styled form, test registration flow

### Implementation for User Story 3

- [x] T021 [US3] Update signup page wrapper in `frontend/app/(auth)/signup/page.tsx` with GlassCard and centered layout
- [x] T022 [US3] Add Tailwind classes to SignUpForm in `frontend/components/auth/SignUpForm.tsx` for themed inputs and button
- [x] T023 [US3] Style error message display in `frontend/components/auth/SignUpForm.tsx` with themed colors
- [x] T024 [US3] Ensure responsive layout (centered, touch-friendly) in `frontend/app/(auth)/signup/page.tsx`

**Checkpoint**: Sign-up page looks premium, form works correctly, errors display properly.

---

## Phase 6: User Story 4 - Dashboard View (Priority: P1)

**Goal**: Task dashboard with header, task list, loading/empty/error states

**Independent Test**: Sign in and verify dashboard shows navbar, task area with appropriate state

### Implementation for User Story 4

- [x] T025 [US4] Create TaskCard component in `frontend/components/tasks/TaskCard.tsx` with title, description, status badge, action buttons
- [x] T026 [US4] Create TaskForm component in `frontend/components/tasks/TaskForm.tsx` for create/edit with title and description fields
- [x] T027 [US4] Rebuild dashboard page in `frontend/app/(protected)/dashboard/page.tsx` with Navbar integration
- [x] T028 [US4] Add task list section to dashboard in `frontend/app/(protected)/dashboard/page.tsx` using useTasks hook
- [x] T029 [US4] Implement loading state in dashboard in `frontend/app/(protected)/dashboard/page.tsx` using LoadingState component
- [x] T030 [US4] Implement empty state in dashboard in `frontend/app/(protected)/dashboard/page.tsx` using EmptyState component
- [x] T031 [US4] Implement error state with retry button in dashboard in `frontend/app/(protected)/dashboard/page.tsx`

**Checkpoint**: Dashboard shows tasks (or empty/loading/error states), navbar with logout works.

---

## Phase 7: User Story 5 - Create Task (Priority: P2)

**Goal**: Create new tasks from dashboard form

**Independent Test**: Fill task form, submit, see new task appear in list

### Implementation for User Story 5

- [x] T032 [US5] Integrate TaskForm for creation in dashboard `frontend/app/(protected)/dashboard/page.tsx`
- [x] T033 [US5] Wire form submission to useTasks.createTask in `frontend/app/(protected)/dashboard/page.tsx`
- [x] T034 [US5] Add form validation (title required) with error display in `frontend/components/tasks/TaskForm.tsx`
- [x] T035 [US5] Implement optimistic UI update on task creation in `frontend/lib/hooks/useTasks.ts`

**Checkpoint**: Can create tasks, they appear in list immediately.

---

## Phase 8: User Story 6 - Toggle Completion (Priority: P2)

**Goal**: Toggle task completion status

**Independent Test**: Click toggle button on task card, see status badge update

### Implementation for User Story 6

- [x] T036 [US6] Add toggle completion button to TaskCard in `frontend/components/tasks/TaskCard.tsx`
- [x] T037 [US6] Wire toggle to useTasks.toggleComplete in `frontend/app/(protected)/dashboard/page.tsx`
- [x] T038 [US6] Implement optimistic UI update for toggle in `frontend/lib/hooks/useTasks.ts`
- [x] T039 [US6] Style completion badge (complete/incomplete states) in `frontend/components/tasks/TaskCard.tsx`

**Checkpoint**: Can toggle tasks, status updates immediately.

---

## Phase 9: User Story 7 - Edit Task (Priority: P2)

**Goal**: Edit existing task title and description

**Independent Test**: Click edit on task, modify content, save, see changes

### Implementation for User Story 7

- [x] T040 [US7] Add edit button and edit mode state to TaskCard in `frontend/components/tasks/TaskCard.tsx`
- [x] T041 [US7] Show inline TaskForm in edit mode in `frontend/components/tasks/TaskCard.tsx`
- [x] T042 [US7] Wire form submission to useTasks.updateTask in `frontend/app/(protected)/dashboard/page.tsx`
- [x] T043 [US7] Implement optimistic UI update for edits in `frontend/lib/hooks/useTasks.ts`
- [x] T044 [US7] Add cancel edit functionality in `frontend/components/tasks/TaskCard.tsx`

**Checkpoint**: Can edit tasks, changes appear immediately.

---

## Phase 10: User Story 8 - Delete Task (Priority: P2)

**Goal**: Delete tasks from list

**Independent Test**: Click delete on task, see it removed from list

### Implementation for User Story 8

- [x] T045 [US8] Add delete button to TaskCard in `frontend/components/tasks/TaskCard.tsx`
- [x] T046 [US8] Wire delete to useTasks.deleteTask in `frontend/app/(protected)/dashboard/page.tsx`
- [x] T047 [US8] Implement optimistic UI update for deletion in `frontend/lib/hooks/useTasks.ts`
- [x] T048 [US8] Show empty state after deleting last task in `frontend/app/(protected)/dashboard/page.tsx`

**Checkpoint**: Can delete tasks, they disappear immediately, empty state shows when none left.

---

## Phase 11: User Story 9 - Responsive Experience (Priority: P3)

**Goal**: Full responsive support across all devices

**Independent Test**: Resize browser/use DevTools to test 320px, 768px, 1440px viewports

### Implementation for User Story 9

- [x] T049 [US9] Verify and fix mobile layout (320px) across all pages
- [x] T050 [US9] Verify and fix tablet layout (768px) across all pages
- [x] T051 [US9] Verify and fix desktop layout (1440px) across all pages
- [x] T052 [US9] Ensure touch targets are minimum 44x44px on mobile buttons
- [x] T053 [US9] Fix any layout shifts or flash of unstyled content

**Checkpoint**: All pages render correctly at all breakpoints, no layout issues.

---

## Phase 12: Polish & Demo Readiness

**Purpose**: Final validation and demo preparation

- [x] T054 Run through complete user flow: landing → signup → dashboard → CRUD → logout
- [x] T055 Verify 401 handling: simulate expired token, confirm redirect to signin
- [x] T056 Test error states: disable network, confirm error state with retry
- [x] T057 Cross-browser check: test in Chrome, Firefox, Safari (if available)
- [x] T058 Run quickstart.md validation checklist

**Checkpoint**: App is demo-ready with complete functionality.

---

## Dependencies & Execution Order

### Phase Dependencies

```text
Phase 1 (Setup) ──────────────────────────────────┐
     │                                             │
     ├──► Phase 2 (Foundational) ─────────────────┤
     │         │                                   │
     │         ├──► Phase 6 (Dashboard View) ─────┤
     │         │         │                         │
     │         │         ├──► Phase 7 (Create) ───┤
     │         │         ├──► Phase 8 (Toggle) ───┤
     │         │         ├──► Phase 9 (Edit) ─────┤
     │         │         └──► Phase 10 (Delete) ──┤
     │         │                                   │
     ├──► Phase 3 (Landing) ──────────────────────┤
     ├──► Phase 4 (Sign In) ──────────────────────┤
     └──► Phase 5 (Sign Up) ──────────────────────┤
                                                   │
Phase 11 (Responsive) ◄────────────────────────────┤
     │                                             │
Phase 12 (Polish) ◄────────────────────────────────┘
```

### User Story Dependencies

- **US1 (Landing)**: Needs Phase 1 (UI components)
- **US2 (Sign In)**: Needs Phase 1 (UI components)
- **US3 (Sign Up)**: Needs Phase 1 (UI components)
- **US4 (Dashboard View)**: Needs Phase 1 + Phase 2 (types, API, hook)
- **US5-US8 (CRUD)**: Needs US4 (dashboard structure)
- **US9 (Responsive)**: Needs all previous stories complete

### Parallel Opportunities

- **Phase 1**: T002-T008 can all run in parallel (separate files)
- **Phase 3-5**: Can run in parallel after Phase 1 (independent pages)
- **Phase 7-10**: Can run in parallel after Phase 6 (independent CRUD operations)

---

## Parallel Examples

### Phase 1 Parallel Execution

```bash
# All UI components can be created in parallel:
T002: Create Button in frontend/components/ui/Button.tsx
T003: Create GlassCard in frontend/components/ui/GlassCard.tsx
T004: Create TextInput in frontend/components/ui/TextInput.tsx
T005: Create TextArea in frontend/components/ui/TextArea.tsx
T006: Create LoadingState in frontend/components/ui/LoadingState.tsx
T007: Create EmptyState in frontend/components/ui/EmptyState.tsx
T008: Create Navbar in frontend/components/ui/Navbar.tsx
```

### Auth Pages Parallel Execution

```bash
# After Phase 1, auth pages can be styled in parallel:
T017-T020: Sign In page styling
T021-T024: Sign Up page styling
```

---

## Implementation Strategy

### MVP First (Through Phase 6)

1. Complete Phase 1: Setup (8 tasks)
2. Complete Phase 2: Foundational (4 tasks)
3. Complete Phase 3: Landing Page (4 tasks)
4. Complete Phase 4: Sign In (4 tasks)
5. Complete Phase 5: Sign Up (4 tasks)
6. Complete Phase 6: Dashboard View (7 tasks)
7. **STOP and VALIDATE**: Full auth flow + task viewing works
8. Demo if ready with view-only dashboard

### Full CRUD (Phases 7-10)

9. Complete Phase 7: Create Task (4 tasks)
10. Complete Phase 8: Toggle Completion (4 tasks)
11. Complete Phase 9: Edit Task (5 tasks)
12. Complete Phase 10: Delete Task (4 tasks)
13. **STOP and VALIDATE**: Full CRUD works end-to-end

### Final Polish (Phases 11-12)

14. Complete Phase 11: Responsive Experience (5 tasks)
15. Complete Phase 12: Demo Readiness (5 tasks)
16. **DEMO READY**: Full app functional and polished

---

## Task Summary

| Phase | Tasks | Parallel | Description |
|-------|-------|----------|-------------|
| 1 | 8 | 7 | Setup (Design System) |
| 2 | 4 | 0 | Foundational (API/Types) |
| 3 | 4 | 0 | US1: Landing Page |
| 4 | 4 | 0 | US2: Sign In |
| 5 | 4 | 0 | US3: Sign Up |
| 6 | 7 | 2 | US4: Dashboard View |
| 7 | 4 | 0 | US5: Create Task |
| 8 | 4 | 0 | US6: Toggle Completion |
| 9 | 5 | 0 | US7: Edit Task |
| 10 | 4 | 0 | US8: Delete Task |
| 11 | 5 | 5 | US9: Responsive |
| 12 | 5 | 0 | Polish & Demo |
| **Total** | **58** | **14** | |

---

## Notes

- All file paths are relative to repository root
- `/frontend-DO-NOT-TOUCH` must NEVER be edited
- Existing auth components (SignInForm, SignUpForm) get styling only, no logic changes
- Manual browser testing - no automated tests required
- Commit after each task or logical group for easy rollback
