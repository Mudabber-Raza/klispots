import { restaurants } from '@/data/restaurants';
import { cafes } from '@/data/cafes';
import { shoppingVenues } from '@/data/shopping';
import { entertainmentVenues } from '@/data/entertainment';
import { artsCultureVenues } from '@/data/arts-culture';
import { sportsFitnessVenues } from '@/data/sports-fitness';
import { healthWellnessVenues } from '@/data/health-wellness';

export interface SearchResult {
  id: string;
  name: string;
  category: string;
  city: string;
  neighborhood: string;
  description: string;
  rating: number;
  url: string;
  matchScore: number;
  actualPlaceId?: string; // For image mapping
}

// Enhanced search algorithm with fuzzy matching and relevance scoring
export function searchText(text: string, query: string): number {
  if (!text || !query) return 0;
  
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();
  
  // Exact match gets highest score
  if (textLower === queryLower) return 10;
  
  // Starts with query gets high score
  if (textLower.startsWith(queryLower)) return 8;
  
  // Contains full query gets good score
  if (textLower.includes(queryLower)) return 6;
  
  // Word boundaries match gets decent score
  const words = queryLower.split(' ');
  let wordScore = 0;
  for (const word of words) {
    if (textLower.includes(word)) {
      wordScore += 2;
    }
  }
  
  // Fuzzy matching for partial matches
  let fuzzyScore = 0;
  for (let i = 0; i < Math.min(queryLower.length, textLower.length); i++) {
    if (queryLower[i] === textLower[i]) {
      fuzzyScore += 0.1;
    }
  }
  
  return Math.max(wordScore, fuzzyScore);
}

