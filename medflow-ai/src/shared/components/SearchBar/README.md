# SearchBar

## Purpose
SearchBar collects a query for filtering or finding records.

## When to use
Use for global or local search where results update from a text query.

## When NOT to use
Use Input for ordinary text and Select for a short fixed set.

## Props

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `placeholder` | `string` | No | `Search…` | Search prompt. |
| native input props | `InputHTMLAttributes<HTMLInputElement>` | No | - | Standard input behavior. |
| `className` | `string` | No | - | Additional class names. |

## Variants
SearchBar provides a search affordance and standard input behavior.

## Sizes
Uses the standard search control size.

## Accessibility
Provide a meaningful label or `aria-label`, announce result counts where needed, and keep the input keyboard accessible.

## Usage
```tsx
<SearchBar aria-label="Search patients" placeholder="Search patients" />
```

## Best Practices
Debounce remote queries and show a clear no-results state.

## Anti-patterns
Do not submit a search without communicating what is being searched.

## Related Components
Input, EmptyState, Pagination, DatePicker.
