# KPI Card

## Purpose
KPI Card summarizes a dashboard measure with value, change, trend, and optional icon.

## When to use
Use for a small set of high-priority dashboard metrics.

## When NOT to use
Do not use for detailed records or uncontextualized clinical claims.

## Props

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| label | `string` | Yes | - | Metric label. |
| value | `string` | Yes | - | Primary metric value. |
| delta | `string` | No | - | Change description. |
| trend | `up \| down` | No | - | Trend direction. |
| icon | `LucideIcon` | No | - | Supporting icon. |
| tone | `blue \| green \| amber \| coral` | No | `blue` | Metric tone. |
| variant | `default \| featured` | No | `default` | Card emphasis. |
| meta | `string` | No | - | Supporting metadata. |

## Variants
`default` and `featured` control emphasis; tone communicates metric context.

## Sizes
Uses dashboard card sizing.

## Accessibility
Use a meaningful label and expose trend meaning in text, not color alone.

## Usage
```tsx
<KpiCard label="Open appointments" value="24" delta="8%" trend="up" />
```

## Best Practices
Pair every value with a time frame or comparison context.

## Anti-patterns
Do not imply clinical significance without a defined metric description.

## Related Components
Card, Badge, ActivityChart.
