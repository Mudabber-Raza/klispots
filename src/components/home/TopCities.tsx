
import { MapPin, Utensils } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const TopCities = () => {
  const cities = [
    {
      name: 'Karachi',
      description: 'Coastal flavors and diverse international cuisine',
      restaurantCount: 200,
      topCuisines: ['Pakistani', 'Chinese', 'Continental', 'Seafood'],
      image: 'karachi-gradient',
      highlights: ['Seaside dining', 'Street food', 'International chains']
    },
    {
      name: 'Lahore',
      description: 'Traditional Pakistani cuisine and Mughlai heritage',
      restaurantCount: 180,
      topCuisines: ['Pakistani', 'Mughlai', 'Punjabi', 'Fast Food'],
      image: 'lahore-gradient',
      highlights: ['Food street culture', 'Traditional recipes', 'Heritage dining']
    },
    {
      name: 'Islamabad',
      description: 'Modern dining with scenic mountain views',
      restaurantCount: 120,
      topCuisines: ['Pakistani', 'Continental', 'Italian', 'Chinese'],
      image: 'islamabad-gradient',
      highlights: ['Mountain restaurants', 'Modern cuisine', 'Fine dining']
    }
  ];

  const getGradientClass = (image: string) => {
    switch (image) {
      case 'karachi-gradient':
        return 'bg-gradient-to-br from-blue-400 to-teal-500';
      case 'lahore-gradient':
        return 'bg-gradient-to-br from-orange-400 to-red-500';
      case 'islamabad-gradient':
        return 'bg-gradient-to-br from-green-400 to-emerald-600';
      default:
        return 'bg-gradient-to-br from-gray-400 to-gray-600';
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Explore Pakistan's Food Cities
          </h2>
          <p className="text-xl text-gray-600">
            Each city offers a unique culinary journey waiting to be discovered
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {cities.map((city, index) => (
            <Card key={city.name} className="group hover:shadow-xl transition-all duration-300 cursor-pointer">
              {/* City Header Image */}
              <div className={`h-48 ${getGradientClass(city.image)} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold">{city.name}</h3>
                  <div className="flex items-center mt-1">
                    <Utensils className="w-4 h-4 mr-1" />
                    <span className="text-sm">{city.restaurantCount}+ restaurants</span>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <p className="text-gray-600 mb-4">{city.description}</p>

                {/* Top Cuisines */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Popular Cuisines:</h4>
                  <div className="flex flex-wrap gap-2">
                    {city.topCuisines.map((cuisine) => (
                      <span
                        key={cuisine}
                        className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full"
                      >
                        {cuisine}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Highlights */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">City Highlights:</h4>
                  <ul className="space-y-1">
                    {city.highlights.map((highlight) => (
                      <li key={highlight} className="text-sm text-gray-600 flex items-center">
                        <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mr-2"></div>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-medium transition-colors group-hover:shadow-lg">
                  Explore {city.name}
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopCities;
