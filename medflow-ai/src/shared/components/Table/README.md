# Table

## Purpose
Table presents structured records for comparison and scanning.

## When to use
Use for repeated rows with consistent columns and data relationships.

## When NOT to use
Use cards or a list on narrow screens when row comparison is not important.

## Props

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `columns` | `TableColumn<T>[]` | Yes | - | Column definitions. |
| `data` | `T[]` | Yes | - | Row data. |
| `rowKey` | `(row: T) => string` | Yes | - | Stable row identity. |
| `onRowClick` | `(row: T) => void` | No | - | Row activation handler. |
| `emptyMessage` | `string` | No | `No records to show yet.` | Empty-state text. |

## Variants
Columns define the rendered content; there are no visual variants.

## Sizes
Table density follows its CSS design tokens.

## Accessibility
Use meaningful column headings and ensure row actions have accessible names. Clickable rows should expose an equivalent keyboard-operable control.

## Usage
```tsx
<Table columns={columns} data={patients} rowKey={(patient) => patient.id} />
```

## Best Practices
Use stable keys, concise headings, and format values for scanning.

## Anti-patterns
Do not place paragraphs of prose in cells or rely on color alone for status.

## Related Components
Badge, Pagination, Card, EmptyState.
