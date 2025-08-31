import restaurantData from './Restaurants1.json';

export interface Restaurant {
  restaurant_index: number;
  place_name: string;
  original_place_id?: string;
  city: string;
  phone_number: string;
  full_address: string;
  neighborhood: string;
  google_maps_link: string;
  operating_hours: string;
  best_time_for_date_night: string;
  best_time_for_family: string;
  best_time_for_business_meetings: string;
  least_crowded_hours: string;
  peak_hours: string;
  weekend_vs_weekday: string;
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
  about: string;
  restaurant_category: string;
  cuisine: string;
  specialty: string;
  signature_dishes: string;
  vegetarian_options: string;
  menu_price_range: string;
  dining_areas: string;
  decor_style: string;
  noise_level: string;
  instagram_worthy: string;
  service_style: string;
  wait_time: string;
  parking_situation: string;
  kid_friendly: string;
  group_bookings: string;
  accessibility_features: string;
  public_transport: string;
  review_summary: string;
  common_praise: string;
  improvement_suggestions: string;
  unique_selling_points: string;
  value_proposition: string;
  market_position: string;
  average_meal_duration: string;
  best_days_to_visit: string;
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
}

// Import restaurants from JSON file
export const restaurants: Restaurant[] = restaurantData as Restaurant[];

// Helper functions for filtering
export const getCities = (): string[] => {
  const cities = [...new Set(restaurants.map(r => r.city))];
  return cities.sort();
};

export const getCuisines = (): string[] => {
  const allCuisines: string[] = [];
  
  // Define valid cuisine patterns (actual cuisine names, not descriptions)
  const validCuisinePatterns = [
    'Pakistani', 'Indian', 'Chinese', 'Italian', 'American', 'Mexican', 'Thai', 'Japanese', 'Korean',
    'Lebanese', 'Turkish', 'Greek', 'Spanish', 'French', 'German', 'British', 'Mediterranean',
    'Middle Eastern', 'Arabian', 'Arabic', 'Afghan', 'Afghani', 'Iranian', 'Iraqi', 'Syrian',
    'Asian', 'European', 'African', 'Caribbean', 'Latin American', 'South American',
    'Fast Food', 'Street Food', 'Barbecue', 'BBQ', 'Seafood', 'Vegetarian', 'Vegan',
    'Fusion', 'International', 'Continental', 'Multi-Cuisine', 'Various', 'Desi',
    'Mughlai', 'Punjabi', 'Sindhi', 'Balochi', 'Pashtun', 'Hazara', 'Shinwari',
    'Biryani', 'Karahi', 'Nihari', 'Burgers', 'Pizza', 'Pasta', 'Steak', 'Sushi'
  ];
  
  restaurants.forEach(restaurant => {
    if (restaurant.cuisine && restaurant.cuisine.trim()) {
      // Split by multiple delimiters: comma, slash, and "and"
      const cuisineParts = restaurant.cuisine
        .split(/[,/]| and /)
        .map(c => c.trim())
        .filter(c => c && c.length > 0)
        .map(c => {
          // Clean up common issues
          return c
            .replace(/\.$/, '') // Remove trailing periods
            .replace(/^\s+|\s+$/g, '') // Remove extra whitespace
            .replace(/\s+/g, ' ') // Normalize multiple spaces to single space
            .trim();
        })
        .filter(c => c && c.length > 0) // Filter again after cleanup
        .filter(c => {
          // Only keep cuisines that are reasonable length and not descriptive text
          if (c.length > 25) return false; // Too long, likely descriptive text
          if (c.toLowerCase().includes('primarily') || c.toLowerCase().includes('potentially')) return false;
          if (c.toLowerCase().includes('based on') || c.toLowerCase().includes('mentioned in')) return false;
          if (c.toLowerCase().includes('influences') && c.length > 20) return false;
          if (c.toLowerCase().includes('specific') && c.length > 25) return false;
          if (c.toLowerCase().includes('also') || c.toLowerCase().includes('offering')) return false;
          if (c.toLowerCase().includes('availability') || c.toLowerCase().includes('specialties')) return false;
          if (c.toLowerCase().includes('options available') || c.toLowerCase().includes('items')) return false;
          if (c.toLowerCase().includes('contemporary') && c.length > 15) return false;
          
          return true;
        });
      
      allCuisines.push(...cuisineParts);
    }
  });
  
  // Remove duplicates, normalize case, and sort
  let uniqueCuisines = [...new Set(allCuisines)]
    .map(c => c.charAt(0).toUpperCase() + c.slice(1).toLowerCase()) // Title case
    .sort();
  
  // Post-process to standardize common cuisine names
  uniqueCuisines = uniqueCuisines.map(cuisine => {
    // Standardize common variations
    if (cuisine.toLowerCase() === 'bbq') return 'BBQ';
    if (cuisine.toLowerCase() === 'fast food') return 'Fast Food';
    if (cuisine.toLowerCase() === 'street food') return 'Street Food';
    if (cuisine.toLowerCase() === 'multi-cuisine') return 'Multi-Cuisine';
    if (cuisine.toLowerCase() === 'middle eastern') return 'Middle Eastern';
    if (cuisine.toLowerCase() === 'north indian') return 'North Indian';
    if (cuisine.toLowerCase() === 'south indian') return 'South Indian';
    if (cuisine.toLowerCase() === 'desi chinese') return 'Desi Chinese';
    if (cuisine.toLowerCase() === 'pakistani-chinese fusion') return 'Pakistani-Chinese Fusion';
    if (cuisine.toLowerCase() === 'american-chinese') return 'American-Chinese';
    if (cuisine.toLowerCase() === 'american-italian') return 'American-Italian';
    if (cuisine.toLowerCase() === 'pakistani-italian fusion') return 'Pakistani-Italian Fusion';
    if (cuisine.toLowerCase() === 'fast casual') return 'Fast Casual';
    if (cuisine.toLowerCase() === 'desi style fast food') return 'Desi Fast Food';
    if (cuisine.toLowerCase() === 'desi-chinese') return 'Desi Chinese';
    if (cuisine.toLowerCase() === 'desi cuisine') return 'Desi';
    if (cuisine.toLowerCase() === 'desi fusion') return 'Desi Fusion';
    if (cuisine.toLowerCase() === 'desi breakfast') return 'Desi Breakfast';
    if (cuisine.toLowerCase() === 'chinese-pakistani fusion') return 'Chinese-Pakistani Fusion';
    if (cuisine.toLowerCase() === 'american bbq') return 'American BBQ';
    if (cuisine.toLowerCase() === 'american fast food') return 'American Fast Food';
    if (cuisine.toLowerCase() === 'coffee & tea') return 'Coffee & Tea';
    
    return cuisine;
  });
  
  // Remove duplicates again after standardization and sort
  uniqueCuisines = [...new Set(uniqueCuisines)].sort();
  
  return uniqueCuisines;
};

