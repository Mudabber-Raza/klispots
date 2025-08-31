// Local Image Mapper - Maps category data to local images
// This replaces the S3-based system with a local folder-based approach

interface LocalImageMapping {
  [category: string]: {
    [venueName: string]: string[];
  };
}

// Cache for found local images
const localImageCache = new Map<string, string[]>();

// Base path for local images
const LOCAL_IMAGES_BASE = '/google_places_images1';

/**
 * Find local images for a venue using fuzzy name matching
 */
export const findLocalImages = async (
  category: string,
  venueName: string,
  maxResults: number = 3
): Promise<string[]> => {
  const cacheKey = `${category}-${venueName}`;
  
  // Check cache first
  if (localImageCache.has(cacheKey)) {
    return localImageCache.get(cacheKey) || [];
  }

  console.log(`🔍 LocalImageMapper: Searching for ${category}/${venueName}`);

  try {
    // Get all available image folders for this category
    const availableImages = await getAvailableImagesForCategory(category);
    
    // Find matching venues using fuzzy matching
    const matches = findFuzzyMatches(venueName, availableImages, maxResults);
    
    // Cache the results
    localImageCache.set(cacheKey, matches);
    
    console.log(`✅ LocalImageMapper: Found ${matches.length} images for ${venueName}`);
    return matches;
    
  } catch (error) {
    console.warn(`⚠️ LocalImageMapper: Error finding images for ${venueName}:`, error);
    return [];
  }
};

/**
 * Get all available images for a specific category
 */
const getAvailableImagesForCategory = async (category: string): Promise<string[]> => {
  // This would typically scan the local folder structure
  // For now, we'll use a predefined mapping based on your folder structure
  
  const categoryImageMap: { [key: string]: string[] } = {
    'shopping': [
      '14th_Street_Pizza_ChIJXR1VYOw-sz4Rao3SmJpzZnE',
      '1923_Coffee_Shop_ChIJaxWMQWAFGTkRnaX2CN3bJyY',
      '1969_Restaurant_ChIJXV_Db-O_3zgRumwPJFsWMog',
      '14th_Street_Pizza_Co._ChIJEXVP9n-_3zgR1ahso6NpYh8',
      '14th_Street_Pizza_Co._Johar_Town_8293'
    ],
    'restaurants': [
      '14th_Street_Pizza_ChIJXR1VYOw-sz4Rao3SmJpzZnE',
      '14th_Street_Pizza_Co._ChIJEXVP9n-_3zgR1ahso6NpYh8',
      '14th_Street_Pizza_Co._Johar_Town_8293',
      '1969_Restaurant_ChIJXV_Db-O_3zgRumwPJFsWMog',
      '1923_Coffee_Shop_ChIJaxWMQWAFGTkRnaX2CN3bJyY'
    ],
    'cafes': [
      '1923_Coffee_Shop_ChIJaxWMQWAFGTkRnaX2CN3bJyY',
      '14th_Street_Pizza_ChIJXR1VYOw-sz4Rao3SmJpzZnE',
      '14th_Street_Pizza_Co._ChIJEXVP9n-_3zgR1ahso6NpYh8',
      '14th_Street_Pizza_Co._Johar_Town_8293',
      '1969_Restaurant_ChIJXV_Db-O_3zgRumwPJFsWMog'
    ],
    'entertainment': [
      '14th_Street_Pizza_ChIJXR1VYOw-sz4Rao3SmJpzZnE',
      '1923_Coffee_Shop_ChIJaxWMQWAFGTkRnaX2CN3bJyY',
      '1969_Restaurant_ChIJXV_Db-O_3zgRumwPJFsWMog',
      '14th_Street_Pizza_Co._ChIJEXVP9n-_3zgR1ahso6NpYh8',
      '14th_Street_Pizza_Co._Johar_Town_8293'
    ],
    'arts-culture': [
      '14th_Street_Pizza_ChIJXR1VYOw-sz4Rao3SmJpzZnE',
      '1923_Coffee_Shop_ChIJaxWMQWAFGTkRnaX2CN3bJyY',
      '1969_Restaurant_ChIJXV_Db-O_3zgRumwPJFsWMog',
      '14th_Street_Pizza_Co._ChIJEXVP9n-_3zgR1ahso6NpYh8',
      '14th_Street_Pizza_Co._Johar_Town_8293'
    ],
    'health-wellness': [
      '14th_Street_Pizza_ChIJXR1VYOw-sz4Rao3SmJpzZnE',
      '1923_Coffee_Shop_ChIJaxWMQWAFGTkRnaX2CN3bJyY',
      '1969_Restaurant_ChIJXV_Db-O_3zgRumwPJFsWMog',
      '14th_Street_Pizza_Co._ChIJEXVP9n-_3zgR1ahso6NpYh8',
      '14th_Street_Pizza_Co._Johar_Town_8293'
    ],
    'sports-fitness': [
      '14th_Street_Pizza_ChIJXR1VYOw-sz4Rao3SmJpzZnE',
      '1923_Coffee_Shop_ChIJaxWMQWAFGTkRnaX2CN3bJyY',
      '1969_Restaurant_ChIJXV_Db-O_3zgRumwPJFsWMog',
      '14th_Street_Pizza_Co._ChIJEXVP9n-_3zgR1ahso6NpYh8',
      '14th_Street_Pizza_Co._Johar_Town_8293'
    ]
  };

  return categoryImageMap[category] || [];
};

/**
 * Find fuzzy matches between venue name and available images
 */
const findFuzzyMatches = (
  venueName: string, 
  availableImages: string[], 
  maxResults: number
): string[] => {
  if (!venueName || availableImages.length === 0) return [];

  const cleanVenueName = venueName.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Score each available image based on similarity
  const scoredMatches = availableImages.map(imageFolder => {
    const cleanImageName = imageFolder.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    let score = 0;
    
    // Exact match gets highest score
    if (cleanImageName === cleanVenueName) {
      score = 100;
    }
    // Contains the venue name
    else if (cleanImageName.includes(cleanVenueName)) {
      score = 80;
    }
    // Venue name contains the image name
    else if (cleanVenueName.includes(cleanImageName)) {
      score = 60;
    }
    // Partial word matches
    else {
      const venueWords = cleanVenueName.split(/(?=[A-Z])|_|-/);
      const imageWords = cleanImageName.split(/(?=[A-Z])|_|-/);
      
      for (const venueWord of venueWords) {
        for (const imageWord of imageWords) {
          if (venueWord.length > 2 && imageWord.length > 2) {
            if (venueWord.includes(imageWord) || imageWord.includes(venueWord)) {
              score += 20;
            }
          }
        }
      }
    }
    
    return { imageFolder, score };
  });

  // Sort by score and return top matches
  return scoredMatches
    .filter(match => match.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(match => `${LOCAL_IMAGES_BASE}/${match.imageFolder}`);
};

/**
 * Get a specific image from a venue folder
 */
export const getVenueImage = (
  venuePath: string, 
  imageNumber: number = 1
): string => {
  // Try different image extensions and numbers
  const extensions = ['_1.jpg', '_2.jpg', '_3.jpg', '.jpg', '_hero.jpg'];
  const imageName = extensions[imageNumber - 1] || extensions[0];
  
  return `${venuePath}/${imageName}`;
};

/**
 * Clear the image cache
 */
export const clearImageCache = (): void => {
  localImageCache.clear();
};

/**
 * Get cache statistics
 */
export const getCacheStats = (): { size: number; keys: string[] } => {
  return {
    size: localImageCache.size,
    keys: Array.from(localImageCache.keys())
  };
};
