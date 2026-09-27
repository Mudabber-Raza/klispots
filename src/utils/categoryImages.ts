const CATEGORY_ALIASES: Record<string, string> = {
  restaurant: 'restaurants',
  restaurants: 'restaurants',
  cafe: 'cafes',
  cafes: 'cafes',
  'cafes & coffee': 'cafes',
  shopping: 'shopping',
  entertainment: 'entertainment',
  'health & wellness': 'health-wellness',
  'health-&-wellness': 'health-wellness',
  'health-wellness': 'health-wellness',
  'arts & culture': 'arts-culture',
  'arts-&-culture': 'arts-culture',
  'arts-culture': 'arts-culture',
  'sports & fitness': 'sports-fitness',
  'sports-&-fitness': 'sports-fitness',
  'sports-fitness': 'sports-fitness',
};

export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  restaurants:
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
  cafes:
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
  shopping:
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
  entertainment:
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
  'health-wellness':
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1200&q=80',
  'arts-culture':
    'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80',
  'sports-fitness':
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
};

export function normalizeCategory(category: string): string {
  const key = category.toLowerCase().trim();
  if (CATEGORY_ALIASES[key]) return CATEGORY_ALIASES[key];
  return key.replace(/&/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
}

export function getCategoryFallbackImage(category: string, custom?: string): string {
  if (custom) return custom;
  return CATEGORY_FALLBACK_IMAGES[normalizeCategory(category)] || '/placeholder.svg';
}
