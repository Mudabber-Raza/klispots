import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Phone, Filter, Search } from 'lucide-react';
import { sportsFitnessVenues, getSportsFitnessCities, getSportsFitnessTypes, SportsFitnessVenue } from '@/data/sports-fitness';
import ComprehensiveVenueImage from '@/components/shared/ComprehensiveVenueImage';
import CustomPagination from '@/components/ui/custom-pagination';
import { createVenueUrl } from '@/utils/urlSlugs';

const SportsFitnessListing = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 15;
  const cities = getSportsFitnessCities();
  const types = getSportsFitnessTypes();

  const filteredAndSortedVenues = useMemo(() => {
    let filtered = sportsFitnessVenues;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(venue =>
        (venue.place_name || '').toLowerCase().includes(query) ||
        venue.facility_type.toLowerCase().includes(query) ||
        venue.neighborhood.toLowerCase().includes(query) ||
        venue.city.toLowerCase().includes(query)
      );
    }

    // Filter by city
    if (selectedCity !== 'all') {
      filtered = filtered.filter(venue => venue.city === selectedCity);
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(venue => 
        venue.facility_type.toLowerCase().includes(selectedType.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (Number(b.total_score) || 0) - (Number(a.total_score) || 0);
        case 'name':
          return (a.place_name || '').localeCompare(b.place_name || '');
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedCity, selectedType, sortBy]);

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        <section className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                Sports & Fitness
              </h1>
              <p className="text-xl lg:text-2xl opacity-90 max-w-3xl mx-auto">
                Explore {sportsFitnessVenues.length} carefully curated sports and fitness venues across Pakistan
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
                <Card className="lg:sticky lg:top-32">
                  <div className="p-4 lg:p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Filter className="h-5 w-5 text-gray-500" />
                      <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                    </div>
                    
                    <div className="space-y-6">
                      {/* Search */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Search</label>
                        <div className="relative group">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 transition-all duration-300 group-focus-within:text-emerald-500 group-focus-within:scale-110" />
                          <Input
                            placeholder="Search sports & fitness venues..."
                            value={searchQuery}
                            onChange={(e) => {
                              setSearchQuery(e.target.value);
                              handleFilterChange();
                            }}
                            className="pl-10 transition-all duration-300 transform hover:scale-[1.01] focus:scale-[1.02] focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                          />
                        </div>
                      </div>
                      
                      {/* City Filter */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">City</label>
                        <Select value={selectedCity} onValueChange={(value) => {
                          setSelectedCity(value);
                          handleFilterChange();
                        }}>
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

                      {/* Type Filter */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Type</label>
                        <Select value={selectedType} onValueChange={(value) => {
                          setSelectedType(value);
                          handleFilterChange();
                        }}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            {types.filter(type => type && type.trim()).map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Sort */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Sort By</label>
                        <Select value={sortBy} onValueChange={(value) => {
                          setSortBy(value);
                          handleFilterChange();
                        }}>
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
                          setSelectedType('all');
                          setSortBy('rating');
                          setCurrentPage(1);
                        }}
                      >
                        Clear All Filters
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Content */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {filteredAndSortedVenues.length} Venue{filteredAndSortedVenues.length !== 1 ? 's' : ''} Found
                  </h2>
                  {totalPages > 1 && (
                    <div className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages} • Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedVenues.length)} of {filteredAndSortedVenues.length}
                    </div>
                  )}
                </div>

                {/* Results Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {currentPageVenues.map((venue, index) => (
                    <Link key={index} to={createVenueUrl('sports-fitness', venue.venue_index, venue.place_name || 'Unknown')}>
                      <Card className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <div className="relative h-48 bg-gradient-to-br from-orange-100 to-orange-200">
                          <ComprehensiveVenueImage
                            category="sports-fitness"
                            placeId={(venue as any).original_place_id || venue.place_name}
                            placeName={venue.place_name}
                            alt={venue.place_name || 'Sports & Fitness venue'}
                            className="w-full h-full object-cover"
                          />
                          
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-orange-100 text-orange-800">
                              {venue.facility_type}
                            </Badge>
                          </div>
                          
                          <div className="absolute top-3 right-3">
                            <div className="bg-white bg-opacity-95 px-3 py-1 rounded-lg text-center">
                              <div className={`text-lg font-bold ${getScoreColor(Number(venue.total_score) || 0)}`}>
                                {(Number(venue.total_score) || 0).toFixed(1)}
                              </div>
                              <div className="flex items-center text-xs text-gray-500">
                                <Star className="w-3 h-3 fill-current mr-1" />
                              </div>
                            </div>
                          </div>
                        </div>

                        <CardContent className="p-6">
                          <div className="mb-4">
                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                              {venue.place_name}
                            </h3>
                            <p className="text-gray-600 mb-2">{venue.facility_type}</p>
                            <div className="flex items-center text-gray-600 text-sm mb-2">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span>{venue.neighborhood}, {venue.city}</span>
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {venue.about}
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            <Button variant="outline" size="sm" className="flex-1 mr-2">
                              View Details
                            </Button>
                            <Button 
                              size="sm" 
                              className="bg-orange-600 hover:bg-orange-700"
                              onClick={(e) => {
                                e.preventDefault();
                                window.open(`tel:${venue.phone_number}`, '_self');
                              }}
                            >
                              <Phone className="w-3 h-3 mr-1" />
                              Call
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
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
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No sports & fitness venues found</h3>
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

export default SportsFitnessListing;