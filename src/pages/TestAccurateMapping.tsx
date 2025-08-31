import React, { useState } from 'react';
import { AccurateVenueImage } from '@/components/shared/AccurateVenueImage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAvailableVenueNames, getAvailableS3Folders, getVenueMappingCacheStats, clearVenueMappingCache } from '@/utils/AccurateVenueMapper';

export const TestAccurateMapping: React.FC = () => {
  const [useS3, setUseS3] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('shopping');

  const categories = ['shopping', 'restaurants', 'cafes', 'entertainment', 'arts-culture', 'health-wellness', 'sports-fitness'];

  const testVenues = {
    'shopping': [
      'Packages Mall',
      'Dolmen Mall Lahore',
      'Dolmen Mall - Clifton',
      'Centaurus Mall',
      'Centaurus Mall Garden',
      'Gulberg Galleria',
      'Giga Mall',
      'LuckyOne Mall',
      'Carrefour - Packages Mall',
      'Al Fatah Exclusive Mall - Hussain Chowk'
    ],
    'restaurants': [
      'Bundu Khan Restaurant',
      'California Pizza',
      'Broadway Pizza',
      'Arcadian Café',
      'Espresso',
      'Bundu Khan Restaurant - Packages Mall',
      'California Pizza - The Centaurus Mall',
      'Broadway Pizza - Dolmen Mall Clifton'
    ],
    'cafes': [
      'Arcadian Café',
      'Espresso',
      'Cafe Beirut',
      'Artisan Coffee',
      'Arcadian Café - Packages Mall',
      'Espresso Dolmen Mall Clifton'
    ],
    'entertainment': [
      'Fun City - The Centaurus Mall Islamabad',
      'Food Courts - Packages Mall',
      'Fun City',
      'Food Courts'
    ],
    'arts-culture': [
      'Artisan Coffee',
      'Cafe Beirut'
    ],
    'health-wellness': [
      'Espresso',
      'Artisan Coffee'
    ],
    'sports-fitness': [
      'Fun City',
      'Food Courts'
    ]
  };

  const getCacheStats = () => {
    const stats = getVenueMappingCacheStats();
    return stats;
  };

  const handleClearCache = () => {
    clearVenueMappingCache();
    console.log('Cache cleared');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">🎯 Accurate Venue Mapping System</h1>
          <p className="text-xl text-gray-600 mb-6">
            Precise 1:1 mapping between venue names and S3 folder names
          </p>
          
          <div className="flex justify-center gap-4 mb-6">
            <Button 
              variant={useS3 ? "default" : "outline"}
              onClick={() => setUseS3(true)}
            >
              🌐 Use S3 Images
            </Button>
            <Button 
              variant={!useS3 ? "default" : "outline"}
              onClick={() => setUseS3(false)}
            >
              💾 Use Local Images
            </Button>
          </div>

          <div className="flex justify-center gap-4 mb-6">
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-center gap-4 mb-6">
            <Badge variant="outline">
              Cache Size: {getCacheStats().size}
            </Badge>
            <Button variant="outline" onClick={handleClearCache}>
              Clear Cache
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testVenues[selectedCategory as keyof typeof testVenues]?.map((venueName, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{venueName}</CardTitle>
                <p className="text-sm text-gray-600 capitalize">{selectedCategory}</p>
                <Badge variant="secondary" className="text-xs">
                  {useS3 ? 'S3 Images' : 'Local Images'}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <AccurateVenueImage
                    category={selectedCategory}
                    venueName={venueName}
                    alt={venueName}
                    className="w-full h-full object-cover"
                    useS3={useS3}
                  />
                </div>
                
                <div className="text-xs text-gray-500 space-y-2">
                  <div>
                    <strong>Available Venue Names:</strong>
                    <p className="font-mono text-xs mt-1">
                      {getAvailableVenueNames(selectedCategory).slice(0, 3).join(', ')}
                      {getAvailableVenueNames(selectedCategory).length > 3 && '...'}
                    </p>
                  </div>
                  
                  <div>
                    <strong>S3 Folders:</strong>
                    <p className="font-mono text-xs mt-1">
                      {getAvailableS3Folders(selectedCategory).slice(0, 2).join(', ')}
                      {getAvailableS3Folders(selectedCategory).length > 2 && '...'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Check the browser console for detailed logging of the accurate mapping process.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This system provides exact 1:1 mapping between your venue data and S3 folder names.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestAccurateMapping;





