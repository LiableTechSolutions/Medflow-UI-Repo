# SearchableSelect

## Purpose
Lets users find and choose one value from a list too long to scan, by typing to filter.

## When to use
Use for long or API-loaded option lists — states, countries, doctors, drugs. This is the
searchable combobox the `Select` README points to for exactly this case.

## When NOT to use
Use `Select` for a short, stable, well-known set of options (fewer than ~10).

## Props

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | No | - | Visible field label. |
| `hint` | `string` | No | - | Supporting guidance. |
| `error` | `string` | No | - | Validation message. |
| `value` | `string` | Yes | - | Selected option's value. |
| `onChange` | `(value: string) => void` | Yes | - | Called with the selected option's value. |
| `options` | `SearchableSelectOption[]` | No | - | Static option list. Use this OR `loadOptions`. |
| `loadOptions` | `() => Promise<SearchableSelectOption[]>` | No | - | Fetches options once, lazily, the first time the field opens (e.g. a state/country API); cached and filtered in memory afterwards. |
| `placeholder` | `string` | No | `'Search…'` | Input placeholder. |
| `disabled` | `boolean` | No | `false` | Disables the field. |
| `emptyMessage` | `string` | No | `'No matches'` | Shown when no option matches the query. |

## Variants
Validation is represented by `error`; a loading spinner replaces the chevron while `loadOptions` is in flight.

## Accessibility
Implements the `combobox` + `listbox` pattern: arrow keys move the highlight, `Enter` selects, `Escape` closes and restores the current value.

## Usage
```tsx
<SearchableSelect
  label="State"
  value={state}
  onChange={setState}
  loadOptions={() => geoApi.states('IN')}
/>
```

## Best Practices
Prefer `loadOptions` over prefetching a large list eagerly on page load; it only fetches once the user actually opens the field.

## Anti-patterns
Do not use this for a handful of well-known options — use `Select` instead.

## Related Components
Select, Input, SearchBar.
