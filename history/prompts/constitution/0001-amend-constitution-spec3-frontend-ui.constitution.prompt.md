---
id: 0001
title: Amend Constitution for Spec-3 Frontend UI
stage: constitution
date: 2026-01-23
surface: agent
model: claude-opus-4-5-20251101
feature: none
branch: 002-task-crud
user: hafsaibrahim
command: /sp.constitution
labels: ["constitution", "spec-3", "frontend-ui", "design-system"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - N/A (constitution amendment, no tests)
---

## Prompt

Spec-3 Constitution: Frontend UI + Responsive Experience (Next.js)

## Purpose
Deliver a modern, responsive, demo-ready frontend for the Todo Full-Stack Web App.
This spec focuses ONLY on frontend UI/UX and integration with the already-built backend APIs.

## Project Scope (Allowed)
Frontend must include:
- Auth pages (already created in Spec-1)
- A protected Task Dashboard
- Task CRUD UI:
  - Create task
  - List tasks
  - Update task
  - Delete task
  - Toggle completion
- Responsive layout (mobile/tablet/desktop)
- Attractive polished theme (soft teal–cyan–black glow)

## Locked Tech Stack
- Next.js 16+ (App Router)
- TypeScript
- Tailwind CSS
- Better Auth (already completed in Spec-1)
- Backend: FastAPI REST API (already completed in Spec-2)

## Folder Safety Rules (Non-Negotiable)
- All frontend work MUST happen only inside: `/frontend`
- DO NOT edit or create anything inside: `/frontend-DO-NOT-TOUCH` (backup folder)
- DO NOT recreate the Next.js app again
- Do not generate duplicate auth files/components if they already exist
- If unsure, STOP and report existing files before editing

## Design System Rules (Theme)
Required visual theme:
- Background: soft black/dark base with teal/cyan glow accents
- Cards: glassy (semi-transparent), blur effect, rounded-xl
- Buttons: modern, soft glow on hover
- Inputs: clean, high-contrast, focus ring
- Smooth hover transitions
- Use Tailwind only (no inline CSS)
- UI must look premium, modern, and hackathon-demo ready

## UX Rules (Non-Negotiable)
- All pages must be responsive
- Clear user flows: Login → Dashboard, Sign Up → Dashboard
- Dashboard must include: Loading state, Empty state, Error state (with retry)
- Must prevent flashing/ugly layout shifts

## Integration Rules
- The frontend must call Spec-2 endpoints for tasks
- Every API request must include JWT token
- If API returns 401 → redirect to Sign In
- No backend changes allowed in Spec-3

## Forbidden (Phase-2 Spec-3)
- No extra features: search/filter/sort, tags/priorities, due dates/reminders, recurring tasks
- No backend modifications
- No database changes

## Completion Criteria
Spec-3 is complete only if:
- UI looks modern and attractive with teal/cyan/black glowing theme
- Fully responsive dashboard works on mobile + desktop
- Task CRUD works from the UI end-to-end
- No duplicate file creation occurred

## Response snapshot

Amended constitution from v1.1.0 to v1.2.0 (MINOR bump) with 5 new principles for Spec-3 Frontend UI:

**Added Principles:**
- XI. Frontend Workspace Isolation - `/frontend` only, no `/frontend-DO-NOT-TOUCH`
- XII. Design System Compliance - Teal/cyan/black glow theme, Tailwind-only
- XIII. Responsive Layout Requirements - Mobile-first, 320px-2560px support
- XIV. UX State Management - Loading, empty, error states required
- XV. Frontend-Backend Integration - JWT in all requests, 401 redirect handling

**Added Sections:**
- Spec-3 Frontend UI Scope
- Spec-3 Success Criteria (9 checkpoints)
- Explicitly Forbidden items for Spec-3

All existing principles (I-X) preserved unchanged. Templates verified compatible.

## Outcome

- ✅ Impact: Constitution amended to v1.2.0 with comprehensive Spec-3 frontend UI governance
- 🧪 Tests: N/A (constitution document)
- 📁 Files: 1 file modified (.specify/memory/constitution.md)
- 🔁 Next prompts: /sp.specify for Spec-3, /sp.plan for implementation planning
- 🧠 Reflection: Clear separation of concerns maintained between specs; design system rules are testable

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Manual validation PASS - no bracket placeholders remain, version correct, dates ISO format
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
