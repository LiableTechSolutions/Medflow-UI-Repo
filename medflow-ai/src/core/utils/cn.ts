export type ClassValue = string | number | bigint | null | undefined | false | Record<string, boolean>;

/** Lightweight classnames combinator — avoids pulling in an extra dependency. */
export function cn(...values: ClassValue[]): string {
  const out: string[] = [];
  for (const value of values) {
    if (!value) continue;
    if (typeof value === 'object') {
      for (const key in value) {
        if (value[key]) out.push(key);
      }
    } else {
      out.push(String(value));
    }
  }
  return out.join(' ');
}
