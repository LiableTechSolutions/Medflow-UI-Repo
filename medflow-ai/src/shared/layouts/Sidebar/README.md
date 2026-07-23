# Sidebar

## Purpose
Sidebar provides primary navigation for the authenticated application.

## When to use
Use for products with multiple top-level work areas.

## When NOT to use
Use a simpler navigation pattern for small, single-purpose experiences.

## Props

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| collapsed | `boolean` | Yes | - | Compact desktop state. |
| onToggle | `() => void` | Yes | - | Toggles collapsed state. |
| mobileOpen | `boolean` | Yes | - | Mobile visibility. |
| onCloseMobile | `() => void` | Yes | - | Closes mobile navigation. |

## Variants
Collapsed and mobile-open states adapt navigation to viewport and available space.

## Sizes
Desktop expanded/collapsed widths follow layout tokens.

## Accessibility
Use a navigation landmark, meaningful link labels, and an accessible toggle. The active route must be distinguishable without color alone.

## Usage
```tsx
<Sidebar collapsed={false} onToggle={toggle} mobileOpen={open} onCloseMobile={close} />
```

## Best Practices
Keep primary destinations stable and group related routes.

## Anti-patterns
Do not hide essential destinations behind unexplained icons.

## Related Components
Header, Navbar, Breadcrumb, ProfileMenu.
