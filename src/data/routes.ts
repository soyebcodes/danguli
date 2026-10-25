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
    legend: 'This route has made legends out of stubborn drivers who never flinch.',
    story: [
      'Older commuters swear this lane is where fake urgency goes to die.',
      'Every rider here thinks they are the only one with a deadline.',
      'The noisy junction turns every refusal into a neighborhood story.',
    ],
  },
  'GEC → 2 No. Gate': {
    zone: 'Chittagong corridor',
    demand: 74,
    baseFare: 150,
    heat: 'The waterfront lane is packed with impatient commuters.',
    vibe: 'Steady pressure, moderate crowd, but the price still climbs fast.',
    legend: 'The waterfront crowd learns fast whether the driver is bluffing or serious.',
    story: [
      'Sea breeze and commuter chaos make this route feel half festival, half fight.',
      'The same rider will negotiate twice if a second lane opens up.',
      'This corridor rewards a cool head more than a loud one.',
    ],
  },
  'Mirpur 10 → Gulshan 2': {
    zone: 'North-south commuter route',
    demand: 81,
    baseFare: 170,
    heat: 'Mirpur road is moving, but every lane feels blocked.',
    vibe: 'A classic “too much time in traffic” route with premium ego pricing.',
    legend: 'People on this route can smell a weak excuse from three blocks away.',
    story: [
      'The lane is always full, but the riders still act like they are first in line.',
      'A sharp refusal here is often remembered by the whole bus stop.',
      'The longer the wait, the louder the ego becomes.',
    ],
  },
  'Badda → Uttara': {
    zone: 'Eastern bypass',
    demand: 63,
    baseFare: 140,
    heat: 'Street flow is okay, but every rider wants a bargain.',
    vibe: 'Less chaos, more negotiation energy.',
    legend: 'This route rewards discipline because the crowds are patient and watchful.',
    story: [
      'The lane is calmer, but the haggling is more deliberate and more personal.',
      'A smooth refusal here feels like a win for the driver and a loss for the ego.',
      'The best tricks are the ones that never look rehearsed.',
    ],
  },
  'Khulna → Jessore': {
    zone: 'Long-distance route',
    demand: 57,
    baseFare: 120,
    heat: 'Long haul means the driver wants a proper check before moving.',
    vibe: 'Patient mood, but the distance still adds pressure.',
    legend: 'Long trips make people talk and people remember who stood firm.',
    story: [
      'Distance changes the mood; riders get more serious and less theatrical.',
      'This route is where the driver keeps control and the rider learns patience.',
      'A decent refusal here feels like a full transit strategy, not a tantrum.',
    ],
  },
  'Motijheel → Rampura': {
    zone: 'Business district',
    demand: 69,
    baseFare: 160,
    heat: 'Office-hour impatience is spreading across the lane.',
    vibe: 'Fast, restless, and full of cash-fueled arguments.',
    legend: 'By afternoon, every rider here acts like the price has already been settled.',
    story: [
      'The crowd is quick, sharp, and never happy to wait for a second answer.',
      'This route is where the business crowd creates the stiffest ego battle.',
      'A smart refusal here sounds like confidence instead of panic.',
    ],
  },
} as const satisfies Record<RouteOption, {
  zone: string;
  demand: number;
  baseFare: number;
  heat: string;
  vibe: string;
  legend: string;
  story: string[];
}>;
