import React, { useState, useEffect } from 'react';
import { getOtherCategoriesVenueImage, getAllOtherCategoriesVenueImages } from '../../utils/ComprehensiveOtherCategoriesMapper';

interface OtherCategoriesVenueImageProps {
  category: string;
  venueName: string;
  placeId?: string;
  className?: string;
  alt?: string;
  showDebug?: boolean;
  showCarousel?: boolean;
}

export const OtherCategoriesVenueImage: React.FC<OtherCategoriesVenueImageProps> = ({
  category,
  venueName,
  placeId,
  className = '',
  alt = '',
  showDebug = false,
  showCarousel = false
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [allImages, setAllImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const loadVenueImage = async () => {
      try {
        setLoading(true);
        setError(null);

        // Skip restaurants and cafes - they have their own working system
        if (category === 'restaurants' || category === 'cafes') {
          setLoading(false);
          return;
        }

        if (showDebug) {
          console.log(`🔍 Loading image for: ${venueName} (${category}) - Place ID: ${placeId}`);
        }

        // Get primary image
        const primaryImage = await getOtherCategoriesVenueImage(category, venueName, placeId);
        
        if (primaryImage) {
          setImageSrc(primaryImage);
          
          // Get all available images if carousel is enabled
          if (showCarousel) {
            const images = await getAllOtherCategoriesVenueImages(category, venueName, placeId);
            setAllImages(images);
          }
          
          if (showDebug) {
            console.log(`✅ Image loaded successfully: ${primaryImage}`);
          }
        } else {
          setError('No image found for this venue');
          if (showDebug) {
            console.log(`❌ No image found for: ${venueName}`);
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load image';
        setError(errorMessage);
        if (showDebug) {
          console.error(`❌ Error loading image for ${venueName}:`, err);
        }
      } finally {
        setLoading(false);
      }
    };

    loadVenueImage();
  }, [category, venueName, placeId, showDebug, showCarousel]);

  const nextImage = () => {
    if (allImages.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    }
  };

  const prevImage = () => {
    if (allImages.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    }
  };

  if (loading) {
    return (
      <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`}>
        <div className="w-full h-full min-h-[200px] bg-gray-300 rounded-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-4">
          <div className="text-gray-400 text-4xl mb-2">📷</div>
          <div className="text-gray-500 text-sm">No image available</div>
          {showDebug && <div className="text-gray-400 text-xs mt-1">{error}</div>}
        </div>
      </div>
    );
  }

  if (!imageSrc) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-4">
          <div className="text-gray-400 text-4xl mb-2">🏪</div>
          <div className="text-gray-500 text-sm">Restaurant/Cafe venue</div>
          <div className="text-gray-400 text-xs mt-1">Using existing system</div>
        </div>
      </div>
    );
  }

  if (showCarousel && allImages.length > 1) {
    return (
      <div className={`relative group ${className}`}>
        <img
          src={allImages[currentImageIndex]}
          alt={alt || `${venueName} - Image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover rounded-lg"
          onError={() => setError('Failed to load image')}
        />
        
        {/* Navigation arrows */}
        <button
          onClick={prevImage}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          ←
        </button>
        <button
          onClick={nextImage}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          →
        </button>
        
        {/* Image counter */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          {currentImageIndex + 1} / {allImages.length}
        </div>
        
        {showDebug && (
          <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs p-2 rounded">
            <div>Category: {category}</div>
            <div>Venue: {venueName}</div>
            <div>Place ID: {placeId || 'N/A'}</div>
            <div>Images: {allImages.length}</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <img
        src={imageSrc}
        alt={alt || venueName}
        className="w-full h-full object-cover rounded-lg"
        onError={() => setError('Failed to load image')}
      />
      
      {showDebug && (
        <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs p-2 rounded">
          <div>Category: {category}</div>
          <div>Venue: {venueName}</div>
          <div>Place ID: {placeId || 'N/A'}</div>
          <div>Source: Other Categories Mapper</div>
        </div>
      )}
    </div>
  );
};





