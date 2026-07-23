# Card

## Purpose
Card groups related content into a readable surface.

## When to use
Use for independent records, summaries, or dashboard sections that benefit from visual grouping.

## When NOT to use
Do not wrap an entire page in nested decorative cards or use it when simple layout spacing is enough.

## Props

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `interactive` | `boolean` | No | `false` | Enables interactive styling. |
| `padding` | `sm \| md \| lg` | No | `md` | Inner spacing. |
| `className` | `string` | No | - | Additional class names. |
| native div props | `HTMLAttributes<HTMLDivElement>` | No | - | Standard container behavior. |
| subcomponents | `CardHeader`, `CardTitle`, `CardSubtitle`, `CardBody`, `CardFooter` | No | - | Structured card regions. |

## Variants
`interactive` adds affordance for clickable cards.

## Sizes
`sm`, `md`, and `lg` padding options are available.

## Accessibility
Use a heading inside `CardTitle`. Interactive cards should contain a real button or link so keyboard and screen-reader users have an operable target.

## Usage
```tsx
import { Card, CardBody, CardTitle } from '@/components/ui';
<Card><CardTitle>Appointments</CardTitle><CardBody>12 scheduled today.</CardBody></Card>
```

## Best Practices
Use cards to group one idea and keep hierarchy consistent.

## Anti-patterns
Avoid cards inside cards and avoid making an entire card clickable without a semantic control.

## Related Components
Button, Badge, EmptyState, Table.
