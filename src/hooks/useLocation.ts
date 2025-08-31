import { useState, useEffect, useCallback } from 'react';

interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  address?: string;
  accuracy?: number;
}

interface UseLocationReturn {
  location: Location | null;
  isLoading: boolean;
  error: string | null;
  getCurrentLocation: () => Promise<void>;
  calculateDistance: (lat1: number, lon1: number, lat2: number, lon2: number) => number;
  formatDistance: (distance: number) => string;
  isNearMe: (venueLat: number, venueLon: number, radiusKm: number) => boolean;
}

export const useLocation = (): UseLocationReturn => {
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get current location using browser geolocation
  const getCurrentLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser');
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        });
      });

      const newLocation: Location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy
      };

      // Try to get city name from coordinates (reverse geocoding)
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLocation.latitude}&lon=${newLocation.longitude}&zoom=10`
        );
        const data = await response.json();
        
        if (data.address) {
          newLocation.city = data.address.city || data.address.town || data.address.village || data.address.county;
          newLocation.address = data.display_name;
        }
      } catch (geocodeError) {
        console.log('Could not get city name from coordinates:', geocodeError);
      }

      setLocation(newLocation);
      
      // Store in localStorage for future use
      localStorage.setItem('userLocation', JSON.stringify(newLocation));
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get location';
      setError(errorMessage);
      
      // Try to get location from localStorage if available
      const savedLocation = localStorage.getItem('userLocation');
      if (savedLocation) {
        try {
          const parsed = JSON.parse(savedLocation);
          setLocation(parsed);
        } catch (parseError) {
          console.log('Could not parse saved location');
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Calculate distance between two points using Haversine formula
  const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }, []);

  // Format distance for display
  const formatDistance = useCallback((distance: number): string => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    } else if (distance < 10) {
      return `${distance.toFixed(1)}km`;
    } else {
      return `${Math.round(distance)}km`;
    }
  }, []);

  // Check if a venue is within specified radius
  const isNearMe = useCallback((venueLat: number, venueLon: number, radiusKm: number): boolean => {
    if (!location) return false;
    const distance = calculateDistance(location.latitude, location.longitude, venueLat, venueLon);
    return distance <= radiusKm;
  }, [location, calculateDistance]);

  // Load saved location on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      try {
        const parsed = JSON.parse(savedLocation);
        setLocation(parsed);
      } catch (error) {
        console.log('Could not parse saved location');
      }
    }
  }, []);

  return {
    location,
    isLoading,
    error,
    getCurrentLocation,
    calculateDistance,
    formatDistance,
    isNearMe
  };
};

