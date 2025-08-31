import sportsFitnessData from './sports and fitness.json';

export interface SportsFitnessVenue {
  facility_name?: string;
  place_name?: string;
  website_url?: string;
  city: string;
  phone_number: string;
  full_address: string;
  neighborhood: string;
  google_maps_link: string;
  operating_hours: string;
  best_time_for_competitive_play: string;
  best_time_for_casual_play: string;
  best_time_for_training_sessions: string;
  best_time_for_corporate_events: string;
  least_crowded_hours: string;
  peak_hours: string;
  weekend_vs_weekday: string;
  court_field_quality_score: number;
  equipment_and_facilities_score: number;
  booking_system_and_accessibility_score: number;
  coaching_and_instruction_score: number;
  value_for_money_score: number;
  customer_service_score: number;
  safety_and_maintenance_score: number;
  ambiance_and_community_score: number;
  total_score: number;
  about: string;
  facility_type: string;
  sports_offered: string;
  equipment_provided: string;
  membership_options: string;
  pricing_structure: string;
  coaching_available: string;
  tournament_facilities: string;
  group_bookings: string;
  special_programs: string;
  amenities: string;
  parking_situation: string;
  changing_facilities: string;
  review_summary: string;
  common_praise: string;
  improvement_suggestions: string;
  unique_features: string;
  target_demographics: string;
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
const processedVenues: SportsFitnessVenue[] = (sportsFitnessData as any[]).map((venue, index) => ({
  ...venue,
  place_name: venue.facility_name || venue.place_name,
  facility_type: venue.facility_category || venue.facility_type || 'Sports & Fitness',
  venue_index: venue.cafe_index || (index + 1), // Use stable cafe_index if available, fallback to array position
}));

export const sportsFitnessVenues: SportsFitnessVenue[] = processedVenues;

// Helper functions for filtering
export const getSportsFitnessCities = (): string[] => {
  const cities = [...new Set(sportsFitnessVenues.map(v => v.city))];
  return cities.sort();
};

export const getSportsFitnessTypes = (): string[] => {
  const types = [...new Set(sportsFitnessVenues.map(v => v.facility_type))];
  return types.sort();
};

export const getSportsFitnessVenueById = (id: string): SportsFitnessVenue | undefined => {
  return sportsFitnessVenues.find(v => v.venue_index === parseInt(id));
};

export const getSportsFitnessVenuesByCity = (city: string): SportsFitnessVenue[] => {
  return sportsFitnessVenues.filter(v => v.city.toLowerCase() === city.toLowerCase());
};

export const searchSportsFitnessVenues = (query: string): SportsFitnessVenue[] => {
  const lowercaseQuery = query.toLowerCase();
  return sportsFitnessVenues.filter(v => 
    (v.place_name || '').toLowerCase().includes(lowercaseQuery) ||
    v.facility_type.toLowerCase().includes(lowercaseQuery) ||
    v.neighborhood.toLowerCase().includes(lowercaseQuery) ||
    v.city.toLowerCase().includes(lowercaseQuery) ||
    v.sports_offered.toLowerCase().includes(lowercaseQuery)
  );
};

export const getFeaturedSportsFitnessVenues = (limit: number = 6): SportsFitnessVenue[] => {
  return sportsFitnessVenues
    .sort((a, b) => (Number(b.total_score) || 0) - (Number(a.total_score) || 0))
    .slice(0, limit);
};