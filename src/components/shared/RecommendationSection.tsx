import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin, Star } from 'lucide-react';
import { ComprehensiveVenueImage } from './ComprehensiveVenueImage';
import { RecommendationItem, getCategoryDisplayName, getCategoryIcon } from '@/utils/recommendationEngine';

// Map recommendation categories to image system categories
const mapCategoryForImages = (category: string): string => {
  const categoryMap: { [key: string]: string } = {
    'restaurant': 'restaurants',
    'cafe': 'cafes', 
    'shopping': 'shopping',
    'entertainment': 'entertainment',
    'arts-culture': 'arts-culture',
    'sports-fitness': 'sports-fitness',
    'health-wellness': 'health-wellness'
  };
  return categoryMap[category] || category;
};

interface RecommendationSectionProps {
  recommendations: RecommendationItem[];
  title?: string;
  subtitle?: string;
}

const RecommendationSection: React.FC<RecommendationSectionProps> = ({
  recommendations,
  title = "You Might Also Like",
  subtitle = "Discover more amazing places based on your interests"
}) => {
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </div>

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {recommendations.map((recommendation) => (
            <Card
              key={recommendation.id}
              className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg overflow-hidden"
            >
              <div className="relative">
                {/* Image */}
                <div className="h-48 overflow-hidden">
                  <ComprehensiveVenueImage
                    category={mapCategoryForImages(recommendation.category)}
                    placeId={recommendation.actualPlaceId || recommendation.id}
                    placeName={recommendation.name}
                    alt={recommendation.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    showSlider={false}
                    showNavigation={false}
                    showDots={false}
                  />
                </div>

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <Badge className="bg-white/90 text-gray-800 backdrop-blur-sm">
                    <span className="mr-1">{getCategoryIcon(recommendation.category)}</span>
                    {getCategoryDisplayName(recommendation.category)}
                  </Badge>
                </div>

                {/* Rating Badge */}
                <div className="absolute top-3 right-3">
                  <Badge className="bg-emerald-500 text-white">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    {recommendation.rating}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                {/* Venue Name */}
                <h3 className="font-bold text-xl mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
                  {recommendation.name}
                </h3>

                {/* Location */}
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">{recommendation.city}</span>
                </div>

                {/* Reason */}
                <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                  {recommendation.reason}
                </p>

                {/* Action Button */}
                <Link to={recommendation.url}>
                  <Button 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white group/btn"
                    size="sm"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mb-16">
          <Link to="/search">
            <Button 
              variant="outline" 
              size="lg"
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
            >
              Explore More Venues
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RecommendationSection;
