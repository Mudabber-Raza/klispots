import cafeData from './Cafes1.json';

export interface Cafe {
  cafe_index?: number;
  place_name: string;
  website_url?: string;
  city: string;
  phone_number: string;
  full_address: string;
  neighborhood: string;
  google_maps_link: string;
  operating_hours: string;
  best_time_for_date_night: string;
  best_time_for_family: string;
  best_time_for_business_meetings: string;
  best_time_for_study: string;
  least_crowded_hours: string;
  peak_hours: string;
  weekend_vs_weekday: string;
  coffee_and_beverages_score: number;
  ambiance_and_comfort_score: number;
  wifi_and_study_environment_score: number;
  service_score: number;
  value_score: number;
  location_and_accessibility_score: number;
  cleanliness_score: number;
  staff_friendliness_score: number;
  coffee_quality_score: number;
  food_options_score: number;
  seating_comfort_score: number;
  total_score: number;
  about: string;
  cafe_category: string;
  coffee_and_beverages: string;
  specialty: string;
  "must-try_items": string;
  coffee_types: string;
  food_options: string;
  menu_price_range: string;
  seating_areas: string;
  decor_style: string;
  noise_level: string;
  "instagram worthy": number;
  vibes: string;
  service_style: string;
  wait_time: string;
  parking_situation: string;
  accessibility_features: string;
  review_summary: string;
  common_praise: string;
  improvement_suggestions: string;
  student_popularity: string;
  unique_selling_points: string;
  value_proposition: string;
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
  original_place_id: string;
}

// Process the imported JSON data to add indexes
const processedCafes: Cafe[] = (cafeData as any[]).map((cafe, index) => ({
  ...cafe,
  cafe_index: index + 1,
  location_and_accessibility_score: cafe.location_and_accessibility_score || 8.0 // Handle empty values
}));

// Export processed cafes data
export const cafes: Cafe[] = processedCafes;

// Helper functions for filtering
export const getCafeCities = (): string[] => {
  const cities = [...new Set(cafes.map(c => c.city))];
  return cities.sort();
};

export const getCafeCategories = (): string[] => {
  const categories = [...new Set(cafes.map(c => c.cafe_category.split('/').map(cat => cat.trim())).flat())];
  return categories.sort();
};

export const getCafeById = (id: string): Cafe | undefined => {
  return cafes.find(c => c.cafe_index === parseInt(id));
};

export const getCafesByCity = (city: string): Cafe[] => {
  return cafes.filter(c => c.city.toLowerCase() === city.toLowerCase());
};

export const getCafesByCategory = (category: string): Cafe[] => {
  return cafes.filter(c => 
    c.cafe_category.toLowerCase().includes(category.toLowerCase())
  );
};

export const searchCafes = (query: string): Cafe[] => {
  const lowercaseQuery = query.toLowerCase();
  return cafes.filter(c => 
    c.place_name.toLowerCase().includes(lowercaseQuery) ||
    c.cafe_category.toLowerCase().includes(lowercaseQuery) ||
    c.neighborhood.toLowerCase().includes(lowercaseQuery) ||
    c.city.toLowerCase().includes(lowercaseQuery) ||
    c.coffee_and_beverages.toLowerCase().includes(lowercaseQuery)
  );
};

// Additional helper functions
export const getCafesByRating = (minRating: number): Cafe[] => {
  return cafes.filter(c => c.total_score >= minRating);
};

export const getFeaturedCafes = (limit: number = 6): Cafe[] => {
  return cafes
    .sort((a, b) => b.total_score - a.total_score)
    .slice(0, limit);
};

export const getStudyFriendlyCafes = (): Cafe[] => {
  return cafes.filter(c => c.wifi_and_study_environment_score >= 7.0);
};