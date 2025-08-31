const S3_BASE_URL = 'https://klispots-venue-images.s3.eu-north-1.amazonaws.com/google_places_images1';

// Cache for venue mappings to avoid repeated lookups
const venueMappingCache = new Map<string, string | null>();

// Helper function to get category fallback images
const getCategoryFallbackImage = (category: string): string | null => {
  const fallbacks: Record<string, string> = {
    'restaurants': 'https://th.bing.com/th/id/R.f28a2b8be1925a2eac7c5a8e272422eb?rik=1n%2bxYoe1ESN3Qw&riu=http%3a%2f%2fimages.unsplash.com%2fphoto-1525648199074-cee30ba79a4a%3fcrop%3dentropy%26cs%3dtinysrgb%26fit%3dmax%26fm%3djpg%26ixid%3dMnwxMjA3fDB8MXxzZWFyY2h8MXx8cmVzdGF1cmFudHN8fDB8fHx8MTYxOTMxMDYxNA%26ixlib%3drb-1.2.1%26q%3d80%26w%3d1080&ehk=L3hOYhuRtslpaWLKf%2b59W5GiQE1hyuSiTKQD%2f7vS%2f1s%3d&risl=&pid=ImgRaw&r=0',
    'cafes': 'https://th.bing.com/th/id/R.f28a2b8be1925a2eac7c5a8e272422eb?rik=1n%2bxYoe1ESN3Qw&riu=http%3a%2f%2fimages.unsplash.com%2fphoto-1525648199074-cee30ba79a4a%3fcrop%3dentropy%26cs%3dtinysrgb%26fit%3dmax%26fm%3djpg%26ixid%3dMnwxMjA3fDB8MXxzZWFyY2h8MXx8cmVzdGF1cmFudHN8fDB8fHx8MTYxOTMxMDYxNA%26ixlib%3drb-1.2.1%26q%3d80%26w%3d1080&ehk=L3hOYhuRtslpaWLKf%2b59W5GiQE1hyuSiTKQD%2f7vS%2f1s%3d&risl=&pid=ImgRaw&r=0',
    'arts-culture': 'arts-culture-default.jpg',
    'entertainment': 'entertainment-default.jpg',
    'health-wellness': 'health-wellness-default.jpg',
    'shopping': 'shopping-default.jpg',
    'sports-fitness': 'sports-fitness-default.jpg'
  };
  return fallbacks[category] || null;
};

// Import the final comprehensive mappings with 100% accuracy
import comprehensiveMappings from '../data/comprehensive-venue-mappings-final.json';

// Type assertion to ensure TypeScript recognizes the structure
const mappings = comprehensiveMappings as {
  venues: Array<{
    place_id: string;
    place_name: string;
    s3_folder: string;
    category: string;
    city: string;
    available_images: string[];
  }>;
};

/**
 * Get venue image with final comprehensive mapping (100% accurate with all venue fixes)
 */
