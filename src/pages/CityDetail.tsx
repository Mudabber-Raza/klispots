import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Search, Filter, MapPin, Star, Phone } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { restaurants } from '@/data/restaurants';
import { cafes } from '@/data/cafes';
import { shoppingVenues } from '@/data/shopping';
import { entertainmentVenues } from '@/data/entertainment';
import { healthWellnessVenues } from '@/data/health-wellness';
import { artsCultureVenues } from '@/data/arts-culture';
import { sportsFitnessVenues } from '@/data/sports-fitness';
import ComprehensiveVenueImage from '@/components/shared/ComprehensiveVenueImage';
import VenueCardSkeleton from '@/components/ui/venue-card-skeleton';
import CustomPagination from '@/components/ui/custom-pagination';

interface Venue {
  id: string;
  name: string;
  category: string;
  city: string;
  neighborhood: string;
  rating: number;
  description: string;
  phone?: string;
  imageUrl?: string;
  placeId?: string;
  originalData: any;
}

const CityDetail = () => {
  const { cityName } = useParams<{ cityName: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 15;

  // Decode city name from URL
  const decodedCityName = cityName ? decodeURIComponent(cityName.replace(/-/g, ' ')) : '';

  // Get all venues for this city
  const cityVenues = useMemo(() => {
    const venues: Venue[] = [];

    // Add restaurants
    restaurants
      .filter(v => v.city.toLowerCase() === decodedCityName.toLowerCase())
      .forEach(v => venues.push({
        id: `restaurant-${v.restaurant_index}`,
        name: v.place_name,
        category: 'Restaurants',
        city: v.city,
        neighborhood: v.neighborhood,
        rating: Number(v.total_score || 0),
        description: v.about,
        phone: v.phone_number,
        placeId: (v as any).original_place_id || v.place_name,
        originalData: v
      }));

    // Add cafes
    cafes
      .filter(v => v.city.toLowerCase() === decodedCityName.toLowerCase())
      .forEach(v => venues.push({
        id: `cafe-${v.cafe_index}`,
        name: v.place_name,
        category: 'Cafes',
        city: v.city,
        neighborhood: v.neighborhood,
        rating: Number(v.total_score || 0),
        description: v.about,
        phone: v.phone_number,
        placeId: v.cafe_index?.toString() || v.place_name,
        originalData: v
      }));

    // Add shopping venues
    shoppingVenues
      .filter(v => v.city.toLowerCase() === decodedCityName.toLowerCase())
      .forEach(v => venues.push({
        id: `shopping-${(v as any).venue_index}`,
        name: v.place_name,
        category: 'Shopping',
        city: v.city,
        neighborhood: v.neighborhood,
        rating: Number(v.total_score || 0),
        description: v.about,
        phone: v.phone_number,
        placeId: (v as any).venue_index?.toString() || v.place_name,
        originalData: v
      }));

    // Add entertainment venues
    entertainmentVenues
      .filter(v => v.city.toLowerCase() === decodedCityName.toLowerCase())
      .forEach(v => venues.push({
        id: `entertainment-${(v as any).venue_index}`,
        name: v.place_name,
        category: 'Entertainment',
        city: v.city,
        neighborhood: v.neighborhood,
        rating: Number(v.total_score || 0),
        description: v.about,
        phone: v.phone_number,
        placeId: (v as any).venue_index?.toString() || v.place_name,
        originalData: v
      }));

    // Add health & wellness venues
    healthWellnessVenues
      .filter(v => v.city.toLowerCase() === decodedCityName.toLowerCase())
      .forEach(v => venues.push({
        id: `health-${(v as any).venue_index}`,
        name: v.place_name,
        category: 'Health & Wellness',
        city: v.city,
        neighborhood: v.neighborhood,
        rating: Number(v.total_score || 0),
        description: v.about,
        phone: v.phone_number,
        placeId: (v as any).venue_index?.toString() || v.place_name,
        originalData: v
      }));

    // Add arts & culture venues
    artsCultureVenues
      .filter(v => v.city.toLowerCase() === decodedCityName.toLowerCase())
      .forEach(v => venues.push({
        id: `arts-${(v as any).venue_index}`,
        name: v.place_name,
        category: 'Arts & Culture',
        city: v.city,
        neighborhood: v.neighborhood,
        rating: Number(v.total_score || 0),
        description: v.about,
        phone: v.phone_number,
        placeId: (v as any).venue_index?.toString() || v.place_name,
        originalData: v
      }));

    // Add sports & fitness venues
    sportsFitnessVenues
      .filter(v => v.city.toLowerCase() === decodedCityName.toLowerCase())
      .forEach(v => venues.push({
        id: `sports-${(v as any).venue_index}`,
        name: v.place_name,
        category: 'Sports & Fitness',
        city: v.city,
        neighborhood: v.neighborhood,
        rating: Number(v.total_score || 0),
        description: v.about,
        phone: v.phone_number,
        placeId: (v as any).venue_index?.toString() || v.place_name,
        originalData: v
      }));

    return venues;
  }, [decodedCityName]);

  // Handle filter changes
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  // Filter and sort venues
  const filteredAndSortedVenues = useMemo(() => {
    let filtered = cityVenues;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(venue =>
        venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.neighborhood.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(venue => venue.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Sort venues
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    return filtered;
  }, [cityVenues, searchQuery, selectedCategory, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedVenues.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageVenues = filteredAndSortedVenues.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [decodedCityName]);

  const getCategoryColor = (category: string) => {
    // Use emerald color scheme to match listing pages
    return 'bg-emerald-100 text-emerald-800';
  };

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return 'text-emerald-600';
    if (score >= 7.5) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'restaurants': return '🍽️';
      case 'cafes': return '☕';
      case 'shopping': return '🛍️';
      case 'entertainment': return '🎭';
      case 'health & wellness': return '💚';
      case 'arts & culture': return '🎨';
      case 'sports & fitness': return '🏃';
      default: return '🏢';
    }
  };

  if (!decodedCityName) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900">City not found</h1>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-emerald-600/90 via-emerald-700/85 to-emerald-800/90 backdrop-blur-sm py-16">
          <div className="container mx-auto px-4">
            <div className="text-center text-white">
              <Button
                asChild
                variant="ghost"
                className="mb-6 text-emerald-100 hover:text-white hover:bg-emerald-700"
              >
                <Link to="/cities">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Cities
                </Link>
              </Button>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                {decodedCityName.charAt(0).toUpperCase() + decodedCityName.slice(1)}
              </h1>
              <p className="text-xl sm:text-2xl text-emerald-100 mb-8">
                Discover amazing venues and experiences in {decodedCityName.charAt(0).toUpperCase() + decodedCityName.slice(1)}
              </p>
              
              <div className="flex flex-wrap justify-center gap-6 text-emerald-100">
                <div className="text-center">
                  <div className="text-2xl font-bold">{cityVenues.length}</div>
                  <div className="text-sm">Total Venues</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {(() => {
                      if (cityVenues.length === 0) return '0.0';
                      const ratings = cityVenues.map(v => v.rating).filter(r => !isNaN(r) && r > 0);
                      if (ratings.length === 0) return '0.0';
                      const maxRating = Math.max(...ratings);
                      return maxRating >= 9 ? '9+' : maxRating.toFixed(1);
                    })()}
                  </div>
                  <div className="text-sm">Top Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {new Set(cityVenues.map(v => v.category)).size}
                  </div>
                  <div className="text-sm">Categories</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Results Section with Sidebar */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Sidebar - Filters */}
              <div className="w-full lg:w-80 flex-shrink-0">
                <Card className="sticky top-24">
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Filter className="w-5 h-5 text-emerald-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                    </div>
                    
                    <div className="space-y-6">
                      {/* Search */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Search Venues</label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            type="text"
                            placeholder={`Search venues in ${decodedCityName.charAt(0).toUpperCase() + decodedCityName.slice(1)}...`}
                            value={searchQuery}
                            onChange={(e) => {
                              setSearchQuery(e.target.value);
                              handleFilterChange();
                            }}
                            className="pl-9"
                            disabled={isLoading}
                          />
                        </div>
                      </div>

                      {/* Category Filter */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
                        <Select 
                          value={selectedCategory} 
                          onValueChange={(value) => {
                            setSelectedCategory(value);
                            handleFilterChange();
                          }}
                          disabled={isLoading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="restaurants">🍽️ Restaurants</SelectItem>
                            <SelectItem value="cafes">☕ Cafes</SelectItem>
                            <SelectItem value="shopping">🛍️ Shopping</SelectItem>
                            <SelectItem value="entertainment">🎭 Entertainment</SelectItem>
                            <SelectItem value="health & wellness">💚 Health & Wellness</SelectItem>
                            <SelectItem value="arts & culture">🎨 Arts & Culture</SelectItem>
                            <SelectItem value="sports & fitness">🏃 Sports & Fitness</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Sort */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Sort By</label>
                        <Select 
                          value={sortBy} 
                          onValueChange={(value) => {
                            setSortBy(value);
                            handleFilterChange();
                          }}
                          disabled={isLoading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sort By" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="rating">Highest Rated</SelectItem>
                            <SelectItem value="name">Name A-Z</SelectItem>
                            <SelectItem value="category">Category</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Clear Filters */}
                      <Button 
                        variant="outline" 
                        className="w-full transition-all duration-300 hover:scale-105"
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategory('all');
                          setSortBy('rating');
                          setCurrentPage(1);
                          handleFilterChange();
                        }}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Clearing...' : 'Clear All Filters'}
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Content */}
              <div className="flex-1">
                {/* Pagination Info */}
                {totalPages > 1 && (
                  <div className="flex justify-end mb-8">
                    <div className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages} • Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedVenues.length)} of {filteredAndSortedVenues.length}
                    </div>
                  </div>
                )}

                {/* Results Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {isLoading ? (
                    // Show skeleton loaders while loading
                    Array.from({ length: 6 }).map((_, index) => (
                      <VenueCardSkeleton key={index} />
                    ))
                  ) : currentPageVenues.length === 0 ? (
                    <div className="col-span-full text-center py-16">
                      <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No venues found</h3>
                      <p className="text-gray-600">Try adjusting your search criteria or filters</p>
                    </div>
                  ) : (
                    currentPageVenues.map((venue) => {
                  const getDetailPath = () => {
                    switch (venue.category.toLowerCase()) {
                      case 'restaurants': return `/restaurant/${venue.id.split('-')[1]}`;
                      case 'cafes': return `/cafe/${venue.id.split('-')[1]}`;
                      case 'shopping': return `/shopping/${venue.id.split('-')[1]}`;
                      case 'entertainment': return `/entertainment/${venue.id.split('-')[1]}`;
                      case 'health & wellness': return `/health-wellness/${venue.id.split('-')[1]}`;
                      case 'arts & culture': return `/arts-culture/${venue.id.split('-')[1]}`;
                      case 'sports & fitness': return `/sports-fitness/${venue.id.split('-')[1]}`;
                      default: return '#';
                    }
                  };

                  return (
                    <Link key={venue.id} to={getDetailPath()}>
                      <Card className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <div className="listing-card-container">
                          <ComprehensiveVenueImage
                            category={venue.category.toLowerCase().replace(/\s+/g, '-')}
                            placeId={venue.placeId || venue.name}
                            placeName={venue.name}
                            alt={venue.name}
                            className="w-full h-full object-cover"
                            showSlider={false}
                          />
                          
                          <div className="absolute top-3 left-3">
                            <Badge className={`text-xs ${getCategoryColor(venue.category)}`}>
                              {getCategoryIcon(venue.category)} {venue.category}
                            </Badge>
                          </div>
                          
                          <div className="absolute top-3 right-3">
                            <div className="bg-white bg-opacity-95 px-2 sm:px-3 py-1 rounded-lg text-center">
                              <div className={`text-sm sm:text-lg font-bold ${getScoreColor(venue.rating)}`}>
                                {venue.rating.toFixed(1)}
                              </div>
                              <div className="flex items-center text-xs text-gray-500">
                                <Star className="w-3 h-3 fill-current mr-1" />
                              </div>
                            </div>
                          </div>
                        </div>

                        <CardContent className="p-4 sm:p-6">
                          <div className="mb-4">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                              {venue.name}
                            </h3>
                            <p className="text-gray-600 mb-2 text-sm">{venue.category}</p>
                            <div className="flex items-center text-gray-600 text-sm mb-2">
                              <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                              <span className="truncate">{venue.neighborhood}, {venue.city}</span>
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {venue.description}
                            </p>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              View Details
                            </Button>
                            {venue.phone && (
                              <Button 
                                size="sm" 
                                className="bg-emerald-600 hover:bg-emerald-700 sm:w-auto w-full"
                                onClick={(e) => {
                                  e.preventDefault();
                                  window.open(`tel:${venue.phone}`, '_self');
                                }}
                              >
                                <Phone className="w-3 h-3 mr-1" />
                                Call
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })
              )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8">
                    <CustomPagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      className="mb-8"
                    />
                  </div>
                )}

                {currentPageVenues.length === 0 && !isLoading && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No venues found</h3>
                    <p className="text-gray-600">Try adjusting your search criteria or filters</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CityDetail;
