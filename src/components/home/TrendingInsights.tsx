
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Search, Clock, Users, Star, MapPin } from 'lucide-react';

const TrendingInsights = () => {
  const trendingSearches = [
    { query: 'Best Biryani Karachi', count: 1240, trend: '+15%' },
    { query: 'Coffee Shops Lahore', count: 890, trend: '+22%' },
    { query: 'Fine Dining Islamabad', count: 670, trend: '+8%' },
    { query: 'Shopping Malls DHA', count: 560, trend: '+31%' },
    { query: 'Family Restaurants', count: 450, trend: '+12%' }
  ];

  const mostReviewed = [
    { name: 'Okra Restaurant', city: 'Karachi', reviews: 127, avgRating: 8.7 },
    { name: "Cooco's Den", city: 'Lahore', reviews: 98, avgRating: 8.5 },
    { name: 'Monal Restaurant', city: 'Islamabad', reviews: 84, avgRating: 8.1 },
    { name: 'Café Flo', city: 'Karachi', reviews: 76, avgRating: 8.2 }
  ];

  const recentlyAdded = [
    { name: 'Rooftop Grill', city: 'Karachi', category: 'BBQ', addedDays: 2 },
    { name: 'Urban Café', city: 'Lahore', category: 'Coffee Shop', addedDays: 5 },
    { name: 'Himalaya Restaurant', city: 'Islamabad', category: 'Pakistani', addedDays: 7 },
    { name: 'Spice Garden', city: 'Karachi', category: 'Indian', addedDays: 10 }
  ];

  const seasonalRecommendations = [
    {
      title: 'Winter Warmers',
      description: 'Cozy spots perfect for cold weather',
      places: ['Chai Shai', 'Coffee Corner', 'Hot Pot Palace']
    },
    {
      title: 'Date Night Specials',
      description: 'Romantic dining experiences',
      places: ['The Basil Leaf', 'Okra', 'Cooco\'s Den']
    },
    {
      title: 'Family Gatherings',
      description: 'Spacious venues for large groups',
      places: ['Monal', 'PC Hotel', 'Marriott']
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Trending & Insights
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover what's popular this week and stay ahead of the trends
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Trending Searches */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Search className="w-6 h-6 text-emerald-600" />
                Popular Searches This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trendingSearches.map((search, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{search.query}</div>
                      <div className="text-sm text-gray-600">{search.count.toLocaleString()} searches</div>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {search.trend}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Most Reviewed */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Star className="w-6 h-6 text-emerald-600" />
                Most Reviewed This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mostReviewed.map((place, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{place.name}</div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-3 h-3" />
                        {place.city}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-600">{place.avgRating}</div>
                      <div className="text-xs text-gray-600">{place.reviews} reviews</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recently Added */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Clock className="w-6 h-6 text-emerald-600" />
                Recently Added
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentlyAdded.map((place, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{place.name}</div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-3 h-3" />
                        {place.city}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="mb-1">
                        {place.category}
                      </Badge>
                      <div className="text-xs text-gray-600">{place.addedDays} days ago</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Seasonal Recommendations */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Users className="w-6 h-6 text-emerald-600" />
                Seasonal Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {seasonalRecommendations.map((season, index) => (
                  <div key={index} className="p-4 bg-emerald-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">{season.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{season.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {season.places.map((place, placeIndex) => (
                        <Badge key={placeIndex} variant="secondary" className="text-xs">
                          {place}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TrendingInsights;
