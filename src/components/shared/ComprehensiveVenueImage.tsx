import React from 'react';
import SmartVenueImageV2 from '@/utils/SmartVenueImageV2';

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
}) => {
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
