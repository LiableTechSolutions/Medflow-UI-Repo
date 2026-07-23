# Alert

## Purpose
Alert presents persistent contextual feedback.

## When to use
Use for important information, validation summaries, warnings, or errors that should remain visible.

## When NOT to use
Use Toast for transient confirmation and Modal for decisions requiring interruption.

## Props

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `tone` | `info \| success \| warning \| danger` | No | `info` | Message intent. |
| `title` | `string` | No | - | Optional heading. |
| `children` | `ReactNode` | Yes | - | Alert content. |
| `onDismiss` | `() => void` | No | - | Optional dismiss action. |
| `className` | `string` | No | - | Additional class names. |

## Variants
`info`, `success`, `warning`, and `danger` express message intent.

## Sizes
Alert uses content-driven sizing.

## Accessibility
Use an appropriate alert/live-region role for urgency and include text that communicates meaning without color alone. Dismiss controls need an accessible name.

## Usage
```tsx
<Alert tone="warning" title="Review required">The record is missing a consent document.</Alert>
```

## Best Practices
Put the alert close to the content it describes and make recovery actions explicit.

## Anti-patterns
Do not stack many alerts or use danger styling for ordinary information.

## Related Components
Toast, Modal, EmptyState, Badge.
