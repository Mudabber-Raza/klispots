import React, { useState, useEffect } from 'react';
import { getAccurateLocalVenueImage, getAllVenueImages } from '../../utils/AccurateLocalVenueMapper';

interface AccurateLocalVenueImageProps {
  category: string;
  venueName: string;
  placeId?: string;
  className?: string;
  alt?: string;
  showDebug?: boolean;
}

export const AccurateLocalVenueImage: React.FC<AccurateLocalVenueImageProps> = ({
  category,
  venueName,
  placeId,
  className = '',
  alt = '',
  showDebug = false
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [allImages, setAllImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get the primary image
        const primaryImage = await getAccurateLocalVenueImage(category, venueName, placeId);
        
        if (primaryImage) {
          setImageSrc(primaryImage);
          
          // Get all available images for this venue
          const images = await getAllVenueImages(category, venueName, placeId);
          setAllImages(images);
        } else {
          setError('No image found for this venue');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load image');
      } finally {
        setLoading(false);
      }
    };

    loadImage();
  }, [category, venueName, placeId]);

  if (loading) {
    return (
      <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`}>
        <div className="w-full h-full bg-gray-300 rounded-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded ${className}`}>
        <strong>Error:</strong> {error}
      </div>
    );
  }

  if (!imageSrc) {
    return (
      <div className={`bg-gray-100 border border-gray-300 text-gray-500 px-4 py-3 rounded ${className}`}>
        No image available
      </div>
    );
  }

  return (
    <div className="relative">
      <img
        src={imageSrc}
        alt={alt || `${venueName} image`}
        className={`w-full h-full object-cover rounded-lg ${className}`}
        onError={() => setError('Failed to load image')}
      />
      
      {showDebug && (
        <div className="absolute top-0 left-0 bg-black bg-opacity-75 text-white p-2 text-xs rounded-tl-lg">
          <div><strong>Venue:</strong> {venueName}</div>
          <div><strong>Category:</strong> {category}</div>
          <div><strong>Place ID:</strong> {placeId || 'N/A'}</div>
          <div><strong>Image:</strong> {imageSrc}</div>
          <div><strong>Total Images:</strong> {allImages.length}</div>
        </div>
      )}
      
      {allImages.length > 1 && (
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
          {allImages.length} images
        </div>
      )}
    </div>
  );
};





