import React, { useState, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import ComprehensiveVenueImage from '@/components/shared/ComprehensiveVenueImage';
import SmartVenueImageV2 from '@/utils/SmartVenueImageV2.tsx';

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
  // Use your original working SmartVenueImageV2 component
  return (
    <SmartVenueImageV2
      category={category}
      placeId={placeId}
      placeName={placeName}
      alt={alt}
      className={className}
    />
  );
};