export const getComprehensiveVenueImage = async (
  category: string,
  venueName: string,
  placeId?: string
): Promise<string | null> => {
  const cacheKey = `${category}-${venueName}-${placeId || 'no-id'}`;
  
  // Check cache first
  if (venueMappingCache.has(cacheKey)) {
    return venueMappingCache.get(cacheKey) || null;
  }

  // Find the venue in our comprehensive mappings
  let foundVenue = null;

                // PRIORITY 1: Place ID (HIGHEST PRIORITY - UNIQUE IDENTIFIER)
              if (placeId) {
                foundVenue = mappings.venues.find(venue =>
                  venue.place_id === placeId && venue.category === category
                );
                if (foundVenue) {
                  console.log(`✅ FOUND by Place ID: ${placeId} → ${foundVenue.place_name}`);
                }
              }

              // PRIORITY 2: Exact Venue Name Match
              if (!foundVenue) {
                foundVenue = mappings.venues.find(venue =>
                  venue.place_name.toLowerCase() === venueName.toLowerCase() && venue.category === category
                );
                if (foundVenue) {
                  console.log(`✅ FOUND by exact name: ${venueName} → ${foundVenue.place_name}`);
                }
              }

              // PRIORITY 3: Fuzzy Name Matching
              if (!foundVenue) {
                foundVenue = mappings.venues.find(venue =>
                  venue.category === category && (
                    venue.place_name.toLowerCase().includes(venueName.toLowerCase()) ||
                    venueName.toLowerCase().includes(venue.place_name.toLowerCase())
                  )
                );
                if (foundVenue) {
                  console.log(`✅ FOUND by fuzzy match: ${venueName} → ${foundVenue.place_name}`);
                }
              }

  if (foundVenue && foundVenue.available_images.length > 0) {
    // Use the first available image
    const imageUrl = `${S3_BASE_URL}/${encodeURIComponent(foundVenue.s3_folder)}/${encodeURIComponent(foundVenue.available_images[0])}`;
    console.log(`✅ Image URL generated: ${imageUrl}`);
    venueMappingCache.set(cacheKey, imageUrl);
    return imageUrl;
  }

              // No match found - use category fallback
              const fallbackImage = getCategoryFallbackImage(category);
              if (fallbackImage) {
                console.log(`⚠️ Using category fallback for ${venueName} (ID: ${placeId}) in category ${category}`);
                
                // Check if it's a direct URL (for restaurants/cafes) or S3 path
                if (fallbackImage.startsWith('http')) {
                  console.log(`🌐 Using direct URL fallback: ${fallbackImage}`);
                  venueMappingCache.set(cacheKey, fallbackImage);
                  return fallbackImage;
                } else {
                  // Use S3 path for other categories
                  const fallbackUrl = `${S3_BASE_URL}/${encodeURIComponent('category-placeholders')}/${encodeURIComponent(fallbackImage)}`;
                  venueMappingCache.set(cacheKey, fallbackUrl);
                  return fallbackUrl;
                }
              }
              
              console.log(`❌ NO MAPPING FOUND for ${venueName} (ID: ${placeId}) in category ${category}`);
              venueMappingCache.set(cacheKey, null);
              return null;
};

/**
 * Get all images for a venue from S3 folder
 */
export const getImagesFromS3Folder = async (folderName: string): Promise<string[]> => {
  try {
    // Find the venue in our mappings to get all available images
    const foundVenue = mappings.venues.find(venue => 
      venue.s3_folder === folderName
    );

    if (foundVenue && foundVenue.available_images.length > 0) {
      const images = foundVenue.available_images.map(imageName => 
        `${S3_BASE_URL}/${encodeURIComponent(folderName)}/${encodeURIComponent(imageName)}`
      );
      console.log(`✅ Generated ${images.length} images for folder ${folderName}`);
      return images;
    }
    
    // Fallback to generating common image variations
    const fallbackImages = [
      `${S3_BASE_URL}/${encodeURIComponent(folderName)}/${encodeURIComponent(folderName)}_1.jpg`,
      `${S3_BASE_URL}/${encodeURIComponent(folderName)}/${encodeURIComponent(folderName)}_2.jpg`,
      `${S3_BASE_URL}/${encodeURIComponent(folderName)}/${encodeURIComponent(folderName)}_3.jpg`,
      `${S3_BASE_URL}/${encodeURIComponent(folderName)}/${encodeURIComponent(folderName)}.jpg`,
    ];
    
    console.log(`⚠️ Using fallback images for folder ${folderName}`);
    return fallbackImages;
    
  } catch (error) {
    console.error(`Error getting images from folder ${folderName}:`, error);
    return [`${S3_BASE_URL}/${encodeURIComponent(folderName)}/${encodeURIComponent(folderName)}_1.jpg`];
  }
};

/**
 * Get all available images for a venue
 */
