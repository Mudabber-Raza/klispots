import React, { useState } from 'react';
import { AccurateLocalVenueImage } from '../components/shared/AccurateLocalVenueImage';
import { getMappingStats, getVenuesByCategory } from '../utils/AccurateLocalVenueMapper';

export const TestAccurateLocalMapper: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showDebug, setShowDebug] = useState(false);

  const stats = getMappingStats();
  const categories = Object.keys(stats?.categories || {});

  const getVenuesToShow = () => {
    if (selectedCategory === 'all') {
      return stats?.total_venues || 0;
    }
    return stats?.categories[selectedCategory as keyof typeof stats.categories] || 0;
  };

  const getSampleVenues = () => {
    if (selectedCategory === 'all') {
      return [
        { name: 'Zee Avenue', category: 'shopping', placeId: 'ChIJtRURlDQbGTkRQNFQ9aCui_g' },
        { name: 'Zarar Cafe', category: 'cafes', placeId: 'ChIJV1VF8fMVsz4R6FJfaSzZsRE' },
        { name: 'Ziggurat Art Gallery', category: 'arts-culture', placeId: 'ChIJheW_tRE9sz4Rjq3sq-aBcz0' },
        { name: 'Z Body Tech Ladies Gym', category: 'health-wellness', placeId: 'ChIJOxFsg_cBGTkRxAPFFJ7xt4o' }
      ];
    }

    const venues = getVenuesByCategory(selectedCategory);
    return venues.slice(0, 4).map(venue => ({
      name: venue.place_name,
      category: venue.category,
      placeId: venue.place_id
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🎯 Accurate Local Venue Mapper Test
          </h1>
          <p className="text-gray-600 mb-6">
            This page tests the 100% accurate venue image mapping using your local 
            <code className="bg-gray-100 px-2 py-1 rounded">google_places_images1</code> folder structure.
          </p>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats?.total_venues || 0}</div>
              <div className="text-sm text-blue-800">Total Venues</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{Object.keys(stats?.categories || {}).length}</div>
              <div className="text-sm text-green-800">Categories</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{stats?.cities?.Lahore || 0}</div>
              <div className="text-sm text-purple-800">Lahore Venues</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{stats?.cities?.Karachi || 0}</div>
              <div className="text-sm text-orange-800">Karachi Venues</div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-medium ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Categories
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} ({stats?.categories[category as keyof typeof stats.categories] || 0})
              </button>
            ))}
          </div>

          {/* Debug Toggle */}
          <div className="flex items-center gap-2 mb-6">
            <input
              type="checkbox"
              id="debug-toggle"
              checked={showDebug}
              onChange={(e) => setShowDebug(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="debug-toggle" className="text-sm font-medium text-gray-700">
              Show Debug Info
            </label>
          </div>

          {/* Venue Count */}
          <div className="text-sm text-gray-600 mb-6">
            Showing {getVenuesToShow()} venues for {selectedCategory === 'all' ? 'all categories' : selectedCategory}
          </div>
        </div>

        {/* Sample Venues */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {getSampleVenues().map((venue, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48">
                <AccurateLocalVenueImage
                  category={venue.category}
                  venueName={venue.name}
                  placeId={venue.placeId}
                  className="w-full h-full"
                  showDebug={showDebug}
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{venue.name}</h3>
                <p className="text-sm text-gray-600 capitalize">{venue.category.replace('-', ' ')}</p>
                <p className="text-xs text-gray-500 mt-1">{venue.placeId}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mapping Pattern Info */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📁 Mapping Pattern</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Pattern:</strong> {stats?.image_pattern}
            </p>
            <div className="text-sm text-gray-600">
              <div><strong>Example:</strong></div>
              <div className="bg-white p-2 rounded mt-1 font-mono text-xs">
                <div>Folder: {stats?.example?.folder}</div>
                <div>Image: {stats?.example?.image}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};





