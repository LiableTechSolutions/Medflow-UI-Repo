# DatePicker

## Purpose
DatePicker collects a calendar date.

## When to use
Use when a date must be selected from a calendar or constrained date range.

## When NOT to use
Use a plain Input for approximate or free-form date text.

## Props

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | No | - | Visible field label. |
| `hint` | `string` | No | - | Supporting guidance. |
| `error` | `string` | No | - | Validation message. |
| `value` | `string` | No | - | Controlled date value. |
| `onChange` | `(value: string) => void` | Yes | - | Date callback. |
| `placeholder` | `string` | No | `Select a date` | Empty prompt. |
| `minDate` / `maxDate` | `string` | No | - | Date bounds. |
| `className` | `string` | No | - | Additional class names. |

## Variants
Error and hint states follow the field pattern.

## Sizes
Uses the standard field size.

## Accessibility
The field has a label and validation state. Calendar controls must remain keyboard reachable and expose the selected date to screen readers.

## Usage
```tsx
<DatePicker label="Visit date" value={date} onChange={setDate} />
```

## Best Practices
Use the user’s locale and prevent impossible dates through bounds.

## Anti-patterns
Do not require users to guess date formats or hide validation feedback.

## Related Components
Input, Select, SearchBar.
