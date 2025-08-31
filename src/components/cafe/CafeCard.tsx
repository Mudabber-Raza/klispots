import React from 'react';
import { Star, MapPin, Coffee, Wifi, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ComprehensiveVenueImage from '@/components/shared/ComprehensiveVenueImage';

interface CafeCardProps {
  cafe: {
    cafe_index?: number;
    place_name: string;
    cafe_category: string;
    city: string;
    neighborhood: string;
    total_score: number;
    coffee_quality_score: number;
    wifi_and_study_environment_score: number;
    operating_hours: string;
    imageUrl?: string;
  };
}

const CafeCard = ({ cafe }: CafeCardProps) => {
  const getRatingColor = (score: number) => {
    if (score >= 8.5) return 'text-emerald-600';
    if (score >= 7.5) return 'text-yellow-600';
    return 'text-orange-600';
  };



  return (
    <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden">
      {/* Image */}
      <div className="listing-card-container">
        <ComprehensiveVenueImage
          category="cafes"
          placeId={cafe.cafe_index?.toString() || cafe.place_name}
          placeName={cafe.place_name}
          alt={cafe.place_name}
          className="w-full h-full object-cover"
          showSlider={false}
        />
        

      </div>

      <CardContent className="p-5">
        {/* Header */}
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-amber-600 transition-colors">
            {cafe.place_name}
          </h3>
          <p className="text-gray-600 text-sm">{cafe.cafe_category.split('/')[0]}</p>
        </div>

        {/* Location */}
        <div className="flex items-center text-gray-600 text-sm mb-3">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{cafe.neighborhood}, {cafe.city}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
            <span className={`font-bold ${getRatingColor(Number(cafe.total_score || 0))}`}>
              {Number(cafe.total_score || 0).toFixed(1)}
            </span>
          </div>
          <span className="text-gray-500 text-sm ml-2">•</span>
          <span className="text-gray-600 text-sm ml-2">Cafe</span>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          {Number(cafe.wifi_and_study_environment_score || 0) >= 7 && (
            <Badge variant="outline" className="text-xs">
              <Wifi className="w-3 h-3 mr-1" />
              Study Friendly
            </Badge>
          )}
          {Number(cafe.coffee_quality_score || 0) >= 8 && (
            <Badge variant="outline" className="text-xs">
              <Coffee className="w-3 h-3 mr-1" />
              Premium Coffee
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
                      <Button
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm"
              onClick={(e) => {
                e.preventDefault();
                // Navigation will be handled by the Link wrapper
              }}
            >
              View Details
            </Button>
                      <Button 
              variant="outline" 
              className="px-3 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              onClick={(e) => {
                e.preventDefault();
                // Add phone functionality here if needed
              }}
            >
              <Phone className="w-4 h-4 mr-1" />
              Call
            </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CafeCard;
