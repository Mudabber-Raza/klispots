import React, { useState } from 'react';
import { OtherCategoriesVenueImage } from '../components/shared/OtherCategoriesVenueImage';
import { getOtherCategoriesMappingStats, getSampleVenuesFromCategory, searchVenuesInOtherCategories } from '../utils/ComprehensiveOtherCategoriesMapper';

export const TestOtherCategoriesMapper: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showDebug, setShowDebug] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const stats = getOtherCategoriesMappingStats();
  const categories = Object.keys(stats?.categories || {});

  const getVenuesToShow = () => {
    if (selectedCategory === 'all') {
      return stats?.total_venues || 0;
    }
    return stats?.categories[selectedCategory as keyof typeof stats.categories] || 0;
  };

  const getSampleVenues = () => {
    if (selectedCategory === 'all') {
      // Get sample from each category
      const allSamples = categories.flatMap(cat => 
        getSampleVenuesFromCategory(cat, 2)
      );
      return allSamples.slice(0, 10); // Show max 10 samples
    }
    return getSampleVenuesFromCategory(selectedCategory, 10);
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      const results = searchVenuesInOtherCategories(searchTerm, selectedCategory === 'all' ? undefined : selectedCategory);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎯 Other Categories Venue Mapper Test
          </h1>
          <p className="text-xl text-gray-600">
            Testing venue image loading for ALL categories (excluding restaurants & cafes)
          </p>
        </div>

        {/* Statistics */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">📊 Mapping Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{stats?.total_venues || 0}</div>
              <div className="text-sm text-gray-600">Total Venues</div>
            </div>
            {categories.map(category => (
              <div key={category} className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats?.categories[category as keyof typeof stats.categories] || 0}
                </div>
                <div className="text-sm text-gray-600 capitalize">{category.replace('-', ' ')}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Created: {stats?.created_at ? new Date(stats.created_at).toLocaleString() : 'N/A'}
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <label className="text-sm font-medium text-gray-700">Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-4 items-center">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showDebug}
                  onChange={(e) => setShowDebug(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-700">Show Debug Info</span>
              </label>
            </div>
          </div>

          {/* Search */}
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              placeholder="Search venues by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
            >
              Search
            </button>
            <button
              onClick={clearSearch}
              className="bg-gray-500 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-600"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              🔍 Search Results ({searchResults.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((venue, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">{venue.place_name}</h4>
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="capitalize">{venue.category.replace('-', ' ')}</span> • {venue.city}
                  </div>
                  <OtherCategoriesVenueImage
                    category={venue.category}
                    venueName={venue.place_name}
                    placeId={venue.place_id}
                    className="w-full h-32 object-cover rounded"
                    showDebug={showDebug}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sample Venues */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            🎭 Sample Venues from {selectedCategory === 'all' ? 'All Categories' : selectedCategory.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} ({getVenuesToShow()})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getSampleVenues().map((venue, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <OtherCategoriesVenueImage
                  category={venue.category}
                  venueName={venue.place_name}
                  placeId={venue.place_id}
                  className="w-full h-48 object-cover"
                  showDebug={showDebug}
                  showCarousel={venue.available_images && venue.available_images.length > 1}
                />
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{venue.place_name}</h4>
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="capitalize">{venue.category.replace('-', ' ')}</span> • {venue.city}
                  </div>
                  {venue.neighborhood && (
                    <div className="text-xs text-gray-500 mb-2">{venue.neighborhood}</div>
                  )}
                  {venue.available_images && venue.available_images.length > 0 && (
                    <div className="text-xs text-blue-600">
                      {venue.available_images.length} image{venue.available_images.length !== 1 ? 's' : ''} available
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {getSampleVenues().length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No venues found for the selected category.
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">ℹ️ How to Test</h3>
          <ul className="text-blue-800 text-sm space-y-2">
            <li>• <strong>Category Selection:</strong> Choose a specific category to see venues from that category only</li>
            <li>• <strong>Search:</strong> Search for specific venues by name across all or selected categories</li>
            <li>• <strong>Debug Mode:</strong> Enable to see detailed mapping information for each venue</li>
            <li>• <strong>Image Carousel:</strong> Venues with multiple images will show navigation arrows</li>
            <li>• <strong>Restaurants & Cafes:</strong> These are intentionally skipped as they have their own working system</li>
          </ul>
        </div>
      </div>
    </div>
  );
};





