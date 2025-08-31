import React, { useState, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { SmartVenueImageV2 } from '@/utils/SmartVenueImageV2';

interface VenueImageCarouselProps {
  category: string;
  placeId?: string;
  placeName?: string;
  alt: string;
  className?: string;
}

export const VenueImageCarousel: React.FC<VenueImageCarouselProps> = ({
  category,
  placeId,
  placeName,
  alt,
  className = ''
}) => {
  const [availableImages, setAvailableImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      try {
        setLoading(true);
        // Use SmartVenueImageV2 to find the best available image
        const { findImageUrl } = await import('@/utils/SmartVenueImageV2');
        const primaryImage = await findImageUrl(category, placeId, placeName);
        
        // For now, we'll use a single image approach but with proper fallback
        // In the future, this could be expanded to load multiple images per venue
        setAvailableImages([primaryImage]);
      } catch (error) {
        console.error('Error loading venue images:', error);
        // Use category-specific fallback instead of hardcoded path
        const fallbackImages = {
          'restaurants': '/placeholder.svg',
          'cafes': '/placeholder.svg',
          'arts-culture': '/placeholder.svg',
          'entertainment': '/placeholder.svg',
          'health-wellness': '/placeholder.svg',
          'shopping': '/placeholder.svg',
          'sports-fitness': '/placeholder.svg'
        };
        const fallbackImage = fallbackImages[category as keyof typeof fallbackImages] || '/placeholder.svg';
        setAvailableImages([fallbackImage]);
      } finally {
        setLoading(false);
      }
    };
    
    loadImages();
  }, [category, placeId, placeName]);

  if (loading) {
    return <div className={`${className} bg-gray-200 animate-pulse flex items-center justify-center`}>Loading...</div>;
  }

  if (availableImages.length === 0) {
    return <div className={`${className} bg-gray-200 animate-pulse flex items-center justify-center`}>No images available</div>;
  }

  // If only one image, show it without carousel
  if (availableImages.length === 1) {
    return (
      <SmartVenueImageV2
        category={category}
        placeId={placeId}
        placeName={placeName}
        alt={alt}
        className={className}
      />
    );
  }

  // Multiple images - use carousel
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {availableImages.map((imageSrc, index) => (
          <CarouselItem key={index}>
            <img
              src={imageSrc}
              alt={`${alt} - Image ${index + 1}`}
              className={className}
              loading="lazy"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      {availableImages.length > 1 && (
        <>
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70" />
        </>
      )}
    </Carousel>
  );
};