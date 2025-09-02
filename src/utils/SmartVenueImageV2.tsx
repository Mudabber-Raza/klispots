import React, { useState, useEffect } from 'react';
import comprehensiveMappings from '@/data/comprehensive-venue-mappings-bulletproof-restaurants.json';

// Type definition for comprehensive mappings
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

const S3_BASE_URL = 'https://klispots-venue-images.s3.eu-north-1.amazonaws.com';

// Fallback images for different categories
const RESTAURANT_FALLBACK_IMAGE = 'https://th.bing.com/th/id/R.e5e24c0619512148b49064c4a0f7ec43?rik=KOKrCSELBkyRCw&riu=http%3a%2f%2fimages.unsplash.com%2fphoto-1582920980795-2f97b0834c58%3fcrop%3dentropy%26cs%3dtinysrgb%26fit%3dmax%26fm%3djpg%26ixid%3dMnwxMjA3fDB8MXxzZWFyY2h8M3x8cmVzdGF1cmFudHN8fDB8fHx8MTYxOTMxMDYxNA%26ixlib%3drb-1.2.1%26q%3d80%26w%3d1080&ehk=tjXn4HLoD22SD8pX8hAxRWKRnjuUiIh1Vud22FKgbHQ%3d&risl=&pid=ImgRaw&r=0';
const CAFE_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';

// Cache for found mappings
const foundMappings = new Map<string, string | null>();

interface SmartVenueImageProps {
  category: string;
  placeId?: string;
  placeName?: string;
  imageName?: string;
  alt: string;
  className?: string;
  fallback?: string;
  width?: number;
  height?: number;
  onLoad?: () => void;
  onError?: () => void;
}

// Check if image exists with optimized timeout
const imageExists = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      console.log(`✅ Image loaded successfully: ${url}`);
      resolve(true);
    };
    
    img.onerror = (error) => {
      console.warn(`❌ Image failed to load: ${url}`, error);
      resolve(false);
    };
    
    // Add crossOrigin attribute to help with CORS
    img.crossOrigin = 'anonymous';
    
    img.src = url;
    // Optimized timeout for S3 images
    setTimeout(() => {
      console.warn(`⏰ Image load timeout: ${url}`);
      resolve(false);
    }, 2000);
  });
};

