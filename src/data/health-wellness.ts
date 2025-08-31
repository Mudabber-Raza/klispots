import healthWellnessData from './Health and wellness.json';

export interface HealthWellnessVenue {
  place_name: string;
  website_url?: string;
  city: string;
  phone_number: string;
  full_address: string;
  neighborhood: string;
  google_maps_link: string;
  operating_hours: string;
  best_time_for_beginners: string;
  best_time_for_weight_training: string;
  best_time_for_cardio: string;
  best_time_for_classes: string;
  best_time_for_women: string;
  least_crowded_hours: string;
  peak_hours: string;
  weekend_vs_weekday: string;
  equipment_quality_and_variety_score: number;
  trainer_and_staff_expertise_score: number;
  facility_cleanliness_and_maintenance_score: number;
  ambiance_and_atmosphere_score: number;
  value_for_money_score: number;
  accessibility_and_location_score: number;
  safety_and_security_score: number;
  customer_service_score: number;
  total_score: number;
  about: string;
  facility_type: string;
  services_offered: string;
  equipment_available: string;
  membership_options: string;
  pricing_structure: string;
  class_schedules: string;
  trainer_availability: string;
  special_programs: string;
  amenities: string;
  parking_situation: string;
  changing_rooms: string;
  review_summary: string;
  common_praise: string;
  improvement_suggestions: string;
  unique_features: string;
  target_demographics: string;
  safety_measures: string;
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
const processedVenues: HealthWellnessVenue[] = (healthWellnessData as any[]).map((venue, index) => ({
  ...venue,
  facility_type: venue.facility_category || venue.facility_type || 'Health & Wellness',
  venue_index: venue.cafe_index || (index + 1), // Use stable cafe_index if available, fallback to array position
}));

export const healthWellnessVenues: HealthWellnessVenue[] = processedVenues;

// Helper functions for filtering
export const getHealthWellnessCities = (): string[] => {
  const cities = [...new Set(healthWellnessVenues.map(v => v.city))];
  return cities.sort();
};

export const getHealthWellnessTypes = (): string[] => {
  const types = [...new Set(healthWellnessVenues.map(v => v.facility_type))];
  return types.sort();
};

export const getHealthWellnessVenueById = (id: string): HealthWellnessVenue | undefined => {
  return healthWellnessVenues.find(v => v.venue_index === parseInt(id));
};

export const getHealthWellnessVenuesByCity = (city: string): HealthWellnessVenue[] => {
  return healthWellnessVenues.filter(v => v.city.toLowerCase() === city.toLowerCase());
};

export const searchHealthWellnessVenues = (query: string): HealthWellnessVenue[] => {
  const lowercaseQuery = query.toLowerCase();
  return healthWellnessVenues.filter(v => 
    v.place_name.toLowerCase().includes(lowercaseQuery) ||
    v.facility_type.toLowerCase().includes(lowercaseQuery) ||
    v.neighborhood.toLowerCase().includes(lowercaseQuery) ||
    v.city.toLowerCase().includes(lowercaseQuery) ||
    v.services_offered.toLowerCase().includes(lowercaseQuery)
  );
};

export const getFeaturedHealthWellnessVenues = (limit: number = 6): HealthWellnessVenue[] => {
  return healthWellnessVenues
    .sort((a, b) => (Number(b.total_score) || 0) - (Number(a.total_score) || 0))
    .slice(0, limit);
};