import React, { useState, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import SmartVenueImageV2 from '@/utils/SmartVenueImageV2.tsx';

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
  const [currentIndex, setCurrentIndex] = useState(0);

  // If slider is enabled, show a simple carousel with multiple SmartVenueImageV2 components
  if (showSlider) {
    // Create multiple image variations for the carousel
    const imageVariations = [
      { imageName: '_1.jpg' },
      { imageName: '_2.jpg' },
      { imageName: '_3.jpg' },
      { imageName: '_4.jpg' },
      { imageName: '_5.jpg' }
    ];

    return (
      <div className={`relative ${className}`}>
        <Carousel className="w-full">
          <CarouselContent>
            {imageVariations.map((variation, index) => (
              <CarouselItem key={index}>
                <div className="relative w-full h-full">
                  <SmartVenueImageV2
                    category={category}
                    placeId={placeId}
                    placeName={placeName}
                    imageName={variation.imageName}
                    alt={`${alt} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                    fallback={fallback}
                    width={width}
                    height={height}
                    onLoad={onLoad}
                    onError={onError}
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
            {imageVariations.map((_, index) => (
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
          {currentIndex + 1} / {imageVariations.length}
        </div>
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