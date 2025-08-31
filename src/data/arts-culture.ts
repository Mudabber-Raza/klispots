import artsCultureData from './Arts and Culture.json';

export interface ArtsCultureVenue {
  place_name: string;
  venue_category: string;
  about: string;
  website_url?: string;
  city: string;
  phone_number: string;
  full_address: string;
  neighborhood: string;
  google_maps_link: string;
  operating_hours: string;
  best_time_for_art_enthusiasts: string;
  best_time_for_dates: string;
  best_time_for_families: string;
  best_time_for_photography: string;
  best_time_for_events: string;
  least_crowded_hours: string;
  peak_hours: string;
  weekend_vs_weekday: string;
  cultural_significance_score: number;
  accessibility_and_facilities_score: number;
  educational_value_score: number;
  ambiance_and_atmosphere_score: number;
  visitor_experience_score: number;
  total_score: number;
  exhibitions_and_collections: string;
  architecture_and_design: string;
  visitor_amenities: string;
  guided_tours: string;
  special_events: string;
  photography_policy: string;
  entry_fee: string;
  parking_availability: string;
  public_transport_access: string;
  review_summary: string;
  common_praise: string;
  improvement_suggestions: string;
  unique_features: string;
  target_audience: string;
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
const processedVenues: ArtsCultureVenue[] = (artsCultureData as any[]).map((venue, index) => ({
  ...venue,
  venue_index: venue.cafe_index || (index + 1), // Use stable cafe_index if available, fallback to array position
}));

export const artsCultureVenues: ArtsCultureVenue[] = processedVenues;

// Helper functions for filtering
export const getArtsCultureCities = (): string[] => {
  const cities = [...new Set(artsCultureVenues.map(v => v.city))];
  return cities.sort();
};

export const getArtsCultureCategories = (): string[] => {
  const categories = [...new Set(artsCultureVenues.map(v => v.venue_category))];
  return categories.sort();
};

export const getArtsCultureVenueById = (id: string): ArtsCultureVenue | undefined => {
  return artsCultureVenues.find(v => v.venue_index === parseInt(id));
};

export const getArtsCultureVenuesByCity = (city: string): ArtsCultureVenue[] => {
  return artsCultureVenues.filter(v => v.city.toLowerCase() === city.toLowerCase());
};

export const searchArtsCultureVenues = (query: string): ArtsCultureVenue[] => {
  const lowercaseQuery = query.toLowerCase();
  return artsCultureVenues.filter(v => 
    v.place_name.toLowerCase().includes(lowercaseQuery) ||
    v.venue_category.toLowerCase().includes(lowercaseQuery) ||
    v.neighborhood.toLowerCase().includes(lowercaseQuery) ||
    v.city.toLowerCase().includes(lowercaseQuery) ||
    v.about.toLowerCase().includes(lowercaseQuery)
  );
};

export const getFeaturedArtsCultureVenues = (limit: number = 6): ArtsCultureVenue[] => {
  return artsCultureVenues
    .sort((a, b) => (Number(b.total_score) || 0) - (Number(a.total_score) || 0))
    .slice(0, limit);
};