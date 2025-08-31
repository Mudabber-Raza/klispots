import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Loader2, AlertCircle } from 'lucide-react';
import { useLocation } from '@/hooks/useLocation';

interface NearMeButtonProps {
  onLocationUpdate?: (location: { latitude: number; longitude: number; city?: string }) => void;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const NearMeButton: React.FC<NearMeButtonProps> = ({ 
  onLocationUpdate, 
  className = '',
  variant = 'outline',
  size = 'md'
}) => {
  const { 
    location, 
    isLoading, 
    error, 
    getCurrentLocation 
  } = useLocation();

  const handleGetLocation = async () => {
    await getCurrentLocation();
    if (location && onLocationUpdate) {
      onLocationUpdate(location);
    }
  };

  const getButtonText = () => {
    if (isLoading) return 'Getting Location...';
    if (location?.city) return `Near ${location.city}`;
    if (location) return 'Near Me';
    return 'Near Me';
  };

  const getButtonIcon = () => {
    if (isLoading) return <Loader2 className="w-4 h-4 animate-spin" />;
    if (location) return <Navigation className="w-4 h-4" />;
    return <MapPin className="w-4 h-4" />;
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={handleGetLocation}
        disabled={isLoading}
        variant={variant}
        size={size}
        className={`${className} ${location ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : ''}`}
      >
        {getButtonIcon()}
        {getButtonText()}
      </Button>
      
      {location && (
        <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
          <MapPin className="w-3 h-3 mr-1" />
          Active
        </Badge>
      )}
      
      {error && (
        <Badge variant="destructive" className="bg-red-100 text-red-800">
          <AlertCircle className="w-3 h-3 mr-1" />
          Error
        </Badge>
      )}
    </div>
  );
};

export default NearMeButton;

