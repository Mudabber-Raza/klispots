
import { Search, MapPin, Star, Shield, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useState, useCallback } from 'react';
import { categories } from '@/data/categories';
import { useNavigate } from 'react-router-dom';
import PageSEO from '@/components/seo/PageSEO';
import NearMeButton from '@/components/location/NearMeButton';
import { useLocation } from '@/hooks/useLocation';

const SearchHero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [isSearching, setIsSearching] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number; city?: string } | null>(null);
  const navigate = useNavigate();
  const { location } = useLocation();

  const cities = [
    { id: 'all', name: 'All Cities' },
    { id: 'karachi', name: 'Karachi' },
    { id: 'lahore', name: 'Lahore' },
    { id: 'islamabad', name: 'Islamabad' },
    { id: 'rawalpindi', name: 'Rawalpindi' },
    { id: 'faisalabad', name: 'Faisalabad' },
    { id: 'multan', name: 'Multan' },
    { id: 'peshawar', name: 'Peshawar' }
  ];

  const popularSearches = [
    'Best Biryani in Karachi',
    'Coffee Shops Islamabad',
    'Family Restaurants',
    'Shopping Malls Karachi',
    'Chinese Food Lahore',
    'BBQ Restaurants',
    'Cafe with WiFi',
    'Cinema Halls',
    'Gym Near Me',
    'Spa Services',
    'Art Galleries'
  ];

  const handleLocationUpdate = useCallback((location: { latitude: number; longitude: number; city?: string }) => {
    setUserLocation(location);
    // Auto-select the detected city if available
    if (location.city) {
      const cityId = cities.find(city => 
        city.name.toLowerCase() === location.city?.toLowerCase()
      )?.id;
      if (cityId) {
        setSelectedCity(cityId);
      }
    }
  }, [cities]);

  const handleSearch = useCallback(() => {
    if (!searchQuery.trim() && selectedCategory === 'all' && selectedCity === 'all' && !userLocation) {
      return;
    }

    setIsSearching(true);
    
    // Simulate search delay for smooth UX
    setTimeout(() => {
      setIsSearching(false);
      
      // Build search URL using the new URL manager format
      const queryParams = new URLSearchParams();
      
      if (searchQuery.trim()) {
        queryParams.set('search', searchQuery.trim());
      }
      
      if (selectedCategory !== 'all') {
        queryParams.set('category', selectedCategory);
      }
      
      if (selectedCity !== 'all') {
        queryParams.set('city', selectedCity);
      }
      
      // Add location parameters if available
      if (userLocation) {
        queryParams.set('lat', userLocation.latitude.toString());
        queryParams.set('lng', userLocation.longitude.toString());
        if (userLocation.city) {
          queryParams.set('nearCity', userLocation.city);
        }
      }
      
      // Use global search page for better results
      let searchUrl = '/search';
      if (queryParams.toString()) {
        searchUrl += `?${queryParams.toString()}`;
      }
      
      console.log('SearchHero: Navigating to:', searchUrl, 'with params:', queryParams.toString());
      
      navigate(searchUrl);
    }, 300);
  }, [searchQuery, selectedCategory, selectedCity, userLocation, navigate]);

  const handlePopularSearch = useCallback((search: string) => {
    setSearchQuery(search);
    
    // Auto-detect category from search
    let detectedCategory = 'all';
    const searchLower = search.toLowerCase();
    
    if (searchLower.includes('biryani') || searchLower.includes('restaurant') || 
        searchLower.includes('dining') || searchLower.includes('bbq') || 
        searchLower.includes('chinese') || searchLower.includes('food')) {
      detectedCategory = 'restaurants';
    } else if (searchLower.includes('coffee') || searchLower.includes('cafe') || 
               searchLower.includes('wifi')) {
      detectedCategory = 'cafes';
    } else if (searchLower.includes('shopping') || searchLower.includes('mall')) {
      detectedCategory = 'shopping';
    } else if (searchLower.includes('entertainment') || searchLower.includes('cinema') || 
               searchLower.includes('movie')) {
      detectedCategory = 'entertainment';
    } else if (searchLower.includes('gym') || searchLower.includes('fitness') || 
               searchLower.includes('sports')) {
      detectedCategory = 'sports-fitness';
    } else if (searchLower.includes('spa') || searchLower.includes('wellness') || 
               searchLower.includes('health')) {
      detectedCategory = 'health-wellness';
    } else if (searchLower.includes('art') || searchLower.includes('gallery') || 
               searchLower.includes('museum') || searchLower.includes('culture')) {
      detectedCategory = 'arts-culture';
    }
    setSelectedCategory(detectedCategory);
    
    // Auto-trigger search
    setTimeout(() => {
      const queryParams = new URLSearchParams();
      queryParams.set('search', search);
      if (detectedCategory !== 'all') {
        queryParams.set('category', detectedCategory);
      }
      if (selectedCity !== 'all') {
        queryParams.set('city', selectedCity);
      }
      navigate(`/search?${queryParams.toString()}`);
    }, 100);
  }, [selectedCity, navigate]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  return (
    <>
      <PageSEO
        title="KLIspots - Discover Pakistan's Premium Lifestyle"
        description="AI-powered insights, local expert verification, and comprehensive data to find your perfect dining and lifestyle experiences in Pakistan. Discover 5500+ verified places across 7 categories."
        keywords="Pakistan restaurants, cafes, shopping, entertainment, fitness, wellness, arts, culture, dining, lifestyle, verified places"
        type="website"
      />
      
      <section className="bg-gradient-to-br from-gray-50 via-white to-emerald-50 py-24 lg:py-32 relative overflow-hidden">
      {/* Enhanced background pattern with animation */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(5,150,105,0.05)_1px,transparent_0)] [background-size:20px_20px] animate-pulse"></div>
      
      {/* Floating elements for visual interest */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-emerald-200 rounded-full opacity-20 animate-bounce"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-blue-200 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-40 left-20 w-12 h-12 bg-purple-200 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '2s' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <div className="flex justify-center items-center gap-2 mb-6">
            <Shield className="w-6 h-6 text-emerald-600 animate-bounce" style={{ animationDuration: '2s' }} />
            <span className="text-emerald-600 font-semibold">KLIspots Verified</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight animate-fade-in">
            Discover Pakistan's
            <span className="text-emerald-700 block bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
              Premium Lifestyle
            </span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed animate-fade-in-up">
            AI-powered insights, local expert verification, and comprehensive data 
            to find your perfect dining and lifestyle experiences.
          </p>

          {/* Enhanced Trust Indicators with animations */}
          <div className="flex flex-wrap justify-center items-center gap-8 mb-12 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-2 text-gray-600 hover:scale-105 transition-transform duration-300">
              <Star className="w-5 h-5 text-yellow-500 fill-current animate-pulse" />
              <span className="font-semibold">5500+</span>
              <span>Verified Places</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 hover:scale-105 transition-transform duration-300">
              <Users className="w-5 h-5 text-emerald-600 animate-pulse" style={{ animationDelay: '0.5s' }} />
              <span className="font-semibold">25K+</span>
              <span>Happy Users</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 hover:scale-105 transition-transform duration-300">
              <Shield className="w-5 h-5 text-emerald-600 animate-pulse" style={{ animationDelay: '1s' }} />
              <span className="font-semibold">7</span>
              <span>Categories</span>
            </div>
          </div>
        </div>

        {/* Enhanced Search Bar with smooth animations */}
        <Card className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 shadow-2xl border-0 bg-white/90 backdrop-blur-md mb-12 transform hover:scale-[1.01] transition-all duration-500 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col gap-4">
              {/* Category Dropdown */}
              <div className="w-full">
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-4 sm:pl-6 pr-8 sm:pr-12 py-3 sm:py-4 border border-gray-200 rounded-lg text-base sm:text-lg appearance-none bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium transition-all duration-300 hover:border-emerald-300"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.slug}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Input */}
              <div className="relative group">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 sm:w-6 sm:h-6 group-focus-within:text-emerald-500 transition-colors duration-300" />
                <Input
                  type="text"
                  placeholder="Search places, cuisines, or anything..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 sm:pl-12 py-3 sm:py-4 text-base sm:text-lg border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white transition-all duration-300 hover:border-emerald-300 group-hover:border-emerald-300"
                />
              </div>

              {/* City Selector */}
              <div className="relative group">
                <MapPin className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 sm:w-6 sm:h-6 group-focus-within:text-emerald-500 transition-colors duration-300" />
                <select 
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-8 py-3 sm:py-4 border border-gray-200 rounded-lg text-base sm:text-lg appearance-none bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium transition-all duration-300 hover:border-emerald-300"
                >
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Near Me Button */}
              <div className="flex justify-center">
                <NearMeButton
                  onLocationUpdate={handleLocationUpdate}
                  variant="outline"
                  size="md"
                  className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                />
              </div>

              <Button 
                size="lg" 
                onClick={handleSearch}
                disabled={isSearching}
                className="w-full bg-emerald-700 hover:bg-emerald-800 px-6 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSearching ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Searching...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Search Now
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                )}
              </Button>
            </div>

            {/* Enhanced Popular Searches */}
            <div className="border-t pt-4">
              <p className="text-sm text-gray-600 mb-3">Popular searches:</p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handlePopularSearch(search)}
                    className="px-3 sm:px-4 py-2 bg-gray-100 hover:bg-emerald-100 text-gray-700 hover:text-emerald-700 rounded-full text-xs sm:text-sm transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Enhanced Quick Stats with animations */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-4xl font-bold text-emerald-700 mb-2 group-hover:text-emerald-800 transition-colors duration-300">5500+</div>
            <div className="text-gray-600 font-medium">Verified Places</div>
          </div>
          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-4xl font-bold text-emerald-700 mb-2 group-hover:text-emerald-800 transition-colors duration-300">7</div>
            <div className="text-gray-600 font-medium">Categories</div>
          </div>
          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-4xl font-bold text-emerald-700 mb-2 group-hover:text-emerald-800 transition-colors duration-300">3</div>
            <div className="text-gray-600 font-medium">Major Cities</div>
          </div>
          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-4xl font-bold text-emerald-700 mb-2 group-hover:text-emerald-800 transition-colors duration-300">25K+</div>
            <div className="text-gray-600 font-medium">Happy Users</div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default SearchHero;
