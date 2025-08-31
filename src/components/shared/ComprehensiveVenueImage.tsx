import React, { useState, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
// import { getComprehensiveVenueImage, getAllVenueImages } from '@/utils/ComprehensiveVenueMapper';

interface ComprehensiveVenueImageProps {
  category: string;
  placeId?: string;
  placeName?: string;
  alt: string;
  className?: string;
  fallback?: string;
  showSlider?: boolean;
  slideInterval?: number;
  showDots?: boolean;
  showNavigation?: boolean;
}

export const ComprehensiveVenueImage: React.FC<ComprehensiveVenueImageProps> = ({
  category,
  placeId,
  placeName,
  alt,
  className = '',
  fallback = '/placeholder.svg',
  showSlider = true,
  slideInterval = 5000,
  showDots = true,
  showNavigation = true
}) => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadImages = async () => {
      try {
        setLoading(true);
        setError(false);

        console.log(`🔍 ComprehensiveVenueImage: Loading images for ${category}/${placeName} (ID: ${placeId})`);

        // Simple fallback approach for images
        const allImages = [`/lovable-uploads/${placeName?.replace(/\s+/g, '_')}.jpg`];
        console.log(`📸 ComprehensiveVenueImage: Using fallback image:`, allImages);
        
        if (allImages && allImages.length > 0) {
          setImages(allImages);
          console.log(`✅ ComprehensiveVenueImage: Set ${allImages.length} images for ${placeName}`);
        } else {
          // Fallback to single image if no multiple images found
          console.log(`🔄 ComprehensiveVenueImage: No multiple images, trying single image...`);
          const primaryImage = `/lovable-uploads/${placeName?.replace(/\s+/g, '_')}.jpg`;
          console.log(`🖼️ ComprehensiveVenueImage: Primary image:`, primaryImage);
          if (primaryImage) {
            setImages([primaryImage]);
            console.log(`✅ ComprehensiveVenueImage: Set single image for ${placeName}`);
          } else {
            console.log(`⚠️ ComprehensiveVenueImage: No images found, using fallback`);
            setImages([fallback]);
          }
        }
      } catch (error) {
        console.error('❌ ComprehensiveVenueImage: Error loading venue images:', error);
        setError(true);
        setImages([fallback]);
      } finally {
        setLoading(false);
      }
    };

    if (placeName || placeId) {
      console.log(`🚀 ComprehensiveVenueImage: Starting image load for ${placeName || placeId}`);
      loadImages();
    } else {
      console.log(`⚠️ ComprehensiveVenueImage: No placeName or placeId provided`);
      setImages([fallback]);
      setLoading(false);
    }
  }, [category, placeId, placeName, fallback]);

  if (loading) {
    console.log(`⏳ ComprehensiveVenueImage: Showing loading state for ${placeName}`);
    return (
      <div className={`${className} bg-gray-200 animate-pulse flex items-center justify-center`}>
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error || images.length === 0) {
    console.log(`❌ ComprehensiveVenueImage: Showing error/fallback for ${placeName}, images:`, images);
    return (
      <img
        src={fallback}
        alt={alt}
        className={className}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = '/placeholder.svg';
        }}
      />
    );
  }

  // Single image - no slider needed
  if (images.length === 1 || !showSlider) {
    return (
      <div className="relative smart-image-container">
        <img
          src={images[0]}
          alt={alt}
          className={`${className} listing-card-image`}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = fallback;
          }}
          onLoad={(e) => {
            // Smart ratio detection
            const img = e.target as HTMLImageElement;
            const ratio = img.naturalWidth / img.naturalHeight;
            if (ratio > 1.2) {
              img.setAttribute('data-ratio', 'landscape');
            } else if (ratio < 0.8) {
              img.setAttribute('data-ratio', 'portrait');
            } else {
              img.setAttribute('data-ratio', 'square');
            }
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            maxWidth: '100%',
            maxHeight: '100%',
            imageRendering: 'auto'
          }}
        />

      </div>
    );
  }

  // Multiple images - show slider
  if (images.length > 1 && showSlider) {
    return (
      <div className="relative w-full h-full smart-image-container">
        <Carousel className="w-full h-full" opts={{ loop: true }}>
          <CarouselContent className="h-full">
            {images.map((imageSrc, index) => (
              <CarouselItem key={index} className="h-full">
                <img
                  src={imageSrc}
                  alt={`${alt} - Image ${index + 1}`}
                  className={`${className} detail-page-image`}
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = fallback;
                  }}
                  onLoad={(e) => {
                    // Smart ratio detection for slider images
                    const img = e.target as HTMLImageElement;
                    const ratio = img.naturalWidth / img.naturalHeight;
                    if (ratio > 1.2) {
                      img.setAttribute('data-ratio', 'landscape');
                    } else if (ratio < 0.8) {
                      img.setAttribute('data-ratio', 'portrait');
                    } else {
                      img.setAttribute('data-ratio', 'square');
                    }
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'fill',
                    opacity: '0.9',
                    imageRendering: 'auto'
                  }}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {showNavigation && images.length > 1 && (
            <>
              <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 z-10" />
              <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 z-10" />
            </>
          )}
          
          {showDots && images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
              {images.map((_, index) => (
                <div
                  key={index}
                  className="w-2 h-2 rounded-full bg-white/50 cursor-pointer hover:bg-white"
                />
              ))}
            </div>
          )}
        </Carousel>
      </div>
    );
  }

  // Fallback to single image display
  return (
    <img
      src={images[0]}
      alt={alt}
      className={className}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = fallback;
      }}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        maxWidth: '100%',
        maxHeight: '100%',
        imageRendering: 'auto'
      }}
    />
  );
};

export default ComprehensiveVenueImage;