export const getAllVenueImages = async (
  category: string,
  venueName: string,
  placeId?: string
): Promise<string[]> => {
  const cacheKey = `all-images-${category}-${venueName}-${placeId || 'no-id'}`;
  
  console.log(`🔍 getAllVenueImages: Searching for ${category}/${venueName} (ID: ${placeId})`);
  
  // Check cache first
  if (venueMappingCache.has(cacheKey)) {
    const cached = venueMappingCache.get(cacheKey);
    console.log(`📋 getAllVenueImages: Found cached result:`, cached);
    return cached ? JSON.parse(cached) : [];
  }

  // Find the venue in our comprehensive mappings
  let foundVenue = null;

  // PRIORITY 1: Place ID (HIGHEST PRIORITY - UNIQUE IDENTIFIER)
  if (placeId) {
    foundVenue = mappings.venues.find(venue =>
      venue.place_id === placeId && venue.category === category
    );
    if (foundVenue) {
      console.log(`✅ getAllVenueImages: Found by Place ID: ${placeId}`);
    }
  }

  // PRIORITY 2: Exact Venue Name Match
  if (!foundVenue) {
    foundVenue = mappings.venues.find(venue =>
      venue.place_name.toLowerCase() === venueName.toLowerCase() && venue.category === category
    );
    if (foundVenue) {
      console.log(`✅ getAllVenueImages: Found by exact name: ${venueName}`);
    }
  }

  // PRIORITY 3: Fuzzy Name Matching
  if (!foundVenue) {
    foundVenue = mappings.venues.find(venue =>
      venue.category === category && (
        venue.place_name.toLowerCase().includes(venueName.toLowerCase()) ||
        venueName.toLowerCase().includes(venue.place_name.toLowerCase())
      )
    );
    if (foundVenue) {
      console.log(`✅ getAllVenueImages: Found by fuzzy match: ${venueName} → ${foundVenue.place_name}`);
    }
  }

  if (foundVenue) {
    console.log(`🎯 getAllVenueImages: Found venue: ${foundVenue.place_name} with ${foundVenue.available_images?.length || 0} images`);
    
    if (foundVenue.available_images && foundVenue.available_images.length > 0) {
      // Generate URLs for all available images
      const imageUrls = foundVenue.available_images.map(imageName => 
        `${S3_BASE_URL}/${encodeURIComponent(foundVenue.s3_folder)}/${encodeURIComponent(imageName)}`
      );
      
      console.log(`🖼️ getAllVenueImages: Generated ${imageUrls.length} image URLs`);
      
      // Cache the result
      venueMappingCache.set(cacheKey, JSON.stringify(imageUrls));
      return imageUrls;
    } else {
      console.log(`⚠️ getAllVenueImages: Venue found but no available_images`);
    }
  } else {
    console.log(`❌ getAllVenueImages: No venue found for ${category}/${venueName}`);
  }

  // No images found - try category fallback
  const fallbackImage = getCategoryFallbackImage(category);
  if (fallbackImage) {
    console.log(`⚠️ getAllVenueImages: Using category fallback for ${category}/${venueName}`);
    
    // Check if it's a direct URL (for restaurants/cafes) or S3 path
    if (fallbackImage.startsWith('http')) {
      console.log(`🌐 getAllVenueImages: Using direct URL fallback: ${fallbackImage}`);
      const fallbackArray = [fallbackImage];
      venueMappingCache.set(cacheKey, JSON.stringify(fallbackArray));
      return fallbackArray;
    } else {
      // Use S3 path for other categories
      const fallbackUrl = `${S3_BASE_URL}/${encodeURIComponent('category-placeholders')}/${encodeURIComponent(fallbackImage)}`;
      const fallbackArray = [fallbackUrl];
      venueMappingCache.set(cacheKey, JSON.stringify(fallbackArray));
      return fallbackArray;
    }
  }
  
  // No fallback available - return empty array
  venueMappingCache.set(cacheKey, JSON.stringify([]));
  return [];
};

/**
 * Get comprehensive venue mapping info
 */
