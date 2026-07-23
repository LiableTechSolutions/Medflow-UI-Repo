# AuthLayout

## Purpose
AuthLayout provides a focused shell for login, signup, and account-recovery flows.

## When to use
Use for public authentication routes with a consistent visual frame.

## When NOT to use
Do not use around authenticated application pages.

## Props

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| eyebrow | `string` | No | - | Small contextual label. |
| title | `string` | Yes | - | Authentication heading. |
| description | `string` | No | - | Supporting copy. |
| children | `ReactNode` | Yes | - | Form content. |
| footer | `ReactNode` | No | - | Secondary actions or legal copy. |

## Variants
Eyebrow and footer are optional composition regions.

## Sizes
Responsive authentication layout controls sizing.

## Accessibility
Provide one clear heading, keep form labels visible, and ensure footer links are keyboard accessible.

## Usage
```tsx
<AuthLayout title="Sign in"> <LoginForm /> </AuthLayout>
```

## Best Practices
Keep authentication tasks focused and preserve entered values after validation errors.

## Anti-patterns
Do not embed application navigation or unrelated marketing actions in the auth shell.

## Related Components
Input, Button, Alert, Footer.
