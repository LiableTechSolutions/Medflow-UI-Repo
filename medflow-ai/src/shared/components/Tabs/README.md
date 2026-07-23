# Tabs

## Purpose
Tabs switch between related views without leaving the current context.

## When to use
Use for peer views that share the same page context.

## When NOT to use
Use navigation links for separate routes or an accordion for stacked content.

## Props

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `items` | `TabItem[]` | Yes | - | Tab labels and values. |
| `value` | `string` | Yes | - | Active tab value. |
| `onChange` | `(value: string) => void` | Yes | - | Selection callback. |
| `variant` | `line \| pill` | No | `line` | Tab presentation. |
| `className` | `string` | No | - | Additional class names. |

## Variants
`line` and `pill` provide two presentation options.

## Sizes
Uses the standard navigation density.

## Accessibility
Tabs expose tablist, tab, and tabpanel relationships. Keyboard users can focus and change tabs; panels should have meaningful headings.

## Usage
```tsx
<Tabs items={items} value={activeTab} onChange={setActiveTab} />
```

## Best Practices
Keep labels short and preserve active state when content updates.

## Anti-patterns
Do not use tabs for unrelated tasks or hide critical information in an inaccessible tab panel.

## Related Components
Breadcrumb, Pagination, Accordion, Menu.
