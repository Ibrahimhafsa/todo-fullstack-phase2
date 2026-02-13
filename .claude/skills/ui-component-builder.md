# Skill: ui-component-builder

## Purpose
Generate beautiful, accessible React components with Tailwind CSS, implement responsive design, add ARIA labels, and ensure mobile-first patterns.

## Used By
- frontend-expert

## Capabilities

### 1. Component Generation
- Create functional React components
- Implement proper TypeScript typing
- Structure component hierarchy
- Manage component state

### 2. Tailwind CSS Styling
- Apply utility-first CSS
- Create consistent design system
- Implement dark mode support
- Use responsive modifiers

### 3. Accessibility Implementation
- Add ARIA labels and roles
- Ensure keyboard navigation
- Implement focus management
- Support screen readers

### 4. Responsive Design
- Mobile-first approach
- Breakpoint management
- Touch-friendly interactions
- Flexible layouts

## Component Template

```tsx
import { useState } from 'react';

interface ComponentProps {
  // Props definition
}

export function Component({ ...props }: ComponentProps) {
  // State and logic

  return (
    <div
      className="..."
      role="..."
      aria-label="..."
    >
      {/* Content */}
    </div>
  );
}
```

## Tailwind Patterns

### Responsive Modifiers
```tsx
// Mobile-first: base → sm → md → lg → xl → 2xl
<div className="
  w-full           // Mobile: full width
  sm:w-1/2         // Small: half width
  md:w-1/3         // Medium: third width
  lg:w-1/4         // Large: quarter width
">
```

### Common Layouts
```tsx
// Flex container
<div className="flex flex-col sm:flex-row gap-4">

// Grid layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Centered content
<div className="flex items-center justify-center min-h-screen">
```

### Form Styling
```tsx
<input
  type="text"
  className="
    w-full px-4 py-2
    border border-gray-300 rounded-lg
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    disabled:bg-gray-100 disabled:cursor-not-allowed
  "
/>

<button
  className="
    px-6 py-2
    bg-blue-600 text-white rounded-lg
    hover:bg-blue-700
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-colors
  "
>
```

## Accessibility Patterns

### Interactive Elements
```tsx
// Button with proper accessibility
<button
  type="button"
  onClick={handleClick}
  disabled={isLoading}
  aria-label="Create new task"
  aria-busy={isLoading}
  className="..."
>
  {isLoading ? 'Creating...' : 'Create Task'}
</button>

// Checkbox with label
<label className="flex items-center gap-2 cursor-pointer">
  <input
    type="checkbox"
    checked={isCompleted}
    onChange={handleChange}
    aria-describedby="task-description"
    className="w-5 h-5 rounded border-gray-300"
  />
  <span id="task-description">{taskTitle}</span>
</label>
```

### Form Accessibility
```tsx
<form onSubmit={handleSubmit} aria-label="Create task form">
  <div className="space-y-4">
    <div>
      <label htmlFor="title" className="block text-sm font-medium">
        Task Title
      </label>
      <input
        id="title"
        type="text"
        required
        aria-required="true"
        aria-invalid={!!errors.title}
        aria-describedby={errors.title ? "title-error" : undefined}
        className="..."
      />
      {errors.title && (
        <p id="title-error" role="alert" className="text-red-600 text-sm mt-1">
          {errors.title}
        </p>
      )}
    </div>
  </div>
</form>
```

### List Accessibility
```tsx
<ul role="list" aria-label="Task list" className="space-y-2">
  {tasks.map((task) => (
    <li
      key={task.id}
      role="listitem"
      className="..."
    >
      {/* Task content */}
    </li>
  ))}
</ul>
```

## Component Examples

### Task Card
```tsx
interface TaskCardProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export function TaskCard({ task, onToggle, onDelete }: TaskCardProps) {
  return (
    <article
      className="
        p-4 bg-white rounded-lg shadow-sm border border-gray-200
        hover:shadow-md transition-shadow
      "
      aria-labelledby={`task-${task.id}-title`}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
          className="mt-1 w-5 h-5 rounded border-gray-300"
        />
        <div className="flex-1 min-w-0">
          <h3
            id={`task-${task.id}-title`}
            className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p className="text-gray-600 text-sm mt-1">{task.description}</p>
          )}
        </div>
        <button
          onClick={() => onDelete(task.id)}
          aria-label={`Delete task "${task.title}"`}
          className="text-gray-400 hover:text-red-600 transition-colors"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </article>
  );
}
```

## Checklist

### Component Quality
```
- [ ] TypeScript props interface defined
- [ ] Proper event handlers
- [ ] Loading states handled
- [ ] Error states displayed
- [ ] Empty states designed
```

### Accessibility
```
- [ ] All interactive elements focusable
- [ ] Keyboard navigation works
- [ ] ARIA labels present
- [ ] Color contrast sufficient (4.5:1)
- [ ] Focus indicators visible
```

### Responsive
```
- [ ] Mobile layout works
- [ ] Tablet layout works
- [ ] Desktop layout works
- [ ] Touch targets ≥44px
- [ ] Text readable at all sizes
```
