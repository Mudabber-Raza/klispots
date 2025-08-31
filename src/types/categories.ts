
export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  slug: string;
  count: number;
}

export interface Place {
  id: string;
  categoryId: string;
  name: string;
  address: string;
  city: 'karachi' | 'lahore' | 'islamabad';
  phone?: string;
  website?: string;
  rating: number;
  priceRange: string;
  imageUrl?: string;
  isOpen: boolean;
  features: string[];
  neighborhood?: string;
}

// Comprehensive Restaurant Schema
export interface Restaurant {
  id: string;
  place_name: string;
  city: 'karachi' | 'lahore' | 'islamabad';
  phone_number?: string;
  full_address: string;
  neighborhood?: string;
  google_maps_link?: string;
  operating_hours: string;
  current_status: 'open' | 'closed' | 'opening_soon' | 'closing_soon';
  
  // Timing Intelligence
  best_time_for_date_night?: string;
  best_time_for_family?: string;
  best_time_for_business_meetings?: string;
  least_crowded_hours?: string;
  peak_hours?: string;
  weekend_vs_weekday?: string;
  
  // Detailed Scoring (0-10 scale)
  food_and_menu_score: number;
  service_score: number;
  ambiance_score: number;
  value_score: number;
  location_and_accessibility_score: number;
  cleanliness_score: number;
  staff_friendliness_score: number;
  food_authenticity_score: number;
  portion_size_score: number;
  presentation_score: number;
  total_score: number;
  
  // Restaurant Details
  about?: string;
  restaurant_category: string;
  cuisine: string;
  specialty?: string;
  signature_dishes?: string[];
  vegetarian_options?: boolean;
  menu_price_range: string;
  dining_areas?: string[];
  decor_style?: string;
  noise_level?: 'quiet' | 'moderate' | 'lively' | 'loud';
  instagram_worthy?: boolean;
  service_style?: string;
  wait_time?: string;
  
  // Practical Information
  parking_situation?: string;
  kid_friendly?: boolean;
  group_bookings?: boolean;
  accessibility_features?: string[];
  public_transport?: string;
  
  // Reviews & Insights
  review_summary?: string;
  common_praise?: string[];
  improvement_suggestions?: string[];
  unique_selling_points?: string[];
  value_proposition?: string;
  market_position?: string;
  average_meal_duration?: string;
  best_days_to_visit?: string[];
  
  // FAQ
  faq1?: string;
  faqans1?: string;
  faq2?: string;
  faqans2?: string;
  faq3?: string;
  faqans3?: string;
  faq4?: string;
  faqans4?: string;
  faq5?: string;
  faqans5?: string;
  
  // Additional fields for display
  imageUrl?: string;
  images?: string[];
}

export interface PlaceDetails {
  id: string;
  placeId: string;
  details: Record<string, any>;
}

export interface PlaceScore {
  id: string;
  placeId: string;
  overallScore: number;
  specificScores: Record<string, number>;
}
