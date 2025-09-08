
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Clock, Utensils } from 'lucide-react';
import { Link } from 'react-router-dom';
import ComprehensiveVenueImage from '@/components/shared/ComprehensiveVenueImage';
import { createVenueUrl } from '@/utils/urlSlugs';

const CitySpotlight = () => {
  const cities = [
    {
      name: 'Karachi',
      description: 'Coastal flavors and diverse international cuisine',
      gradient: 'from-blue-500 to-teal-600',
      places: [
        { 
          name: 'Istanbul', 
          category: 'Restaurant', 
          score: 8.8, 
          status: 'Open',
          id: '1862',
          route: createVenueUrl('restaurant', '1862', 'Istanbul'),
          s3Category: 'restaurants'
        },
        { 
          name: 'SENZO', 
          category: 'Cafe', 
          score: 8.5, 
          status: 'Open',
          id: '182',
          route: createVenueUrl('cafe', '182', 'SENZO'),
          s3Category: 'cafes'
        },
        { 
          name: 'DOLMEN MALL - Clifton', 
          category: 'Shopping', 
          score: 8.1, 
          status: 'Open',
          id: '10',
          route: createVenueUrl('shopping', '10', 'DOLMEN MALL - Clifton'),
          s3Category: 'shopping'
        },
        { 
          name: 'The Haveli: A Museum of Textiles', 
          category: 'Arts & Culture', 
          score: 8.4, 
          status: 'Open',
          id: '31',
          route: createVenueUrl('arts-culture', '31', 'The Haveli: A Museum of Textiles'),
          s3Category: 'arts-culture'
        },
        { 
          name: 'Arts Council of Pakistan Karachi', 
          category: 'Entertainment', 
          score: 8.0, 
          status: 'Open',
          id: '15',
          route: createVenueUrl('entertainment', '15', 'Arts Council of Pakistan Karachi'),
          s3Category: 'entertainment'
        },
        { 
          name: 'Club Vibora', 
          category: 'Sports & Fitness', 
          score: 9.1, 
          status: 'Open',
          id: '10',
          route: createVenueUrl('sports-fitness', '10', 'Club Vibora'),
          s3Category: 'sports-fitness'
        }
      ],
      stats: { restaurants: "900+", cafes: "400+", shopping: "150+" }
    },
    {
      name: 'Lahore',
      description: 'Traditional Pakistani heritage and cultural significance',
      gradient: 'from-orange-500 to-red-600',
      places: [
        { 
          name: 'Bamboo Union', 
          category: 'Restaurant', 
          score: 9.2, 
          status: 'Open',
          id: '1239',
          route: createVenueUrl('restaurant', '1239', 'Lahore Bamboo Union'),
          s3Category: 'restaurants'
        },
        { 
          name: 'Artisan Coffee Roaster', 
          category: 'Cafe', 
          score: 8.2, 
          status: 'Open',
          id: '282',
          route: createVenueUrl('cafe', '282', 'Artisan Coffee Roaster'),
          s3Category: 'cafes'
        },
        { 
          name: 'Packages Mall', 
          category: 'Shopping', 
          score: 8.6, 
          status: 'Open',
          id: '1',
          route: createVenueUrl('shopping', '1', 'Packages Mall'),
          s3Category: 'shopping'
        },
        { 
          name: 'EVOKE FITNESS ARENA - GYM', 
          category: 'Health & Wellness', 
          score: 9.2, 
          status: 'Open',
          id: '369',
          route: createVenueUrl('health-wellness', '369', 'EVOKE FITNESS ARENA - GYM'),
          s3Category: 'health-wellness'
        },
        { 
          name: 'Maharani Jindan Kaur Haveli: Sarkar-i Khalsa Gallery', 
          category: 'Arts & Culture', 
          score: 8.2, 
          status: 'Open',
          id: '187',
          route: createVenueUrl('arts-culture', '187', 'Maharani Jindan Kaur Haveli: Sarkar-i Khalsa Gallery'),
          s3Category: 'arts-culture'
        },
        { 
          name: 'Padel Park Lahore', 
          category: 'Sports & Fitness', 
          score: 8.8, 
          status: 'Open',
          id: '130',
          route: createVenueUrl('sports-fitness', '130', 'Padel Park Lahore'),
          s3Category: 'sports-fitness'
        }
      ],
      stats: { restaurants: "850+", cafes: "400+", shopping: "150+" }
    },
    {
      name: 'Islamabad',
      description: 'Modern dining with scenic mountain views',
      gradient: 'from-green-500 to-emerald-700',
      places: [
        { 
          name: '1969 Restaurant', 
          category: 'Restaurant', 
          score: 8.4, 
          status: 'Open',
          id: '608',
          route: createVenueUrl('restaurant', '608', '1969 Restaurant'),
          s3Category: 'restaurants'
        },
        { 
          name: 'THE CROWN LOUNGE', 
          category: 'Cafe', 
          score: 8.7, 
          status: 'Open',
          id: '603',
          route: createVenueUrl('cafe', '603', 'THE CROWN LOUNGE'),
          s3Category: 'cafes'
        },
        { 
          name: 'Centaurus Mall', 
          category: 'Shopping', 
          score: 8.3, 
          status: 'Open',
          id: '3',
          route: createVenueUrl('shopping', '3', 'Centaurus Mall'),
          s3Category: 'shopping'
        },
        { 
          name: 'Fun Cage', 
          category: 'Entertainment', 
          score: 7.2, 
          status: 'Open',
          id: '109',
          route: createVenueUrl('entertainment', '109', 'Fun Cage'),
          s3Category: 'entertainment'
        },
        { 
          name: 'Vostro World G-13', 
          category: 'Health & Wellness', 
          score: 9.27, 
          status: 'Open',
          id: '295',
          route: createVenueUrl('health-wellness', '295', 'Vostro World G-13'),
          s3Category: 'health-wellness'
        },
        { 
          name: 'Court Cricket (Rooftop)', 
          category: 'Sports & Fitness', 
          score: 8.8, 
          status: 'Open',
          id: '288',
          route: createVenueUrl('sports-fitness', '288', 'Court Cricket (Rooftop)'),
          s3Category: 'sports-fitness'
        }
      ],
      stats: { restaurants: "700+", cafes: "300+", shopping: "100+" }
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return 'text-emerald-600';
    if (score >= 7.5) return 'text-yellow-600';
    return 'text-orange-600';
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            City Spotlights
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the unique character and top spots in each of Pakistan's major cities
          </p>
        </div>

        <div className="space-y-16">
          {cities.map((city, index) => (
            <div key={city.name} className="space-y-8">
              {/* City Header */}
              <div className="text-center">
                <div className={`inline-block bg-gradient-to-r ${city.gradient} text-white px-8 py-3 rounded-full mb-4`}>
                  <h3 className="text-2xl font-bold">{city.name}</h3>
                </div>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
                  {city.description}
                </p>
                
                {/* City Stats */}
                <div className="flex justify-center gap-8 mb-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-700">{city.stats.restaurants}</div>
                    <div className="text-sm text-gray-600">Restaurants</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-700">{city.stats.cafes}</div>
                    <div className="text-sm text-gray-600">Cafés</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-700">{city.stats.shopping}</div>
                    <div className="text-sm text-gray-600">Shopping</div>
                  </div>
                </div>
              </div>

              {/* Featured Places Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {city.places.map((place, placeIndex) => (
                  <Link key={placeIndex} to={place.route}>
                    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white cursor-pointer overflow-hidden">
                      {/* Image Section */}
                      <div className="h-32 w-full overflow-hidden">
                        <ComprehensiveVenueImage
                          category={place.s3Category}
                          placeId={place.id}
                          placeName={place.name}
                          alt={place.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h4 className="font-bold text-lg text-gray-900 group-hover:text-emerald-700 transition-colors">
                              {place.name}
                            </h4>
                            <Badge variant="outline" className="text-xs mt-1">
                              {place.category}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className={`font-bold text-lg ${getScoreColor(place.score)}`}>
                              {place.score}
                            </div>
                            <div className="flex items-center text-xs text-gray-500">
                              <Star className="w-3 h-3 fill-current mr-1" />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-3 h-3" />
                            <span>{city.name}</span>
                          </div>
                          <Badge className={`text-xs ${place.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            <Clock className="w-3 h-3 mr-1" />
                            {place.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Explore City Button */}
              <div className="text-center">
                <Button size="lg" className="bg-emerald-700 hover:bg-emerald-800 px-8 transform hover:scale-105 transition-all duration-300" asChild>
                  <Link to={`/cities/${city.name}`}>
                    <Utensils className="w-5 h-5 mr-2" />
                    Explore All {city.name} Spots
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CitySpotlight;
