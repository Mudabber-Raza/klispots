import React, { useState, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import SmartVenueImageV2 from '@/utils/SmartVenueImageV2.tsx';
import comprehensiveMappings from '@/data/comprehensive-venue-mappings-bulletproof-restaurants.json';

const S3_BASE_URL = 'https://klispots-venue-images.s3.eu-north-1.amazonaws.com';

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

interface ComprehensiveVenueImageProps {
  category: string;
  placeId?: string;
  placeName?: string;
  alt: string;
  className?: string;
  fallback?: string;
  width?: number;
  height?: number;
  onLoad?: () => void;
  onError?: () => void;
  showSlider?: boolean;
  showDots?: boolean;
  showNavigation?: boolean;
}

// Find available images for a venue
const findAvailableImages = async (
  category: string,
  placeId?: string,
  placeName?: string
): Promise<string[]> => {
  const availableImages: string[] = [];
  
  try {
    // Check comprehensive mappings first
    if (mappings && mappings.venues) {
      let foundVenue = null;
      
      // Try to find venue by place ID
      if (placeId) {
        foundVenue = mappings.venues.find(venue => 
          venue.place_id === placeId && venue.category === category
        );
      }
      
      // Try to find venue by place name
      if (!foundVenue && placeName) {
        foundVenue = mappings.venues.find(venue => 
          venue.place_name.toLowerCase() === placeName.toLowerCase() && venue.category === category
        );
      }
      
      // If venue found, get all available images
      if (foundVenue && foundVenue.available_images && foundVenue.available_images.length > 0) {
        console.log(`Found venue: ${foundVenue.place_name} with ${foundVenue.available_images.length} images`);
        
        for (const imageName of foundVenue.available_images) {
          const imageUrl = `${S3_BASE_URL}/${encodeURIComponent('google_places_images1')}/${encodeURIComponent(foundVenue.s3_folder)}/${encodeURIComponent(imageName)}`;
          availableImages.push(imageUrl);
          console.log(`✅ Added image: ${imageUrl}`);
        }
      }
    }
    
    // If no images found in mappings, try generated paths
    if (availableImages.length === 0 && placeId && placeName) {
      console.log(`No images found in mappings, trying generated paths for ${placeName}`);
      const cleanName = placeName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
      const s3FolderName = `${cleanName}_${placeId}`;
      
      // Try different image numbers
      const imageNumbers = ['_1.jpg', '_2.jpg', '_3.jpg', '_4.jpg', '_5.jpg', '.jpg', '_hero.jpg'];
      
      for (const imageNumber of imageNumbers) {
        const fileName = `${s3FolderName}${imageNumber}`;
        const imageUrl = `${S3_BASE_URL}/${encodeURIComponent('google_places_images1')}/${encodeURIComponent(s3FolderName)}/${encodeURIComponent(fileName)}`;
        availableImages.push(imageUrl);
      }
    }
    
    console.log(`Total available images: ${availableImages.length}`);
    return availableImages;
  } catch (error) {
    console.error('Error finding available images:', error);
    return [];
  }
};

export const ComprehensiveVenueImage: React.FC<ComprehensiveVenueImageProps> = ({
  category,
  placeId,
  placeName,
  alt,
  className = '',
  fallback,
  width,
  height,
  onLoad,
  onError,
  showSlider = false,
  showDots = true,
  showNavigation = true
}) => {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      if (showSlider) {
        setLoading(true);
        console.log(`Loading images for ${category}, placeId: ${placeId}, placeName: ${placeName}`);
        const availableImages = await findAvailableImages(category, placeId, placeName);
        setImages(availableImages);
        setLoading(false);
      }
    };
    
    loadImages();
  }, [category, placeId, placeName, showSlider]);

  // If slider is enabled and we have multiple images, show carousel
  if (showSlider && images.length > 1) {
    return (
      <div className={`relative ${className}`}>
        {loading ? (
          <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="text-gray-500">Loading images...</div>
          </div>
        ) : (
          <>
            <Carousel className="w-full">
              <CarouselContent>
                {images.map((imageUrl, index) => (
                  <CarouselItem key={index}>
                    <div className="relative w-full h-full">
                      <img
                        src={imageUrl}
                        alt={`${alt} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = fallback || '/placeholder.svg';
                        }}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              {showNavigation && (
                <>
                  <CarouselPrevious className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white" />
                  <CarouselNext className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white" />
                </>
              )}
            </Carousel>
            
            {showDots && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
            
            <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>
    );
  }

  // Otherwise, use the single image component
  return (
    <SmartVenueImageV2
      category={category}
      placeId={placeId}
      placeName={placeName}
      alt={alt}
      className={className}
      fallback={fallback}
      width={width}
      height={height}
      onLoad={onLoad}
      onError={onError}
    />
  );
};

export default ComprehensiveVenueImage;