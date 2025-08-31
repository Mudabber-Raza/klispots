import React, { useState, useEffect } from 'react';
import { getExactVenueImage, getAllVenueImages } from '@/utils/AccurateVenueMapper';

interface AccurateVenueImageProps {
  category: string;
  venueName: string;
  alt: string;
  className?: string;
  fallback?: string;
  width?: number;
  height?: number;
  onLoad?: () => void;
  onError?: () => void;
  imageIndex?: number; // Which image to show (1, 2, 3, etc.)
  useS3?: boolean; // Whether to use S3 or local images
}

export const AccurateVenueImage: React.FC<AccurateVenueImageProps> = ({ 
  category, 
  venueName, 
  alt, 
  className = '', 
  fallback = '/placeholder.svg',
  width,
  height,
  onLoad,
  onError,
  imageIndex = 1,
  useS3 = true
}) => {
  const [imageSrc, setImageSrc] = useState<string>(fallback);
  const [loading, setLoading] = useState(true);
  const [availableImages, setAvailableImages] = useState<string[]>([]);

  useEffect(() => {
    const loadAccurateImage = async () => {
      try {
        setLoading(true);
        
        if (useS3) {
          // Use S3 images via accurate mapping
          const primaryImage = getExactVenueImage(category, venueName);
          if (primaryImage) {
            setImageSrc(primaryImage);
            console.log(`✅ AccurateVenueImage: Loaded S3 image ${primaryImage} for ${venueName}`);
            
            // Get all available images for this venue
            const allImages = getAllVenueImages(category, venueName);
            setAvailableImages(allImages);
          } else {
            console.log(`⚠️ AccurateVenueImage: No S3 mapping found for ${venueName}`);
            setImageSrc(fallback);
          }
        } else {
          // Use local images (fallback)
          const localImage = `/google_places_images1/${venueName.replace(/\s+/g, '_')}_1.jpg`;
          setImageSrc(localImage);
          console.log(`✅ AccurateVenueImage: Loaded local image ${localImage} for ${venueName}`);
        }
        
      } catch (error) {
        console.error('Error loading accurate venue image:', error);
        setImageSrc(fallback);
      } finally {
        setLoading(false);
      }
    };

    if (venueName) {
      loadAccurateImage();
    }
  }, [category, venueName, imageIndex, fallback, useS3]);

  const handleImageLoad = () => {
    onLoad?.();
  };

  const handleImageError = () => {
    console.warn(`Failed to load accurate venue image for ${venueName}`);
    
    if (useS3 && availableImages.length > 0) {
      // Try next available S3 image if current one fails
      const currentIndex = availableImages.findIndex(img => img === imageSrc);
      const nextIndex = (currentIndex + 1) % availableImages.length;
      const nextImage = availableImages[nextIndex];
      
      if (nextImage !== imageSrc) {
        console.log(`🔄 AccurateVenueImage: Trying next S3 image: ${nextImage}`);
        setImageSrc(nextImage);
        return;
      }
    }
    
    // Fallback to placeholder
    setImageSrc(fallback);
    onError?.();
  };

  if (loading) {
    return (
      <div 
        className={`${className} bg-gray-200 animate-pulse flex items-center justify-center`}
        style={{ width, height }}
      >
        <div className="text-gray-400 text-sm">Loading...</div>
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
      loading="lazy"
    />
  );
};

export default AccurateVenueImage;





