// Accurate Venue Mapper - Maps exact venue names to exact S3 folder names
// This provides 1:1 mapping for precise image loading

interface VenueMapping {
  [venueName: string]: string; // venue name -> S3 folder name
}

interface CategoryVenueMappings {
  [category: string]: VenueMapping;
}

// Cache for found mappings
const venueMappingCache = new Map<string, string>();

// Base path for S3 images
const S3_BASE_URL = 'https://klispots-venue-images.s3.eu-north-1.amazonaws.com/google_places_images1';

/**
 * Get the exact S3 folder name for a venue
 */
export const getExactVenueImage = (
  category: string,
  venueName: string
): string | null => {
  const cacheKey = `${category}-${venueName}`;
  
  // Check cache first
  if (venueMappingCache.has(cacheKey)) {
    return venueMappingCache.get(cacheKey) || null;
  }

  // Get the mapping for this category
  const categoryMappings = getCategoryMappings(category);
  
  // Try exact match first
  if (categoryMappings[venueName]) {
    const s3Folder = categoryMappings[venueName];
    const imageUrl = `${S3_BASE_URL}/${s3Folder}/${s3Folder}_1.jpg`;
    venueMappingCache.set(cacheKey, imageUrl);
    return imageUrl;
  }

  // Try partial matches for common variations
  const partialMatch = findPartialMatch(venueName, Object.keys(categoryMappings));
  if (partialMatch) {
    const s3Folder = categoryMappings[partialMatch];
    const imageUrl = `${S3_BASE_URL}/${s3Folder}/${s3Folder}_1.jpg`;
    venueMappingCache.set(cacheKey, imageUrl);
    return imageUrl;
  }

  // No match found
  venueMappingCache.set(cacheKey, null);
  return null;
};

/**
 * Get all available images for a venue (multiple image numbers)
 */
export const getAllVenueImages = (
  category: string,
  venueName: string
): string[] => {
  const s3Folder = getExactVenueImage(category, venueName);
  if (!s3Folder) return [];

  // Extract the folder name from the full URL
  const folderName = s3Folder.split('/').slice(-2, -1)[0];
  
  // Return multiple image variations
  return [
    `${S3_BASE_URL}/${folderName}/${folderName}_1.jpg`,
    `${S3_BASE_URL}/${folderName}/${folderName}_2.jpg`,
    `${S3_BASE_URL}/${folderName}/${folderName}_3.jpg`,
    `${S3_BASE_URL}/${folderName}/${folderName}.jpg`,
    `${S3_BASE_URL}/${folderName}/${folderName}_hero.jpg`
  ];
};

/**
 * Find partial matches for venue names
 */
const findPartialMatch = (venueName: string, availableNames: string[]): string | null => {
  const cleanVenueName = venueName.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  for (const availableName of availableNames) {
    const cleanAvailableName = availableName.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Check if venue name contains the available name or vice versa
    if (cleanVenueName.includes(cleanAvailableName) || cleanAvailableName.includes(cleanVenueName)) {
      return availableName;
    }
    
    // Check for word-by-word matching
    const venueWords = cleanVenueName.split(/(?=[A-Z])|_|-/);
    const availableWords = cleanAvailableName.split(/(?=[A-Z])|_|-/);
    
    let matchScore = 0;
    for (const venueWord of venueWords) {
      for (const availableWord of availableWords) {
        if (venueWord.length > 2 && availableWord.length > 2) {
          if (venueWord === availableWord) {
            matchScore += 2;
          } else if (venueWord.includes(availableWord) || availableWord.includes(venueWord)) {
            matchScore += 1;
          }
        }
      }
    }
    
    if (matchScore >= 2) {
      return availableName;
    }
  }
  
  return null;
};

/**
 * Get category-specific venue mappings
 */
