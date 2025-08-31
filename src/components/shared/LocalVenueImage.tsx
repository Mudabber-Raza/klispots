import React, { useState, useEffect } from 'react';
import { findLocalImages, getVenueImage } from '@/utils/LocalImageMapper';

interface LocalVenueImageProps {
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
}

export const LocalVenueImage: React.FC<LocalVenueImageProps> = ({ 
  category, 
  venueName, 
  alt, 
  className = '', 
  fallback = '/placeholder.svg',
  width,
  height,
  onLoad,
  onError,
  imageIndex = 1
}) => {
  const [imageSrc, setImageSrc] = useState<string>(fallback);
  const [loading, setLoading] = useState(true);
  const [availableImages, setAvailableImages] = useState<string[]>([]);

  useEffect(() => {
    const loadLocalImage = async () => {
      try {
        setLoading(true);
        
        // Find local images for this venue
        const images = await findLocalImages(category, venueName, 5);
        setAvailableImages(images);
        
        if (images.length > 0) {
          // Get the specific image requested
          const selectedImage = getVenueImage(images[0], imageIndex);
          setImageSrc(selectedImage);
          console.log(`✅ LocalVenueImage: Loaded ${selectedImage} for ${venueName}`);
        } else {
          console.log(`⚠️ LocalVenueImage: No local images found for ${venueName}`);
          setImageSrc(fallback);
        }
        
      } catch (error) {
        console.error('Error loading local image:', error);
        setImageSrc(fallback);
      } finally {
        setLoading(false);
      }
    };

    if (venueName) {
      loadLocalImage();
    }
  }, [category, venueName, imageIndex, fallback]);

  const handleImageLoad = () => {
    onLoad?.();
  };

  const handleImageError = () => {
    console.warn(`Failed to load local image for ${venueName}`);
    
    // Try next available image if current one fails
    if (availableImages.length > 0) {
      const currentIndex = availableImages.findIndex(img => img === imageSrc);
      const nextIndex = (currentIndex + 1) % availableImages.length;
      const nextImage = getVenueImage(availableImages[nextIndex], imageIndex);
      
      if (nextImage !== imageSrc) {
        console.log(`🔄 LocalVenueImage: Trying next image: ${nextImage}`);
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

export default LocalVenueImage;





