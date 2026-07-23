# ModulePlaceholder

## Purpose
ModulePlaceholder marks an application module that has not been implemented yet.

## When to use
Use only in the MedFlow application while a feature is under construction.

## When NOT to use
Do not expose it as a generic library component or present it as a finished empty state.

## Props

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | Yes | - | Module name. |
| `description` | `string` | Yes | - | Scope explanation. |
| `features` | `FeatureCardDef[]` | No | - | Planned feature cards. |

## Variants
Feature definitions control the placeholder content.

## Sizes
Uses the module page layout.

## Accessibility
Use headings and descriptive text. Planned items must not be presented as available controls unless they work.

## Usage
```tsx
<ModulePlaceholder title="Reports" description="Reporting is being prepared." />
```

## Best Practices
Use only for clearly unfinished product areas.

## Anti-patterns
Do not use it to replace an error, loading state, or real empty state.

## Related Components
EmptyState, PageHeader, Card.
