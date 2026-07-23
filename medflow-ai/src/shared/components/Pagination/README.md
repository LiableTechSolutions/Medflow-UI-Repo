# Pagination

## Purpose
Pagination divides a large result set into manageable pages.

## When to use
Use when loading all results at once would harm scanning or performance.

## When NOT to use
Use infinite scroll only when continuous exploration is the primary task and position can be preserved.

## Props

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `currentPage` | `number` | Yes | - | Active page number. |
| `totalPages` | `number` | Yes | - | Number of pages. |
| `onPageChange` | `(page: number) => void` | Yes | - | Page callback. |
| `summary` | `string` | No | - | Result summary. |
| `className` | `string` | No | - | Additional class names. |

## Variants
The optional summary adds result context.

## Sizes
Uses the standard navigation density.

## Accessibility
Use a navigation landmark with an accessible label, expose current page state, and give previous/next controls meaningful names.

## Usage
```tsx
<Pagination currentPage={page} totalPages={12} onPageChange={setPage} />
```

## Best Practices
Preserve filters and scroll position when changing pages.

## Anti-patterns
Do not render controls that imply pages users cannot access.

## Related Components
Table, SearchBar, Breadcrumb.
