import { useState, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useURLManager } from '@/utils/urlManager';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Phone, Filter, Search } from 'lucide-react';
import { artsCultureVenues, getArtsCultureCities, getArtsCultureCategories, ArtsCultureVenue } from '@/data/arts-culture';
import { ComprehensiveVenueImage } from '@/components/shared/ComprehensiveVenueImage';
import CustomPagination from '@/components/ui/custom-pagination';
import { createVenueUrl } from '@/utils/urlSlugs';

const ArtsCultureListing = () => {
  const location = useLocation();
  const urlManager = useURLManager();
  
  const [searchQuery, setSearchQuery] = useState(urlManager.currentSearch);
  const [selectedCity, setSelectedCity] = useState(urlManager.currentCity || 'all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState(urlManager.currentSortBy || 'rating');
  const [currentPage, setCurrentPage] = useState(urlManager.currentPage);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const ITEMS_PER_PAGE = 15;
  const cities = getArtsCultureCities();
  const categories = getArtsCultureCategories();

  // Initialize search from URL parameters
  useEffect(() => {
    setSearchQuery(urlManager.currentSearch);
    setSelectedCity(urlManager.currentCity || 'all');
    setSortBy(urlManager.currentSortBy || 'rating');
    setCurrentPage(urlManager.currentPage);
  }, [urlManager.searchParams]);

  const filteredAndSortedVenues = useMemo(() => {
    let filtered = artsCultureVenues;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(venue =>
        (venue.place_name || '').toLowerCase().includes(query) ||
        (venue.venue_category || '').toLowerCase().includes(query) ||
        (venue.neighborhood || '').toLowerCase().includes(query) ||
        (venue.city || '').toLowerCase().includes(query)
      );
    }

    // Filter by city
    if (selectedCity !== 'all') {
      filtered = filtered.filter(venue => venue.city === selectedCity);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(venue => 
        (venue.venue_category || '').toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (Number(b.total_score) || 0) - (Number(a.total_score) || 0);
        case 'name':
          return a.place_name.localeCompare(b.place_name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedCity, selectedCategory, sortBy]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedVenues.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPageVenues = filteredAndSortedVenues.slice(startIndex, endIndex);

  // Reset to first page when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
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
    setSortBy('rating');
    setCurrentPage(1);
    // Reset URL to default state
    urlManager.resetFilters();
    handleFilterChange();
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-emerald-600';
    if (score >= 7) return 'text-yellow-600';
    return 'text-orange-600';
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
                Discover Amazing <span className="text-emerald-600">Arts & Culture</span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto">
                Find the perfect spot for your cultural experiences, art exhibitions, performances, or just immersing yourself in Pakistan's rich artistic heritage
              </p>
            </div>
          </div>
        </section>

        {/* Filters and Results */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar - Filters */}
            <div className="lg:w-80">
              <Card className="sticky top-24">
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-gray-500" />
                    <h3 className="text-lg font-semibold">Filters</h3>
                  </div>

                  {/* Search */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Search</label>
                    <Input
                      placeholder="Search venues..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        handleFilterChange();
                      }}
                      className="w-full"
                    />
                  </div>

                  {/* City Filter */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">City</label>
                    <Select 
                      value={selectedCity} 
                      onValueChange={handleCityChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select City" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Cities</SelectItem>
                        {cities.map(city => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sort */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Sort By</label>
                    <Select 
                      value={sortBy} 
                      onValueChange={handleSortChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sort By" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                        <SelectItem value="name">Name A-Z</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Clear Filters */}
                  <Button 
                    variant="outline" 
                    className="w-full transition-all duration-300 hover:scale-105"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCity('all');
                      setSelectedCategory('all');
                      setSortBy('rating');
                      setCurrentPage(1);
                    }}
                  >
                    Clear All Filters
                  </Button>
                </CardContent>
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
                                  {currentPageVenues.map((venue, pageIndex) => {
                    // Use the stable venue_index instead of calculating from array position
                    const venueId = venue.venue_index;
                    
                    // Skip venues without a valid venue_index
                    if (!venueId) {
                      return null;
                    }
                      
                    return (
                      <Link key={venueId} to={createVenueUrl('arts-culture', venueId, venue.place_name || 'Unknown')}>
                      <Card className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <div className="listing-card-container">
                          <ComprehensiveVenueImage
                            category="arts-culture"
                            placeName={venue.place_name}
                            alt={venue.place_name || 'Arts & Culture venue'}
                            className="w-full h-full object-cover"
                          />
                          
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-indigo-100 text-indigo-800 text-xs">
                              {venue.venue_category}
                            </Badge>
                          </div>
                          
                          <div className="absolute top-3 right-3">
                            <div className="bg-white bg-opacity-95 px-2 sm:px-3 py-1 rounded-lg text-center">
                              <div className={`text-sm sm:text-lg font-bold ${getScoreColor(Number(venue.total_score || 0))}`}>
                                {Number(venue.total_score || 0).toFixed(1)}
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
                              {venue.place_name}
                            </h3>
                            <p className="text-gray-600 mb-2 text-sm">{venue.venue_category}</p>
                            <div className="flex items-center text-gray-600 text-sm mb-2">
                              <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                              <span className="truncate">{venue.neighborhood}, {venue.city}</span>
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {venue.about}
                            </p>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button 
                              variant="outline" 
                              className="flex-1 rounded-lg h-10"
                            >
                              View Details
                            </Button>
                            {venue.phone_number && (
                              <Button 
                                className="bg-emerald-600 hover:bg-emerald-700 sm:w-auto w-full rounded-lg h-10"
                                onClick={(e) => {
                                  e.preventDefault();
                                  window.open(`tel:${venue.phone_number}`, '_self');
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
                })}
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

              {currentPageVenues.length === 0 && filteredAndSortedVenues.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No venues found</h3>
                  <p className="text-gray-600">Try adjusting your search criteria or filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ArtsCultureListing;