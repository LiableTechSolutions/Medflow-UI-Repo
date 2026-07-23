# VitalsLine

## Purpose
VitalsLine renders the MedFlow ECG-inspired visual signal.

## When to use
Use in MedFlow healthcare contexts where a lightweight medical signal reinforces status or loading.

## When NOT to use
Do not use as a clinical measurement, diagnosis, or generic chart without labeling context.

## Props

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `color` | `string` | No | `var(--mf-blue-500)` | Signal stroke color. |
| `animated` | `boolean` | No | `true` | Enables motion. |
| `className` | `string` | No | - | Additional class names. |

## Variants
`animated` controls motion.

## Sizes
SVG dimensions follow the component CSS.

## Accessibility
Mark decorative signals as hidden from assistive technology and provide adjacent text for any meaningful status. Respect reduced-motion preferences.

## Usage
```tsx
<VitalsLine animated aria-hidden="true" />
```

## Best Practices
Pair with explicit clinical or operational context.

## Anti-patterns
Never imply real-time patient vitals from a decorative trace.

## Related Components
Loading, ActivityChart, Alert.
