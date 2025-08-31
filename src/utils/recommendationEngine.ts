import { restaurants } from '@/data/restaurants';
import { cafes } from '@/data/cafes';
import { shoppingVenues } from '@/data/shopping';
import { entertainmentVenues } from '@/data/entertainment';
import { artsCultureVenues } from '@/data/arts-culture';
import { sportsFitnessVenues } from '@/data/sports-fitness';
import { healthWellnessVenues } from '@/data/health-wellness';

// Extract the total score from venue data
const getTotalScore = (venue: any): string => {
  const score = venue.total_score || 
                venue.overall_score || 
                venue.score || 
                venue.facilities_score || 
                venue.service_score ||
                0;
  
  return score.toString();
};

export interface RecommendationItem {
  id: string;
  name: string;
  category: string;
  city: string;
  score: number;
  rating: string;
  image?: string;
  url: string;
  reason: string;
  actualPlaceId?: string;
}

interface VenueBase {
  city: string;
  score?: number;
  rating?: string;
  overall_score?: number;
  facilities_score?: number;
  service_score?: number;
  value_score?: number;
  ambience_score?: number;
}

// Enhanced scoring algorithm with diversity controls
const calculateRelevanceScore = (
  currentVenue: VenueBase & { category?: string },
  candidateVenue: VenueBase & { category?: string },
  sameCityBonus = 0.25,
  differentCityPenalty = 0.15,
  scoreWeight = 0.35,
  diversityBonus = 0.2,
  randomFactor = 0.1
): number => {
  let score = 0;

  // Base score from venue quality
  const candidateScore = candidateVenue.score || candidateVenue.overall_score || 
                        candidateVenue.facilities_score || candidateVenue.service_score || 0;
  score += candidateScore * scoreWeight;

  // City preference (reduced to allow more cross-city recommendations)
  if (currentVenue.city === candidateVenue.city) {
    score += sameCityBonus;
  } else {
    score -= differentCityPenalty;
  }

  // Strong diversity bonus for different categories
  if (currentVenue.category !== candidateVenue.category) {
    score += diversityBonus;
  }

  // Rating bonus
  const rating = candidateVenue.rating || '0';
  const ratingNum = parseFloat(rating.replace(/[^\d.]/g, ''));
  if (ratingNum >= 4.0) score += 0.15;
  if (ratingNum >= 4.5) score += 0.1;

  // Add random factor to introduce variety
  score += Math.random() * randomFactor;

  return Math.max(0, score);
};

// Helper to ensure diversity in recommendations
const ensureDiversity = (recommendations: RecommendationItem[], count: number): RecommendationItem[] => {
  const diverseRecs: RecommendationItem[] = [];
  const usedCategories = new Set<string>();
  const usedCities = new Set<string>();
  
  // First pass: prioritize different categories
  for (const rec of recommendations) {
    if (diverseRecs.length >= count) break;
    
    if (!usedCategories.has(rec.category)) {
      diverseRecs.push(rec);
      usedCategories.add(rec.category);
    }
  }
  
  // Second pass: fill remaining slots with different cities
  for (const rec of recommendations) {
    if (diverseRecs.length >= count) break;
    
    if (!diverseRecs.some(existing => existing.id === rec.id) && 
        !usedCities.has(rec.city)) {
      diverseRecs.push(rec);
      usedCities.add(rec.city);
    }
  }
  
  // Third pass: fill any remaining slots
  for (const rec of recommendations) {
    if (diverseRecs.length >= count) break;
    
    if (!diverseRecs.some(existing => existing.id === rec.id)) {
      diverseRecs.push(rec);
    }
  }
  
  return diverseRecs.slice(0, count);
};

