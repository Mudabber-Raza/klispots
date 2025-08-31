// S3 Image mapping system for venues
const S3_BASE_URL = 'https://s3.eu-north-1.amazonaws.com/klispots-images';

// Venue to S3 mapping with place IDs
export const venueS3Mapping: Record<string, { category: string; placeId: string }> = {
  // Restaurants
  'Istanbul': { category: 'restaurants', placeId: '1862' },
  'The Basil Leaf': { category: 'restaurants', placeId: '1862' },
  
  // Cafes
  'SENZO': { category: 'cafes', placeId: '182' },
  'Corti Cafe': { category: 'cafes', placeId: '182' },
  'Havana Terraces': { category: 'cafes', placeId: '182' },
  
  // Shopping
  'DOLMEN MALL - Clifton': { category: 'shopping', placeId: '10' },
  
  // Arts & Culture
  'The Haveli: A Museum of Textiles': { category: 'arts-culture', placeId: '34' },
  
  // Entertainment
  'Arts Council of Pakistan Karachi': { category: 'entertainment', placeId: '15' },
  
  // Sports & Fitness
  'Club Vibora': { category: 'sports-fitness', placeId: '10' },
  
  // Cities (use local images for cities)
  'Karachi': { category: 'cities', placeId: 'karachi' },
  'Lahore': { category: 'cities', placeId: 'lahore' },
  'Islamabad': { category: 'cities', placeId: 'islamabad' },
};

export const getVenueImage = (venueName: string, category?: string, placeId?: string): string => {
  // If we have a direct S3 mapping, use it
  if (venueS3Mapping[venueName]) {
    const mapping = venueS3Mapping[venueName];
    
    // Cities use local images
    if (mapping.category === 'cities') {
      return `/lovable-uploads/${mapping.placeId}.jpg`;
    }
    
    // Other venues use S3
    return `${S3_BASE_URL}/${mapping.category}/${mapping.placeId}.jpg`;
  }
  
  // If we have category and placeId, construct S3 URL
  if (category && placeId && category !== 'cities') {
    return `${S3_BASE_URL}/${category}/${placeId}.jpg`;
  }
  
  // Try partial match for venue name
  const partialMatch = Object.keys(venueS3Mapping).find(key => 
    venueName.toLowerCase().includes(key.toLowerCase()) || 
    key.toLowerCase().includes(venueName.toLowerCase())
  );
  
  if (partialMatch) {
    const mapping = venueS3Mapping[partialMatch];
    if (mapping.category === 'cities') {
      return `/lovable-uploads/${mapping.placeId}.jpg`;
    }
    return `${S3_BASE_URL}/${mapping.category}/${mapping.placeId}.jpg`;
  }
  
  // Fallback to local default image
  return '/lovable-uploads/29ed049d-e94f-4e00-8516-8a363566e3ff.png';
};

export const getAllVenueImages = (venueName: string, category?: string, placeId?: string): string[] => {
  const primaryImage = getVenueImage(venueName, category, placeId);
  return [primaryImage];
};
