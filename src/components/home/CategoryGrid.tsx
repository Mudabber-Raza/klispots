
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { categories } from '@/data/categories';
import { 
  Utensils, 
  Coffee, 
  ShoppingBag, 
  Music, 
  Dumbbell, 
  Heart, 
  Palette,
  MapPin,
  Sparkles,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import NearMeButton from '@/components/location/NearMeButton';
import { useLocation } from '@/hooks/useLocation';
import { useState } from 'react';

const CategoryGrid = () => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number; city?: string } | null>(null);
  const trendingCategories = ['restaurants', 'cafes', 'shopping'];

  const handleCategoryHover = (categoryId: string | null) => {
    setHoveredCategory(categoryId);
  };

  const handleLocationUpdate = (location: { latitude: number; longitude: number; city?: string }) => {
    setUserLocation(location);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-200 rounded-full opacity-10 animate-float"></div>
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-blue-200 rounded-full opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-emerald-600 animate-pulse" />
            <Badge variant="outline" className="border-emerald-200 text-emerald-700">
              Explore & Discover
            </Badge>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-gray-900 via-emerald-800 to-emerald-600 bg-clip-text text-transparent">
            Explore All Categories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Discover premium experiences across Pakistan's lifestyle landscape
          </p>
          
          {/* Near Me Button */}
          <div className="flex justify-center">
            <NearMeButton
              onLocationUpdate={handleLocationUpdate}
              variant="outline"
              size="lg"
              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            />
          </div>
          
          {userLocation && (
            <div className="mt-4 text-sm text-emerald-600">
              <MapPin className="w-4 h-4 inline mr-1" />
              Showing venues near {userLocation.city || 'your location'}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Link to={category.slug === 'restaurants' ? '/restaurants' : category.slug === 'cafes' ? '/cafes' : `/${category.slug}`}>
                <Card 
                  className="group cursor-pointer overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 border-0 bg-white/80 backdrop-blur-sm h-full transform hover:scale-105 active:scale-95"
                  onMouseEnter={() => handleCategoryHover(category.id)}
                  onMouseLeave={() => handleCategoryHover(null)}
                >
                  <div className="p-8 relative h-full flex flex-col">
                    {/* Enhanced Trending Badge */}
                    {trendingCategories.includes(category.slug) && (
                      <div className="absolute top-4 right-4 z-10">
                        <Badge className="bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs flex items-center gap-1 shadow-lg animate-pulse">
                          <TrendingUp className="w-3 h-3" />
                          Trending
                        </Badge>
                      </div>
                    )}

                    <div className="text-center flex-1 flex flex-col justify-between">
                      {/* Enhanced Icon with better styling */}
                      <div className="relative mb-6">
                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                          <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{category.icon}</span>
                        </div>
                        {/* Glow effect on hover */}
                        <div className="absolute inset-0 w-20 h-20 mx-auto bg-emerald-300 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
                      </div>

                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-700 transition-colors duration-300">
                          {category.name}
                        </h3>
                        
                        <p className="text-sm text-gray-600 mb-6 leading-relaxed min-h-[40px] group-hover:text-gray-700 transition-colors duration-300">
                          {category.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                          <span className="text-emerald-700 font-semibold group-hover:text-emerald-800 transition-colors duration-300">
                            {category.count}+ places
                          </span>
                        </div>
                        <div className="relative">
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-2 transition-all duration-300" />
                          {/* Arrow trail effect */}
                          <ArrowRight className="absolute top-0 left-0 w-5 h-5 text-emerald-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Hover Effect Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-emerald-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"></div>
                    
                    {/* Border glow effect */}
                    <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-emerald-200 transition-all duration-300"></div>
                  </div>
                </Card>
              </Link>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
};

export default CategoryGrid;
