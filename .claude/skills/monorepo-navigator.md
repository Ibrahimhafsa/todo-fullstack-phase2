# Skill: monorepo-navigator

## Purpose
Navigate monorepo structure, find related files across frontend/backend/specs, coordinate cross-stack changes, and detect inconsistencies.

## Used By
- orchestrator
- backend-expert
- frontend-expert
- spec-manager

## Capabilities

### 1. Structure Discovery
- Map frontend directory structure (Next.js)
- Map backend directory structure (FastAPI)
- Locate specification files
- Identify shared types/contracts

### 2. Cross-Stack File Correlation
- Match API routes to backend endpoints
- Link TypeScript types to Pydantic models
- Connect UI components to API calls
- Map database models to API responses

### 3. Change Coordination
- Identify files affected by a change
- Suggest related updates across stack
- Detect breaking changes
- Plan coordinated modifications

### 4. Inconsistency Detection
- Find type mismatches frontend/backend
- Detect orphaned endpoints
- Identify missing implementations
- Flag spec/implementation drift

## Project Structure Map

```
todo-fullstack/
├── frontend/                 # Next.js 16 application
│   ├── src/
│   │   ├── app/             # App router pages
│   │   ├── components/      # React components
│   │   ├── lib/             # Utilities, API client
│   │   └── types/           # TypeScript types
│   ├── .env.local           # Frontend environment
│   └── package.json
│
├── backend/                  # FastAPI application
│   ├── app/
│   │   ├── api/             # API routes
│   │   ├── models/          # SQLModel definitions
│   │   ├── schemas/         # Pydantic schemas
│   │   └── core/            # Auth, config, deps
│   ├── .env                 # Backend environment
│   └── requirements.txt
│
├── specs/                    # Feature specifications
│   └── <feature>/
│       ├── spec.md
│       ├── plan.md
│       └── tasks.md
│
├── .specify/                 # Spec-Kit Plus config
│   ├── memory/
│   │   └── constitution.md
│   └── templates/
│
└── history/                  # Project history
    ├── prompts/
    └── adr/
```

## File Correlation Patterns

### API Endpoint Changes
When modifying an endpoint, check:
```
backend/app/api/<resource>.py    → Endpoint implementation
backend/app/schemas/<resource>.py → Request/Response schemas
backend/app/models/<resource>.py  → Database model
frontend/src/lib/api/<resource>.ts → API client
frontend/src/types/<resource>.ts  → TypeScript types
specs/<feature>/spec.md          → Specification
```

### Database Schema Changes
When modifying a model, check:
```
backend/app/models/<model>.py    → SQLModel definition
backend/app/schemas/<model>.py   → Pydantic schemas
frontend/src/types/<model>.ts    → TypeScript interface
specs/<feature>/spec.md          → Database schema spec
```

### UI Component Changes
When modifying a component, check:
```
frontend/src/components/<comp>.tsx → Component implementation
frontend/src/lib/api/<resource>.ts → API calls used
frontend/src/types/<type>.ts      → Types used
specs/<feature>/spec.md           → UI requirements
```

## Navigation Commands

```bash
# Find all files related to a feature
find . -name "*task*" -type f

# Find TypeScript types
find frontend/src/types -name "*.ts"

# Find API routes
find backend/app/api -name "*.py"

# Find specs
find specs -name "spec.md"
```

## Cross-Stack Checklist

When making changes, ensure:
- [ ] Backend schema matches frontend types
- [ ] API client reflects endpoint changes
- [ ] Spec is updated if behavior changes
- [ ] All related files are modified together
