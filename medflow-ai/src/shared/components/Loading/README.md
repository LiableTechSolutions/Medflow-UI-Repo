# Loading

## Purpose
Loading and Skeleton communicate pending content.

## When to use
Use Loading for active work and Skeleton when the eventual layout is known.

## When NOT to use
Do not use an indefinite loader when an error or empty state is known.

## Props

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | No | `Loading…` | Accessible progress text. |
| `fullHeight` | `boolean` | No | `false` | Fills the available region. |
| `className` | `string` on Skeleton | No | - | Additional skeleton classes. |

## Variants
Loading is the active indicator; Skeleton is the placeholder variant.

## Sizes
Uses the surrounding layout dimensions.

## Accessibility
Loading exposes a text label for assistive technology. Respect reduced-motion preferences and do not communicate progress through animation alone.

## Usage
```tsx
<Loading label="Loading appointments" />
<Skeleton className="table-placeholder" />
```

## Best Practices
Use a stable placeholder layout and keep loading states brief.

## Anti-patterns
Do not replace content with a spinner for every small update.

## Related Components
EmptyState, Alert, Toast.
