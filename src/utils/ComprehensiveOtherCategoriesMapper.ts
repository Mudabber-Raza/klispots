import otherCategoriesMappings from '../data/other-categories-mapping.json';

// Cache for venue mappings to avoid repeated lookups
const venueMappingCache = new Map<string, string | null>();

/**
 * Get venue image for OTHER CATEGORIES (excluding restaurants and cafes)
 * Uses 100% accurate mapping from local folder structure
 */
export const getOtherCategoriesVenueImage = async (
  category: string,
  venueName: string,
  placeId?: string
): Promise<string | null> => {
  // Skip restaurants and cafes - they have their own working system
  if (category === 'restaurants' || category === 'cafes') {
    return null;
  }

  const cacheKey = `${category}-${venueName}-${placeId || 'no-id'}`;
  
  // Check cache first
  if (venueMappingCache.has(cacheKey)) {
    return venueMappingCache.get(cacheKey) || null;
  }

  // PRIORITY 1: Place ID (HIGHEST PRIORITY - UNIQUE IDENTIFIER)
  if (placeId) {
    const venue = otherCategoriesMappings.venues.find(v => v.place_id === placeId);
    if (venue) {
      const imageUrl = `/google_places_images1/${encodeURIComponent(venue.s3_folder)}/${encodeURIComponent(venue.available_images[0] || '')}`;
      console.log(`✅ FOUND by Place ID: ${venueName} (${placeId}) → ${venue.s3_folder} → ${imageUrl}`);
      venueMappingCache.set(cacheKey, imageUrl);
      return imageUrl;
    }
  }

  // PRIORITY 2: Exact Venue Name Match
  const exactMatch = otherCategoriesMappings.venues.find(v => 
    v.place_name.toLowerCase() === venueName.toLowerCase() && 
    v.category === category
  );
  
  if (exactMatch) {
    const imageUrl = `/google_places_images1/${encodeURIComponent(exactMatch.s3_folder)}/${encodeURIComponent(exactMatch.available_images[0] || '')}`;
    console.log(`✅ FOUND by Exact Name: ${venueName} → ${exactMatch.s3_folder} → ${imageUrl}`);
    venueMappingCache.set(cacheKey, imageUrl);
    return imageUrl;
  }

  // PRIORITY 3: Fuzzy Name Match
  const normalizedVenueName = venueName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const fuzzyMatch = otherCategoriesMappings.venues.find(v => {
    if (v.category !== category) return false;
    
    const normalizedMappedName = v.place_name.toLowerCase().replace(/[^a-z0-9]/g, '');
    return normalizedMappedName.includes(normalizedVenueName) || 
           normalizedVenueName.includes(normalizedMappedName);
  });

  if (fuzzyMatch) {
    const imageUrl = `/google_places_images1/${encodeURIComponent(fuzzyMatch.s3_folder)}/${encodeURIComponent(fuzzyMatch.available_images[0] || '')}`;
    console.log(`✅ FOUND by Fuzzy Match: ${venueName} → ${fuzzyMatch.s3_folder} → ${imageUrl}`);
    venueMappingCache.set(cacheKey, imageUrl);
    return imageUrl;
  }

  console.log(`❌ NOT FOUND: ${venueName} (${placeId}) in category ${category}`);
  venueMappingCache.set(cacheKey, null);
  return null;
};

/**
 * Get ALL available images for a venue in other categories
 */
export const getAllOtherCategoriesVenueImages = async (
  category: string,
  venueName: string,
  placeId?: string
): Promise<string[]> => {
  // Skip restaurants and cafes
  if (category === 'restaurants' || category === 'cafes') {
    return [];
  }

  const cacheKey = `all-${category}-${venueName}-${placeId || 'no-id'}`;
  
  // Check cache first
  if (venueMappingCache.has(cacheKey)) {
    const cached = venueMappingCache.get(cacheKey);
    return cached ? [cached] : [];
  }

  let venue;
  
  // Find venue by place ID first
  if (placeId) {
    venue = otherCategoriesMappings.venues.find(v => v.place_id === placeId);
  }
  
  // If not found by place ID, try by name
  if (!venue) {
    venue = otherCategoriesMappings.venues.find(v => 
      v.place_name.toLowerCase() === venueName.toLowerCase() && 
      v.category === category
    );
  }

  if (venue && venue.available_images && venue.available_images.length > 0) {
    const images = venue.available_images.map(imageName => 
      `/google_places_images1/${encodeURIComponent(venue.s3_folder)}/${encodeURIComponent(imageName)}`
    );
    
    console.log(`✅ Found ${images.length} images for ${venueName}: ${images.join(', ')}`);
    venueMappingCache.set(cacheKey, images[0]); // Cache first image
    return images;
  }

  console.log(`❌ No images found for ${venueName} in category ${category}`);
  venueMappingCache.set(cacheKey, null);
  return [];
};

/**
 * Get mapping statistics for other categories
 */
export const getOtherCategoriesMappingStats = () => {
  return {
    total_venues: otherCategoriesMappings.metadata.total_venues,
    categories: otherCategoriesMappings.metadata.categories,
    created_at: otherCategoriesMappings.metadata.created_at,
    source: otherCategoriesMappings.metadata.source
  };
};

/**
 * Get sample venues from a specific category
 */
export const getSampleVenuesFromCategory = (category: string, count: number = 5) => {
  const venues = otherCategoriesMappings.venues.filter(v => v.category === category);
  return venues.slice(0, count);
};

/**
 * Search venues by name across other categories
 */
export const searchVenuesInOtherCategories = (searchTerm: string, category?: string) => {
  const normalizedSearch = searchTerm.toLowerCase();
  const venues = otherCategoriesMappings.venues.filter(v => {
    if (category && v.category !== category) return false;
    return v.place_name.toLowerCase().includes(normalizedSearch);
  });
  return venues;
};