const getCategoryMappings = (category: string): VenueMapping => {
  const mappings: CategoryVenueMappings = {
    'shopping': {
      // Shopping Malls - Exact matches
      'Packages Mall': 'Packages_Mall_Lahore_ChIJW57Oe1cdGTkRVnPOWapf8D8',
      'Dolmen Mall Lahore': 'Dolmen_Mall_Lahore_Lahore_ChIJoX_4gMsJGTkRSJuRZSi0bLc',
      'Dolmen Mall - Clifton': 'Dolmen_Mall_-_Clifton_Karachi_ChIJb1gSnAk9sz4R9zKPSWSPRo8',
      'Centaurus Mall': 'Centaurus_Mall_Islamabad_ChIJeXP39LC_3zgRAm31UYYLxfg',
      'Centaurus Mall Garden': 'Centaurus_Mall_Garden_Islamabad_ChIJQ6O0GpW_3zgR66sTqi8Q-2k',
      'Gulberg Galleria': 'Gulberg_Galleria_Lahore_ChIJtRURlDQbGTkRQNFQ9aCui_g',
      'Giga Mall': 'Giga_Mall_Lahore_ChIJW57Oe1cdGTkRVnPOWapf8D8',
      'LuckyOne Mall': 'LuckyOne_Mall_Karachi_ChIJb1gSnAk9sz4R9zKPSWSPRo8',
      
      // Shopping Centers and Markets
      'Carrefour - Packages Mall': 'Carrefour_-_Packages_Mall_Lahore_ChIJsfKBA9UDGTkRpsbP5eoN1-8',
      'Al Fatah Exclusive Mall - Hussain Chowk': 'Al_Fatah_Exclusive_Mall_Hussain_Chowk_ChIJW57Oe1cdGTkRVnPOWapf8D8',
      
      // Food Courts and Restaurants in Malls
      'Arcadian Café - Packages Mall': 'Arcadian_CafÃ©_-_Packages_Mall_11169',
      'Broadway Pizza - Dolmen Mall Clifton': 'Broadway_Pizza_-_Dolmen_Mall_Clifton_3950',
      'Broadway Pizza - Dolmen Mall Hyderi': 'Broadway_Pizza_-_Dolmen_Mall_Hyderi_9928',
      'Broadway Pizza - LuckyOne Mall': 'Broadway_Pizza_-_LuckyOne_Mall_3929',
      'Bundu Khan Restaurant - Packages Mall': 'Bundu_Khan_Restaurant_-_Packages_Mall_8977',
      'California Pizza - The Centaurus Mall': 'California_Pizza_-_The_Centaurus_Mall_7421',
      'Espresso Dolmen Mall Clifton': 'Espresso_Dolmen_Mall_Clifton_3992',
      'Food Courts - Packages Mall': 'Food_Courts_-_Packages_Mall_10980',
      'Fun City - The Centaurus Mall Islamabad': 'Fun_City___The_Centaurus_Mall_Islamabad'
    },
    
    'restaurants': {
      // Restaurants - Exact matches
      'Bundu Khan Restaurant': 'Bundu_Khan_Restaurant_8977',
      'California Pizza': 'California_Pizza_7421',
      'Broadway Pizza': 'Broadway_Pizza_3950',
      'Arcadian Café': 'Arcadian_CafÃ©_11169',
      'Espresso': 'Espresso_3992',
      
      // Restaurant chains in malls
      'Bundu Khan Restaurant - Packages Mall': 'Bundu_Khan_Restaurant_-_Packages_Mall_8977',
      'California Pizza - The Centaurus Mall': 'California_Pizza_-_The_Centaurus_Mall_7421',
      'Broadway Pizza - Dolmen Mall Clifton': 'Broadway_Pizza_-_Dolmen_Mall_Clifton_3950',
      'Broadway Pizza - Dolmen Mall Hyderi': 'Broadway_Pizza_-_Dolmen_Mall_Hyderi_9928',
      'Broadway Pizza - LuckyOne Mall': 'Broadway_Pizza_-_LuckyOne_Mall_3929',
      'Espresso Dolmen Mall Clifton': 'Espresso_Dolmen_Mall_Clifton_3992'
    },
    
    'cafes': {
      // Cafes - Exact matches
      'Arcadian Café': 'Arcadian_CafÃ©_11169',
      'Espresso': 'Espresso_3992',
      'Cafe Beirut': 'Cafe_Beirut_Gulberg_ChIJnbNX5PcEGTkRMmXN3i-424c',
      'Artisan Coffee': 'Artisan_Coffee_Gulberg_ChIJY7GsCz8FGTkRcU5c_M7I2Jc',
      
      // Cafe locations
      'Arcadian Café - Packages Mall': 'Arcadian_CafÃ©_-_Packages_Mall_11169',
      'Espresso Dolmen Mall Clifton': 'Espresso_Dolmen_Mall_Clifton_3992',
      'Cafe Beirut Gulberg': 'Cafe_Beirut_Gulberg_ChIJnbNX5PcEGTkRMmXN3i-424c',
      'Artisan Coffee Gulberg': 'Artisan_Coffee_Gulberg_ChIJY7GsCz8FGTkRcU5c_M7I2Jc'
    },
    
    'entertainment': {
      // Entertainment venues
      'Fun City - The Centaurus Mall Islamabad': 'Fun_City___The_Centaurus_Mall_Islamabad',
      'Food Courts - Packages Mall': 'Food_Courts_-_Packages_Mall_10980',
      
      // Entertainment in malls
      'Fun City': 'Fun_City___The_Centaurus_Mall_Islamabad',
      'Food Courts': 'Food_Courts_-_Packages_Mall_10980'
    },
    
    'arts-culture': {
      // Art galleries and cultural venues
      'Artisan Coffee': 'Artisan_Coffee_Gulberg_ChIJY7GsCz8FGTkRcU5c_M7I2Jc',
      'Cafe Beirut': 'Cafe_Beirut_Gulberg_ChIJnbNX5PcEGTkRMmXN3i-424c'
    },
    
    'health-wellness': {
      // Health and wellness venues
      'Espresso': 'Espresso_3992',
      'Artisan Coffee': 'Artisan_Coffee_Gulberg_ChIJY7GsCz8FGTkRcU5c_M7I2Jc'
    },
    
    'sports-fitness': {
      // Sports and fitness venues
      'Fun City': 'Fun_City___The_Centaurus_Mall_Islamabad',
      'Food Courts': 'Food_Courts_-_Packages_Mall_10980'
    }
  };

  return mappings[category] || {};
};

/**
 * Clear the mapping cache
 */
export const clearVenueMappingCache = (): void => {
  venueMappingCache.clear();
};

/**
 * Get cache statistics
 */
export const getVenueMappingCacheStats = (): { size: number; keys: string[] } => {
  return {
    size: venueMappingCache.size,
    keys: Array.from(venueMappingCache.keys())
  };
};

/**
 * Get all available venue names for a category
 */
export const getAvailableVenueNames = (category: string): string[] => {
  const mappings = getCategoryMappings(category);
  return Object.keys(mappings);
};

/**
 * Get all available S3 folder names for a category
 */
export const getAvailableS3Folders = (category: string): string[] => {
  const mappings = getCategoryMappings(category);
  return Object.values(mappings);
};





