# ProfileMenu

## Purpose
ProfileMenu provides account identity and account actions.

## When to use
Use in an authenticated application header or navigation shell.

## When NOT to use
Do not use for unrelated application navigation or anonymous actions.

## Props

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `userName` | `string` | Yes | - | Account display name. |
| `userSubtitle` | `string` | No | `View profile` | Supporting account text. |
| `items` | `ProfileMenuItem[]` | No | built-in items | Account actions. |
| `className` | `string` | No | - | Additional class names. |

## Variants
Menu items define the available account actions.

## Sizes
Uses the header control size.

## Accessibility
The trigger needs an accessible name and exposes expanded state. Menu items must be keyboard reachable and have clear labels.

## Usage
```tsx
<ProfileMenu userName="Ananya Rao" userSubtitle="Cardiology" />
```

## Best Practices
Keep account actions limited to identity and session tasks.

## Anti-patterns
Do not hide critical product navigation inside the profile menu.

## Related Components
Avatar, Header, Menu, Sidebar.
