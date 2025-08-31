import { useState, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Phone, Filter, Search } from 'lucide-react';
import { cafes, getCafeCities, getCafeCategories, Cafe } from '@/data/cafes';
import ComprehensiveVenueImage from '@/components/shared/ComprehensiveVenueImage';
import CustomPagination from '@/components/ui/custom-pagination';
import VenueCardSkeleton from '@/components/ui/venue-card-skeleton';
import { useURLManager } from '@/utils/urlManager';
import { createVenueUrl } from '@/utils/urlSlugs';

const CafeListing = () => {
  const location = useLocation();
  const urlManager = useURLManager();
  
  // Initialize state from URL parameters
  const [searchQuery, setSearchQuery] = useState(urlManager.currentSearch);
  const [selectedCity, setSelectedCity] = useState(urlManager.currentCity || 'all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState(urlManager.currentSortBy || 'rating');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(urlManager.currentPage);
  const [isLoading, setIsLoading] = useState(false);

  const ITEMS_PER_PAGE = 15;
  const cities = getCafeCities();
  const categories = getCafeCategories();

  // Sync URL with component state when URL changes
  useEffect(() => {
    setSearchQuery(urlManager.currentSearch);
    setSelectedCity(urlManager.currentCity || 'all');
    setSortBy(urlManager.currentSortBy || 'rating');
    setCurrentPage(urlManager.currentPage);
  }, [urlManager.searchParams]);

  // Simulate initial loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredAndSortedCafes = useMemo(() => {
    let filtered = cafes;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(cafe =>
        cafe.place_name.toLowerCase().includes(query) ||
        cafe.cafe_category.toLowerCase().includes(query) ||
        cafe.neighborhood.toLowerCase().includes(query) ||
        cafe.city.toLowerCase().includes(query)
      );
    }

    // Filter by city
    if (selectedCity !== 'all') {
      filtered = filtered.filter(cafe => cafe.city === selectedCity);
    }

    // Filter by cafe category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(cafe => {
        if (!cafe.cafe_category) return false;
        
        // Split the cafe's category by delimiters and check for exact matches
        const cafeCategories = cafe.cafe_category
          .split(/[,/]| and /)
          .map(cat => cat.trim().toLowerCase())
          .filter(cat => cat && cat.length > 0);
        
        return cafeCategories.some(category => 
          category === selectedCategory.toLowerCase()
        );
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return Number(b.total_score || 0) - Number(a.total_score || 0);
        case 'name':
          return a.place_name.localeCompare(b.place_name);
        case 'price-low':
          return parseFloat(a.menu_price_range.split('-')[0].replace(/[^\d]/g, '')) - 
                 parseFloat(b.menu_price_range.split('-')[0].replace(/[^\d]/g, ''));
        case 'price-high':
          return parseFloat(b.menu_price_range.split('-')[0].replace(/[^\d]/g, '')) - 
                 parseFloat(a.menu_price_range.split('-')[0].replace(/[^\d]/g, ''));
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedCity, selectedCategory, sortBy]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedCafes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPageCafes = filteredAndSortedCafes.slice(startIndex, endIndex);

  // Reset to first page when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
    setIsLoading(true);
    // Update URL with new filters
    urlManager.updateURL({
      search: searchQuery,
      city: selectedCity !== 'all' ? selectedCity : '',
      sortBy: sortBy,
      page: 1
    });
    // Simulate loading delay
    setTimeout(() => setIsLoading(false), 500);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Update URL with new page
    urlManager.updateParam('page', page);
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    // Update URL with search query
    urlManager.updateURL({
      search: value,
      page: 1
    });
  };

  // Handle city filter change
  const handleCityChange = (value: string) => {
    setSelectedCity(value);
    setCurrentPage(1);
    // Update URL with city filter
    urlManager.updateURL({
      city: value !== 'all' ? value : '',
      page: 1
    });
    handleFilterChange();
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value);
    // Update URL with sort option
    urlManager.updateParam('sortBy', value);
    handleFilterChange();
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCity('all');
    setSelectedCategory('all');
    setSortBy('rating');
    setCurrentPage(1);
    // Reset URL to default state
    urlManager.resetFilters();
    handleFilterChange();
  };

  const getScoreColor = (score: number) => {
    if (score >= 4.0) return 'text-green-600';
    if (score >= 3.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-gray-900">
                Discover Amazing <span className="text-emerald-600">Cafes</span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto">
                Find the perfect spot for your coffee, study sessions, meetings, or just relaxing in Pakistan's best cafes
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Mobile Filters Toggle */}
            <div className="lg:hidden mb-6">
              <Button 
                variant="outline" 
                className="w-full transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md active:scale-[0.98]" 
                onClick={() => setShowMobileFilters(!showMobileFilters)}
              >
                <Filter className="h-4 w-4 mr-2 transition-transform duration-300" />
                Filters & Search
              </Button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar Filters */}
          <div className={`w-full lg:w-80 lg:flex-shrink-0 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
            <Card className="lg:sticky lg:top-8 border-0 shadow-lg">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Filter className="h-5 w-5 text-gray-500" />
                  <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                </div>
                
                <div className="space-y-6">
                  {/* Search */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search cafes, neighborhoods..."
                        value={searchQuery}
                        onChange={(e) => {
                          handleSearchChange(e.target.value);
                        }}
                        className="pl-10 transition-all duration-300 transform hover:scale-[1.01] focus:scale-[1.02] focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* City Filter */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">City</label>
                    <Select value={selectedCity} onValueChange={(value) => {
                      handleCityChange(value);
                    }} disabled={isLoading}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select City" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Cities</SelectItem>
                        {cities.filter(city => city && city.trim()).map(city => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
                    <Select value={selectedCategory} onValueChange={(value) => {
                      setSelectedCategory(value);
                      handleFilterChange();
                    }} disabled={isLoading}>
                      <SelectTrigger>
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.filter(category => category && category.trim()).map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sort */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Sort By</label>
                    <Select value={sortBy} onValueChange={(value) => {
                      handleSortChange(value);
                    }} disabled={isLoading}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                        <SelectItem value="name">Name (A-Z)</SelectItem>
                        <SelectItem value="price-low">Price (Low to High)</SelectItem>
                        <SelectItem value="price-high">Price (High to Low)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Clear Filters */}
                  <Button 
                    variant="outline" 
                    className="w-full transition-all duration-300 hover:scale-105"
                    onClick={handleClearFilters}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Clearing...' : 'Clear All Filters'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Content */}
          <div className="flex-1">
            {/* Pagination Info */}
            {totalPages > 1 && (
              <div className="flex justify-end mb-8">
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages} • Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedCafes.length)} of {filteredAndSortedCafes.length}
                </div>
              </div>
            )}

            {/* Cafe Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {isLoading ? (
                // Show skeleton loaders while loading
                Array.from({ length: 6 }).map((_, index) => (
                  <VenueCardSkeleton key={index} />
                ))
              ) : (
                currentPageCafes.map((cafe) => (
                  <Link key={cafe.cafe_index} to={createVenueUrl('cafe', cafe.cafe_index, cafe.place_name)}>
                    <Card className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                      <div className="listing-card-container">
                        <ComprehensiveVenueImage
                          category="cafes"
                          placeId={(cafe as any).original_place_id || cafe.place_name}
                          placeName={cafe.place_name}
                          alt={cafe.place_name}
                          className="w-full h-full object-cover"
                          showSlider={false}
                        />
                        
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-emerald-100 text-emerald-800 text-xs">
                            {cafe.cafe_category}
                          </Badge>
                        </div>
                        
                        <div className="absolute top-3 right-3">
                          <div className="bg-white bg-opacity-95 px-2 sm:px-3 py-1 rounded-lg text-center">
                            <div className={`text-sm sm:text-lg font-bold ${getScoreColor(Number(cafe.total_score || 0))}`}>
                              {Number(cafe.total_score || 0).toFixed(1)}
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
                            {cafe.place_name}
                          </h3>
                          <p className="text-gray-600 mb-2 text-sm">{cafe.cafe_category}</p>
                          <div className="flex items-center text-gray-600 text-sm mb-2">
                            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                            <span className="truncate">{cafe.neighborhood}, {cafe.city}</span>
                          </div>
                          <div className="text-base sm:text-lg font-semibold text-gray-900">
                            {cafe.menu_price_range}
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {cafe.about}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
                          {cafe.coffee_and_beverages.split(', ').slice(0, 2).map((item, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {item}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            View Details
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-emerald-600 hover:bg-emerald-700 sm:w-auto w-full"
                            onClick={(e) => {
                              e.preventDefault();
                              window.open(`tel:${cafe.phone_number}`, '_self');
                            }}
                          >
                            <Phone className="w-3 h-3 mr-1" />
                            Call
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
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

            {/* No Results */}
            {currentPageCafes.length === 0 && filteredAndSortedCafes.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No cafes found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or filters to find more cafes.
                </p>
                <Button
                  onClick={handleClearFilters}
                  variant="outline"
                >
                  Clear Filters
                </Button>
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

export default CafeListing;