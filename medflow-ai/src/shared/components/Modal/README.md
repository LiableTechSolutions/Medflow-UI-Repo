# Modal

## Purpose
Modal presents focused content above the current page.

## When to use
Use for short tasks that require attention without losing page context.

## When NOT to use
Use a page or Drawer for large workflows, long forms, or content users need to compare with the underlying page.

## Props

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `isOpen` | `boolean` | Yes | - | Controls visibility. |
| `onClose` | `() => void` | Yes | - | Closes the modal. |
| `title` | `string` | No | - | Dialog heading. |
| `description` | `string` | No | - | Supporting description. |
| `children` | `ReactNode` | Yes | - | Dialog content. |
| `footer` | `ReactNode` | No | - | Action region. |
| `size` | `sm \| md \| lg` | No | `md` | Dialog width. |

## Variants
The `size` prop controls the dialog width.

## Sizes
`sm`, `md`, and `lg` support focused, standard, and larger tasks.

## Accessibility
The component renders dialog semantics, traps focus while open, and supports Escape dismissal where implemented. Use a meaningful title and keep focusable actions reachable.

## Usage
```tsx
<Modal isOpen={open} onClose={() => setOpen(false)} title="Delete patient">
  <p>This action cannot be undone.</p>
</Modal>
```

## Best Practices
Use one clear primary action and explain destructive consequences.

## Anti-patterns
Do not nest modals or put multi-step application workflows inside a small dialog.

## Related Components
Drawer, Button, Alert, Card.
