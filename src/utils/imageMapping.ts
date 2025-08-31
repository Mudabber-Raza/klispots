// Simple image mapping for venues
export const venueImageMapping: Record<string, string> = {
  // Restaurants
  'Istanbul': '/lovable-uploads/29ed049d-e94f-4e00-8516-8a363566e3ff.png',
  'The Basil Leaf': '/lovable-uploads/The_Basil_Leaf_ChIJl3IsuNQFGTkR4EhEnVaxMv0_3.jpg',
  
  // Cafes
  'SENZO': '/lovable-uploads/29ed049d-e94f-4e00-8516-8a363566e3ff.png',
  'Corti Cafe': '/lovable-uploads/Corti_Cafe_ChIJN3eKLwA_sz4R-rP79g-_PcY_1.jpg',
  'Havana Terraces': '/lovable-uploads/Havana_Terraces_ChIJiScdKsG93zgRibz8gP_ohZM_2.jpg',
  
  // Shopping
  'DOLMEN MALL - Clifton': '/lovable-uploads/29ed049d-e94f-4e00-8516-8a363566e3ff.png',
  
  // Arts & Culture
  'The Haveli: A Museum of Textiles': '/lovable-uploads/29ed049d-e94f-4e00-8516-8a363566e3ff.png',
  
  // Entertainment
  'Arts Council of Pakistan Karachi': '/lovable-uploads/29ed049d-e94f-4e00-8516-8a363566e3ff.png',
  
  // Sports & Fitness
  'Club Vibora': '/lovable-uploads/29ed049d-e94f-4e00-8516-8a363566e3ff.png',
  
  // Cities
  'Karachi': '/lovable-uploads/Karachi.jpg',
  'Lahore': '/lovable-uploads/Lahore.jpg',
  'Islamabad': '/lovable-uploads/Islamabad.webp',
};

export const getVenueImage = (venueName: string, category?: string): string => {
  // Try exact match first
  if (venueImageMapping[venueName]) {
    return venueImageMapping[venueName];
  }
  
  // Try partial match
  const partialMatch = Object.keys(venueImageMapping).find(key => 
    venueName.toLowerCase().includes(key.toLowerCase()) || 
    key.toLowerCase().includes(venueName.toLowerCase())
  );
  
  if (partialMatch) {
    return venueImageMapping[partialMatch];
  }
  
  // Fallback to default image
  return '/lovable-uploads/29ed049d-e94f-4e00-8516-8a363566e3ff.png';
};

export const getAllVenueImages = (venueName: string, category?: string): string[] => {
  const primaryImage = getVenueImage(venueName, category);
  return [primaryImage];
};
