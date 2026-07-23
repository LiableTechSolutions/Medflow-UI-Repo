# AppLayout

## Purpose
AppLayout composes the authenticated application shell around routed content.

## When to use
Use as the top-level shell for authenticated MedFlow application routes.

## When NOT to use
Do not use for standalone library examples or public/authentication pages.

## Props

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| children | `ReactNode` | No | Routed outlet | Page content rendered in the shell. |

## Variants
The shell uses the authenticated navigation layout.

## Sizes
Responsive behavior is controlled by the shell breakpoints.

## Accessibility
The layout provides navigation and main content landmarks. Keep a single meaningful page heading inside the content region.

## Usage
```tsx
<AppLayout />
```

## Best Practices
Keep route-specific content outside the shell and make navigation labels stable.

## Anti-patterns
Do not nest authenticated shells or place business logic in the layout.

## Related Components
Sidebar, Header, Footer, PageHeader.
