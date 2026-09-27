import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Building2, 
  Star,
  ArrowRight
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { restaurants } from '@/data/restaurants';
import { cafes } from '@/data/cafes';
import { shoppingVenues } from '@/data/shopping';
import { entertainmentVenues } from '@/data/entertainment';
import { healthWellnessVenues } from '@/data/health-wellness';
import { artsCultureVenues } from '@/data/arts-culture';
import { sportsFitnessVenues } from '@/data/sports-fitness';
import PageSEO from '@/components/seo/PageSEO';

const Cities = () => {
  // Major cities data with descriptions and images
  const majorCities = useMemo(() => {
    const cityDescriptions = {
      'Karachi': {
        description: "Pakistan's bustling economic hub and largest city, known for its vibrant food scene, historic landmarks, and coastal charm along the Arabian Sea. Experience the diverse culture, endless entertainment options, and world-class dining that makes Karachi the country's commercial heart.",
        imageUrl: "/lovable-uploads/Karachi.jpg"
      },
      'Lahore': {
        description: "The cultural heart of Pakistan, famous for its rich Mughal heritage, exquisite cuisine, and beautiful gardens that blend history with modernity. Discover centuries-old architecture, traditional crafts, and the warmest hospitality in this magnificent city of gardens.",
        imageUrl: "/lovable-uploads/Lahore.jpg"
      },
      'Islamabad': {
        description: "Pakistan's capital city, known for its modern architecture, well-planned layout, and scenic beauty nestled against the Margalla Hills. Enjoy clean air, organized infrastructure, and stunning natural landscapes in this peaceful metropolitan center.",
        imageUrl: "/lovable-uploads/Islamabad.webp"
      }
    };

    // Calculate stats for each city
    return Object.entries(cityDescriptions).map(([cityName, cityInfo]) => {
      const cityRestaurants = restaurants.filter(v => v.city === cityName);
      const cityCafes = cafes.filter(v => v.city === cityName);
      const cityShopping = shoppingVenues.filter(v => v.city === cityName);
      const cityEntertainment = entertainmentVenues.filter(v => v.city === cityName);
      const cityHealthWellness = healthWellnessVenues.filter(v => v.city === cityName);
      const cityArtsCulture = artsCultureVenues.filter(v => v.city === cityName);
      const citySportsFitness = sportsFitnessVenues.filter(v => v.city === cityName);

      const totalVenues = cityRestaurants.length + cityCafes.length + cityShopping.length + 
                         cityEntertainment.length + cityHealthWellness.length + 
                         cityArtsCulture.length + citySportsFitness.length;

      // Calculate top rating
      const allVenues = [
        ...cityRestaurants.map(v => Number(v.total_score || 0)),
        ...cityCafes.map(v => Number(v.total_score || 0)),
        ...cityShopping.map(v => Number(v.total_score || 0)),
        ...cityEntertainment.map(v => Number(v.total_score || 0)),
        ...cityHealthWellness.map(v => Number(v.total_score || 0)),
        ...cityArtsCulture.map(v => Number(v.total_score || 0)),
        ...citySportsFitness.map(v => Number(v.total_score || 0))
      ].filter(score => !isNaN(score) && score > 0); // Filter out NaN and 0 values
      
      const topRating = allVenues.length > 0 ? Math.max(...allVenues) : 0;

      return {
        name: cityName,
        description: cityInfo.description,
        imageUrl: cityInfo.imageUrl,
        totalVenues,
        topRating
      };
    }).filter(city => city.totalVenues > 0); // Only show cities with venues
  }, []);

  return (
    <>
      <PageSEO
        title="Major Cities in Pakistan - Discover Venues by City | KLIspots"
        description="Explore amazing venues and experiences across major cities in Pakistan including Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, and Peshawar. Find the best restaurants, cafes, shopping, and entertainment in each city."
        keywords="Pakistan cities, Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, city venues, local places, urban lifestyle"
        type="website"
      />
      
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-emerald-50/90 via-white/85 to-emerald-50/90 backdrop-blur-sm py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Explore Pakistan's 
                <span className="bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent"> Amazing Cities</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Discover the best venues, restaurants, cafes, and experiences in Pakistan's major cities
              </p>
              <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
                <div className="flex items-center">
                  <Building2 className="w-5 h-5 mr-2 text-emerald-600" />
                  5500+ Verified Places
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-emerald-600" />
                  3 Major Cities
                </div>
                <div className="flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-500" />
                  7 Categories
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cities Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="space-y-20">
              {majorCities.map((city, index) => {
                const isEven = index % 2 === 0;
                
                return (
                  <div key={city.name} className="max-w-7xl mx-auto">
                    <div className={`grid lg:grid-cols-2 gap-12 items-center ${isEven ? '' : 'lg:flex-row-reverse'}`}>
                      {/* Image Side - Show first on mobile */}
                      <div className={`${isEven ? 'lg:order-2 order-1' : 'lg:order-1 order-1'}`}>
                        <div className="relative group overflow-hidden rounded-2xl shadow-2xl">
                          <img 
                            src={city.imageUrl} 
                            alt={city.name}
                            className="w-full h-80 lg:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop&crop=center";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute bottom-6 left-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <h3 className="text-2xl font-bold">{city.name}</h3>
                            <p className="text-sm opacity-90">Click to explore</p>
                          </div>
                        </div>
                      </div>

                      {/* Content Side - Show second on mobile */}
                      <div className={`space-y-6 ${isEven ? 'lg:order-1 order-2' : 'lg:order-2 order-2'}`}>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <Badge className="bg-emerald-100 text-emerald-800 border-0">
                              <Star className="w-3 h-3 mr-1" />
                              {city.topRating >= 9 ? '9+' : city.topRating.toFixed(1)} Rating
                            </Badge>
                            <Badge className="bg-blue-100 text-blue-800 border-0">
                              <Building2 className="w-3 h-3 mr-1" />
                              {city.totalVenues} Venues
                            </Badge>
                          </div>
                          
                          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
                            {city.name}
                          </h2>
                          
                          <p className="text-lg text-gray-600 leading-relaxed mb-8">
                            {city.description}
                          </p>
                        </div>

                        <div className="pt-4">
                          <Link to={`/cities/${city.name.toLowerCase().replace(/\s+/g, '-')}`}>
                            <Button 
                              size="lg" 
                              className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white group rounded-full px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                              <MapPin className="w-5 h-5 mr-2" />
                              Explore {city.name}
                              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-emerald-600 to-emerald-800 py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Ready to Discover More?
              </h2>
              <p className="text-xl text-emerald-100 mb-8">
                Explore thousands of venues across Pakistan's most vibrant cities
              </p>
              <Link to="/">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-white text-emerald-600 border-white hover:bg-emerald-50"
                >
                  Start Exploring
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default Cities;