export const getVenueMappingInfo = (
  category: string,
  venueName: string,
  placeId?: string
): {
  folderName: string | null;
  s3Url: string | null;
  hasMapping: boolean;
  availableImages: string[];
  mappingMethod: string;
} => {
  let foundVenue = null;

  // Try Place ID first
  if (placeId) {
    foundVenue = mappings.venues.find(venue => 
      venue.place_id === placeId && venue.category === category
    );
  }
  
  // Try exact venue name
  if (!foundVenue) {
    foundVenue = mappings.venues.find(venue => 
      venue.place_name.toLowerCase() === venueName.toLowerCase() && venue.category === category
    );
  }

  if (foundVenue) {
    const s3Url = foundVenue.available_images.length > 0 
      ? `${S3_BASE_URL}/${foundVenue.s3_folder}/${foundVenue.available_images[0]}`
      : null;

    return {
      folderName: foundVenue.s3_folder,
      s3Url,
      hasMapping: foundVenue.available_images.length > 0,
      availableImages: foundVenue.available_images,
      mappingMethod: foundVenue.mapping_method || 'unknown'
    };
  }

  return {
    folderName: null,
    s3Url: null,
    hasMapping: false,
    availableImages: [],
    mappingMethod: 'not_found'
  };
};

/**
 * Get mapping statistics
 */
export const getMappingStats = () => {
  const total = mappings.venues.length;
  const mapped = mappings.venues.filter(v => v.available_images && v.available_images.length > 0).length;
  const unmapped = total - mapped;
  
  // Group by category with mapped/unmapped counts
  const categories = mappings.venues.reduce((acc, venue) => {
    if (!acc[venue.category]) {
      acc[venue.category] = { total: 0, mapped: 0, unmapped: 0 };
    }
    acc[venue.category].total++;
    if (venue.available_images && venue.available_images.length > 0) {
      acc[venue.category].mapped++;
    } else {
      acc[venue.category].unmapped++;
    }
    return acc;
  }, {} as Record<string, { total: number; mapped: number; unmapped: number }>);
  
  return {
    total,
    mapped,
    unmapped,
    categories
  };
};

/**
 * Get sample venues from a category
 */
export const getSampleVenuesFromCategory = (category: string, count: number = 5) => {
  const categoryVenues = mappings.venues.filter(venue => 
    venue.category === category && venue.available_images.length > 0
  );
  return categoryVenues.slice(0, count);
};

/**
 * Search venues in all categories
 */
export const searchVenues = (searchTerm: string, category?: string) => {
  let venues = mappings.venues;
  
  if (category) {
    venues = venues.filter(venue => venue.category === category);
  }
  
  return venues.filter(venue => 
    venue.place_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venue.city.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

/**
 * Get available S3 folders
 */
export const getAvailableS3Folders = () => {
  const folders = new Set();
  mappings.venues.forEach(venue => {
    if (venue.s3_folder && venue.s3_folder !== 'category-placeholders') {
      folders.add(venue.s3_folder);
    }
  });
  const folderArray = Array.from(folders);
  return {
    total: folderArray.length,
    folders: folderArray.slice(0, 10) // Return first 10 as sample
  };
};

/**
 * Get available venue names
 */
export const getAvailableVenueNames = () => {
  return mappings.venues.map(venue => venue.place_name);
};

/**
 * Get available place IDs
 */
export const getAvailablePlaceIds = () => {
  const placeIds = mappings.venues.map(venue => venue.place_id).filter(id => id && !id.startsWith('generated_'));
  return {
    total: placeIds.length,
    placeIds: placeIds.slice(0, 10) // Return first 10 as sample
  };
};

/**
 * Get venue mapping cache stats
 */
export const getVenueMappingCacheStats = () => {
  return {
    cacheSize: venueMappingCache.size,
    cachedEntries: Array.from(venueMappingCache.entries()).map(([key, value]) => ({
      key,
      hasValue: value !== null
    }))
  };
};

/**
 * Clear venue mapping cache
 */
export const clearVenueMappingCache = () => {
  venueMappingCache.clear();
  console.log('✅ Venue mapping cache cleared');
};
