import shoppingData from './Shopping.json';

export interface ShoppingVenue {
  mall_name?: string;
  place_name?: string;
  website_url?: string;
  city: string;
  phone_number: string;
  full_address: string;
  neighborhood: string;
  google_maps_link: string;
  operating_hours: string;
  best_time_for_family_shopping: string;
  best_time_for_couples: string;
  best_time_for_solo_shopping: string;
  least_crowded_hours: string;
  peak_hours: string;
  weekend_vs_weekday: string;
  retail_variety_and_store_quality_score: number;
  dining_and_food_court_score: number;
  entertainment_and_recreation_score: number;
  facilities_and_amenities_score: number;
  accessibility_and_location_score: number;
  value_and_pricing_score: number;
  customer_service_score: number;
  safety_and_security_score: number;
  total_score: number;
  about: string;
  venue_type: string;
  brands_and_stores: string;
  dining_options: string;
  entertainment_and_recreation: string;
  facilities_and_amenities: string;
  parking_availability: string;
  accessibility_features: string;
  special_services: string;
  events_and_promotions: string;
  payment_options: string;
  family_facilities: string;
  review_summary: string;
  common_praise: string;
  improvement_suggestions: string;
  unique_features: string;
  target_audience: string;
  mall_theme: string;
  seasonal_considerations: string;
  faq1: string;
  faqans1: string;
  faq2: string;
  faqans2: string;
  faq3: string;
  faqans3: string;
  faq4: string;
  faqans4: string;
  faq5: string;
  faqans5: string;
  venue_index?: number;
}

// Process the imported JSON data
const processedVenues: ShoppingVenue[] = (shoppingData as any[]).map((venue, index) => ({
  ...venue,
  place_name: venue.mall_name || venue.place_name,
  venue_index: index + 1,
}));

export const shoppingVenues: ShoppingVenue[] = processedVenues;

// Helper functions for filtering
export const getShoppingCities = (): string[] => {
  const cities = [...new Set(shoppingVenues.map(v => v.city))];
  return cities.sort();
};

export const getShoppingTypes = (): string[] => {
  const types = [...new Set(shoppingVenues.map(v => v.venue_type))];
  return types.sort();
};

export const getShoppingThemes = (): string[] => {
  const themes = [...new Set(shoppingVenues.map(v => v.mall_theme).filter(theme => theme && theme.trim()))];
  return themes.sort();
};

export const getShoppingVenueById = (id: string): ShoppingVenue | undefined => {
  return shoppingVenues.find((v, index) => index + 1 === parseInt(id));
};

export const getShoppingVenuesByCity = (city: string): ShoppingVenue[] => {
  return shoppingVenues.filter(v => v.city.toLowerCase() === city.toLowerCase());
};

export const searchShoppingVenues = (query: string): ShoppingVenue[] => {
  const lowercaseQuery = query.toLowerCase();
  return shoppingVenues.filter(v => 
    (v.place_name || '').toLowerCase().includes(lowercaseQuery) ||
    (v.venue_type || '').toLowerCase().includes(lowercaseQuery) ||
    (v.neighborhood || '').toLowerCase().includes(lowercaseQuery) ||
    (v.city || '').toLowerCase().includes(lowercaseQuery) ||
    (v.brands_and_stores || '').toLowerCase().includes(lowercaseQuery)
  );
};

export const getFeaturedShoppingVenues = (limit: number = 6): ShoppingVenue[] => {
  return shoppingVenues
    .sort((a, b) => (Number(b.total_score) || 0) - (Number(a.total_score) || 0))
    .slice(0, limit);
};