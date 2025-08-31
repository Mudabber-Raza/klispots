
import React from 'react';
import { Star, MapPin, Phone, Clock, Wifi, Car } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ComprehensiveVenueImage from '@/components/shared/ComprehensiveVenueImage';
import { Button } from '@/components/ui/button';

interface RestaurantCardProps {
  restaurant: {
    id: string;
    name: string;
    cuisine: string;
    city: string;
    neighborhood: string;
    totalScore: number;
    priceRange: string;
    category: string;
    halalStatus: string;
    imageUrl?: string;
    specialties: string[];
    features: string[];
    phone?: string;
    currentStatus: 'Open' | 'Closed' | 'Opening Soon';
  };
}

const RestaurantCard = ({ restaurant }: RestaurantCardProps) => {
  const getRatingColor = (score: number) => {
    if (score >= 8.5) return 'text-emerald-600';
    if (score >= 7.5) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-emerald-100 text-emerald-800';
      case 'Closed': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden">
      {/* Image */}
              <div className="listing-card-container">
        {restaurant.imageUrl ? (
          <img
            src={restaurant.imageUrl}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <ComprehensiveVenueImage
            category="restaurants"
            placeId={restaurant.id}
            placeName={restaurant.name}
            alt={restaurant.name}
            className="w-full h-full object-cover"
            showSlider={false}
          />
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge className={getStatusColor(restaurant.currentStatus)}>
            <Clock className="w-3 h-3 mr-1" />
            {restaurant.currentStatus}
          </Badge>
        </div>

        {/* Halal Badge */}
        {restaurant.halalStatus === 'Halal' && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-green-100 text-green-800">
              Halal ✓
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-5">
        {/* Header */}
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
            {restaurant.name}
          </h3>
          <p className="text-gray-600 text-sm">{restaurant.cuisine}</p>
        </div>

        {/* Location */}
        <div className="flex items-center text-gray-600 text-sm mb-3">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{restaurant.neighborhood}, {restaurant.city}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
            <span className={`font-bold ${getRatingColor(restaurant.totalScore)}`}>
              {restaurant.totalScore.toFixed(1)}
            </span>
          </div>
          <span className="text-gray-500 text-sm ml-2">•</span>
          <span className="text-gray-600 text-sm ml-2">{restaurant.priceRange}</span>
        </div>

        {/* Specialties */}
        {restaurant.specialties.length > 0 && (
          <div className="mb-3">
            <p className="text-sm text-gray-600 mb-1">Specialties:</p>
            <div className="flex flex-wrap gap-1">
              {restaurant.specialties.slice(0, 3).map((specialty, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Features */}
        {restaurant.features.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {restaurant.features.slice(0, 3).map((feature, index) => {
                const icons = {
                  'WiFi': <Wifi className="w-3 h-3" />,
                  'Parking': <Car className="w-3 h-3" />,
                  '24/7': <Clock className="w-3 h-3" />
                };
                
                return (
                  <span key={index} className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {icons[feature as keyof typeof icons]}
                    {feature}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1">
            View Details
          </Button>
          {restaurant.phone && (
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => window.open(`tel:${restaurant.phone}`, '_self')}
            >
              <Phone className="w-3 h-3 mr-1" />
              Call
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RestaurantCard;
