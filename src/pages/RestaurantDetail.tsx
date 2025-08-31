
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Phone, MapPin, Clock, Star, Heart, Share2, Calendar, ChefHat, Users, Car, Wifi, CreditCard } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Accessibility } from 'lucide-react';
import { getRestaurantById } from '@/data/restaurants';
import { Restaurant } from '@/types/categories';
import ComprehensiveVenueImage from '@/components/shared/ComprehensiveVenueImage';
import RecommendationSection from '@/components/shared/RecommendationSection';
import { getRestaurantRecommendations } from '@/utils/recommendationEngine';
import { useSEO } from '@/hooks/useSEO';
import StructuredData from '@/components/seo/StructuredData';

// Mock data - Enhanced with your requirements
const mockRestaurant = {
  id: '1',
  place_name: 'MASALAWALA BY QASAR-E-NOOR',
  city: 'Lahore',
  phone_number: '+92 308 8789789',
  full_address: '9-e-2 Block E 2 Gulberg III, Lahore, Pakistan',
  neighborhood: '9-e-2 Block E 2 Gulberg III',
  google_maps_link: 'https://www.google.com/maps/search/?api=1&query=MASALAWALA%20BY%20QASAR-E-NOOR&query_place_id=ChIJScKv9DMFGTkRA8HfEvP0PL8',
  operating_hours: '1 PM - 12 AM',
  
  // Enhanced details from your data
  details: {
    category: 'Casual Dining/Buffet',
    cuisine: 'Pakistani',
    specialty: 'Diverse Pakistani cuisine with a focus on kebabs, karahi, and biryanis',
    priceRange: 'Rs 1,000-2,500 per person',
    avgDuration: '1.5-2 hours',
    decorStyle: 'Modern or possibly a blend of modern and traditional',
    noiseLevel: 'Moderate',
    instagramWorthy: 8,
    serviceStyle: 'Table service',
    waitTime: 'No wait mentioned in recent reviews, but likely during peak hours',
    parking: 'Free parking lot and free street parking available',
    kidFriendly: true,
    groupBookings: true,
    accessibility: 'Wheelchair accessible entrance, parking lot, and restroom'
  },
  
  // Timing recommendations
  timing: {
    dateNight: 'Fridays or Saturdays from 7-9 PM',
    family: 'Weekends from 1 PM to 5 PM',
    business: 'Weekdays from 1 PM to 3 PM for lunch',
    leastCrowded: 'Weekdays before 1 PM and after 10 PM',
    peakHours: 'Weekends from 7 PM to 10 PM and weekdays from 7 PM to 9 PM',
    weekendNote: 'Weekends are significantly busier, especially evenings. Weekdays offer a more relaxed dining experience'
  },
  
  // Scores
  scores: {
    overall: 8.34,
    food: 8.5,
    service: 8.0,
    ambiance: 9.0,
    value: 7.5,
    location: 9.5,
    cleanliness: 8.8,
    friendliness: 8.5,
    authenticity: 9.2,
    portionSize: 7.8,
    presentation: 8.0
  },
  
  about: 'Masalawala by Qasar-e-Noor is a popular family restaurant in Lahore\'s Gulberg III neighborhood, known for its authentic Pakistani cuisine, lively ambiance, and extensive menu. It offers a wide variety of dishes, catering to various tastes and dietary needs. The restaurant boasts a high Google rating and numerous positive reviews.',
  
  menu: {
    signature: ['Malai Boti', 'Chicken Karahi', 'Mutton Karahi', 'Seekh Kabab', 'Biryani', 'Kheer', 'Naan'],
    vegetarian: 'Good variety available, judging by reviews and "vegetarian options" tag'
  },
  
  reviews: {
    summary: 'Masalawala receives overwhelmingly positive reviews, praising the food quality, ambiance, and service. Customers repeatedly highlight the taste and variety of food options.',
    praise: 'Delicious food, great ambiance, excellent service',
    improvements: 'Could provide more detailed information on menu pricing and online ordering options',
    uniquePoints: 'Lively atmosphere, extensive menu, good accessibility',
    valueProposition: 'Offers a balance of quality food, ambiance, and service at a reasonable price'
  },
  
  faq: [
    {
      question: 'Can I book a table in advance?',
      answer: 'Yes, reservations are recommended, especially for weekends and peak hours. Contact the restaurant directly to book.'
    },
    {
      question: 'What vegetarian options are available?',
      answer: 'Masalawala offers a variety of vegetarian dishes, including options such as salads and vegetable curries. Check the menu or ask staff upon arrival.'
    },
    {
      question: 'Where is the restaurant located and is it accessible?',
      answer: 'Masalawala is in Gulberg III, Lahore. It\'s fully accessible with wheelchair access, ramps, and accessible restrooms.'
    },
    {
      question: 'What is the price range and what payment methods are accepted?',
      answer: 'Prices vary, but expect Rs. 1000-2500 per person. They accept credit cards.'
    },
    {
      question: 'Can Masalawala accommodate large groups?',
      answer: 'Yes, they can accommodate large parties and group bookings. It\'s recommended to call and book in advance to ensure seating.'
    }
  ],
  
  images: [
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop'
  ]
};

const RestaurantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      const foundRestaurant = getRestaurantById(id);
      if (foundRestaurant) {
        setRestaurant(foundRestaurant);
        // Get recommendations
        const recs = getRestaurantRecommendations(foundRestaurant, id);
        setRecommendations(recs);
      }
      setIsLoading(false);
    }
  }, [id]);

  // SEO Optimization
  useEffect(() => {
    if (restaurant) {
      // Update page title and meta tags
      document.title = `${restaurant.place_name} - ${restaurant.city} | KLIspots`;
      
      // Update meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', `Discover ${restaurant.place_name} in ${restaurant.city}. ${restaurant.details?.specialty || 'Experience authentic Pakistani cuisine with excellent service and ambiance.'} Book your table today!`);
      
      // Update Open Graph tags
      const updateOGTag = (property: string, content: string) => {
        let ogTag = document.querySelector(`meta[property="${property}"]`);
        if (!ogTag) {
          ogTag = document.createElement('meta');
          ogTag.setAttribute('property', property);
          document.head.appendChild(ogTag);
        }
        ogTag.setAttribute('content', content);
      };
      
      updateOGTag('og:title', `${restaurant.place_name} - ${restaurant.city}`);
      updateOGTag('og:description', `Discover ${restaurant.place_name} in ${restaurant.city}. ${restaurant.details?.specialty || 'Experience authentic Pakistani cuisine.'}`);
      updateOGTag('og:type', 'restaurant');
      updateOGTag('og:url', window.location.href);
      
      // Add canonical URL
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', window.location.href);
    }
  }, [restaurant]);

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Restaurant Not Found</h1>
            <p className="text-gray-600 mb-8">Sorry, we couldn't find the restaurant you're looking for.</p>
            <Link to="/restaurants" className="text-blue-600 hover:text-blue-800">
              ← Back to Restaurants
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Check if restaurant is currently open
  const getCurrentStatus = () => {
    const now = new Date();
    const currentHour = now.getHours();
    
    // Parse operating hours (1 PM - 12 AM means 13:00 - 24:00)
    const openHour = 13; // 1 PM
    const closeHour = 24; // 12 AM (midnight)
    
    if (currentHour >= openHour || currentHour < 1) { // Open from 1 PM to midnight
      return 'open';
    }
    return 'closed';
  };

  const currentStatus = getCurrentStatus();

  const getScoreColor = (score) => {
    if (score >= 8.5) return 'text-emerald-600';
    if (score >= 7.0) return 'text-amber-600';
    return 'text-red-500';
  };

  const getScoreBarColor = (score) => {
    if (score >= 8.5) return 'from-emerald-500 to-emerald-600';
    if (score >= 7.0) return 'from-amber-500 to-amber-600';
    return 'from-red-400 to-red-500';
  };

  const handleCall = () => {
    window.open(`tel:${restaurant.phone_number}`, '_self');
  };

  const handleDirections = () => {
    window.open(restaurant.google_maps_link, '_blank');
  };

  const ScoreBar = ({ label, score, maxScore = 10 }) => {
    const percentage = (score / maxScore) * 100;
    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className={`text-sm font-bold ${getScoreColor(score)}`}>
            {score.toFixed(1)}/{maxScore}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-2.5 rounded-full bg-gradient-to-r ${getScoreBarColor(score)} transition-all duration-700 ease-out shadow-sm`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Structured Data for SEO */}
      {restaurant && (
        <StructuredData 
          type="restaurant" 
          data={restaurant} 
        />
      )}
      
      <Header />
      <main className="pt-20">
        {/* Back Button */}
        <Link 
          to="/restaurants" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Restaurants
        </Link>

        {/* Hero Section with Image */}
        <div className="relative h-[500px] rounded-2xl overflow-hidden mb-8 shadow-xl">
          <ComprehensiveVenueImage
            category="restaurants"
            placeId={restaurant.place_id}
            placeName={restaurant.place_name}
            alt={restaurant.place_name}
            className="detail-page-image"
            showSlider={true}
            showDots={true}
            showNavigation={true}
          />
          {/* Removed dark overlay for better image visibility */}
          
          {/* Hero Content - Simplified */}
          <div className="absolute bottom-0 left-0 right-0 p-8 text-gray-900 bg-white/80 backdrop-blur-md rounded-t-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{restaurant.place_name}</h1>
            
            <div className="flex flex-wrap items-center gap-6 text-lg">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{restaurant.total_score.toFixed(1)}/10</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>{restaurant.city}</span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="absolute top-6 right-6 flex gap-3">
            <Button variant="outline" size="icon" className="bg-white hover:bg-gray-50">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="bg-white hover:bg-gray-50">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button onClick={handleCall} size="lg" className="flex-1 min-w-48 bg-orange-600 hover:bg-orange-700">
            <Phone className="h-5 w-5 mr-2" />
            Call Restaurant
          </Button>
          <Button onClick={handleDirections} variant="outline" size="lg" className="flex-1 min-w-48 border-orange-600 text-orange-600 hover:bg-orange-50">
            <MapPin className="h-5 w-5 mr-2" />
            Get Directions
          </Button>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* About Section */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">About {restaurant.place_name}</h2>
                <p className="text-gray-700 leading-relaxed text-lg">{restaurant.about}</p>
              </CardContent>
            </Card>

            {/* Restaurant Scores */}
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Star className="h-6 w-6 text-orange-600" />
                  </div>
                  Restaurant Ratings
                  <Badge variant="outline" className="ml-auto">Verified by KLIspots</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Overall Score Highlight */}
                <div className="text-center p-8 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border border-orange-200">
                  <div className="text-6xl font-bold text-orange-600 mb-2">
                    {restaurant.total_score.toFixed(1)}
                  </div>
                  <div className="text-lg text-gray-600">out of 10</div>
                </div>

                {/* Individual Scores */}
                <div className="grid md:grid-cols-2 gap-8">
                  <ScoreBar label="Food & Menu Quality" score={restaurant.food_and_menu_score} />
                  <ScoreBar label="Service Excellence" score={restaurant.service_score} />
                  <ScoreBar label="Ambiance & Atmosphere" score={restaurant.ambiance_score} />
                  <ScoreBar label="Value for Money" score={restaurant.value_score} />
                  <ScoreBar label="Location & Accessibility" score={restaurant.location_and_accessibility_score} />
                  <ScoreBar label="Cleanliness Standards" score={restaurant.cleanliness_score} />
                  <ScoreBar label="Staff Friendliness" score={restaurant.staff_friendliness_score} />
                  <ScoreBar label="Food Authenticity" score={restaurant.food_authenticity_score} />
                  <ScoreBar label="Portion Generosity" score={restaurant.portion_size_score} />
                  <ScoreBar label="Food Presentation" score={restaurant.presentation_score} />
                </div>
              </CardContent>
            </Card>

            {/* Signature Dishes */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <ChefHat className="h-6 w-6 text-red-600" />
                  </div>
                  <h2 className="text-3xl font-bold">Signature Dishes</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {restaurant.signature_dishes.split(', ').map((dish, index) => (
                    <div 
                      key={index}
                      className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 text-center border border-red-200 hover:border-orange-300 transition-colors hover:shadow-md"
                    >
                      <span className="font-medium text-red-800">{dish}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Specialty:</span> {restaurant.specialty}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Best Times to Visit */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-left">Best Times to Visit</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="p-6 bg-rose-50 rounded-xl border border-rose-200">
                                              <h3 className="font-semibold mb-3 flex items-center justify-center gap-2 text-rose-700">
                          💕 Perfect for Date Night
                        </h3>
                      <p className="text-sm text-rose-600">{restaurant.best_time_for_date_night}</p>
                    </div>
                    
                    <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                      <h3 className="font-semibold mb-3 flex items-center justify-center gap-2 text-blue-700">
                        👨‍👩‍👧‍👦 Family Dining
                      </h3>
                      <p className="text-sm text-blue-600">{restaurant.best_time_for_family}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="p-6 bg-green-50 rounded-xl border border-green-200">
                      <h3 className="font-semibold mb-3 text-green-700 text-left">✨ Least Crowded</h3>
                      <p className="text-sm text-green-600">{restaurant.least_crowded_hours}</p>
                    </div>
                    
                    <div className="p-6 bg-orange-50 rounded-xl border border-orange-200">
                      <h3 className="font-semibold mb-3 text-orange-700 text-left">🔥 Peak Hours</h3>
                      <p className="text-sm text-orange-600">{restaurant.peak_hours}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-6 bg-gray-50 rounded-xl">
                  <h4 className="font-medium mb-2">Weekend vs Weekday</h4>
                  <p className="text-sm text-gray-600">{restaurant.weekend_vs_weekday}</p>
                </div>
              </CardContent>
            </Card>

            {/* Customer Reviews */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-8">Customer Reviews</h2>
                <p className="text-gray-700 mb-8 text-lg leading-relaxed">{restaurant.review_summary}</p>
                
                <div className="space-y-6">
                  <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-200">
                    <h3 className="font-semibold text-emerald-800 mb-3">✅ What People Love</h3>
                    <p className="text-emerald-700">{restaurant.common_praise}</p>
                  </div>
                  
                  <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                    <h3 className="font-semibold text-blue-800 mb-3">💡 Suggestions for Improvement</h3>
                    <p className="text-blue-700">{restaurant.improvement_suggestions}</p>
                  </div>
                  
                  <div className="p-6 bg-orange-50 rounded-xl border border-orange-200">
                    <h3 className="font-semibold text-orange-800 mb-3">⭐ What Makes It Special</h3>
                    <p className="text-orange-700">{restaurant.unique_selling_points}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
                <div className="space-y-8">
                  {[
                    { q: restaurant.faq1, a: restaurant.faqans1 },
                    { q: restaurant.faq2, a: restaurant.faqans2 },
                    { q: restaurant.faq3, a: restaurant.faqans3 },
                    { q: restaurant.faq4, a: restaurant.faqans4 },
                    { q: restaurant.faq5, a: restaurant.faqans5 }
                  ].map((item, index) => (
                    <div key={index} className="p-6 bg-gray-50 rounded-xl">
                      <h3 className="font-semibold mb-3 text-lg text-gray-800">Q: {item.q}</h3>
                      <p className="text-gray-600 leading-relaxed">A: {item.a}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            {/* Contact Information */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl">Contact & Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-orange-500 mt-1" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-sm text-gray-600">{restaurant.phone_number}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-orange-500 mt-1" />
                    <div className="text-left">
                      <p className="font-medium">Address</p>
                      <p className="text-sm text-gray-600 mb-1">{restaurant.neighborhood}</p>
                      <p className="text-sm text-gray-500">{restaurant.full_address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-orange-500 mt-1" />
                    <div>
                      <p className="font-medium">Operating Hours</p>
                      <p className="text-sm text-gray-600">{restaurant.operating_hours}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CreditCard className="h-5 w-5 text-orange-500 mt-1" />
                    <div>
                      <p className="font-medium">Price Range</p>
                      <p className="text-sm text-gray-600">{restaurant.menu_price_range}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Restaurant Features */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl">Restaurant Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="font-medium mb-1">Dining Areas</p>
                    <p className="text-gray-600">Indoor and outdoor seating</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Service Style</p>
                    <p className="text-gray-600">{restaurant.service_style}</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Typical Wait Time</p>
                    <p className="text-gray-600">{restaurant.wait_time}</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Atmosphere</p>
                    <p className="text-gray-600">{restaurant.noise_level}</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Average Meal Duration</p>
                    <p className="text-gray-600">1.5-2 hours</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <Users className="h-4 w-4" />
                    <span>Kid Friendly</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600">
                    <Calendar className="h-4 w-4" />
                    <span>Group Bookings</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600">
                    <Car className="h-4 w-4" />
                    <span>Free Parking</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600">
                    <Accessibility className="h-4 w-4" />
                    <span>Wheelchair accessible</span>
                  </div>
                </div>
              </CardContent>
            </Card>


          </div>
        </div>
      </main>

      {/* Recommendations Section */}
      {restaurant && (
        <RecommendationSection
          recommendations={getRestaurantRecommendations(restaurant, id || '')}
          title="You Might Also Like"
          subtitle="Discover more amazing dining experiences"
        />
      )}

      <Footer />
    </>
  );
};

export default RestaurantDetail;
