import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Phone, Clock, Wifi, Car, Users, Shield, ChefHat } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createVenueUrl } from '@/utils/urlSlugs';

const FeaturedPlaces = () => {
  const featuredPlace = {
    id: '1772',
    name: 'The Basil Leaf',
    category: 'Fine Dining',
    cuisine: 'Italian • Mediterranean • Pakistani',
    neighborhood: 'DHA Phase 6',
    city: 'Lahore',
    overallScore: 9.27,
    priceRange: 'Rs 1500 - Rs 3500',
    status: 'Open',
    verified: true,
    imageUrl: '/lovable-uploads/The_Basil_Leaf_ChIJl3IsuNQFGTkR4EhEnVaxMv0_3.jpg',
    scores: {
      food: 9.5,
      service: 9.4,
      ambiance: 9.3,
      value: 8.7,
      location: 9.2
    },
    features: ['WiFi', 'Parking', 'Fine Dining', 'Halal', 'Wheelchair Access'],
    specialties: ['Grilled Burgers', 'Pasta', 'Mushrooms'],
    phone: '+92 300 700 0000',
    bestFor: ['Date Night', 'Business Meetings'],
    culturalNote: 'Hidden gem in DHA Phase 6 with excellent international and Pakistani cuisine'
  };

  const otherPlaces = [
    {
      id: '4',
      name: 'Corti Cafe',
      category: 'Cafe',
      neighborhood: 'Karachi',
      city: 'Karachi',
      score: 8.8,
      priceRange: 'Rs 800-1,500',
      status: 'Open',
      cuisine: 'Coffee & Beverages',
      imageUrl: '/lovable-uploads/Corti_Cafe_ChIJN3eKLwA_sz4R-rP79g-_PcY_1.jpg'
    },
    {
      id: '556',
      name: "Havana's Terraces",
      category: 'Fine Dining',
      neighborhood: 'F-10',
      city: 'Islamabad',
      score: 9.1,
      priceRange: 'Rs 3,500-5,000',
      status: 'Open',
      cuisine: 'International',
      imageUrl: '/lovable-uploads/Havana_Terraces_ChIJiScdKsG93zgRibz8gP_ohZM_2.jpg'
    },
    {
      id: '1321',
      name: 'Tapestry7',
      category: 'Fine Dining',
      neighborhood: 'Lahore',
      city: 'Lahore',
      score: 9.3,
      priceRange: 'Rs 2,500-4,000',
      status: 'Open',
      cuisine: 'International',
      imageUrl: '/lovable-uploads/Tapestry7_ChIJT3R7JpAFGTkRLLFSKfeqbf0_1.jpg'
    },

  ];

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return 'text-emerald-600';
    if (score >= 7.5) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getProgressBarColor = (score: number) => {
    if (score >= 8.5) return 'bg-emerald-500';
    if (score >= 7.5) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Best Places This Week
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Handpicked experiences with detailed AI-powered analysis and local expert verification
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {/* Main Featured Place */}
          <div className="lg:col-span-2">
            <Link to={createVenueUrl('restaurant', featuredPlace.id, featuredPlace.name)}>
              <Card className="overflow-hidden shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 hover:shadow-2xl transition-shadow cursor-pointer">
                <div className="relative h-80">
                  {/* Hero Image */}
                  <img
                    src={featuredPlace.imageUrl}
                    alt={featuredPlace.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <Badge className="bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      KLIspots Verified
                    </Badge>
                    <Badge className={`${featuredPlace.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      <Clock className="w-3 h-3 mr-1" />
                      {featuredPlace.status}
                    </Badge>
                  </div>

                  {/* Overall Score */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/70 backdrop-blur-sm px-3 py-1.5 rounded-lg text-center">
                      <div className={`text-lg font-bold ${getScoreColor(featuredPlace.overallScore)}`}>
                        {featuredPlace.overallScore}
                      </div>
                      <div className="text-xs text-gray-600">KLIspots Score</div>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-2xl font-bold text-gray-900">{featuredPlace.name}</h3>
                      <Badge variant="outline" className="text-emerald-700 border-emerald-200">
                        {featuredPlace.category}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-2">{featuredPlace.cuisine}</p>
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{featuredPlace.neighborhood}, {featuredPlace.city}</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{featuredPlace.priceRange}</p>
                  </div>

                  {/* Detailed Scores */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Detailed Analysis</h4>
                    <div className="space-y-3">
                      {Object.entries(featuredPlace.scores).map(([category, score]) => (
                        <div key={category} className="flex items-center justify-between">
                          <div className="flex items-center gap-2 min-w-[120px]">
                            <span className="text-sm font-medium text-gray-700 capitalize">
                              {category === 'food' && '🍽️'}
                              {category === 'service' && '👥'}
                              {category === 'ambiance' && '🏛️'}
                              {category === 'value' && '💰'}
                              {category === 'location' && '📍'}
                              {' ' + category}
                            </span>
                          </div>
                          <div className="flex-1 mx-4">
                            <div className="bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${getProgressBarColor(score)}`}
                                style={{ width: `${score * 10}%` }}
                              ></div>
                            </div>
                          </div>
                          <span className={`text-sm font-semibold ${getScoreColor(score)} min-w-[40px] text-right`}>
                            {score}/10
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {featuredPlace.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature === 'WiFi' && <Wifi className="w-3 h-3 mr-1" />}
                          {feature === 'Parking' && <Car className="w-3 h-3 mr-1" />}
                          {feature === 'Family Friendly' && <Users className="w-3 h-3 mr-1" />}
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Cultural Note */}
                  <div className="mb-6 p-4 bg-emerald-50 rounded-lg">
                    <p className="text-sm text-emerald-800">
                      <strong>Cultural Insight:</strong> {featuredPlace.culturalNote}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Button className="w-full bg-emerald-700 hover:bg-emerald-800">
                        View Details
                      </Button>
                    </div>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Call
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          </div>

          {/* Other Featured Places */}
          <div className="space-y-6">
            {otherPlaces.map((place) => (
              <Link key={place.id} to={place.category === 'Cafe' ? createVenueUrl('cafe', place.id, place.name) : createVenueUrl('restaurant', place.id, place.name)}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  {/* Image Section */}
                  {place.imageUrl && (
                    <div className="h-32 w-full overflow-hidden">
                      <img
                        src={place.imageUrl}
                        alt={place.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-lg text-gray-900 hover:text-emerald-600 transition-colors">{place.name}</h4>
                        <p className="text-sm text-gray-600">{place.cuisine}</p>
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
                    
                    <div className="flex items-center text-gray-600 text-sm mb-2">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span>{place.neighborhood}, {place.city}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {place.category}
                      </Badge>
                      <span className="text-sm font-medium text-gray-700">
                        {place.priceRange}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPlaces;
