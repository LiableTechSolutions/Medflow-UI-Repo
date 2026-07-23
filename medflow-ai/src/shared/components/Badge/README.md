# Badge

## Purpose
Badge displays a compact status, category, or count.

## When to use
Use for short metadata and status signals near the related content.

## When NOT to use
Use Alert or Toast for messages that need explanation or attention.

## Props

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `tone` | `neutral \| blue \| green \| amber \| coral` | No | `neutral` | Status color. |
| `dot` | `boolean` | No | `false` | Shows a status dot. |
| `children` | `ReactNode` | Yes | - | Badge content. |
| native span props | `HTMLAttributes<HTMLSpanElement>` | No | - | Standard span behavior. |

## Variants
Tone communicates neutral, informational, positive, pending, or critical status.

## Sizes
Badge uses a compact fixed size.

## Accessibility
Do not use color alone to communicate meaning. Include text that screen readers can understand; hide decorative dots from assistive technology.

## Usage
```tsx
<Badge tone="green" dot>Active</Badge>
```

## Best Practices
Use one or two words and keep status vocabulary consistent.

## Anti-patterns
Do not use badges for long descriptions or as unlabeled interactive controls.

## Related Components
Alert, Avatar, Card, Table.
