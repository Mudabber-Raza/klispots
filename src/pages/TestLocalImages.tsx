import React from 'react';
import { LocalVenueImage } from '@/components/shared/LocalVenueImage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const TestLocalImages: React.FC = () => {
  const testVenues = [
    { category: 'shopping', name: '14th Street Pizza', expected: '14th_Street_Pizza_ChIJXR1VYOw-sz4Rao3SmJpzZnE' },
    { category: 'restaurants', name: '14th Street Pizza', expected: '14th_Street_Pizza_ChIJXR1VYOw-sz4Rao3SmJpzZnE' },
    { category: 'cafes', name: '1923 Coffee Shop', expected: '1923_Coffee_Shop_ChIJaxWMQWAFGTkRnaX2CN3bJyY' },
    { category: 'entertainment', name: '1969 Restaurant', expected: '1969_Restaurant_ChIJXV_Db-O_3zgRumwPJFsWMog' },
    { category: 'arts-culture', name: '14th Street Pizza Co.', expected: '14th_Street_Pizza_Co._ChIJEXVP9n-_3zgR1ahso6NpYh8' },
    { category: 'health-wellness', name: '14th Street Pizza Co. Johar Town', expected: '14th_Street_Pizza_Co._Johar_Town_8293' },
    { category: 'sports-fitness', name: '14th Street Pizza', expected: '14th_Street_Pizza_ChIJXR1VYOw-sz4Rao3SmJpzZnE' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">🧪 Local Image System Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testVenues.map((venue, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{venue.name}</CardTitle>
                <p className="text-sm text-gray-600 capitalize">{venue.category}</p>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <LocalVenueImage
                    category={venue.category}
                    venueName={venue.name}
                    alt={venue.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-xs text-gray-500">
                  <p><strong>Expected folder:</strong></p>
                  <p className="font-mono break-all">{venue.expected}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Check the browser console for detailed logging of the image loading process.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestLocalImages;