export function searchAllVenues(query: string, filters: {
  category?: string;
  city?: string;
  limit?: number;
} = {}): SearchResult[] {
  const results: SearchResult[] = [];
  const queryLower = query.toLowerCase();
  
  // Search restaurants
  if (!filters.category || filters.category === 'all' || filters.category === 'restaurants') {
    restaurants.forEach((restaurant, index) => {
      let totalScore = 0;
      
      // Search in name (highest weight)
      totalScore += searchText(restaurant.place_name, query) * 3;
      
      // Search in cuisine (high weight)
      totalScore += searchText(restaurant.cuisine, query) * 2.5;
      
      // Search in neighborhood
      totalScore += searchText(restaurant.neighborhood, query) * 2;
      
      // Search in city
      totalScore += searchText(restaurant.city, query) * 1.5;
      
      // Check for specific popular searches
      if (queryLower.includes('biryani') && restaurant.cuisine.toLowerCase().includes('biryani')) {
        totalScore += 5;
      }
      if (queryLower.includes('karachi') && restaurant.city.toLowerCase() === 'karachi') {
        totalScore += 3;
      }
      if (queryLower.includes('lahore') && restaurant.city.toLowerCase() === 'lahore') {
        totalScore += 3;
      }
      if (queryLower.includes('fine dining') && restaurant.cuisine.toLowerCase().includes('fine')) {
        totalScore += 4;
      }
      
      if (totalScore > 0.5 && (!filters.city || restaurant.city.toLowerCase() === filters.city.toLowerCase())) {
        results.push({
          id: `restaurant-${restaurant.restaurant_index}`,
          name: restaurant.place_name,
          category: 'restaurants',
          city: restaurant.city,
          neighborhood: restaurant.neighborhood,
          description: `${restaurant.cuisine} • ${restaurant.neighborhood}`,
          rating: Number(restaurant.total_score) || 0,
          url: `/restaurant/${restaurant.restaurant_index}`,
          matchScore: totalScore,
          actualPlaceId: restaurant.original_place_id || undefined
        });
      }
    });
  }
  
  // Search cafes
  if (!filters.category || filters.category === 'all' || filters.category === 'cafes') {
    cafes.forEach((cafe, index) => {
      let totalScore = 0;
      
      totalScore += searchText(cafe.place_name, query) * 3;
      totalScore += searchText(cafe.coffee_and_beverages, query) * 2;
      totalScore += searchText(cafe.neighborhood, query) * 2;
      totalScore += searchText(cafe.city, query) * 1.5;
      totalScore += searchText(cafe.cafe_category, query) * 1.5;
      
      // Special handling for coffee-related searches
      if (queryLower.includes('coffee') && cafe.coffee_and_beverages.toLowerCase().includes('coffee')) {
        totalScore += 4;
      }
      if (queryLower.includes('study') && cafe.wifi_and_study_environment_score && Number(cafe.wifi_and_study_environment_score) > 7) {
        totalScore += 3;
      }
      
      if (totalScore > 0.5 && (!filters.city || cafe.city.toLowerCase() === filters.city.toLowerCase())) {
        results.push({
          id: `cafe-${cafe.cafe_index}`,
          name: cafe.place_name,
          category: 'cafes',
          city: cafe.city,
          neighborhood: cafe.neighborhood,
          description: `${cafe.cafe_category} • ${cafe.neighborhood}`,
          rating: Number(cafe.total_score) || 0,
          url: `/cafe/${cafe.cafe_index}`,
          matchScore: totalScore,
          actualPlaceId: cafe.original_place_id || undefined
        });
      }
    });
  }
  
  // Search shopping venues
  if (!filters.category || filters.category === 'all' || filters.category === 'shopping') {
    shoppingVenues.forEach((venue, index) => {
      let totalScore = 0;
      
      totalScore += searchText(venue.place_name || '', query) * 3;
      totalScore += searchText(venue.venue_type || '', query) * 2;
      totalScore += searchText(venue.neighborhood || '', query) * 2;
      totalScore += searchText(venue.city || '', query) * 1.5;
      
      if (queryLower.includes('mall') && (venue.venue_type || '').toLowerCase().includes('mall')) {
        totalScore += 4;
      }
      if (queryLower.includes('shopping') && (venue.venue_type || '').toLowerCase().includes('shopping')) {
        totalScore += 4;
      }
      
      if (totalScore > 0.5 && (!filters.city || (venue.city || '').toLowerCase() === filters.city.toLowerCase())) {
        results.push({
          id: `shopping-${index + 1}`,
          name: venue.place_name || 'Unknown',
          category: 'shopping',
          city: venue.city || '',
          neighborhood: venue.neighborhood || '',
          description: `${venue.venue_type || 'Shopping'} • ${venue.neighborhood || ''}`,
          rating: Number(venue.total_score) || 0,
          url: `/shopping/${index + 1}`,
          matchScore: totalScore,
          actualPlaceId: undefined
        });
      }
    });
  }
  
  // Search entertainment venues
  if (!filters.category || filters.category === 'all' || filters.category === 'entertainment') {
    entertainmentVenues.forEach((venue, index) => {
      let totalScore = 0;
      
      totalScore += searchText(venue.place_name || '', query) * 3;
      totalScore += searchText(venue.venue_type || '', query) * 2;
      totalScore += searchText(venue.neighborhood || '', query) * 2;
      totalScore += searchText(venue.city || '', query) * 1.5;
      
      if (queryLower.includes('entertainment') || queryLower.includes('cinema') || queryLower.includes('movie')) {
        totalScore += 3;
      }
      
      if (totalScore > 0.5 && (!filters.city || (venue.city || '').toLowerCase() === filters.city.toLowerCase())) {
        results.push({
          id: `entertainment-${index + 1}`,
          name: venue.place_name || 'Unknown',
          category: 'entertainment',
          city: venue.city || '',
          neighborhood: venue.neighborhood || '',
          description: `${venue.venue_type || 'Entertainment'} • ${venue.neighborhood || ''}`,
          rating: Number(venue.total_score) || 0,
          url: `/entertainment/${index + 1}`,
          matchScore: totalScore,
          actualPlaceId: undefined
        });
      }
    });
  }
  
  // Search arts & culture venues
  if (!filters.category || filters.category === 'all' || filters.category === 'arts-culture') {
    artsCultureVenues.forEach((venue, index) => {
      let totalScore = 0;
      
      totalScore += searchText(venue.place_name || '', query) * 3;
      totalScore += searchText(venue.venue_category || '', query) * 2;
      totalScore += searchText(venue.neighborhood || '', query) * 2;
      totalScore += searchText(venue.city || '', query) * 1.5;
      
      if (totalScore > 0.5 && (!filters.city || (venue.city || '').toLowerCase() === filters.city.toLowerCase())) {
        results.push({
          id: `arts-culture-${index + 1}`,
          name: venue.place_name || 'Unknown',
          category: 'arts-culture',
          city: venue.city || '',
          neighborhood: venue.neighborhood || '',
          description: `${venue.venue_category || 'Arts & Culture'} • ${venue.neighborhood || ''}`,
          rating: Number(venue.total_score) || 0,
          url: `/arts-culture/${index + 1}`,
          matchScore: totalScore,
          actualPlaceId: undefined
        });
      }
    });
  }
  
  // Search sports & fitness venues
  if (!filters.category || filters.category === 'all' || filters.category === 'sports-fitness') {
    sportsFitnessVenues.forEach((venue, index) => {
      let totalScore = 0;
      
      totalScore += searchText(venue.place_name || '', query) * 3;
      totalScore += searchText(venue.facility_type || '', query) * 2;
      totalScore += searchText(venue.neighborhood || '', query) * 2;
      totalScore += searchText(venue.city || '', query) * 1.5;
      
      if (queryLower.includes('gym') || queryLower.includes('fitness') || queryLower.includes('sports')) {
        totalScore += 5; // Higher score for gym/fitness searches in sports-fitness category
      }
      
      if (totalScore > 0.5 && (!filters.city || (venue.city || '').toLowerCase() === filters.city.toLowerCase())) {
        results.push({
          id: `sports-fitness-${index + 1}`,
          name: venue.place_name || 'Unknown',
          category: 'sports-fitness',
          city: venue.city || '',
          neighborhood: venue.neighborhood || '',
          description: `${venue.facility_type || 'Sports & Fitness'} • ${venue.neighborhood || ''}`,
          rating: Number(venue.total_score) || 0,
          url: `/sports-fitness/${venue.venue_index}`,
          matchScore: totalScore,
          actualPlaceId: undefined
        });
      }
    });
  }
  
  // Search health & wellness venues
  if (!filters.category || filters.category === 'all' || filters.category === 'health-wellness') {
    healthWellnessVenues.forEach((venue, index) => {
      let totalScore = 0;
      
      totalScore += searchText(venue.place_name || '', query) * 3;
      totalScore += searchText(venue.facility_type || '', query) * 2;
      totalScore += searchText(venue.neighborhood || '', query) * 2;
      totalScore += searchText(venue.city || '', query) * 1.5;
      
      if (queryLower.includes('health') || queryLower.includes('wellness') || queryLower.includes('spa')) {
        totalScore += 3;
      }
      // Reduce score for gym searches in health-wellness to prioritize sports-fitness
      if (queryLower.includes('gym') || queryLower.includes('fitness')) {
        totalScore -= 2;
      }
      
      if (totalScore > 0.5 && (!filters.city || (venue.city || '').toLowerCase() === filters.city.toLowerCase())) {
        results.push({
          id: `health-wellness-${index + 1}`,
          name: venue.place_name || 'Unknown',
          category: 'health-wellness',
          city: venue.city || '',
          neighborhood: venue.neighborhood || '',
          description: `${venue.facility_type || 'Health & Wellness'} • ${venue.neighborhood || ''}`,
          rating: Number(venue.total_score) || 0,
          url: `/health-wellness/${index + 1}`,
          matchScore: totalScore,
          actualPlaceId: undefined
        });
      }
    });
  }
  
  // Sort by match score (descending) and rating (descending)
  results.sort((a, b) => {
    if (a.matchScore !== b.matchScore) {
      return b.matchScore - a.matchScore;
    }
    return b.rating - a.rating;
  });
  
  // Apply limit
  if (filters.limit) {
    return results.slice(0, filters.limit);
  }
  
  return results;
}