// Test S3 connectivity
export const testS3Connectivity = async (): Promise<{ connected: boolean; error?: string }> => {
  try {
    // Test 1: Basic connectivity
    const testUrl = `${S3_BASE_URL}/test-connection.txt`;
    console.log(`🔍 Testing S3 connectivity to: ${testUrl}`);
    
    try {
      const response = await fetch(testUrl, { 
        method: 'HEAD',
        mode: 'no-cors'
      });
      console.log('✅ Basic S3 connectivity test completed');
    } catch (error) {
      console.warn('⚠️ Basic connectivity test failed, trying alternative method');
    }

    // Test 2: Try to access a known image path from comprehensive mappings
    if (comprehensiveMappings && comprehensiveMappings.venues) {
      const firstVenue = comprehensiveMappings.venues[0];
      if (firstVenue) {
        const s3FolderName = firstVenue.s3_folder;
        const testImageUrl = `${S3_BASE_URL}/${encodeURIComponent('google_places_images1')}/${encodeURIComponent(s3FolderName)}/${encodeURIComponent(s3FolderName)}_1.jpg`;
        console.log(`🔍 Testing actual image access: ${testImageUrl}`);
        
        try {
          const img = new Image();
          const imageExists = await new Promise<boolean>((resolve) => {
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = testImageUrl;
            setTimeout(() => resolve(false), 3000);
          });
          
          if (imageExists) {
            console.log('✅ S3 image access test successful');
            return { connected: true };
          } else {
            console.log('⚠️ S3 image access test failed - image not found');
            return { connected: false, error: 'Image not found in S3 bucket' };
          }
        } catch (error) {
          console.log('⚠️ S3 image access test failed - access error');
          return { connected: false, error: 'Access denied to S3 bucket' };
        }
      }
    }
    
    return { connected: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ S3 connectivity test failed:', errorMessage);
    return { connected: false, error: errorMessage };
  }
};

// Test CORS configuration specifically
export const testCORSAccess = async (): Promise<{ corsWorking: boolean; error?: string }> => {
  try {
    // Test with a known working image URL
    const testImageUrl = 'https://klispots-venue-images.s3.eu-north-1.amazonaws.com/google_places_images1/Dolmen_Mall_-_Clifton_Karachi_ChIJb1gSnAk9sz4R9zKPSWSPRo8/Dolmen_Mall_-_Clifton_Karachi_ChIJb1gSnAk9sz4R9zKPSWSPRo8_1.jpg';
    
    console.log(`🔍 Testing CORS access to: ${testImageUrl}`);
    
    // Test 1: Fetch with CORS mode
    try {
      const response = await fetch(testImageUrl, { 
        method: 'HEAD',
        mode: 'cors'
      });
      console.log('✅ CORS fetch test successful');
    } catch (fetchError) {
      console.log('⚠️ CORS fetch test failed, trying image load test');
    }

    // Test 2: Image load test
    try {
      const img = new Image();
      const imageLoads = await new Promise<boolean>((resolve) => {
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.crossOrigin = 'anonymous';
        img.src = testImageUrl;
        setTimeout(() => resolve(false), 5000);
      });
      
      if (imageLoads) {
        console.log('✅ CORS test successful - image loading working');
        return { corsWorking: true };
      } else {
        console.log('⚠️ CORS test failed - image not loading');
        return { corsWorking: false, error: 'Image not loading' };
      }
    } catch (imgError) {
      console.log('⚠️ CORS test failed - image error:', imgError);
      return { corsWorking: false, error: 'Image loading failed' };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ CORS test failed:', errorMessage);
    return { corsWorking: false, error: errorMessage };
  }
};

// Find image URL from S3 bucket
const findImageUrl = async (
  category: string, 
  placeId?: string, 
  placeName?: string, 
  imageName: string = 'hero.jpg',
  customFallback?: string
): Promise<string> => {
  const cacheKey = `${category}-${placeId}-${placeName}`;
  
  if (foundMappings.has(cacheKey)) {
    const result = foundMappings.get(cacheKey);
    if (result) return result;
    // Use category-specific fallback
    if (category === 'restaurants' || category === 'restaurant') {
      return customFallback || RESTAURANT_FALLBACK_IMAGE;
    } else if (category === 'cafes' || category === 'cafe') {
      return customFallback || CAFE_FALLBACK_IMAGE;
    }
    return customFallback || '/placeholder.svg';
  }

  console.log(`🔍 SmartVenueImageV2: Searching for ${category}/${placeName} (${placeId})`);

  // Check if mappings is properly loaded
  if (!mappings || !mappings.venues) {
    console.warn('⚠️ mappings not properly loaded, using fallback');
    foundMappings.set(cacheKey, null);
    // Use category-specific fallback
    if (category === 'restaurants' || category === 'restaurant') {
      return customFallback || RESTAURANT_FALLBACK_IMAGE;
    } else if (category === 'cafes' || category === 'cafe') {
      return customFallback || CAFE_FALLBACK_IMAGE;
    }
    return customFallback || '/placeholder.svg';
  }

  // PRIORITY 1: Exact Place ID match from comprehensive mappings
  if (placeId) {
    const foundVenue = mappings.venues.find(venue => 
      venue.place_id === placeId && venue.category === category
    );
    
    if (foundVenue && foundVenue.available_images && foundVenue.available_images.length > 0) {
      const imageUrl = `${S3_BASE_URL}/${encodeURIComponent('google_places_images1')}/${encodeURIComponent(foundVenue.s3_folder)}/${encodeURIComponent(foundVenue.available_images[0])}`;
      console.log(`✅ FOUND IMAGE via Place ID: ${imageUrl}`);
      foundMappings.set(cacheKey, imageUrl);
      return imageUrl;
    }
  }

  // PRIORITY 2: Exact Place Name match from comprehensive mappings
  if (placeName) {
    const foundVenue = mappings.venues.find(venue => 
      venue.place_name.toLowerCase() === placeName.toLowerCase() && venue.category === category
    );
    
    if (foundVenue && foundVenue.available_images && foundVenue.available_images.length > 0) {
      const imageUrl = `${S3_BASE_URL}/${encodeURIComponent('google_places_images1')}/${encodeURIComponent(foundVenue.s3_folder)}/${encodeURIComponent(foundVenue.available_images[0])}`;
      console.log(`✅ FOUND IMAGE via Place Name: ${imageUrl}`);
      foundMappings.set(cacheKey, imageUrl);
      return imageUrl;
    }
  }

  // PRIORITY 3: Fuzzy Place Name match from comprehensive mappings
  if (placeName) {
    const foundVenue = mappings.venues.find(venue => 
      venue.category === category && (
        venue.place_name.toLowerCase().includes(placeName.toLowerCase()) ||
        placeName.toLowerCase().includes(venue.place_name.toLowerCase())
      )
    );
    
    if (foundVenue && foundVenue.available_images && foundVenue.available_images.length > 0) {
      const imageUrl = `${S3_BASE_URL}/${encodeURIComponent('google_places_images1')}/${encodeURIComponent(foundVenue.s3_folder)}/${encodeURIComponent(foundVenue.available_images[0])}`;
      console.log(`✅ FOUND IMAGE via fuzzy match: ${imageUrl}`);
      foundMappings.set(cacheKey, imageUrl);
      return imageUrl;
    }
  }

  // PRIORITY 4: Generate S3 path based on naming convention (UPDATED to match actual S3 structure)
  if (placeId && placeName) {
    // Use the correct folder name without spaces
    const baseFolder = 'google_places_images1';
    
    // Create folder name that matches the actual S3 structure
    // Format: Dolmen_Mall_-_Clifton_Karachi_ChIJb1gSnAk9sz4R9zKPSWSPRo8
    const cleanName = placeName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
    const s3FolderName = `${cleanName}_${placeId}`;
    
    // Try different image numbers
    const imageNumbers = ['_1.jpg', '_2.jpg', '_3.jpg', '.jpg', '_hero.jpg'];
    
    for (const imageNumber of imageNumbers) {
      const fileName = `${s3FolderName}${imageNumber}`;
      // Ensure proper URL encoding for spaces and special characters
      const fullUrl = `${S3_BASE_URL}/${encodeURIComponent(baseFolder)}/${encodeURIComponent(s3FolderName)}/${encodeURIComponent(fileName)}`;
      
      console.log(`🎯 Trying generated path: ${fullUrl}`);
      
      try {
        if (await imageExists(fullUrl)) {
          console.log(`✅ FOUND IMAGE via generated path: ${fullUrl}`);
          foundMappings.set(cacheKey, fullUrl);
          return fullUrl;
        }
      } catch (error) {
        console.warn(`⚠️ Error checking image: ${fullUrl}`, error);
      }
    }
  }

  console.log(`❌ No S3 image found for ${category}/${placeName} (${placeId})`);
  foundMappings.set(cacheKey, null);
  // Use category-specific fallback
  if (category === 'restaurants' || category === 'restaurant') {
    return customFallback || RESTAURANT_FALLBACK_IMAGE;
  } else if (category === 'cafes' || category === 'cafe') {
    return customFallback || CAFE_FALLBACK_IMAGE;
  }
  return customFallback || '/placeholder.svg';
};

export const SmartVenueImageV2: React.FC<SmartVenueImageProps> = ({ 
  category, 
  placeId, 
  placeName, 
  imageName = 'hero.jpg',
  alt, 
  className = '', 
  fallback,
  width,
  height,
  onLoad,
  onError
}) => {
  const [imageSrc, setImageSrc] = useState<string>(() => {
    // Use category-specific fallback
    if ((category === 'restaurants' || category === 'restaurant') && !fallback) {
      return RESTAURANT_FALLBACK_IMAGE;
    } else if ((category === 'cafes' || category === 'cafe') && !fallback) {
      return CAFE_FALLBACK_IMAGE;
    }
    return fallback || '/placeholder.svg';
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      try {
        setLoading(true);
        const imageUrl = await findImageUrl(category, placeId, placeName, imageName, fallback);
        setImageSrc(imageUrl);
      } catch (error) {
        console.error('Error loading S3 image:', error);
        // Use category-specific fallback
        if (category === 'restaurants' || category === 'restaurant') {
          setImageSrc(fallback || RESTAURANT_FALLBACK_IMAGE);
        } else if (category === 'cafes' || category === 'cafe') {
          setImageSrc(fallback || CAFE_FALLBACK_IMAGE);
        } else {
          setImageSrc(fallback || '/placeholder.svg');
        }
      } finally {
        setLoading(false);
      }
    };

    loadImage();
  }, [category, placeId, placeName, imageName, fallback]);

  const handleImageLoad = () => {
    onLoad?.();
  };

  const handleImageError = () => {
    console.warn(`Failed to load S3 image for ${category}/${placeName}`);
    // Use category-specific fallback
    let fallbackImage;
    if (category === 'restaurants' || category === 'restaurant') {
      fallbackImage = fallback || RESTAURANT_FALLBACK_IMAGE;
    } else if (category === 'cafes' || category === 'cafe') {
      fallbackImage = fallback || CAFE_FALLBACK_IMAGE;
    } else {
      fallbackImage = fallback || '/placeholder.svg';
    }
    setImageSrc(fallbackImage);
    onError?.();
  };

  if (loading) {
    return (
      <div className={`${className} bg-gray-200 animate-pulse flex items-center justify-center`}>
        <div className="text-gray-500 text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      onLoad={handleImageLoad}
      onError={handleImageError}
    />
  );
};

export default SmartVenueImageV2;