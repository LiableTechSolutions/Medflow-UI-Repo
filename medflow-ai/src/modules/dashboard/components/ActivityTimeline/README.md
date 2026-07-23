# Timeline Widget

## Purpose
Timeline Widget summarizes recent dashboard activity in chronological order.

## When to use
Use for a compact stream of recent operational events.

## When NOT to use
Use a Table for comparison or an Alert for urgent persistent messages.

## Props

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| none | - | - | - | Current implementation renders its own dashboard dataset. |

## Variants
No configurable variants are currently exposed.

## Sizes
Responsive sizing follows the dashboard grid.

## Accessibility
Each event should have readable timestamp and description text; visual markers are supplementary.

## Usage
```tsx
<ActivityTimeline />
```

## Best Practices
Keep entries concise and order them consistently.

## Anti-patterns
Do not use a timeline for high-volume records without pagination or filtering.

## Related Components
ActivityChart, Alert, Table.
