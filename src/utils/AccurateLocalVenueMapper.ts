import accurateMappings from '../data/venue-image-mappings-accurate.json';

// Cache for venue mappings to avoid repeated lookups
const venueMappingCache = new Map<string, string | null>();

/**
 * Get venue image with 100% accurate mapping using local folder structure
 */
export const getAccurateLocalVenueImage = async (
  category: string,
  venueName: string,
  placeId?: string
): Promise<string | null> => {
  const cacheKey = `${category}-${venueName}-${placeId || 'no-id'}`;
  
  // Check cache first
  if (venueMappingCache.has(cacheKey)) {
    return venueMappingCache.get(cacheKey) || null;
  }

  // PRIORITY 1: Place ID (HIGHEST PRIORITY - UNIQUE IDENTIFIER)
  if (placeId) {
    const venue = accurateMappings.venues.find(v => v.place_id === placeId);
    if (venue) {
      const imagePath = `/google_places_images1/${venue.s3_folder}/${venue.available_images[0]}`;
      console.log(`✅ FOUND by Place ID: ${placeId} → ${venue.place_name} → ${imagePath}`);
      venueMappingCache.set(cacheKey, imagePath);
      return imagePath;
    }
  }

  // PRIORITY 2: Exact venue name match
  const exactNameMatch = accurateMappings.venues.find(v => 
    v.place_name.toLowerCase() === venueName.toLowerCase()
  );
  if (exactNameMatch) {
    const imagePath = `/google_places_images1/${exactNameMatch.s3_folder}/${exactNameMatch.available_images[0]}`;
    console.log(`✅ FOUND by exact name: ${venueName} → ${exactNameMatch.place_name} → ${imagePath}`);
    venueMappingCache.set(cacheKey, imagePath);
    return imagePath;
  }

  // PRIORITY 3: Fuzzy name matching
  const fuzzyMatch = accurateMappings.venues.find(v => 
    v.place_name.toLowerCase().includes(venueName.toLowerCase()) ||
    venueName.toLowerCase().includes(v.place_name.toLowerCase())
  );
  if (fuzzyMatch) {
    const imagePath = `/google_places_images1/${fuzzyMatch.s3_folder}/${fuzzyMatch.available_images[0]}`;
    console.log(`✅ FOUND by fuzzy match: ${venueName} → ${fuzzyMatch.place_name} → ${imagePath}`);
    venueMappingCache.set(cacheKey, imagePath);
    return imagePath;
  }

  console.log(`❌ NO MATCH FOUND for: ${category} - ${venueName} - ${placeId}`);
  venueMappingCache.set(cacheKey, null);
  return null;
};

/**
 * Get all available images for a venue
 */
export const getAllVenueImages = async (
  category: string,
  venueName: string,
  placeId?: string
): Promise<string[]> => {
  // Find venue by Place ID first, then by name
  let venue = null;
  
  if (placeId) {
    venue = accurateMappings.venues.find(v => v.place_id === placeId);
  }
  
  if (!venue) {
    venue = accurateMappings.venues.find(v => 
      v.place_name.toLowerCase() === venueName.toLowerCase()
    );
  }
  
  if (!venue) {
    venue = accurateMappings.venues.find(v => 
      v.place_name.toLowerCase().includes(venueName.toLowerCase()) ||
      venueName.toLowerCase().includes(v.place_name.toLowerCase())
    );
  }

  if (!venue) {
    console.log(`❌ NO VENUE FOUND for: ${category} - ${venueName} - ${placeId}`);
    return [];
  }

  // Generate all image paths for this venue
  const imagePaths = venue.available_images.map(imageName => 
    `/google_places_images1/${venue.s3_folder}/${imageName}`
  );

  console.log(`✅ Found ${imagePaths.length} images for ${venue.place_name}:`, imagePaths);
  return imagePaths;
};

/**
 * Get venue mapping info for debugging
 */
export const getVenueMappingInfo = (
  category: string,
  venueName: string,
  placeId?: string
): {
  venue: any;
  folderName: string;
  localUrl: string;
  availableImages: string[];
} | null => {
  let venue = null;
  
  if (placeId) {
    venue = accurateMappings.venues.find(v => v.place_id === placeId);
  }
  
  if (!venue) {
    venue = accurateMappings.venues.find(v => 
      v.place_name.toLowerCase() === venueName.toLowerCase()
    );
  }
  
  if (!venue) {
    venue = accurateMappings.venues.find(v => 
      v.place_name.toLowerCase().includes(venueName.toLowerCase()) ||
      venueName.toLowerCase().includes(v.place_name.toLowerCase())
    );
  }

  if (!venue) {
    return null;
  }

  const folderName = venue.s3_folder;
  const localUrl = `/google_places_images1/${folderName}/${venue.available_images[0]}`;
  const availableImages = venue.available_images.map(imageName => 
    `/google_places_images1/${folderName}/${imageName}`
  );

  return {
    venue,
    folderName,
    localUrl,
    availableImages
  };
};

/**
 * Get all venues by category
 */
export const getVenuesByCategory = (category: string) => {
  return accurateMappings.venues.filter(v => v.category === category);
};

/**
 * Get all venues by city
 */
export const getVenuesByCity = (city: string) => {
  return accurateMappings.venues.filter(v => v.city === city);
};

/**
 * Get mapping statistics
 */
export const getMappingStats = () => {
  return accurateMappings.metadata;
};





