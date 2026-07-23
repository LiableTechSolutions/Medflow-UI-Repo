# Button

## Purpose
Button triggers an action or submits a form.

## When to use
Use for clear, intentional actions such as saving, creating, confirming, or cancelling.

## When NOT to use
Use a link for navigation. Use an icon-only control only when the icon has a clear accessible label.

## Props

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `variant` | `primary \| secondary \| ghost \| outline \| danger` | No | `primary` | Visual intent. |
| `size` | `sm \| md \| lg` | No | `md` | Button scale. |
| `leftIcon` | `ReactNode` | No | - | Icon before the label. |
| `rightIcon` | `ReactNode` | No | - | Icon after the label. |
| `isLoading` | `boolean` | No | `false` | Shows progress and disables the button. |
| `fullWidth` | `boolean` | No | `false` | Expands to the container width. |
| native button props | `ButtonHTMLAttributes<HTMLButtonElement>` | No | - | Standard button behavior. |

## Variants
`primary`, `secondary`, `ghost`, `outline`, and `danger` communicate action priority.

## Sizes
`sm`, `md`, and `lg` support dense, standard, and prominent actions.

## Accessibility
Native button keyboard support includes Enter and Space. The disabled and loading states expose native disabled behavior; provide visible text and use `aria-label` for icon-only content.

## Usage
```tsx
import { Button } from '@/components/ui';
<Button variant="primary">Save</Button>
<Button variant="outline" isLoading>Saving</Button>
```

## Best Practices
Use concise verb-led labels and one primary action per region.

## Anti-patterns
Do not use buttons for navigation or hide the only action behind an unlabeled icon.

## Related Components
Link, Input, Modal, Card.
