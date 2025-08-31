// SmartVenueCarousel.tsx
import React, { useState, useEffect } from 'react';
import { SmartVenueImageV2 } from './SmartVenueImageV2';

interface SmartVenueCarouselProps {
  category: string;
  placeId?: string;
  placeName?: string;
  alt: string;
  className?: string;
  slideInterval?: number;
  showDots?: boolean;
}

export const SmartVenueCarousel: React.FC<SmartVenueCarouselProps> = ({
  category,
  placeId,
  placeName,
  alt,
  className = '',
  slideInterval = 5000,
  showDots = true
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [availableImages, setAvailableImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load all available images
  useEffect(() => {
    const loadImages = async () => {
      try {
        setLoading(true);
        // Use SmartVenueImageV2 to find the best available image
        const { findImageUrl } = await import('./SmartVenueImageV2');
        const primaryImage = await findImageUrl(category, placeId, placeName);
        setAvailableImages([primaryImage]);
      } catch (error) {
        console.error('Error loading images for carousel:', error);
        // Use category-specific fallback
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

  // Auto-slide
  useEffect(() => {
    if (availableImages.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % availableImages.length);
    }, slideInterval);

    return () => clearInterval(interval);
  }, [availableImages.length, slideInterval]);

  if (loading) {
    return <div className={`${className} bg-gray-200 animate-pulse flex items-center justify-center`}>Loading...</div>;
  }

  if (availableImages.length === 0) {
    return <div className={`${className} bg-gray-200 animate-pulse flex items-center justify-center`}>No images available</div>;
  }

  // If only one image, use SmartVenueImageV2 for better handling
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

  return (
    <div className="relative">
      <img
        src={availableImages[currentImageIndex]}
        alt={alt}
        className={className}
        loading="lazy"
        onError={(e) => {
          console.warn(`Failed to load carousel image: ${availableImages[currentImageIndex]}`);
          // Fallback to placeholder on error
          const target = e.target as HTMLImageElement;
          target.src = '/placeholder.svg';
        }}
      />
      
      {/* Dots indicator */}
      {showDots && availableImages.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {availableImages.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
