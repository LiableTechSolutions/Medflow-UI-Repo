# Header

## Purpose
Header provides authenticated page context, search, notifications, and account access.

## When to use
Use at the top of an authenticated application shell.

## When NOT to use
Do not use as a generic page heading or on public pages without account context.

## Props

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| onMenuClick | `() => void` | Yes | - | Toggles navigation. |
| userName | `string` | No | `Dr. Ananya Rao` | Displayed account name. |

## Variants
Responsive behavior changes available controls across viewport sizes.

## Sizes
Header height follows the shell token.

## Accessibility
Menu, search, notification, and profile controls need accessible labels. Preserve keyboard order and expose notification counts as text.

## Usage
```tsx
<Header onMenuClick={() => setNavigationOpen(true)} userName="Ava Singh" />
```

## Best Practices
Keep header actions limited to global context and account tasks.

## Anti-patterns
Do not put page-specific workflows or unlabeled icon buttons in the header.

## Related Components
Sidebar, ProfileMenu, SearchBar, Badge.
