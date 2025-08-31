import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Phone, MapPin, Clock, Star, Heart, Share2, Calendar, Dumbbell, Users, Car, Globe, Award, BookOpen, Lightbulb } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getHealthWellnessVenueById } from '@/data/health-wellness';
import ComprehensiveVenueImage from '@/components/shared/ComprehensiveVenueImage';
import RecommendationSection from '@/components/shared/RecommendationSection';
import { getHealthWellnessRecommendations } from '@/utils/recommendationEngine';

const HealthWellnessDetail = () => {
  const { id } = useParams();
  const venue = getHealthWellnessVenueById(id || '');

  if (!venue) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Health & Wellness Venue Not Found</h1>
            <p className="text-gray-600 mb-8">Sorry, we couldn't find the health & wellness venue you're looking for.</p>
            <Link to="/health-wellness" className="text-blue-600 hover:text-blue-800">
              ← Back to Health & Wellness
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
      const parts = cleaned.split(/(?=\d+\.\s+)/).filter(item => item.trim());
      return parts.map(item => item.replace(/^\d+\.\s*/, '').trim()).filter(item => item);
    }
    
    // Then try asterisks or bullet points
    if (cleaned.includes('*') || cleaned.includes('•')) {
      return cleaned.split(/[*•]/).filter(item => item.trim()).map(item => item.trim());
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

  // Enhanced parsing for complex operating hours
  const parseOperatingHours = (hoursString) => {
    if (!hoursString || hoursString === 'Not Available' || hoursString === 'Not available') return [];
    
    const dayHours = hoursString.split(' ##')[0].split(/(?=Monday:|Tuesday:|Wednesday:|Thursday:|Friday:|Saturday:|Sunday:)/)
      .filter(Boolean)
      .map(dayTime => {
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
    
    // Handle multiple time ranges
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
        
        // Handle overnight hours
        if (closeTime <= openTime) {
          if (currentTime >= openTime || currentTime <= closeTime) {
            return 'open';
          }
        } else {
          if (currentTime >= openTime && currentTime <= closeTime) {
            return 'open';
          }
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
    if (venue.phone_number) {
      window.open(`tel:${venue.phone_number}`, '_self');
    }
  };

  const handleDirections = () => {
    window.open(venue.google_maps_link, '_blank');
  };

  const handleWebsite = () => {
    if (venue.website_url) {
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
          to="/health-wellness" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Health & Wellness
        </Link>

        {/* Hero Section with Image */}
        <div className="relative h-[500px] rounded-2xl overflow-hidden mb-8 shadow-xl">
          <ComprehensiveVenueImage
            category="health-wellness"
            placeId={venue.place_id}
            placeName={venue.place_name}
            alt={venue.place_name}
            className="detail-page-image"
            showSlider={true}
            showDots={true}
            showNavigation={true}
          />
          
          {/* Hero Content - Simplified */}
          <div className="absolute bottom-0 left-0 right-0 p-8 text-gray-900 bg-white/80 backdrop-blur-md rounded-t-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{venue.place_name}</h1>
            
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
          {venue.phone_number && (
            <Button onClick={handleCall} size="lg" className="flex-1 min-w-48 bg-green-600 hover:bg-green-700">
              <Phone className="h-5 w-5 mr-2" />
              Call Facility
            </Button>
          )}
          <Button onClick={handleDirections} variant="outline" size="lg" className="flex-1 min-w-48 border-green-600 text-green-600 hover:bg-green-50">
            <MapPin className="h-5 w-5 mr-2" />
            Get Directions
          </Button>
          {venue.website_url && (
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
                <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">About {venue.place_name}</h2>
                <p className="text-gray-700 leading-relaxed text-lg">{cleanText(venue.about)}</p>
              </CardContent>
            </Card>

            {/* Comprehensive Ratings */}
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Star className="h-6 w-6 text-green-600" />
                  </div>
                  Health & Wellness Ratings
                  <Badge variant="outline" className="ml-auto">Verified by KLIspots</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="text-center p-8 bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl border border-green-200">
                  <div className="text-6xl font-bold text-green-600 mb-2">
                    {Number(venue.total_score).toFixed(1)}
                  </div>
                  <div className="text-lg text-gray-600">Overall Rating</div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <ScoreBar label="Equipment Quality & Variety" score={venue.equipment_quality_and_variety_score} />
                  <ScoreBar label="Trainer & Staff Expertise" score={venue.trainer_and_staff_expertise_score} />
                  <ScoreBar label="Facility & Infrastructure" score={venue.facility_and_infrastructure_score} />
                  <ScoreBar label="Customer Service" score={venue.customer_service_score} />
                  <ScoreBar label="Hygiene & Maintenance" score={venue.hygiene_and_maintenance_score} />
                  <ScoreBar label="Value for Money" score={venue.value_for_money_score} />
                  <ScoreBar label="Cleanliness" score={venue.cleanliness_score} />
                  <ScoreBar label="Equipment Maintenance" score={venue.equipment_maintenance_score} />
                  <ScoreBar label="Air Conditioning & Ventilation" score={venue.air_conditioning_and_ventilation_score} />
                  <ScoreBar label="Safety & Security" score={venue.safety_and_security_score} />
                </div>

                {/* Unique Selling Points & Market Position - MOVED HERE */}
                <div className="grid md:grid-cols-2 gap-6">
                  {venue.unique_selling_points && (
                    <div className="p-6 bg-green-50 rounded-xl border border-green-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Award className="h-5 w-5 text-green-600" />
                        <h3 className="font-semibold text-green-800">Unique Selling Points</h3>
                      </div>
                      <p className="text-green-700">{cleanText(venue.unique_selling_points)}</p>
                    </div>
                  )}

                  {venue.competition_analysis && (
                    <div className="p-6 bg-teal-50 rounded-xl border border-teal-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Star className="h-5 w-5 text-teal-600" />
                        <h3 className="font-semibold text-teal-800">Market Position</h3>
                      </div>
                      <p className="text-teal-700">{cleanText(venue.competition_analysis)}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Services & Programs */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <Dumbbell className="h-6 w-6 text-teal-600" />
                  </div>
                  <h2 className="text-3xl font-bold">Services & Programs</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {venue.group_fitness_classes && (
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <h4 className="font-semibold text-blue-800 mb-2">Group Fitness Classes</h4>
                      <p className="text-sm text-blue-700">{cleanText(venue.group_fitness_classes)}</p>
                    </div>
                  )}
                  
                  {venue.personal_training && (
                    <div className="p-4 bg-green-50 rounded-xl">
                      <h4 className="font-semibold text-green-800 mb-2">Personal Training</h4>
                      <p className="text-sm text-green-700">{cleanText(venue.personal_training)}</p>
                    </div>
                  )}

                  {venue.yoga_and_meditation && venue.yoga_and_meditation !== 'Not mentioned.' && (
                    <div className="p-4 bg-purple-50 rounded-xl">
                      <h4 className="font-semibold text-purple-800 mb-2">Yoga & Meditation</h4>
                      <p className="text-sm text-purple-700">{cleanText(venue.yoga_and_meditation)}</p>
                    </div>
                  )}

                  {venue.martial_arts && venue.martial_arts !== 'Not mentioned.' && (
                    <div className="p-4 bg-red-50 rounded-xl">
                      <h4 className="font-semibold text-red-800 mb-2">Martial Arts</h4>
                      <p className="text-sm text-red-700">{cleanText(venue.martial_arts)}</p>
                    </div>
                  )}

                  {venue.recovery_facilities && (
                    <div className="p-4 bg-orange-50 rounded-xl">
                      <h4 className="font-semibold text-orange-800 mb-2">Recovery Facilities</h4>
                      <p className="text-sm text-orange-700">{cleanText(venue.recovery_facilities)}</p>
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
                    {venue.best_time_for_beginners && (
                      <div className="p-6 bg-rose-50 rounded-xl border border-rose-200">
                        <h3 className="font-semibold mb-3 flex items-center justify-center gap-2 text-rose-700">
                          👶 Beginners
                        </h3>
                        <p className="text-sm text-rose-600">{cleanText(venue.best_time_for_beginners)}</p>
                      </div>
                    )}

                    {venue.best_time_for_cardio && (
                      <div className="p-6 bg-purple-50 rounded-xl border border-purple-200">
                        <h3 className="font-semibold mb-3 flex items-center justify-center gap-2 text-purple-700">
                          💗 Cardio
                        </h3>
                        <p className="text-sm text-purple-600">{cleanText(venue.best_time_for_cardio)}</p>
                      </div>
                    )}

                    {venue.best_time_for_women && (
                      <div className="p-6 bg-pink-50 rounded-xl border border-pink-200">
                        <h3 className="font-semibold mb-3 text-pink-700 text-center">👩 Women-friendly</h3>
                        <p className="text-sm text-pink-600">{cleanText(venue.best_time_for_women)}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-6">
                    {venue.least_crowded_hours && (
                      <div className="p-6 bg-green-50 rounded-xl border border-green-200">
                        <h3 className="font-semibold mb-3 text-green-700 text-center">✨ Least Crowded</h3>
                        <p className="text-sm text-green-600">{cleanText(venue.least_crowded_hours)}</p>
                      </div>
                    )}
                    
                    {venue.peak_hours && (
                      <div className="p-6 bg-orange-50 rounded-xl border border-orange-200">
                        <h3 className="font-semibold mb-3 text-orange-700 text-center">🔥 Peak Hours</h3>
                        <p className="text-sm text-orange-600">{cleanText(venue.peak_hours)}</p>
                      </div>
                    )}

                    {venue.best_time_for_classes && (
                      <div className="p-6 bg-yellow-50 rounded-xl border border-yellow-200">
                        <h3 className="font-semibold mb-3 text-yellow-700 text-center">📚 Classes</h3>
                        <p className="text-sm text-yellow-600">{cleanText(venue.best_time_for_classes)}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {venue.weekend_vs_weekday && (
                  <div className="mt-6 p-6 bg-gray-50 rounded-xl">
                    <h4 className="font-medium mb-2">Weekend vs Weekday</h4>
                    <p className="text-sm text-gray-600">{cleanText(venue.weekend_vs_weekday)}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Customer Reviews */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-8">Customer Reviews & Experience</h2>
                
                {venue.customer_feedback && (
                  <p className="text-gray-700 mb-8 text-lg leading-relaxed">{cleanText(venue.customer_feedback)}</p>
                )}
                
                <div className="space-y-6">
                  {venue.popular_features && (
                    <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-200">
                      <h3 className="font-semibold text-emerald-800 mb-3">✅ Popular Features</h3>
                      <div className="text-emerald-700">
                        {parseListText(venue.popular_features).map((item, index) => (
                          <div key={index} className="mb-2">• {item}</div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {venue.common_complaints && (
                    <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                      <h3 className="font-semibold text-blue-800 mb-3">💡 Areas for Improvement</h3>
                      <p className="text-blue-700">{cleanText(venue.common_complaints)}</p>
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
                    { q: venue.faq5, a: venue.faqans5 }
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
                  {venue.phone_number && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-gray-500" />
                      <p>{venue.phone_number}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Facilities & Amenities - MOVED HERE */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <h3 className="font-bold text-xl mb-4">Facilities & Amenities</h3>
                <div className="space-y-4">
                  {venue.locker_rooms && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Locker Rooms</h4>
                      <p className="text-sm text-gray-600">{cleanText(venue.locker_rooms)}</p>
                    </div>
                  )}
                  {venue.hygiene_protocols && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Hygiene Protocols</h4>
                      <p className="text-sm text-gray-600">{cleanText(venue.hygiene_protocols)}</p>
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
                          isToday ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                        }`}>
                          <div className="flex justify-between items-start">
                             <span className={`font-medium ${isToday ? 'text-green-700' : 'text-gray-700'}`}>
                               {dayHour.day}
                             </span>
                             <div className={`text-sm text-right ${
                               isToday ? 'text-green-600 font-medium' : 'text-gray-600'
                             } ${isClosed ? 'text-red-500' : ''}`}>
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

             {/* Gender Sensitivity */}
             {venue.gender_sensitivity && (
               <Card className="shadow-lg border-0">
                 <CardContent className="p-6">
                   <div className="flex items-center gap-2 mb-4">
                     <Users className="h-5 w-5 text-gray-500" />
                     <h3 className="font-bold text-xl">Gender Sensitivity</h3>
                   </div>
                   <p className="text-sm text-gray-600">{cleanText(venue.gender_sensitivity)}</p>
                 </CardContent>
               </Card>
             )}
           </div>
         </div>
       </main>

       {/* Recommendations Section */}
       {venue && (
         <RecommendationSection
           recommendations={getHealthWellnessRecommendations(venue, id || '')}
           title="You Might Also Like"
           subtitle="Discover more amazing wellness destinations"
         />
       )}
       
       <Footer />
     </div>
   );
 };
 
 export default HealthWellnessDetail;
