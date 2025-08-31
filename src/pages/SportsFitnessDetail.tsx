import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Phone, MapPin, Clock, Star, Heart, Share2, Calendar, Trophy, Users, Car, Globe, Award, BookOpen, Lightbulb } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSportsFitnessVenueById } from '@/data/sports-fitness';
import ComprehensiveVenueImage from '@/components/shared/ComprehensiveVenueImage';
import RecommendationSection from '@/components/shared/RecommendationSection';
import { getSportsFitnessRecommendations } from '@/utils/recommendationEngine';

const SportsFitnessDetail = () => {
  const { id } = useParams();
  const venue = getSportsFitnessVenueById(id || '');

  if (!venue) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Sports & Fitness Venue Not Found</h1>
            <p className="text-gray-600 mb-8">Sorry, we couldn't find the sports & fitness venue you're looking for.</p>
            <Link to="/sports-fitness" className="text-blue-600 hover:text-blue-800">
              ← Back to Sports & Fitness
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
    return text.split('#')[0].trim();
  };

  // Helper function to convert numbered list to array
  const parseListText = (text) => {
    if (!text) return [];
    const cleaned = cleanText(text);
    
    // First, try splitting by numbers followed by period (1. 2. 3.)
    let items = cleaned.split(/\d+\.\s+/).filter(item => item.trim());
    
    // If numbered list found, return it
    if (items.length > 1) {
      return items.map(item => item.trim().replace(/^[,\s]+|[,\s]+$/g, ''));
    }
    
    // Try splitting by asterisks or bullets
    if (cleaned.includes('*')) {
      items = cleaned.split('*').filter(item => item.trim());
      if (items.length > 1) {
        return items.map(item => item.trim().replace(/^[,\s]+|[,\s]+$/g, ''));
      }
    }
    
    // Try splitting by bullet points
    if (cleaned.includes('•')) {
      items = cleaned.split('•').filter(item => item.trim());
      if (items.length > 1) {
        return items.map(item => item.trim().replace(/^[,\s]+|[,\s]+$/g, ''));
      }
    }
    
    // Only split by commas if it looks like a proper list
    if (cleaned.includes(',')) {
      const potentialItems = cleaned.split(',');
      
      // If we have 3+ potential items and none are too long, treat as comma-separated list
      if (potentialItems.length >= 3 && potentialItems.every(item => item.trim().length < 50)) {
        return potentialItems.map(item => item.trim()).filter(item => item);
      }
    }
    
    // If nothing else works, return as single item
    return [cleaned];
  };

  // Enhanced parsing for complex operating hours
  const parseOperatingHours = (hoursString) => {
    if (!hoursString) return [];
    
    const dayHours = hoursString.split(/(?=Monday:|Tuesday:|Wednesday:|Thursday:|Friday:|Saturday:|Sunday:)/)
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

    // Handle "Open 24 hours" cases
    if (todayHours.time.toLowerCase().includes('open 24 hours')) {
      return 'open';
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
        
        // Handle overnight hours (e.g., 7:00 AM - 3:00 AM next day)
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
    if (venue.website_url && venue.website_url !== 'maps.google.com') {
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
          to="/sports-fitness" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Sports & Fitness
        </Link>

        {/* Hero Section with Image */}
        <div className="relative h-[500px] rounded-2xl overflow-hidden mb-8 shadow-xl">
          <ComprehensiveVenueImage
            category="sports-fitness"
            placeId={venue.place_id}
            placeName={venue.facility_name}
            alt={venue.facility_name}
            className="detail-page-image"
            showSlider={true}
            showDots={true}
            showNavigation={true}
          />
          
          {/* Hero Content - Simplified */}
          <div className="absolute bottom-0 left-0 right-0 p-8 text-gray-900 bg-white/80 backdrop-blur-md rounded-t-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{venue.facility_name}</h1>
            
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
            <Button onClick={handleCall} size="lg" className="flex-1 min-w-48 bg-blue-600 hover:bg-blue-700">
              <Phone className="h-5 w-5 mr-2" />
              Call Facility
            </Button>
          )}
          <Button onClick={handleDirections} variant="outline" size="lg" className="flex-1 min-w-48 border-blue-600 text-blue-600 hover:bg-blue-50">
            <MapPin className="h-5 w-5 mr-2" />
            Get Directions
          </Button>
          {venue.website_url && venue.website_url !== 'maps.google.com' && (
            <Button onClick={handleWebsite} variant="outline" size="lg" className="flex-1 min-w-48 border-cyan-600 text-cyan-600 hover:bg-cyan-50">
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
                <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">About {venue.facility_name}</h2>
                <p className="text-gray-700 leading-relaxed text-lg">{cleanText(venue.about)}</p>
              </CardContent>
            </Card>

            {/* Comprehensive Ratings */}
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Star className="h-6 w-6 text-blue-600" />
                  </div>
                  Sports & Fitness Ratings
                  <Badge variant="outline" className="ml-auto">Verified by KLIspots</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200">
                  <div className="text-6xl font-bold text-blue-600 mb-2">
                    {Number(venue.total_score).toFixed(1)}
                  </div>
                  <div className="text-lg text-gray-600">Overall Rating</div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <ScoreBar label="Court/Field Quality" score={venue.court_field_quality_score} />
                  <ScoreBar label="Equipment & Facilities" score={venue.equipment_and_facilities_score} />
                  <ScoreBar label="Booking System & Accessibility" score={venue.booking_system_and_accessibility_score} />
                  <ScoreBar label="Staff & Coaching Quality" score={venue.staff_and_coaching_quality_score} />
                  <ScoreBar label="Location & Parking" score={venue.location_and_parking_score} />
                  <ScoreBar label="Value for Money" score={venue.value_for_money_score} />
                  <ScoreBar label="Safety & Maintenance" score={venue.safety_and_maintenance_score} />
                  <ScoreBar label="Surface Quality" score={venue.surface_quality_score} />
                  <ScoreBar label="Lighting Quality" score={venue.lighting_quality_score} />
                  <ScoreBar label="Equipment Condition" score={venue.equipment_condition_score} />
                  <ScoreBar label="Crowd Management" score={venue.crowd_management_score} />
                  <ScoreBar label="Cleanliness" score={venue.cleanliness_score} />
                </div>

                {/* Value Proposition - MOVED HERE */}
                {venue.value_proposition && (
                  <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Award className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-blue-800 text-center">Value Proposition</h3>
                    </div>
                    <p className="text-blue-700">{cleanText(venue.value_proposition)}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sports & Equipment */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-cyan-100 rounded-lg">
                    <Trophy className="h-6 w-6 text-cyan-600" />
                  </div>
                  <h2 className="text-3xl font-bold">Sports & Equipment</h2>
                </div>
                
                {venue.sports_offered && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-semibold text-gray-800 mb-2">Sports Offered</h4>
                    <p className="text-gray-700 leading-relaxed">{cleanText(venue.sports_offered)}</p>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  {venue.equipment_provided && (
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <h4 className="font-semibold text-blue-800 mb-2">Equipment Provided</h4>
                      <p className="text-sm text-blue-700">{cleanText(venue.equipment_provided)}</p>
                    </div>
                  )}
                  {venue.equipment_rental && (
                    <div className="p-4 bg-green-50 rounded-xl">
                      <h4 className="font-semibold text-green-800 mb-2">Equipment Rental</h4>
                      <p className="text-sm text-green-700">{cleanText(venue.equipment_rental)}</p>
                    </div>
                  )}
                </div>

                {venue.equipment_quality_vs_price && (
                  <div className="mt-6 p-6 bg-orange-50 rounded-xl border border-orange-200">
                    <h4 className="font-semibold text-orange-800 mb-2">Equipment Quality vs Price</h4>
                    <p className="text-sm text-orange-700">{cleanText(venue.equipment_quality_vs_price)}</p>
                  </div>
                )}
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
                    {venue.best_time_for_competitive_play && (
                      <div className="p-6 bg-rose-50 rounded-xl border border-rose-200">
                        <h3 className="font-semibold mb-3 flex items-center justify-center gap-2 text-rose-700">
                          🏆 Competitive Play
                        </h3>
                        <p className="text-sm text-rose-600">{cleanText(venue.best_time_for_competitive_play)}</p>
                      </div>
                    )}
                    
                    {venue.best_time_for_casual_play && (
                      <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                        <h3 className="font-semibold mb-3 flex items-center justify-center gap-2 text-blue-700">
                          😊 Casual Play
                        </h3>
                        <p className="text-sm text-blue-600">{cleanText(venue.best_time_for_casual_play)}</p>
                      </div>
                    )}

                    {venue.best_time_for_training_sessions && (
                      <div className="p-6 bg-purple-50 rounded-xl border border-purple-200">
                        <h3 className="font-semibold mb-3 flex items-center justify-center gap-2 text-purple-700">
                          💪 Training Sessions
                        </h3>
                        <p className="text-sm text-purple-600">{cleanText(venue.best_time_for_training_sessions)}</p>
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

                    {venue.best_time_for_corporate_events && (
                      <div className="p-6 bg-yellow-50 rounded-xl border border-yellow-200">
                        <h3 className="font-semibold mb-3 text-yellow-700 text-center">🏢 Corporate Events</h3>
                        <p className="text-sm text-yellow-600">{cleanText(venue.best_time_for_corporate_events)}</p>
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
                  
                  {venue.improvement_suggestion && (
                    <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                      <h3 className="font-semibold text-blue-800 mb-3">💡 Suggestions for Improvement</h3>
                      <p className="text-blue-700">{cleanText(venue.improvement_suggestion)}</p>
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
                  {venue.phone_number && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-gray-500" />
                      <p>{venue.phone_number}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Booking Information - MOVED ABOVE OPERATING HOURS */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <h3 className="font-bold text-xl mb-4">Booking Information</h3>
                <div className="space-y-4">
                  {venue.booking_price_range && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Price Range</h4>
                      <p className="text-sm text-gray-600">{cleanText(venue.booking_price_range)}</p>
                    </div>
                  )}
                  {venue.booking_method && venue.booking_method !== 'Not specified, but likely phone or walk-in.' && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Booking Method</h4>
                      <p className="text-sm text-gray-600">{cleanText(venue.booking_method)}</p>
                    </div>
                  )}
                  {venue.equipment_rental && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Equipment Rental</h4>
                      <p className="text-sm text-gray-600">{cleanText(venue.equipment_rental)}</p>
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
                      const isOpen24Hours = dayHour.time.toLowerCase().includes('open 24 hours');
                      
                      return (
                        <div key={index} className={`p-3 rounded-lg ${
                          isToday ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                        }`}>
                          <div className="flex justify-between items-start">
                            <span className={`font-medium ${isToday ? 'text-blue-700' : 'text-gray-700'}`}>
                             {dayHour.day}
                           </span>
                           <div className={`text-sm text-right ${
                             isToday ? 'text-blue-600 font-medium' : 'text-gray-600'
                           } ${isClosed ? 'text-red-500' : ''} ${isOpen24Hours ? 'text-green-600' : ''}`}>
                             {isOpen24Hours ? '24 Hours' : dayHour.time.split(',').map((timeRange, idx) => (
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
         </div>
       </div>
     </main>

     {/* Recommendations Section */}
     {venue && (
       <RecommendationSection
         recommendations={getSportsFitnessRecommendations(venue, id || '')}
         title="You Might Also Like"
         subtitle="Discover more amazing fitness and sports venues"
       />
     )}
     
     <Footer />
   </div>
 );
};

export default SportsFitnessDetail;
