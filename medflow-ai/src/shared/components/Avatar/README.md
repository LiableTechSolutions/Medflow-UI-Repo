# Avatar

## Purpose
Avatar identifies a person or account using initials.

## When to use
Use beside names in navigation, records, comments, or account controls.

## When NOT to use
Use an image with an appropriate alt description when a real portrait is necessary for the task.

## Props

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `name` | `string` | Yes | - | Person name used for initials and accessible text. |
| `size` | `sm \| md \| lg` | No | `md` | Avatar scale. |
| `status` | `online \| away \| offline` | No | - | Optional presence indicator. |
| `className` | `string` | No | - | Additional class names. |

## Variants
Status adds online, away, or offline presence.

## Sizes
`sm`, `md`, and `lg` support compact, standard, and prominent contexts.

## Accessibility
The name is exposed as accessible text. Status must not rely on color alone.

## Usage
```tsx
<Avatar name="Ananya Rao" size="md" status="online" />
```

## Best Practices
Use the same name source as the adjacent label and keep identity context nearby.

## Anti-patterns
Do not use initials as a substitute for required identity verification.

## Related Components
Badge, ProfileMenu, Card.
