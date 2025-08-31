import React, { useState, useMemo, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, MapPin, Star, ArrowRight, Clock } from 'lucide-react';
import { searchAllVenues, getPopularSearches, SearchResult } from '@/utils/searchUtils';
import ComprehensiveVenueImage from '@/components/shared/ComprehensiveVenueImage';
import CustomPagination from '@/components/ui/custom-pagination';
import { useURLManager } from '@/utils/urlManager';
import { useLocation as useLocationHook } from '@/hooks/useLocation';
import DistanceDisplay from '@/components/location/DistanceDisplay';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const urlManager = useURLManager();
  const { location: userLocation } = useLocationHook();
  
  // Initialize state from URL parameters
  const [searchQuery, setSearchQuery] = useState(urlManager.currentSearch);
  const [selectedCategory, setSelectedCategory] = useState(urlManager.currentCategory || 'all');
  const [selectedCity, setSelectedCity] = useState(urlManager.currentCity || 'all');
  const [sortBy, setSortBy] = useState(urlManager.currentSortBy || 'relevance');
  const [currentPage, setCurrentPage] = useState(urlManager.currentPage);
  const [isLoading, setIsLoading] = useState(false);
  const [searchLocation, setSearchLocation] = useState<{ lat: number; lng: number; city?: string } | null>(null);

  const ITEMS_PER_PAGE = 15;

  // Sync URL with component state when URL changes
  useEffect(() => {
    // Check both URL manager and location.search for backward compatibility
    const searchParams = new URLSearchParams(location.search);
    const urlSearch = searchParams.get('search') || urlManager.currentSearch;
    const urlCategory = searchParams.get('category') || urlManager.currentCategory || 'all';
    const urlCity = searchParams.get('city') || urlManager.currentCity || 'all';
    const urlSort = searchParams.get('sortBy') || urlManager.currentSortBy || 'relevance';
    const urlPage = parseInt(searchParams.get('page') || '1') || urlManager.currentPage;
    
    // Check for location parameters
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const nearCity = searchParams.get('nearCity');
    
    if (lat && lng) {
      setSearchLocation({
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        city: nearCity || undefined
      });
    }
    
    console.log('SearchResults: URL Parameters:', {
      locationSearch: location.search,
      urlManager: {
        search: urlManager.currentSearch,
        category: urlManager.currentCategory,
        city: urlManager.currentCity,
        sortBy: urlManager.currentSortBy,
        page: urlManager.currentPage
      },
      finalValues: {
        search: urlSearch,
        category: urlCategory,
        city: urlCity,
        sortBy: urlSort,
        page: urlPage
      },
      location: { lat, lng, nearCity }
    });
    
    setSearchQuery(urlSearch);
    setSelectedCategory(urlCategory);
    setSelectedCity(urlCity);
    setSortBy(urlSort);
    setCurrentPage(urlPage);
  }, [location.search, urlManager.searchParams]);

  // Perform search
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    let results = searchAllVenues(searchQuery, {
      category: selectedCategory === 'all' ? undefined : selectedCategory,
      city: selectedCity === 'all' ? undefined : selectedCity
    });

    // Add distance information and filter by location if available
    if (searchLocation) {
      results = results.map(venue => {
        // For now, we'll add a placeholder distance since SearchResult doesn't have coordinates
        // In a real implementation, you'd need to fetch venue coordinates from the venue data
        return {
          ...venue,
          distance: 0, // Placeholder - would need actual venue coordinates
          isNearMe: true // Placeholder - would calculate based on actual coordinates
        };
      }).filter(venue => venue.isNearMe);
    }

    return results;
  }, [searchQuery, selectedCategory, selectedCity, searchLocation]);

  // Sort and paginate results
  const sortedAndPaginatedResults = useMemo(() => {
    let sorted = [...searchResults];
    
    switch (sortBy) {
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'city':
        sorted.sort((a, b) => a.city.localeCompare(b.city));
        break;
      case 'relevance':
      default:
        // Already sorted by relevance in searchAllVenues
        break;
    }
    
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return sorted.slice(startIndex, endIndex);
  }, [searchResults, sortBy, currentPage]);

  const totalPages = Math.ceil(searchResults.length / ITEMS_PER_PAGE);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setCurrentPage(1);
    
    // Update URL with search parameters
    urlManager.updateURL({
      search: searchQuery.trim(),
      category: selectedCategory !== 'all' ? selectedCategory : '',
      city: selectedCity !== 'all' ? selectedCity : '',
      page: 1
    });
    
    setTimeout(() => setIsLoading(false), 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    // Update URL with category filter
    urlManager.updateURL({
      category: category !== 'all' ? category : '',
      page: 1
    });
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setCurrentPage(1);
    // Update URL with city filter
    urlManager.updateURL({
      city: city !== 'all' ? city : '',
      page: 1
    });
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    // Update URL with sort option
    urlManager.updateParam('sortBy', sort);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Update URL with new page
    urlManager.updateParam('page', page);
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedCity('all');
    setSortBy('relevance');
    setCurrentPage(1);
    // Reset URL to default state
    urlManager.resetFilters();
  };

  const getCategoryBadgeColor = (category: string) => {
    const colors = {
      restaurants: 'bg-emerald-100 text-emerald-800',
      cafes: 'bg-amber-100 text-amber-800',
      shopping: 'bg-blue-100 text-blue-800',
      entertainment: 'bg-purple-100 text-purple-800',
      'arts-culture': 'bg-pink-100 text-pink-800',
      'sports-fitness': 'bg-green-100 text-green-800',
      'health-wellness': 'bg-teal-100 text-teal-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const popularSearches = getPopularSearches(selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        {/* Search Header */}
        <section className="bg-white py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Search Results</h1>
              
              {/* Search Bar */}
              <Card className="p-4 shadow-sm">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Search venues, cuisines, or anything..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="pl-10 py-3 text-lg"
                    />
                  </div>
                  
                  <Select value={selectedCategory} onValueChange={(value) => handleCategoryChange(value)}>
                    <SelectTrigger className="w-full lg:w-48">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="restaurants">Restaurants</SelectItem>
                      <SelectItem value="cafes">Cafes</SelectItem>
                      <SelectItem value="shopping">Shopping</SelectItem>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                      <SelectItem value="arts-culture">Arts & Culture</SelectItem>
                      <SelectItem value="sports-fitness">Sports & Fitness</SelectItem>
                      <SelectItem value="health-wellness">Health & Wellness</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedCity} onValueChange={(value) => handleCityChange(value)}>
                    <SelectTrigger className="w-full lg:w-48">
                      <SelectValue placeholder="City" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cities</SelectItem>
                      <SelectItem value="Karachi">Karachi</SelectItem>
                      <SelectItem value="Lahore">Lahore</SelectItem>
                      <SelectItem value="Islamabad">Islamabad</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button onClick={handleSearch} className="bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                    {isLoading ? <Clock className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                    Search
                  </Button>
                </div>
              </Card>
              
              {/* Popular Searches */}
              {!searchQuery && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-3">Popular searches:</h3>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((search, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSearchQuery(search);
                          handleSearch();
                        }}
                        className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                      >
                        {search}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {searchQuery && (
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {searchResults.length} results for "{searchQuery}"
                    </h2>
                    {selectedCategory !== 'all' && (
                      <p className="text-gray-600 mt-1">
                        in {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1).replace('-', ' & ')}
                      </p>
                    )}
                  </div>
                  
                  <Select value={sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-48 mt-4 lg:mt-0">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Most Relevant</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="name">Name (A-Z)</SelectItem>
                      <SelectItem value="city">City</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Search Results */}
              <div className="space-y-6">
                {/* Location Indicator */}
                {searchLocation && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-emerald-600" />
                      <div>
                        <h3 className="font-semibold text-emerald-800">
                          Showing venues near your location
                        </h3>
                        <p className="text-sm text-emerald-600">
                          {searchLocation.city ? `Near ${searchLocation.city}` : 'Within 50km radius'}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSearchLocation(null)}
                        className="text-emerald-600 hover:text-emerald-800"
                      >
                        Clear Location
                      </Button>
                    </div>
                  </div>
                )}

                {/* Results Count */}
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">
                    {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found
                    {searchLocation && ' near your location'}
                  </p>
                </div>

                {/* Results Grid */}
                {searchQuery && (
                  <>
                    {searchResults.length > 0 ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                          {sortedAndPaginatedResults.map((result) => (
                            <Link key={result.id} to={result.url}>
                              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                                <div className="relative h-48 overflow-hidden rounded-t-lg">
                                  <ComprehensiveVenueImage
                                    category={result.category}
                                    placeId={result.actualPlaceId}
                                    placeName={result.name}
                                    alt={result.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                  <Badge className={`absolute top-3 left-3 ${getCategoryBadgeColor(result.category)}`}>
                                    {result.category.charAt(0).toUpperCase() + result.category.slice(1).replace('-', ' & ')}
                                  </Badge>
                                </div>
                                
                                <CardContent className="p-6">
                                  <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                                    {result.name}
                                  </h3>
                                  
                                  <p className="text-gray-600 mb-3 line-clamp-2">
                                    {result.description}
                                  </p>
                                  
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                      <span className="text-sm text-gray-700">
                                        {result.rating > 0 ? result.rating.toFixed(1) : 'N/A'}
                                      </span>
                                    </div>
                                    
                                    <div className="text-sm text-gray-500">
                                      {result.city}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </Link>
                          ))}
                        </div>
                        
                        {/* Pagination */}
                        {totalPages > 1 && (
                          <CustomPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                          />
                        )}
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No venues found</h3>
                        <p className="text-gray-600 mb-6">
                          Try adjusting your search terms or filters
                          {searchLocation && ' or expand your location radius'}
                        </p>
                        <Button onClick={handleClearFilters} variant="outline">
                          Clear All Filters
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              {/* No search query state */}
              {!searchQuery && (
                <div className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Start your search</h3>
                    <p className="text-gray-600 mb-6">
                      Enter a venue name, cuisine type, or location to find amazing places across Pakistan.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default SearchResults;
