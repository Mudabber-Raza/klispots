
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Phone, Clock, Wifi, Car } from 'lucide-react';
import { Place } from '@/types/categories';
import { Link } from 'react-router-dom';
import ComprehensiveVenueImage from '@/components/shared/ComprehensiveVenueImage';

interface PlaceCardProps {
  place: Place;
  showCategory?: boolean;
}

const PlaceCard = ({ place, showCategory = false }: PlaceCardProps) => {
  return (
    <Link to={`/restaurant/${place.id}`} className="block">
      <Card className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="listing-card-container" style={{ border: '2px solid red' }}>
          {place.imageUrl && place.imageUrl !== '/placeholder.svg' ? (
            <img
              src={place.imageUrl}
              alt={place.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onLoad={() => console.log('✅ Image loaded successfully:', place.imageUrl, 'for', place.name)}
              onError={(e) => console.error('❌ Image failed to load:', place.imageUrl, 'for', place.name, e)}
              style={{ objectFit: 'cover', border: '2px solid blue' }}
            />
          ) : (
            <ComprehensiveVenueImage
              category="restaurants" // Default to restaurants for PlaceCard
              placeId={place.id}
              placeName={place.name}
              alt={place.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              showSlider={false}
            />
          )}
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              place.isOpen 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {place.isOpen ? 'Open' : 'Closed'}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <div className="bg-white/70 backdrop-blur-sm px-2 py-1 rounded-full flex items-center">
              <Star className="w-3 h-3 text-yellow-500 fill-current mr-1" />
              <span className="text-xs font-medium text-gray-900">{place.rating}</span>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="mb-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
              {place.name}
            </h3>
            {showCategory && (
              <span className="text-sm text-emerald-600 font-medium">
                Restaurant • Fine Dining
              </span>
            )}
          </div>

          <div className="flex items-center text-gray-600 text-sm mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="truncate">{place.neighborhood}, {place.city.charAt(0).toUpperCase() + place.city.slice(1)}</span>
          </div>

          <div className="text-sm text-gray-600 mb-3">
            <span className="font-medium text-gray-900">{place.priceRange}</span>
          </div>

          {/* Features */}
          <div className="flex items-center gap-2 mb-4">
            {place.features.slice(0, 3).map((feature, index) => {
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

          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" className="flex-1 mr-2">
              View Details
            </Button>
            {place.phone && (
              <Button 
                size="sm" 
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={(e) => {
                  e.preventDefault();
                  window.open(`tel:${place.phone}`, '_self');
                }}
              >
                <Phone className="w-3 h-3 mr-1" />
                Call
              </Button>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default PlaceCard;
