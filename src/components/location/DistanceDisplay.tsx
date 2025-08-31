import React from 'react';
import { MapPin } from 'lucide-react';
import { useLocation } from '@/hooks/useLocation';

interface DistanceDisplayProps {
  venueLat: number;
  venueLon: number;
  className?: string;
  showIcon?: boolean;
  compact?: boolean;
}

const DistanceDisplay: React.FC<DistanceDisplayProps> = ({ 
  venueLat, 
  venueLon, 
  className = '',
  showIcon = true,
  compact = false
}) => {
  const { location, calculateDistance, formatDistance } = useLocation();

  if (!location) {
    return null;
  }

  const distance = calculateDistance(
    location.latitude, 
    location.longitude, 
    venueLat, 
    venueLon
  );

  const formattedDistance = formatDistance(distance);

  if (compact) {
    return (
      <span className={`text-sm text-gray-600 ${className}`}>
        {showIcon && <MapPin className="w-3 h-3 inline mr-1" />}
        {formattedDistance}
      </span>
    );
  }

  return (
    <div className={`flex items-center gap-1 text-sm text-gray-600 ${className}`}>
      {showIcon && <MapPin className="w-3 h-3" />}
      <span>{formattedDistance} away</span>
    </div>
  );
};

export default DistanceDisplay;

