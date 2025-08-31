
import { Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useState } from 'react';

const HeroSection = () => {
  const [selectedCity, setSelectedCity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const cities = [
    {
      id: 'karachi',
      name: 'Karachi',
      count: '200+',
      image: '/lovable-uploads/29ed049d-e94f-4e00-8516-8a363566e3ff.png',
      description: 'Coastal flavors and diverse cuisine'
    },
    {
      id: 'lahore',
      name: 'Lahore',
      count: '180+',
      image: '/lovable-uploads/29ed049d-e94f-4e00-8516-8a363566e3ff.png',
      description: 'Traditional Pakistani heritage'
    },
    {
      id: 'islamabad',
      name: 'Islamabad',
      count: '120+',
      image: '/lovable-uploads/29ed049d-e94f-4e00-8516-8a363566e3ff.png',
      description: 'Modern dining experiences'
    }
  ];

  return (
    <section className="bg-gradient-to-br from-gray-50 to-emerald-50 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Discover Pakistan's
            <span className="text-emerald-600 block">Finest Restaurants</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            From Karachi's coastal delights to Lahore's traditional flavors and Islamabad's modern cuisine - 
            find your perfect dining experience across Pakistan's major cities.
          </p>
        </div>

        {/* Search Bar */}
        <Card className="max-w-4xl mx-auto p-6 shadow-xl mb-12">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search restaurants, cuisines, or neighborhoods..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-3 text-lg border-gray-200 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select className="pl-10 pr-8 py-3 border border-gray-200 rounded-md text-lg appearance-none bg-white min-w-[200px]">
                <option>All Neighborhoods</option>
                <option>DHA</option>
                <option>Gulshan</option>
                <option>Clifton</option>
                <option>Model Town</option>
                <option>F-6</option>
              </select>
            </div>
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 px-8">
              Search
            </Button>
          </div>
        </Card>

        {/* City Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {cities.map((city) => (
            <Card 
              key={city.id} 
              className={`group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl ${
                selectedCity === city.id ? 'ring-2 ring-emerald-500 shadow-lg' : ''
              }`}
              onClick={() => setSelectedCity(city.id)}
            >
              <div className="relative h-64">
                <img 
                  src={city.image} 
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-1">{city.name}</h3>
                  <p className="text-sm opacity-90 mb-2">{city.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{city.count} restaurants</span>
                    <Button 
                      size="sm" 
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      Explore
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600">500+</div>
            <div className="text-gray-600">Restaurants</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600">3</div>
            <div className="text-gray-600">Major Cities</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600">50+</div>
            <div className="text-gray-600">Cuisines</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600">15K+</div>
            <div className="text-gray-600">Happy Diners</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