export const getRestaurantById = (id: string): Restaurant | undefined => {
  return restaurants.find(r => r.restaurant_index === parseInt(id));
};

export const getRestaurantsByCity = (city: string): Restaurant[] => {
  return restaurants.filter(r => r.city.toLowerCase() === city.toLowerCase());
};

export const getRestaurantsByCuisine = (cuisine: string): Restaurant[] => {
  return restaurants.filter(r => r.cuisine.toLowerCase().includes(cuisine.toLowerCase()));
};

export const searchRestaurants = (query: string): Restaurant[] => {
  const lowercaseQuery = query.toLowerCase();
  return restaurants.filter(r => 
    r.place_name.toLowerCase().includes(lowercaseQuery) ||
    r.cuisine.toLowerCase().includes(lowercaseQuery) ||
    r.neighborhood.toLowerCase().includes(lowercaseQuery) ||
    r.city.toLowerCase().includes(lowercaseQuery)
  );
};

// Additional helper functions
export const getRestaurantsByRating = (minRating: number): Restaurant[] => {
  return restaurants.filter(r => r.total_score >= minRating);
};

export const getFeaturedRestaurants = (limit: number = 6): Restaurant[] => {
  return restaurants
    .sort((a, b) => b.total_score - a.total_score)
    .slice(0, limit);
};

export const getRestaurantsByCategory = (category: string): Restaurant[] => {
  return restaurants.filter(r => 
    r.restaurant_category.toLowerCase().includes(category.toLowerCase())
  );
};
