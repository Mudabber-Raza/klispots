import React, { useState } from 'react';
import { getCategoryFallbackImage } from '@/utils/categoryImages';

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

export const testS3Connectivity = async (): Promise<{ connected: boolean; error?: string }> => {
  return { connected: false, error: 'Venue image bucket is no longer available' };
};

export const testCORSAccess = async (): Promise<{ corsWorking: boolean; error?: string }> => {
  return { corsWorking: false, error: 'Venue image bucket is no longer available' };
};

export const SmartVenueImageV2: React.FC<SmartVenueImageProps> = ({
  category,
  alt,
  className = '',
  fallback,
  width,
  height,
  onLoad,
  onError,
}) => {
  const [imageSrc, setImageSrc] = useState(() => getCategoryFallbackImage(category, fallback));

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading="lazy"
      onLoad={onLoad}
      onError={() => {
        setImageSrc('/placeholder.svg');
        onError?.();
      }}
    />
  );
};

export default SmartVenueImageV2;
