# Select

## Purpose
Select lets users choose one value from a known list.

## When to use
Use when the option set is stable and compact enough to scan.

## When NOT to use
Use a searchable combobox for long lists or free text input for unconstrained values.

## Props

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | No | - | Visible field label. |
| `hint` | `string` | No | - | Supporting guidance. |
| `error` | `string` | No | - | Validation message. |
| `options` | `SelectOption[]` | Yes | - | Selectable values. |
| native select props | `SelectHTMLAttributes<HTMLSelectElement>` | No | - | Standard select behavior. |

## Variants
Validation is represented by `error`; no unrelated visual variants are exposed.

## Sizes
Uses the standard field size.

## Accessibility
Native select keyboard behavior and screen-reader announcements are preserved. Labels and errors should be programmatically associated.

## Usage
```tsx
<Select label="Status" options={[{ value: 'open', label: 'Open' }]} />
```

## Best Practices
Order options logically and provide a non-selected prompt when a choice is required.

## Anti-patterns
Do not use Select for dozens of options without search or grouping.

## Related Components
Input, DatePicker, Radio, SearchBar.
