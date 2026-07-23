# Breadcrumb

## Purpose
Breadcrumb shows the user’s location in a hierarchy.

## When to use
Use on nested pages where returning to parent levels is useful.

## When NOT to use
Do not use for flat navigation or as a replacement for the primary navigation.

## Props

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `items` | `Crumb[]` | Yes | - | Ordered breadcrumb labels and destinations. |

## Variants
The current implementation provides one hierarchical presentation.

## Sizes
Uses the standard navigation density.

## Accessibility
Render within a navigation landmark with an accessible label. Mark the current page and ensure every parent destination is keyboard reachable.

## Usage
```tsx
<Breadcrumb items={[{ label: 'Patients', href: '/patients' }, { label: 'Ava Singh' }]} />
```

## Best Practices
Keep labels short and reflect the route hierarchy.

## Anti-patterns
Do not include every filter or temporary UI state as a breadcrumb.

## Related Components
Pagination, Tabs, Sidebar, PageHeader.