// Get recommendations for restaurants
export const getRestaurantRecommendations = (
  currentRestaurant: any,
  excludeId: string,
  count = 3
): RecommendationItem[] => {
  const currentVenue = { ...currentRestaurant, category: 'restaurant' };
  
  const allVenues = [
    ...restaurants.map(r => ({ ...r, category: 'restaurant', url: `/restaurant/${r.restaurant_index}` })),
    ...cafes.map(c => ({ ...c, category: 'cafe', url: `/cafe/${c.cafe_index}` })),
    ...shoppingVenues.map(s => ({ ...s, category: 'shopping', url: `/shopping/${s.venue_index}` })),
    ...entertainmentVenues.map(e => ({ ...e, category: 'entertainment', url: `/entertainment/${e.venue_index}` })),
  ];

  const candidateVenues = allVenues
    .filter((venue: any) => {
      const venueId = venue.restaurant_index || venue.cafe_index || venue.venue_index;
      return venueId && venueId.toString() !== excludeId;
    })
    .map((venue: any) => {
      const score = calculateRelevanceScore(currentVenue, { ...venue, category: venue.category });
      const venueId = venue.restaurant_index || venue.cafe_index || venue.venue_index;
      const venueName = venue.place_name || venue.venue_name || venue.facility_name;
      
      let reason = '';
      if (venue.category === 'restaurant' && venue.city === currentRestaurant.city) {
        reason = `Similar cuisine experience in ${venue.city}`;
      } else if (venue.category === 'cafe') {
        reason = 'Perfect for post-meal coffee';
      } else if (venue.category === 'shopping') {
        reason = 'Great for shopping after dining';
      } else if (venue.category === 'entertainment') {
        reason = 'Entertainment nearby';
      } else {
        reason = `Highly rated in ${venue.city}`;
      }

      return {
        id: venueId.toString(),
        name: venueName,
        category: venue.category,
        city: venue.city,
        score,
        rating: getTotalScore(venue),
        url: venue.url,
        reason,
        actualPlaceId: venue.original_place_id || undefined
      };
    })
    .sort((a, b) => b.score - a.score);

  return ensureDiversity(candidateVenues, count);
};

// Get recommendations for cafes
export const getCafeRecommendations = (
  currentCafe: any,
  excludeId: string,
  count = 3
): RecommendationItem[] => {
  const currentVenue = { ...currentCafe, category: 'cafe' };
  
  const allVenues = [
    ...cafes.map(c => ({ ...c, category: 'cafe', url: `/cafe/${c.cafe_index}` })),
    ...restaurants.map(r => ({ ...r, category: 'restaurant', url: `/restaurant/${r.restaurant_index}` })),
    ...shoppingVenues.map(s => ({ ...s, category: 'shopping', url: `/shopping/${s.venue_index}` })),
    ...artsCultureVenues.map(a => ({ ...a, category: 'arts-culture', url: `/arts-culture/${a.venue_index}` })),
  ];

  const candidateVenues = allVenues
    .filter((venue: any) => {
      const venueId = venue.cafe_index || venue.restaurant_index || venue.venue_index;
      return venueId && venueId.toString() !== excludeId;
    })
    .map((venue: any) => {
      const score = calculateRelevanceScore(currentVenue, { ...venue, category: venue.category });
      const venueId = venue.cafe_index || venue.restaurant_index || venue.venue_index;
      const venueName = venue.place_name || venue.venue_name || venue.facility_name;
      
      let reason = '';
      if (venue.category === 'cafe' && venue.city === currentCafe.city) {
        reason = `Another great coffee spot in ${venue.city}`;
      } else if (venue.category === 'restaurant') {
        reason = 'Perfect for a meal';
      } else if (venue.category === 'shopping') {
        reason = 'Great for shopping while you work';
      } else if (venue.category === 'arts-culture') {
        reason = 'Cultural experience nearby';
      } else {
        reason = `Popular choice in ${venue.city}`;
      }

      return {
        id: venueId.toString(),
        name: venueName,
        category: venue.category,
        city: venue.city,
        score,
        rating: getTotalScore(venue),
        url: venue.url,
        reason,
        actualPlaceId: venue.original_place_id || undefined
      };
    })
    .sort((a, b) => b.score - a.score);

  return ensureDiversity(candidateVenues, count);
};

