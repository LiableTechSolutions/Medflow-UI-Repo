# PageHeader

## Purpose
PageHeader establishes a page title, description, hierarchy, and actions.

## When to use
Use at the start of application pages that need consistent context.

## When NOT to use
Do not use as a generic heading inside a card or repeated content block.

## Props

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | Yes | - | Page heading. |
| `description` | `string` | No | - | Supporting description. |
| `crumbs` | `Crumb[]` | No | - | Optional hierarchy. |
| `actions` | `ReactNode` | No | - | Page-level actions. |

## Variants
Breadcrumbs and actions are optional composition regions.

## Sizes
Uses the application page heading scale.

## Accessibility
Render one clear page-level heading and ensure action labels describe outcomes.

## Usage
```tsx
<PageHeader title="Patients" description="Manage active patient records." actions={<Button>Add patient</Button>} />
```

## Best Practices
Keep the title stable and put the primary page action nearby.

## Anti-patterns
Do not put multiple competing h1 elements on one page.

## Related Components
Breadcrumb, Button, EmptyState.
