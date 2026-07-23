# Drawer

## Purpose
Drawer reveals supplementary content from an edge of the viewport.

## When to use
Use for filters, detail views, and short side workflows that benefit from retained page context.

## When NOT to use
Use Modal for focused confirmation or a full page for complex workflows.

## Props

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `isOpen` | `boolean` | Yes | - | Controls visibility. |
| `onClose` | `() => void` | Yes | - | Closes the drawer. |
| `title` | `string` | No | - | Drawer heading. |
| `children` | `ReactNode` | Yes | - | Drawer content. |

## Variants
The current implementation provides one edge-panel presentation.

## Sizes
Width follows the responsive drawer layout.

## Accessibility
Use a heading, provide an accessible close control, and preserve keyboard focus while open. Escape should dismiss when supported.

## Usage
```tsx
<Drawer isOpen={open} onClose={() => setOpen(false)} title="Filters">...</Drawer>
```

## Best Practices
Keep drawer tasks short and preserve the underlying page state.

## Anti-patterns
Do not put nested drawers or large multi-step flows inside a drawer.

## Related Components
Modal, Sidebar, Button, Input.
