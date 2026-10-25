export const routeOptions = [
  'Farmgate → Dhanmondi 27',
  'GEC → 2 No. Gate',
  'Mirpur 10 → Gulshan 2',
  'Badda → Uttara',
  'Khulna → Jessore',
  'Motijheel → Rampura',
] as const;

export type RouteOption = (typeof routeOptions)[number];

export const routeProfiles = {
  'Farmgate → Dhanmondi 27': {
    zone: 'Central Dhaka',
    demand: 88,
    baseFare: 180,
    heat: 'Traffic wave is intense around the junction.',
    vibe: 'High-demand route. Riders are already haggling before the engine starts.',
  },
  'GEC → 2 No. Gate': {
    zone: 'Chittagong corridor',
    demand: 74,
    baseFare: 150,
    heat: 'The waterfront lane is packed with impatient commuters.',
    vibe: 'Steady pressure, moderate crowd, but the price still climbs fast.',
  },
  'Mirpur 10 → Gulshan 2': {
    zone: 'North-south commuter route',
    demand: 81,
    baseFare: 170,
    heat: 'Mirpur road is moving, but every lane feels blocked.',
    vibe: 'A classic “too much time in traffic” route with premium ego pricing.',
  },
  'Badda → Uttara': {
    zone: 'Eastern bypass',
    demand: 63,
    baseFare: 140,
    heat: 'Street flow is okay, but every rider wants a bargain.',
    vibe: 'Less chaos, more negotiation energy.',
  },
  'Khulna → Jessore': {
    zone: 'Long-distance route',
    demand: 57,
    baseFare: 120,
    heat: 'Long haul means the driver wants a proper check before moving.',
    vibe: 'Patient mood, but the distance still adds pressure.',
  },
  'Motijheel → Rampura': {
    zone: 'Business district',
    demand: 69,
    baseFare: 160,
    heat: 'Office-hour impatience is spreading across the lane.',
    vibe: 'Fast, restless, and full of cash-fueled arguments.',
  },
} as const satisfies Record<RouteOption, {
  zone: string;
  demand: number;
  baseFare: number;
  heat: string;
  vibe: string;
}>;
