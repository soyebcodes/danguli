export const routeOptions = [
  'Farmgate → Dhanmondi 27',
  'GEC → 2 No. Gate',
  'Mirpur 10 → Gulshan 2',
  'Badda → Uttara',
  'Khulna → Jessore',
  'Motijheel → Rampura',
] as const;

export type RouteOption = (typeof routeOptions)[number];