// Get recommendations for shopping venues
export const getShoppingRecommendations = (
  currentVenue: any,
  excludeId: string,
  count = 3
): RecommendationItem[] => {
  const currentShoppingVenue = { ...currentVenue, category: 'shopping' };
  
  const allVenues = [
    ...shoppingVenues.map(s => ({ ...s, category: 'shopping', url: `/shopping/${s.venue_index}` })),
    ...restaurants.map(r => ({ ...r, category: 'restaurant', url: `/restaurant/${r.restaurant_index}` })),
    ...cafes.map(c => ({ ...c, category: 'cafe', url: `/cafe/${c.cafe_index}` })),
    ...entertainmentVenues.map(e => ({ ...e, category: 'entertainment', url: `/entertainment/${e.venue_index}` })),
  ];

  const candidateVenues = allVenues
    .filter((venue: any) => {
      const venueId = venue.venue_index || venue.restaurant_index || venue.cafe_index;
      return venueId && venueId.toString() !== excludeId;
    })
    .map((venue: any) => {
      const score = calculateRelevanceScore(currentShoppingVenue, { ...venue, category: venue.category });
      const venueId = venue.venue_index || venue.restaurant_index || venue.cafe_index;
      const venueName = venue.place_name || venue.venue_name || venue.facility_name;
      
      let reason = '';
      if (venue.category === 'shopping' && venue.city === currentVenue.city) {
        reason = `More shopping options in ${venue.city}`;
      } else if (venue.category === 'restaurant') {
        reason = 'Dining after shopping';
      } else if (venue.category === 'cafe') {
        reason = 'Coffee break during shopping';
      } else if (venue.category === 'entertainment') {
        reason = 'Entertainment in the area';
      } else {
        reason = `Recommended in ${venue.city}`;
      }

      return {
        id: venueId.toString(),
        name: venueName,
        category: venue.category,
        city: venue.city,
        score,
        rating: getTotalScore(venue),
        url: venue.url,
        reason,
        actualPlaceId: venue.original_place_id || undefined
      };
    })
    .sort((a, b) => b.score - a.score);

  return ensureDiversity(candidateVenues, count);
};

// Get recommendations for entertainment venues
export const getEntertainmentRecommendations = (
  currentVenue: any,
  excludeId: string,
  count = 3
): RecommendationItem[] => {
  const currentEntertainmentVenue = { ...currentVenue, category: 'entertainment' };
  
  const allVenues = [
    ...entertainmentVenues.map(e => ({ ...e, category: 'entertainment', url: `/entertainment/${e.venue_index}` })),
    ...restaurants.map(r => ({ ...r, category: 'restaurant', url: `/restaurant/${r.restaurant_index}` })),
    ...artsCultureVenues.map(a => ({ ...a, category: 'arts-culture', url: `/arts-culture/${a.venue_index}` })),
    ...shoppingVenues.map(s => ({ ...s, category: 'shopping', url: `/shopping/${s.venue_index}` })),
  ];

  const candidateVenues = allVenues
    .filter((venue: any) => {
      const venueId = venue.venue_index || venue.restaurant_index;
      return venueId && venueId.toString() !== excludeId;
    })
    .map((venue: any) => {
      const score = calculateRelevanceScore(currentEntertainmentVenue, { ...venue, category: venue.category });
      const venueId = venue.venue_index || venue.restaurant_index;
      const venueName = venue.place_name || venue.venue_name || venue.facility_name;
      
      let reason = '';
      if (venue.category === 'entertainment' && venue.city === currentVenue.city) {
        reason = `More fun activities in ${venue.city}`;
      } else if (venue.category === 'restaurant') {
        reason = 'Dining before/after entertainment';
      } else if (venue.category === 'arts-culture') {
        reason = 'Cultural experiences nearby';
      } else if (venue.category === 'shopping') {
        reason = 'Shopping in the area';
      } else {
        reason = `Popular choice in ${venue.city}`;
      }

      return {
        id: venueId.toString(),
        name: venueName,
        category: venue.category,
        city: venue.city,
        score,
        rating: getTotalScore(venue),
        url: venue.url,
        reason,
        actualPlaceId: venue.original_place_id || undefined
      };
    })
    .sort((a, b) => b.score - a.score);

  return ensureDiversity(candidateVenues, count);
};

