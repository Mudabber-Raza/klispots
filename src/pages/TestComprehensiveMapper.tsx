import React, { useState } from 'react';
import { ComprehensiveVenueImage } from '@/components/shared/ComprehensiveVenueImage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  getMappingStats, 
  getSampleVenuesFromCategory, 
  searchVenues,
  getAvailableS3Folders,
  getVenueMappingCacheStats,
  clearVenueMappingCache,
  getAvailablePlaceIds
} from '@/utils/ComprehensiveVenueMapper';

export const TestComprehensiveMapper: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('shopping');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['shopping', 'restaurants', 'cafes', 'entertainment', 'arts-culture', 'health-wellness', 'sports-fitness'];

  const stats = getMappingStats();
  const sampleVenues = getSampleVenuesFromCategory(selectedCategory, 10);
  const searchResults = searchTerm ? searchVenues(searchTerm, selectedCategory) : [];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🎯 Comprehensive Venue Mapper Test</h1>
      
      {/* Mapping Statistics */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>📊 Mapping Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Venues</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.mapped}</div>
              <div className="text-sm text-gray-600">Mapped</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.unmapped}</div>
              <div className="text-sm text-gray-600">Unmapped</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((stats.mapped / stats.total) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
          
          {/* Category Breakdown */}
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Category Breakdown:</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {Object.entries(stats.categories).map(([category, data]) => (
                <div key={category} className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-semibold text-sm">{category}</div>
                  <div className="text-xs text-gray-600">
                    {data.mapped}/{data.total}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Selection */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Select Category:</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Search Venues:</h2>
        <input
          type="text"
          placeholder="Search venues..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Sample Venues */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">
          Sample Venues from {selectedCategory} ({sampleVenues.length} found)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sampleVenues.map((venue, index) => (
            <Card key={index} className="overflow-hidden">
              <ComprehensiveVenueImage
                category={selectedCategory}
                venueName={venue.place_name}
                placeId={venue.place_id}
                alt={venue.place_name}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{venue.place_name}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{venue.category}</Badge>
                  <Badge variant="outline">{venue.city}</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{venue.city}</p>
                <div className="text-xs text-gray-500">
                  <div>Images: {venue.available_images.length}</div>
                  <div>Folder: {venue.s3_folder}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Search Results */}
      {searchTerm && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">
            Search Results for "{searchTerm}" ({searchResults.length} found)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.slice(0, 6).map((venue, index) => (
              <Card key={index} className="overflow-hidden">
                <ComprehensiveVenueImage
                  category={venue.category}
                  venueName={venue.place_name}
                  placeId={venue.place_id}
                  alt={venue.place_name}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{venue.place_name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{venue.category}</Badge>
                    <Badge variant="outline">{venue.city}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{venue.city}</p>
                  <div className="text-xs text-gray-500">
                    <div>Images: {venue.available_images.length}</div>
                    <div>Folder: {venue.s3_folder}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Restaurant & Cafe Specific Testing */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">🍽️ Restaurant & Cafe Testing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Restaurants Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🍕 Restaurants Test
                <Badge variant="secondary">
                  {getSampleVenuesFromCategory('restaurants', 1).length > 0 ? 'Available' : 'Not Available'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Test restaurant image mapping with our comprehensive system
              </p>
              <Button 
                variant="outline" 
                onClick={() => setSelectedCategory('restaurants')}
                className="w-full"
              >
                Switch to Restaurants
              </Button>
            </CardContent>
          </Card>

          {/* Cafes Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                ☕ Cafes Test
                <Badge variant="secondary">
                  {getSampleVenuesFromCategory('cafes', 1).length > 0 ? 'Available' : 'Not Available'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Test cafe image mapping with our comprehensive system
              </p>
              <Button 
                variant="outline" 
                onClick={() => setSelectedCategory('cafes')}
                className="w-full"
              >
                Switch to Cafes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* System Information */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">🔧 System Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Cache Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <div>Cache Size: {getVenueMappingCacheStats().cacheSize}</div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearVenueMappingCache}
                  className="mt-2 w-full"
                >
                  Clear Cache
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Folders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <div>Total Folders: {getAvailableS3Folders().total}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {getAvailableS3Folders().folders.slice(0, 3).join(', ')}
                  {getAvailableS3Folders().total > 3 && '...'}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Place IDs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <div>Total IDs: {getAvailablePlaceIds().total}</div>
                <div className="text-xs text-gray-500 mt-1">
                  Sample: {getAvailablePlaceIds().placeIds.slice(0, 2).join(', ')}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TestComprehensiveMapper;
