# Toast

## Purpose
Toast provides transient feedback after an action.

## When to use
Use for non-blocking confirmation, status, or recoverable error feedback.

## When NOT to use
Use Alert for persistent information and Modal for decisions that require attention.

## Props

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `children` | `ReactNode` | Yes | - | Application content wrapped by the provider. |
| `show` | `ToastContextValue` | No | - | Context action for creating a toast. |
| `title` | `string` | Yes when showing | - | Short feedback heading. |
| `description` | `string` | No | - | Supporting detail. |
| `tone` | `success \| info \| warning \| danger` | No | `info` | Feedback intent. |
| `duration` | `number` | No | implementation default | Auto-dismiss duration in milliseconds. |

## Variants
Toast tone communicates success, information, warning, or danger.

## Sizes
Toast size is fixed for consistent notification placement.

## Accessibility
Toasts use live-region behavior so screen readers receive updates. Provide concise titles and do not make critical information available only through a disappearing toast.

## Usage
```tsx
<ToastProvider><App /></ToastProvider>
const { show } = useToast();
show({ title: 'Saved', tone: 'success' });
```

## Best Practices
Confirm completed actions and offer a path to recover from errors.

## Anti-patterns
Do not show a toast for every minor interaction or use it as a form error replacement.

## Related Components
Alert, Modal, Loading.
