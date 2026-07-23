# Radio

## Purpose
Radio and RadioGroup select exactly one option from a set.

## When to use
Use for mutually exclusive choices where all relevant options should be visible.

## When NOT to use
Use Checkbox for independent choices and Select for long option lists.

## Props

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| Radio native props | `InputHTMLAttributes<HTMLInputElement>` without `type` | No | - | Individual radio behavior. |
| `name` | `string` | Yes for group | - | Shared group name. |
| `label` | `string` | No | - | Group label. |
| `value` | `string` | Yes for group | - | Selected value. |
| `onChange` | `(value: string) => void` | Yes for group | - | Selection callback. |
| `options` | `RadioGroupOption[]` | Yes for group | - | Group choices. |
| `direction` | `vertical \| horizontal` | No | `vertical` | Layout direction. |

## Variants
RadioGroup supports vertical and horizontal layouts.

## Sizes
Uses the standard control size.

## Accessibility
The group uses native radio semantics and keyboard arrow navigation. Provide a group label and keep option labels descriptive.

## Usage
```tsx
<RadioGroup name="priority" label="Priority" value={priority} onChange={setPriority} options={options} />
```

## Best Practices
Order choices from most common to least common and provide a sensible default when safe.

## Anti-patterns
Do not use radios for more than a manageable number of options.

## Related Components
Checkbox, Select, Switch.
