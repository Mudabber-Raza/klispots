import entertainmentData from './entertainment.json';

export interface EntertainmentVenue {
  venue_name?: string;
  place_name?: string;
  website_url?: string;
  city: string;
  phone_number: string;
  full_address: string;
  neighborhood: string;
  google_maps_link: string;
  operating_hours: string;
  best_time_for_families_with_kids: string;
  best_time_for_date_night: string;
  best_time_for_groups: string;
  best_time_for_special_events: string;
  least_crowded_hours: string;
  peak_hours: string;
  weekend_vs_weekday: string;
  holiday_considerations?: string;
  entertainment_value_score: number;
  comfort_and_facilities_score: number;
  value_for_money_score: number;
  accessibility_and_location_score: number;
  customer_service_score: number;
  safety_and_cleanliness_score: number;
  variety_and_quality_score: number;
  booking_and_convenience_score: number;
  total_score: number;
  about: string;
  venue_type: string;
  entertainment_options: string;
  facilities_available: string;
  ticket_pricing: string;
  booking_system: string;
  age_restrictions: string;
  group_discounts: string;
  special_packages: string;
  food_and_beverages: string;
  parking_situation: string;
  accessibility_features: string;
  review_summary: string;
  common_praise: string;
  improvement_suggestions: string;
  unique_features: string;
  target_audience: string;
  seasonal_offerings: string;
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
const processedVenues: EntertainmentVenue[] = (entertainmentData as any[]).map((venue, index) => ({
  ...venue,
  place_name: venue.venue_name || venue.place_name,
  venue_index: venue.cafe_index || (index + 1), // Use stable cafe_index if available, fallback to array position
}));

export const entertainmentVenues: EntertainmentVenue[] = processedVenues;

// Helper functions for filtering
export const getEntertainmentCities = (): string[] => {
  const cities = [...new Set(entertainmentVenues.map(v => v.city))];
  return cities.sort();
};

export const getEntertainmentTypes = (): string[] => {
  const types = [...new Set(entertainmentVenues.map(v => v.venue_type))];
  return types.sort();
};

export const getEntertainmentVenueById = (id: string): EntertainmentVenue | undefined => {
  return entertainmentVenues.find(v => v.venue_index === parseInt(id));
};

export const getEntertainmentVenuesByCity = (city: string): EntertainmentVenue[] => {
  return entertainmentVenues.filter(v => v.city.toLowerCase() === city.toLowerCase());
};

export const searchEntertainmentVenues = (query: string): EntertainmentVenue[] => {
  const lowercaseQuery = query.toLowerCase();
  return entertainmentVenues.filter(v => 
    (v.place_name || '').toLowerCase().includes(lowercaseQuery) ||
    v.venue_type.toLowerCase().includes(lowercaseQuery) ||
    v.neighborhood.toLowerCase().includes(lowercaseQuery) ||
    v.city.toLowerCase().includes(lowercaseQuery) ||
    v.entertainment_options.toLowerCase().includes(lowercaseQuery)
  );
};

export const getFeaturedEntertainmentVenues = (limit: number = 6): EntertainmentVenue[] => {
  return entertainmentVenues
    .sort((a, b) => (Number(b.total_score) || 0) - (Number(a.total_score) || 0))
    .slice(0, limit);
};