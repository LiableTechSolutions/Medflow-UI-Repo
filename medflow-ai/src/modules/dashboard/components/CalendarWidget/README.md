# Calendar Widget

## Purpose
Calendar Widget presents the dashboard's upcoming schedule.

## When to use
Use in the MedFlow dashboard overview for the current appointment fixture.

## When NOT to use
Do not use as a general calendar API until data and interaction props are injected.

## Props

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| none | - | - | - | Current implementation is data-bound to dashboard fixtures. |

## Variants
No configurable variants are currently exposed.

## Sizes
Responsive sizing follows the dashboard grid.

## Accessibility
Expose dates and appointment labels as text and ensure event actions are keyboard reachable.

## Usage
```tsx
<CalendarWidget />
```

## Best Practices
Define timezone, date range, and event interaction before extracting it into the generic library.

## Anti-patterns
Do not imply that fixture data is live scheduling data.

## Related Components
ActivityChart, ActivityTimeline, DatePicker.
