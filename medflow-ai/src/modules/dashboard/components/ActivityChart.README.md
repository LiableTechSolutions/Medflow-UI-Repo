# Activity Chart

## Purpose
Activity Chart visualizes the dashboard’s activity trend.

## When to use
Use in the MedFlow dashboard overview where the fixed activity dataset is appropriate.

## When NOT to use
Do not use as a generic chart API or for clinical measurements without a typed data contract.

## Props

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| none | - | - | - | Current implementation renders its own dashboard dataset. |

## Variants
No configurable variants are currently exposed.

## Sizes
Responsive chart layout follows the dashboard grid.

## Accessibility
Provide a nearby summary of the trend and do not rely on visual lines or color alone.

## Usage
```tsx
<ActivityChart />
```

## Best Practices
Add a clear time range and label the data source before generalizing this component.

## Anti-patterns
Do not reuse the current fixed dataset in another product without an injected data model.

## Related Components
KpiCard, CalendarWidget, ActivityTimeline.
