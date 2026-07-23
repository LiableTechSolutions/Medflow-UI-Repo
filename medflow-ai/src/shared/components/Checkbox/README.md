# Checkbox

## Purpose
Checkbox represents an independent boolean choice.

## When to use
Use when users can select any number of options or acknowledge a condition.

## When NOT to use
Use Radio for mutually exclusive choices and Switch for an immediate setting toggle.

## Props

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| native checkbox props | `InputHTMLAttributes<HTMLInputElement>` without `type` | No | - | Standard checkbox behavior. |
| `label` | `ReactNode` | No | - | Visible checkbox label. |

## Variants
Supports native checked, unchecked, and indeterminate behavior where provided.

## Sizes
Uses the standard control size.

## Accessibility
The native input supports Tab and Space. A visible label should be associated with the control; do not communicate state by color alone.

## Usage
```tsx
<Checkbox aria-label="Include archived patients" />
```

## Best Practices
Group related choices with a clear legend or heading.

## Anti-patterns
Do not use a checkbox when selecting one option must immediately replace another.

## Related Components
Radio, Switch, Input, Select.
