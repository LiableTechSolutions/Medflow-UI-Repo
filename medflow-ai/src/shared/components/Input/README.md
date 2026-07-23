# Input

## Purpose
Input collects a single line of user text.

## When to use
Use for names, identifiers, search terms, email addresses, and other short values.

## When NOT to use
Use Textarea for long text and Select for a constrained set of options.

## Props

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | No | - | Visible field label. |
| `hint` | `string` | No | - | Supporting guidance. |
| `error` | `string` | No | - | Validation message and invalid state. |
| `leftIcon` | `ReactNode` | No | - | Leading visual affordance. |
| `rightIcon` | `ReactNode` | No | - | Trailing visual affordance. |
| native input props | `InputHTMLAttributes<HTMLInputElement>` | No | - | Standard input behavior. |

## Variants
Validation is represented through the `error` prop; there are no separate visual variants.

## Sizes
Size follows the design token field scale and is not configurable.

## Accessibility
The generated or supplied `id` connects the label to the input. Invalid fields expose `aria-invalid`; pair errors with a descriptive label and do not rely on color alone.

## Usage
```tsx
import { Input } from '@/components/ui';
<Input label="Patient ID" placeholder="PT-2048" />
<Input label="Email" error="Enter a valid email address" />
```

## Best Practices
Keep labels visible, validate near the field, and preserve entered values on errors.

## Anti-patterns
Do not use placeholder text as the only label or put unrelated controls inside the input.

## Related Components
Select, DatePicker, SearchBar, Checkbox.