// Get popular search suggestions based on category
export function getPopularSearches(category?: string): string[] {
  const popularSearches = {
    all: [
      'Best Biryani in Karachi',
      'Coffee Shops Islamabad',
      'Family Restaurants',
      'Shopping Malls',
      'Entertainment Venues'
    ],
    restaurants: [
      'Best Biryani in Karachi',
      'Family Restaurants',
      'BBQ Restaurants',
      'Pakistani Cuisine',
      'Chinese Food'
    ],
    cafes: [
      'Coffee Shops Islamabad',
      'Study Friendly Cafes',
      'Best Coffee Karachi',
      'Cafe with WiFi',
      'Breakfast Spots',
      'Tea Houses'
    ],
    shopping: [
      'Shopping Malls Karachi',
      'Fashion Outlets',
      'Electronics Markets',
      'Local Bazaars',
      'Branded Stores',
      'Department Stores'
    ],
    entertainment: [
      'Cinema Halls',
      'Gaming Zones',
      'Family Entertainment',
      'Kids Play Areas',
      'Bowling Alleys',
      'Arcade Games'
    ],
    'arts-culture': [
      'Art Galleries',
      'Museums',
      'Cultural Centers',
      'Exhibition Halls',
      'Craft Workshops',
      'Heritage Sites'
    ],
    'sports-fitness': [
      'Gyms Near Me',
      'Swimming Pools',
      'Sports Clubs',
      'Fitness Centers',
      'Yoga Studios',
      'Martial Arts'
    ],
    'health-wellness': [
      'Spa Services',
      'Wellness Centers',
      'Massage Therapy',
      'Beauty Salons',
      'Health Clinics',
      'Meditation Centers'
    ]
  };
  
  return popularSearches[category as keyof typeof popularSearches] || popularSearches.all;
}
