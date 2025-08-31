import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Phone, MapPin, Clock, Star, Heart, Share2, Calendar, Music, Users, Car, Globe, Camera, Award, BookOpen, Lightbulb } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getEntertainmentVenueById } from '@/data/entertainment';
import ComprehensiveVenueImage from '@/components/shared/ComprehensiveVenueImage';
import RecommendationSection from '@/components/shared/RecommendationSection';
import { getEntertainmentRecommendations } from '@/utils/recommendationEngine';

const EntertainmentDetail = () => {
  const { id } = useParams();
  const venue = getEntertainmentVenueById(id || '');

  if (!venue) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Entertainment Venue Not Found</h1>
            <p className="text-gray-600 mb-8">Sorry, we couldn't find the entertainment venue you're looking for.</p>
            <Link to="/entertainment" className="text-blue-600 hover:text-blue-800">
              ← Back to Entertainment
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Helper function to clean text with # delimiter
  const cleanText = (text) => {
    if (!text || typeof text !== 'string') return text;
    return text.split('##')[0].split('#')[0].trim();
  };

  // Helper function to convert text to array
  const parseListText = (text) => {
    if (!text) return [];
    const cleaned = cleanText(text);
    
    // First try numbered lists (1. 2. 3.)
    if (/\d+\.\s+/.test(cleaned)) {
      return cleaned.split(/\d+\.\s+/).filter(item => item.trim()).map(item => item.trim());
    }
    
    // Then try asterisks
    if (cleaned.includes('*')) {
      return cleaned.split('*').filter(item => item.trim()).map(item => item.trim());
    }
    
    // Then try commas (but be smart about it)
    if (cleaned.includes(',')) {
      const items = cleaned.split(',').map(item => item.trim()).filter(item => item);
      // Only use comma split if we have multiple items and they look like list items
      if (items.length > 1 && items.every(item => item.length < 100)) {
        return items;
      }
    }
    
    // If no clear separators, return as single item
    return [cleaned];
  };

  // Enhanced parsing for complex operating hours with multiple time ranges
  const parseOperatingHours = (hoursString) => {
    if (!hoursString || hoursString === 'Not Available' || hoursString === 'Not available') return [];
    
    const dayHours = hoursString.split(' ##')[0].split(/(?=Monday:|Tuesday:|Wednesday:|Thursday:|Friday:|Saturday:|Sunday:)/).filter(Boolean).map(dayTime => {
      const colonIndex = dayTime.indexOf(':');
      if (colonIndex === -1) return { day: dayTime.trim(), time: 'Closed' };
      
      const day = dayTime.substring(0, colonIndex).trim();
      const time = dayTime.substring(colonIndex + 1).trim();
      
      return { day, time };
    });
    
    return dayHours;
  };

  const operatingHours = parseOperatingHours(venue.operating_hours);

  const getCurrentStatus = () => {
    if (!operatingHours.length) return 'unknown';
    
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    
    const todayHours = operatingHours.find(day => 
      day.day.toLowerCase() === currentDay.toLowerCase()
    );
    
    if (!todayHours || todayHours.time === 'Closed' || todayHours.time.toLowerCase().includes('closed')) {
      return 'closed';
    }
    
    // Handle multiple time ranges (e.g., "2:00 PM - 10:00 PM")
    const timeRanges = todayHours.time.split(',').map(range => range.trim());
    
    for (const range of timeRanges) {
      const timeMatch = range.match(/(\d+):(\d+)\s*(AM|PM)\s*-\s*(\d+):(\d+)\s*(AM|PM)/i);
      if (timeMatch) {
        let [, openHour, openMin, openPeriod, closeHour, closeMin, closePeriod] = timeMatch;
        
        openHour = parseInt(openHour);
        closeHour = parseInt(closeHour);
        openMin = parseInt(openMin);
        closeMin = parseInt(closeMin);
        
        // Convert to 24-hour format
        if (openPeriod.toLowerCase() === 'pm' && openHour !== 12) openHour += 12;
        if (openPeriod.toLowerCase() === 'am' && openHour === 12) openHour = 0;
        if (closePeriod.toLowerCase() === 'pm' && closeHour !== 12) closeHour += 12;
        if (closePeriod.toLowerCase() === 'am' && closeHour === 12) closeHour = 0;
        
        const currentTime = currentHour * 60 + currentMinutes;
        const openTime = openHour * 60 + openMin;
        const closeTime = closeHour * 60 + closeMin;
        
        if (currentTime >= openTime && currentTime <= closeTime) {
          return 'open';
        }
      }
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
    if (venue.phone_number && venue.phone_number !== 'Not available' && venue.phone_number !== 'Not Available') {
      window.open(`tel:${venue.phone_number}`, '_self');
    }
  };

  const handleDirections = () => {
    window.open(venue.google_maps_link, '_blank');
  };

  const handleWebsite = () => {
    if (venue.website_url && venue.website_url !== 'https://maps.google.com') {
      window.open(venue.website_url, '_blank');
    }
  };

  const ScoreBar = ({ label, score, maxScore = 10 }) => {
    if (!score || score === 0) return null;
    
    const percentage = (score / maxScore) * 100;
    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className={`text-sm font-bold ${getScoreColor(score)}`}>
            {Number(score).toFixed(1)}/{maxScore}
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <Link 
          to="/entertainment" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Entertainment
        </Link>

        {/* Hero Section with Image */}
        <div className="relative h-[500px] rounded-2xl overflow-hidden mb-8 shadow-xl">
          <ComprehensiveVenueImage
            category="entertainment"
            placeId={venue.place_id}
            placeName={venue.venue_name}
            alt={venue.venue_name}
            className="detail-page-image"
            showSlider={true}
            showDots={true}
            showNavigation={true}
          />
          
          {/* Hero Content - Simplified */}
          <div className="absolute bottom-0 left-0 right-0 p-8 text-gray-900 bg-white/80 backdrop-blur-md rounded-t-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{venue.venue_name}</h1>
            
            <div className="flex flex-wrap items-center gap-6 text-lg">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{Number(venue.total_score).toFixed(1)}/10</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>{venue.city}</span>
              </div>
            </div>
          </div>
          
          <div className="absolute top-6 right-6 flex gap-3">
            <Button variant="outline" size="icon" className="bg-white/90 hover:bg-white backdrop-blur-sm">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="bg-white/90 hover:bg-white backdrop-blur-sm">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-8">
          {venue.phone_number && venue.phone_number !== 'Not available' && venue.phone_number !== 'Not Available' && (
            <Button onClick={handleCall} size="lg" className="flex-1 min-w-48 bg-indigo-600 hover:bg-indigo-700">
              <Phone className="h-5 w-5 mr-2" />
              Call Venue
            </Button>
          )}
          <Button onClick={handleDirections} variant="outline" size="lg" className="flex-1 min-w-48 border-indigo-600 text-indigo-600 hover:bg-indigo-50">
            <MapPin className="h-5 w-5 mr-2" />
            Get Directions
          </Button>
          {venue.website_url && venue.website_url !== 'https://maps.google.com' && (
            <Button onClick={handleWebsite} variant="outline" size="lg" className="flex-1 min-w-48 border-blue-600 text-blue-600 hover:bg-blue-50">
              <Globe className="h-5 w-5 mr-2" />
              Visit Website
            </Button>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            
            {/* About Section */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">About {venue.venue_name}</h2>
                <p className="text-gray-700 leading-relaxed text-lg">{cleanText(venue.about)}</p>
              </CardContent>
            </Card>

            {/* Comprehensive Ratings */}
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Star className="h-6 w-6 text-indigo-600" />
                  </div>
                  Entertainment Experience Ratings
                  <Badge variant="outline" className="ml-auto">Verified by KLIspots</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="text-center p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200">
                  <div className="text-6xl font-bold text-indigo-600 mb-2">
                    {Number(venue.total_score).toFixed(1)}
                  </div>
                  <div className="text-lg text-gray-600">Overall Rating</div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <ScoreBar label="Entertainment Value" score={venue.entertainment_value_score} />
                  <ScoreBar label="Comfort & Facilities" score={venue.comfort_and_facilities_score} />
                  <ScoreBar label="Service Quality" score={(venue as any).service_quality_score} />
                  <ScoreBar label="Safety & Security" score={(venue as any).safety_and_security_score} />
                  <ScoreBar label="Value for Money" score={venue.value_for_money_score} />
                  <ScoreBar label="Location & Accessibility" score={(venue as any).location_and_accessibility_score} />
                  <ScoreBar label="Food & Refreshment" score={(venue as any).food_and_refreshment_score} />
                  <ScoreBar label="Cleanliness" score={(venue as any).cleanliness_score} />
                  <ScoreBar label="Staff Friendliness" score={(venue as any).staff_friendliness_score} />
                  <ScoreBar label="Age Appropriateness" score={(venue as any).age_appropriateness_score} />
                  <ScoreBar label="Crowd Management" score={(venue as any).crowd_management_score} />
                  <ScoreBar label="Technology & Equipment" score={(venue as any).technology_equipment_quality_score} />
                  <ScoreBar label="Air Conditioning" score={(venue as any).air_conditioning_score} />
                </div>

                {/* Value Proposition & Competitive Advantages - MOVED HERE */}
                <div className="grid md:grid-cols-2 gap-6">
                  {venue.value_proposition && (
                    <div className="p-6 bg-indigo-50 rounded-xl border border-indigo-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Award className="h-5 w-5 text-indigo-600" />
                        <h3 className="font-semibold text-indigo-800 text-center">Value Proposition</h3>
                      </div>
                      <p className="text-indigo-700">{cleanText(venue.value_proposition)}</p>
                    </div>
                  )}

                  {venue.competitive_advantages && (
                    <div className="p-6 bg-purple-50 rounded-xl border border-purple-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Star className="h-5 w-5 text-purple-600" />
                        <h3 className="font-semibold text-purple-800 text-center">Competitive Advantages</h3>
                      </div>
                      <p className="text-purple-700">{cleanText(venue.competitive_advantages)}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Entertainment Options & Features */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Music className="h-6 w-6 text-purple-600" />
                  </div>
                  <h2 className="text-3xl font-bold">Entertainment & Features</h2>
                </div>
                
                {venue.main_attractions && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-semibold text-gray-800 mb-2">Main Attractions</h4>
                    <div className="text-gray-700 leading-relaxed">
                      {parseListText(venue.main_attractions).map((item, index) => (
                        <div key={index} className="mb-1">• {item}</div>
                      ))}
                    </div>
                  </div>
                )}

                {venue.special_features && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-xl">
                    <h4 className="font-semibold text-blue-800 mb-2">Special Features</h4>
                    <p className="text-blue-700 leading-relaxed">{cleanText(venue.special_features)}</p>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  {venue.seating_rest_areas && (
                    <div className="p-4 bg-green-50 rounded-xl">
                      <h4 className="font-semibold text-green-800 mb-2">Seating & Rest Areas</h4>
                      <p className="text-sm text-green-700">{cleanText(venue.seating_rest_areas)}</p>
                    </div>
                  )}
                  {venue.food_and_beverage && (
                    <div className="p-4 bg-orange-50 rounded-xl">
                      <h4 className="font-semibold text-orange-800 mb-2">Food & Beverages</h4>
                      <p className="text-sm text-orange-700">{cleanText(venue.food_and_beverage)}</p>
                    </div>
                  )}
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
                  <h2 className="text-3xl font-bold text-center">Best Times to Visit</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    {venue.best_time_for_families_with_kids && venue.best_time_for_families_with_kids !== 'Not determinable from reviews.' && (
                      <div className="p-6 bg-rose-50 rounded-xl border border-rose-200">
                        <h3 className="font-semibold mb-3 flex items-center justify-center gap-2 text-rose-700">
                          👨‍👩‍👧‍👦 Families with Kids
                        </h3>
                        <p className="text-sm text-rose-600">{cleanText(venue.best_time_for_families_with_kids)}</p>
                      </div>
                    )}
                    
                    {venue.best_time_for_date_night && venue.best_time_for_date_night !== 'Not determinable from reviews.' && (
                      <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                        <h3 className="font-semibold mb-3 flex items-center justify-center gap-2 text-blue-700">
                          💑 Date Night
                        </h3>
                        <p className="text-sm text-blue-600">{cleanText(venue.best_time_for_date_night)}</p>
                      </div>
                    )}

                    {venue.best_time_for_groups && venue.best_time_for_groups !== 'Not determinable from reviews.' && (
                      <div className="p-6 bg-purple-50 rounded-xl border border-purple-200">
                        <h3 className="font-semibold mb-3 flex items-center justify-center gap-2 text-purple-700">
                          👥 Groups
                        </h3>
                        <p className="text-sm text-purple-600">{cleanText(venue.best_time_for_groups)}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-6">
                    {venue.least_crowded_hours && venue.least_crowded_hours !== 'Not determinable from reviews.' && (
                      <div className="p-6 bg-green-50 rounded-xl border border-green-200">
                        <h3 className="font-semibold mb-3 text-green-700 text-center">✨ Least Crowded</h3>
                        <p className="text-sm text-green-600">{cleanText(venue.least_crowded_hours)}</p>
                      </div>
                    )}
                    
                    {venue.peak_hours && venue.peak_hours !== 'Not determinable from reviews.' && (
                      <div className="p-6 bg-orange-50 rounded-xl border border-orange-200">
                        <h3 className="font-semibold mb-3 text-orange-700 text-center">🔥 Peak Hours</h3>
                        <p className="text-sm text-orange-600">{cleanText(venue.peak_hours)}</p>
                      </div>
                    )}

                    {venue.best_time_for_special_events && venue.best_time_for_special_events !== 'Not determinable from reviews.' && (
                      <div className="p-6 bg-yellow-50 rounded-xl border border-yellow-200">
                        <h3 className="font-semibold mb-3 text-yellow-700 text-center">🎉 Special Events</h3>
                        <p className="text-sm text-yellow-600">{cleanText(venue.best_time_for_special_events)}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {venue.weekend_vs_weekday && venue.weekend_vs_weekday !== 'Not determinable from reviews.' && (
                  <div className="mt-6 p-6 bg-gray-50 rounded-xl">
                    <h4 className="font-medium mb-2">Weekend vs Weekday</h4>
                    <p className="text-sm text-gray-600">{cleanText(venue.weekend_vs_weekday)}</p>
                  </div>
                )}

                {venue.holiday_considerations && venue.holiday_considerations !== 'Not Specified' && (
                  <div className="mt-6 p-6 bg-blue-50 rounded-xl">
                    <h4 className="font-medium mb-2">Holiday Considerations</h4>
                    <p className="text-sm text-blue-600">{cleanText(venue.holiday_considerations)}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Customer Reviews */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-8">Customer Reviews & Experience</h2>
                
                {venue.review_summary && (
                  <p className="text-gray-700 mb-8 text-lg leading-relaxed">{cleanText(venue.review_summary)}</p>
                )}
                
                <div className="space-y-6">
                  {venue.common_praise && (
                    <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-200">
                      <h3 className="font-semibold text-emerald-800 mb-3">✅ What People Love</h3>
                      <div className="text-emerald-700">
                        {parseListText(venue.common_praise).map((item, index) => (
                          <div key={index} className="mb-2">• {item}</div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {venue.improvement_suggestions && (
                    <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                      <h3 className="font-semibold text-blue-800 mb-3">💡 Suggestions for Improvement</h3>
                      <div className="text-blue-700">
                        {parseListText(venue.improvement_suggestions).map((item, index) => (
                          <div key={index} className="mb-2">• {item}</div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {venue.unique_selling_points && (
                    <div className="p-6 bg-purple-50 rounded-xl border border-purple-200">
                      <h3 className="font-semibold text-purple-800 mb-3">🎯 Unique Selling Points</h3>
                      <p className="text-purple-700">{cleanText(venue.unique_selling_points)}</p>
                    </div>
                  )}

                  {venue.popular_demographics && (
                    <div className="p-6 bg-orange-50 rounded-xl border border-orange-200">
                      <h3 className="font-semibold text-orange-800 mb-3">👥 Popular Demographics</h3>
                      <p className="text-orange-700">{cleanText(venue.popular_demographics)}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* FAQs */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
                
                <div className="space-y-6">
                  {[
                    { q: venue.faq1, a: venue.faqans1 },
                    { q: venue.faq2, a: venue.faqans2 },
                    { q: venue.faq3, a: venue.faqans3 },
                    { q: venue.faq4, a: venue.faqans4 },
                    { q: venue.faq5, a: venue.faqans5 },
                    { q: venue.faq6, a: venue.faqans6 }
                  ].filter(faq => faq.q && faq.a).map((faq, index) => (
                    <div key={index} className="p-6 bg-gray-50 rounded-xl">
                      <h3 className="font-semibold text-gray-900 mb-3">{cleanText(faq.q)}</h3>
                      <p className="text-gray-700 leading-relaxed">{cleanText(faq.a)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <h3 className="font-bold text-xl mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">{venue.full_address}</p>
                      <p className="text-sm text-gray-600">{venue.neighborhood}</p>
                    </div>
                  </div>
                  {venue.phone_number && venue.phone_number !== 'Not available' && venue.phone_number !== 'Not Available' && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-gray-500" />
                      <p>{venue.phone_number}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pricing & Packages - MOVED HERE */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="h-5 w-5 text-gray-500" />
                  <h3 className="font-bold text-xl">Pricing & Packages</h3>
                </div>
                
                <div className="space-y-4">
                  {venue.entry_ticket_price_range && (
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium mb-2 text-green-700">💰 Entry Price</h4>
                      <p className="text-sm text-green-600">{cleanText(venue.entry_ticket_price_range)}</p>
                    </div>
                  )}
                  
                  {venue.package_deals && venue.package_deals !== 'Not available in the provided data.' && (
                   <div className="p-4 bg-blue-50 rounded-lg">
                     <h4 className="font-medium mb-2 text-blue-700">📦 Package Deals</h4>
                     <p className="text-sm text-blue-600">{cleanText(venue.package_deals)}</p>
                   </div>
                 )}

                 {venue.special_pricing && venue.special_pricing !== 'Not available in the provided data.' && (
                   <div className="p-4 bg-purple-50 rounded-lg">
                     <h4 className="font-medium mb-2 text-purple-700">🎟️ Special Pricing</h4>
                     <p className="text-sm text-purple-600">{cleanText(venue.special_pricing)}</p>
                   </div>
                 )}

                 {venue.value_offers && venue.value_offers !== 'Not available in the provided data.' && (
                   <div className="p-4 bg-yellow-50 rounded-lg">
                     <h4 className="font-medium mb-2 text-yellow-700">💎 Value Offers</h4>
                     <p className="text-sm text-yellow-600">{cleanText(venue.value_offers)}</p>
                   </div>
                 )}
               </div>
             </CardContent>
           </Card>

           {/* Booking & Customer Experience - MOVED HERE */}
           <Card className="shadow-lg border-0">
             <CardContent className="p-6">
               <h3 className="font-bold text-xl mb-4">Booking & Experience</h3>
               <div className="space-y-4">
                 {venue.booking_system && venue.booking_system !== 'Not available in the provided data.' && (
                   <div className="p-4 bg-gray-50 rounded-lg">
                     <h4 className="font-medium mb-2">Booking System</h4>
                     <p className="text-sm text-gray-600">{cleanText(venue.booking_system)}</p>
                   </div>
                 )}
                 {venue.wait_times && venue.wait_times !== 'Not available in the provided data.' && (
                   <div className="p-4 bg-gray-50 rounded-lg">
                     <h4 className="font-medium mb-2">Wait Times</h4>
                     <p className="text-sm text-gray-600">{cleanText(venue.wait_times)}</p>
                   </div>
                 )}
                 {venue.target_audience && (
                   <div className="p-4 bg-gray-50 rounded-lg">
                     <h4 className="font-medium mb-2">Target Audience</h4>
                     <p className="text-sm text-gray-600">{cleanText(venue.target_audience)}</p>
                   </div>
                 )}
               </div>
             </CardContent>
           </Card>

           {/* Operating Hours */}
           {operatingHours.length > 0 && (
             <Card className="shadow-lg border-0">
               <CardContent className="p-6">
                 <div className="flex items-center gap-2 mb-4">
                   <Clock className="h-5 w-5 text-gray-500" />
                   <h3 className="font-bold text-xl">Operating Hours</h3>
                 </div>
                 <div className="space-y-3">
                   {operatingHours.map((dayHour, index) => {
                      const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() === 
                                     dayHour.day.toLowerCase();
                      const isClosed = dayHour.time === 'Closed' || dayHour.time.toLowerCase().includes('closed');
                      
                      return (
                        <div key={index} className={`p-3 rounded-lg ${
                          isToday ? 'bg-indigo-50 border border-indigo-200' : 'bg-gray-50'
                        }`}>
                          <div className="flex justify-between items-start">
                            <span className={`font-medium ${isToday ? 'text-indigo-700' : 'text-gray-700'}`}>
                              {dayHour.day}
                            </span>
                            <div className={`text-sm text-right ${
                              isToday ? 'text-indigo-600 font-medium' : 'text-gray-600'
                            } ${isClosed ? 'text-red-500' : ''}`}>
                              {/* Format the time with line breaks for multiple ranges */}
                              {dayHour.time.split(',').map((timeRange, idx) => (
                                <div key={idx} className="whitespace-nowrap">
                                  {timeRange.trim()}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Facilities & Access */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <h3 className="font-bold text-xl mb-4">Facilities & Access</h3>
                <div className="space-y-4">
                  {venue.parking_situation && venue.parking_situation !== 'Not available in the provided data.' && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Parking</h4>
                      <p className="text-sm text-gray-600">{cleanText(venue.parking_situation)}</p>
                    </div>
                  )}
                  {venue.accessibility_features && venue.accessibility_features !== 'Not available in the provided data.' && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Accessibility Features</h4>
                      <p className="text-sm text-gray-600">{cleanText(venue.accessibility_features)}</p>
                    </div>
                  )}
                  {venue.traffic_access && venue.traffic_access !== 'Not available in the provided data.' && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Traffic & Access</h4>
                      <p className="text-sm text-gray-600">{cleanText(venue.traffic_access)}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
 
            {/* Market Position */}
            {venue.market_position && venue.market_position !== 'Not available in the provided data.' && (
              <Card className="shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="h-5 w-5 text-gray-500" />
                    <h3 className="font-bold text-xl">Market Position</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{cleanText(venue.market_position)}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
            </main>

      {/* Recommendations Section */}
      {venue && (
        <RecommendationSection
          recommendations={getEntertainmentRecommendations(venue, id || '')}
          title="You Might Also Like"
          subtitle="Discover more exciting entertainment venues"
        />
      )}
      
      <Footer />
    </div>
  );
};
 
 export default EntertainmentDetail;