// Get recommendations for arts & culture venues
export const getArtsCultureRecommendations = (
  currentVenue: any,
  excludeId: string,
  count = 3
): RecommendationItem[] => {
  const currentArtsCultureVenue = { ...currentVenue, category: 'arts-culture' };
  
  const allVenues = [
    ...artsCultureVenues.map(a => ({ ...a, category: 'arts-culture', url: `/arts-culture/${a.venue_index}` })),
    ...entertainmentVenues.map(e => ({ ...e, category: 'entertainment', url: `/entertainment/${e.venue_index}` })),
    ...cafes.map(c => ({ ...c, category: 'cafe', url: `/cafe/${c.cafe_index}` })),
    ...restaurants.map(r => ({ ...r, category: 'restaurant', url: `/restaurant/${r.restaurant_index}` })),
  ];

  const candidateVenues = allVenues
    .filter((venue: any) => {
      const venueId = venue.venue_index || venue.cafe_index || venue.restaurant_index;
      return venueId && venueId.toString() !== excludeId;
    })
    .map((venue: any) => {
      const score = calculateRelevanceScore(currentArtsCultureVenue, { ...venue, category: venue.category });
      const venueId = venue.venue_index || venue.cafe_index || venue.restaurant_index;
      const venueName = venue.place_name || venue.venue_name || venue.facility_name;
      
      let reason = '';
      if (venue.category === 'arts-culture' && venue.city === currentVenue.city) {
        reason = `More cultural experiences in ${venue.city}`;
      } else if (venue.category === 'entertainment') {
        reason = 'Entertainment nearby';
      } else if (venue.category === 'cafe') {
        reason = 'Perfect for post-visit coffee';
      } else if (venue.category === 'restaurant') {
        reason = 'Dining after cultural experience';
      } else {
        reason = `Recommended in ${venue.city}`;
      }

      return {
        id: venueId.toString(),
        name: venueName,
        category: venue.category,
        city: venue.city,
        score,
        rating: getTotalScore(venue),
        url: venue.url,
        reason,
        actualPlaceId: venue.original_place_id || undefined
      };
    })
    .sort((a, b) => b.score - a.score);

  return ensureDiversity(candidateVenues, count);
};

// Get recommendations for sports & fitness venues
export const getSportsFitnessRecommendations = (
  currentVenue: any,
  excludeId: string,
  count = 3
): RecommendationItem[] => {
  const currentSportsFitnessVenue = { ...currentVenue, category: 'sports-fitness' };
  
  const allVenues = [
    ...sportsFitnessVenues.map(s => ({ ...s, category: 'sports-fitness', url: `/sports-fitness/${s.venue_index}` })),
    ...healthWellnessVenues.map(h => ({ ...h, category: 'health-wellness', url: `/health-wellness/${h.venue_index}` })),
    ...cafes.map(c => ({ ...c, category: 'cafe', url: `/cafe/${c.cafe_index}` })),
    ...restaurants.map(r => ({ ...r, category: 'restaurant', url: `/restaurant/${r.restaurant_index}` })),
  ];

  const candidateVenues = allVenues
    .filter((venue: any) => {
      const venueId = venue.venue_index || venue.cafe_index || venue.restaurant_index;
      return venueId && venueId.toString() !== excludeId;
    })
    .map((venue: any) => {
      const score = calculateRelevanceScore(currentSportsFitnessVenue, { ...venue, category: venue.category });
      const venueId = venue.venue_index || venue.cafe_index || venue.restaurant_index;
      const venueName = venue.place_name || venue.venue_name || venue.facility_name;
      
      let reason = '';
      if (venue.category === 'sports-fitness' && venue.city === currentVenue.city) {
        reason = `More fitness options in ${venue.city}`;
      } else if (venue.category === 'health-wellness') {
        reason = 'Wellness & recovery';
      } else if (venue.category === 'cafe') {
        reason = 'Post-workout refreshments';
      } else if (venue.category === 'restaurant') {
        reason = 'Healthy dining options';
      } else {
        reason = `Popular choice in ${venue.city}`;
      }

      return {
        id: venueId.toString(),
        name: venueName,
        category: venue.category,
        city: venue.city,
        score,
        rating: getTotalScore(venue),
        url: venue.url,
        reason,
        actualPlaceId: venue.original_place_id || undefined
      };
    })
    .sort((a, b) => b.score - a.score);

  return ensureDiversity(candidateVenues, count);
};

