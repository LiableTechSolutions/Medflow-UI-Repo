# EmptyState

## Purpose
EmptyState explains why a region has no content and offers a next step.

## When to use
Use for first-use, filtered-empty, or no-result states.

## When NOT to use
Use Loading while data is pending and Alert when content failed to load.

## Props

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `icon` | `ReactNode` | No | - | Supporting visual. |
| `title` | `string` | Yes | - | Short empty-state heading. |
| `description` | `string` | No | - | Explanation or guidance. |
| `action` | `ReactNode` | No | - | Optional next action. |

## Variants
The message and optional action define the state; no visual variants are exposed.

## Sizes
Content determines the height.

## Accessibility
Use a heading and descriptive text. Ensure the action has an accessible name and do not make the icon the only explanation.

## Usage
```tsx
<EmptyState title="No appointments" description="Create an appointment to see it here." action={<Button>Schedule</Button>} />
```

## Best Practices
Explain what happened and what the user can do next.

## Anti-patterns
Do not use empty state to hide loading or error conditions.

## Related Components
Loading, Alert, Button, Card.
