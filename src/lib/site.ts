export const SITE = {
  name: 'KLIspots',
  url: 'https://klispots.com',
  email: 'mudabberr@gmail.com',
  formEndpoint: 'https://formsubmit.co/ajax/mudabberr@gmail.com',
  venueCount: 5289,
  venueCountLabel: '5,200+',
  cities: ['Karachi', 'Lahore', 'Islamabad'] as const,
  categoryCounts: {
    restaurants: 2509,
    cafes: 1198,
    shopping: 449,
    entertainment: 119,
    'arts-culture': 466,
    'sports-fitness': 200,
    'health-wellness': 348,
  },
} as const;