// Get recommendations for health & wellness venues
export const getHealthWellnessRecommendations = (
  currentVenue: any,
  excludeId: string,
  count = 3
): RecommendationItem[] => {
  const currentHealthWellnessVenue = { ...currentVenue, category: 'health-wellness' };
  
  const allVenues = [
    ...healthWellnessVenues.map(h => ({ ...h, category: 'health-wellness', url: `/health-wellness/${h.venue_index}` })),
    ...sportsFitnessVenues.map(s => ({ ...s, category: 'sports-fitness', url: `/sports-fitness/${s.venue_index}` })),
    ...cafes.map(c => ({ ...c, category: 'cafe', url: `/cafe/${c.cafe_index}` })),
    ...restaurants.map(r => ({ ...r, category: 'restaurant', url: `/restaurant/${r.restaurant_index}` })),
  ];

  const candidateVenues = allVenues
    .filter((venue: any) => {
      const venueId = venue.venue_index || venue.cafe_index || venue.restaurant_index;
      return venueId && venueId.toString() !== excludeId;
    })
    .map((venue: any) => {
      const score = calculateRelevanceScore(currentHealthWellnessVenue, { ...venue, category: venue.category });
      const venueId = venue.venue_index || venue.cafe_index || venue.restaurant_index;
      const venueName = venue.place_name || venue.venue_name || venue.facility_name;
      
      let reason = '';
      if (venue.category === 'health-wellness' && venue.city === currentVenue.city) {
        reason = `More wellness options in ${venue.city}`;
      } else if (venue.category === 'sports-fitness') {
        reason = 'Fitness & activity';
      } else if (venue.category === 'cafe') {
        reason = 'Healthy refreshments';
      } else if (venue.category === 'restaurant') {
        reason = 'Nutritious dining';
      } else {
        reason = `Recommended in ${venue.city}`;
      }

      return {
        id: venueId.toString(),
        name: venueName,
        category: venue.category,
        city: venue.city,
        score,
        rating: getTotalScore(venue),
        url: venue.url,
        reason,
        actualPlaceId: venue.original_place_id || undefined
      };
    })
    .sort((a, b) => b.score - a.score);

  return ensureDiversity(candidateVenues, count);
};

// Helper function to get category display name
export const getCategoryDisplayName = (category: string): string => {
  const categoryMap: { [key: string]: string } = {
    'restaurant': 'Restaurant',
    'cafe': 'Cafe',
    'shopping': 'Shopping',
    'entertainment': 'Entertainment',
    'arts-culture': 'Arts & Culture',
    'sports-fitness': 'Sports & Fitness',
    'health-wellness': 'Health & Wellness'
  };
  return categoryMap[category] || category;
};

// Helper function to get category icon
export const getCategoryIcon = (category: string): string => {
  const iconMap: { [key: string]: string } = {
    'restaurant': '🍽️',
    'cafe': '☕',
    'shopping': '🛍️',
    'entertainment': '🎭',
    'arts-culture': '🎨',
    'sports-fitness': '💪',
    'health-wellness': '🧘'
  };
  return iconMap[category] || '📍';
};