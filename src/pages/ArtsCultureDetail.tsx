import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Phone, MapPin, Clock, Star, Heart, Share2, Calendar, Palette, Users, Car, Globe, Camera, Award, BookOpen, Lightbulb } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getArtsCultureVenueById } from '@/data/arts-culture';
import ComprehensiveVenueImage from '@/components/shared/ComprehensiveVenueImage';
import RecommendationSection from '@/components/shared/RecommendationSection';
import { getArtsCultureRecommendations } from '@/utils/recommendationEngine';

const ArtsCultureDetail = () => {
  const { id } = useParams();
  const venue = getArtsCultureVenueById(id || '');

  if (!venue) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Arts & Culture Venue Not Found</h1>
            <p className="text-gray-600 mb-8">Sorry, we couldn't find the arts & culture venue you're looking for.</p>
            <Link to="/arts-culture" className="text-blue-600 hover:text-blue-800">
              ← Back to Arts & Culture
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Function to clean text and remove content after #
  const cleanText = (text) => {
    if (!text) return '';
    const hashIndex = text.indexOf('#');
    return hashIndex !== -1 ? text.substring(0, hashIndex).trim() : text;
  };

  // Function to parse text into bullet points based on delimiters
  const parseIntoBulletPoints = (text) => {
    if (!text) return [];
    
    const cleanedText = cleanText(text);
    
    // Split by various delimiters and clean up
    let items = [];
    
    // Try splitting by asterisks first
    if (cleanedText.includes('*')) {
      items = cleanedText.split('*').map(item => item.trim()).filter(item => item.length > 0);
    }
    // Try splitting by numbered lists (1., 2., etc.)
    else if (/\\d+\\.\\s/.test(cleanedText)) {
      items = cleanedText.split(/\\d+\\.\\s/).map(item => item.trim()).filter(item => item.length > 0);
    }
    // Try splitting by commas
    else if (cleanedText.includes(',')) {
      items = cleanedText.split(',').map(item => item.trim()).filter(item => item.length > 0);
    }
    // If no delimiters found, return as single item
    else {
      items = [cleanedText];
    }
    
    return items;
  };

  // Enhanced parsing for complex operating hours with multiple time ranges
  const parseOperatingHours = (hoursString) => {
    if (!hoursString) return [];
    
    const dayHours = hoursString.split(' * ').map(dayTime => {
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
    
    // Handle multiple time ranges (e.g., "9:00 AM - 1:00 PM, 2:00 PM - 4:00 PM")
    const timeRanges = todayHours.time.split(',').map(range => range.trim());
    
    for (const range of timeRanges) {
      const timeMatch = range.match(/(\\d+):(\\d+)\\s*(AM|PM)\\s*-\\s*(\\d+):(\\d+)\\s*(AM|PM)/i);
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
    if (venue.phone_number && venue.phone_number !== '(Not provided in the data)') {
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
      <div className="space-y-2 sm:space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm font-medium text-gray-700">{label}</span>
          <span className={`text-xs sm:text-sm font-bold ${getScoreColor(score)}`}>
            {Number(score).toFixed(1)}/{maxScore}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5 overflow-hidden">
          <div
            className={`h-2 sm:h-2.5 rounded-full bg-gradient-to-r ${getScoreBarColor(score)} transition-all duration-700 ease-out shadow-sm`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  // Parse common praise into bullet points
  const commonPraisePoints = parseIntoBulletPoints(venue.common_praise);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <Link 
          to="/arts-culture" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 sm:mb-6 transition-colors group text-sm sm:text-base"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="hidden sm:inline">Back to Arts & Culture</span>
          <span className="sm:hidden">Back</span>
        </Link>

        {/* Hero Section with Image */}
        <div className="relative h-[500px] rounded-2xl overflow-hidden mb-8 shadow-xl">
          <ComprehensiveVenueImage
            category="arts-culture"
            placeId={id || ''}
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
          
          <div className="absolute top-3 sm:top-4 md:top-6 right-3 sm:right-4 md:right-6 flex gap-2 sm:gap-3">
            <Button variant="outline" size="icon" className="bg-white/90 hover:bg-white backdrop-blur-sm h-8 w-8 sm:h-10 sm:w-10">
              <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button variant="outline" size="icon" className="bg-white/90 hover:bg-white backdrop-blur-sm h-8 w-8 sm:h-10 sm:w-10">
              <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-8">
          {venue.phone_number && venue.phone_number !== '(Not provided in the data)' && (
            <Button onClick={handleCall} size="lg" className="flex-1 min-w-48 bg-red-600 hover:bg-red-700 text-white">
              <Phone className="h-5 w-5 mr-2" />
              Call Venue
            </Button>
          )}
          <Button onClick={handleDirections} variant="outline" size="lg" className="flex-1 min-w-48 border-red-600 text-red-600 hover:bg-red-50">
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
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            
            {/* About Section */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-4 sm:p-6 md:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900 text-center">About {venue.place_name}</h2>
                <p className="text-gray-700 leading-relaxed text-base sm:text-lg mb-4 sm:mb-6">{cleanText(venue.about)}</p>
              </CardContent>
            </Card>

            {/* Comprehensive Ratings */}
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-xl sm:text-2xl">
                  <div className="p-2 bg-rose-100 rounded-lg">
                    <Star className="h-5 w-5 sm:h-6 sm:w-6 text-rose-600" />
                  </div>
                  <span>Comprehensive Ratings</span>
                  <Badge variant="outline" className="ml-auto mt-2 sm:mt-0">Verified by KLIspots</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 sm:space-y-8">
                <div className="text-center p-6 sm:p-8 bg-gradient-to-br from-rose-50 to-orange-50 rounded-xl sm:rounded-2xl border border-rose-200">
                  <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-rose-600 mb-2">
                    {Number(venue.total_score).toFixed(1)}
                  </div>
                  <div className="text-base sm:text-lg text-gray-600">Overall Rating</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                  <ScoreBar label="Cultural Significance" score={venue.cultural_significance_score} />
                  <ScoreBar label="Venue & Facilities" score={(venue as any).venue_and_facilities_score} />
                  <ScoreBar label="Educational Value" score={venue.educational_value_score} />
                  <ScoreBar label="Accessibility & Navigation" score={venue.accessibility_and_facilities_score} />
                  <ScoreBar label="Value for Money" score={(venue as any).value_for_money_score} />
                  <ScoreBar label="Cleanliness" score={(venue as any).cleanliness_score} />
                  <ScoreBar label="Art Quality & Curation" score={(venue as any).art_quality_and_curation_score} />
                  <ScoreBar label="Staff Knowledge" score={(venue as any).staff_knowledge_score} />
                  <ScoreBar label="Exhibition Design" score={(venue as any).exhibition_design_score} />
                  <ScoreBar label="Preservation Quality" score={(venue as any).preservation_quality_score} />
                </div>

                {/* Cultural Significance and Artistic Importance under ratings */}
                <div className="mt-8 space-y-6">
                  {(venue as any).cultural_significance && (venue as any).cultural_significance !== '(Data not provided, needs further research)' && (
                    <div className="p-6 bg-amber-50 rounded-xl border border-amber-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Award className="h-5 w-5 text-amber-600" />
                        <h3 className="font-semibold text-amber-800">Cultural Significance</h3>
                      </div>
                      <p className="text-amber-700 leading-relaxed">{cleanText((venue as any).cultural_significance)}</p>
                    </div>
                  )}

                  {(venue as any).artistic_importance && (venue as any).artistic_importance !== '(Data not provided, needs further research)' && (
                    <div className="p-6 bg-purple-50 rounded-xl border border-purple-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Palette className="h-5 w-5 text-purple-600" />
                        <h3 className="font-semibold text-purple-800">Artistic Importance</h3>
                      </div>
                      <p className="text-purple-700 leading-relaxed">{cleanText((venue as any).artistic_importance)}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Collections & Exhibitions */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-4 sm:p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Palette className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold">Collections & Exhibitions</h2>
                </div>
                
                {(venue as any).permanent_collection && (venue as any).permanent_collection !== '(Data not provided, needs further research)' && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-semibold text-gray-800 mb-2">Permanent Collection</h4>
                    <p className="text-gray-700 leading-relaxed">{cleanText((venue as any).permanent_collection)}</p>
                  </div>
                )}

                {(venue as any).special_collections && (venue as any).special_collections !== '(Data not provided, needs further research)' && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-xl">
                    <h4 className="font-semibold text-blue-800 mb-2">Special Collections</h4>
                    <p className="text-blue-700 leading-relaxed">{cleanText((venue as any).special_collections)}</p>
                  </div>
                )}

                {(venue as any).exhibition_spaces && (venue as any).exhibition_spaces !== '(Data not provided, needs further research)' && (
                  <div className="p-4 bg-indigo-50 rounded-xl">
                    <h4 className="font-semibold text-indigo-800 mb-2">Exhibition Spaces</h4>
                    <p className="text-sm text-indigo-700">{cleanText((venue as any).exhibition_spaces)}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Best Times to Visit */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-4 sm:p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-center">Best Times to Visit</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                  <div className="space-y-6">
                    {venue.best_time_for_art_enthusiasts && (
                      <div className="p-6 bg-rose-50 rounded-xl border border-rose-200">
                        <h3 className="font-semibold mb-3 flex items-center justify-center gap-2 text-rose-700">
                          🎨 Art Enthusiasts
                        </h3>
                        <p className="text-sm text-rose-600">{cleanText(venue.best_time_for_art_enthusiasts)}</p>
                      </div>
                    )}
                    
                    {venue.best_time_for_dates && (
                      <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                        <h3 className="font-semibold mb-3 flex items-center justify-center gap-2 text-blue-700">
                          💑 Dates
                        </h3>
                        <p className="text-sm text-blue-600">{cleanText(venue.best_time_for_dates)}</p>
                      </div>
                    )}

                    {venue.best_time_for_families && (
                      <div className="p-6 bg-purple-50 rounded-xl border border-purple-200">
                        <h3 className="font-semibold mb-3 flex items-center justify-center gap-2 text-purple-700">
                          👨‍👩‍👧‍👦 Families
                        </h3>
                        <p className="text-sm text-purple-600">{cleanText(venue.best_time_for_families)}</p>
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

                    {venue.best_time_for_photography && (
                      <div className="p-6 bg-yellow-50 rounded-xl border border-yellow-200">
                        <h3 className="font-semibold mb-3 text-yellow-700 text-center">📸 Photography</h3>
                        <p className="text-sm text-yellow-600">{cleanText(venue.best_time_for_photography)}</p>
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

            {/* Visitor Reviews */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-4 sm:p-6 md:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Visitor Reviews & Experience</h2>
                
                {venue.review_summary && (
                  <p className="text-gray-700 mb-8 text-lg leading-relaxed">{cleanText(venue.review_summary)}</p>
                )}
                
                <div className="space-y-6">
                  {venue.common_praise && commonPraisePoints.length > 0 && (
                    <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-200">
                      <h3 className="font-semibold text-emerald-800 mb-3">✅ What Visitors Love</h3>
                      <ul className="space-y-2 text-emerald-700">
                        {commonPraisePoints.map((point, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-emerald-600 mt-1">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {(venue as any).areas_for_improvement && (
                    <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                      <h3 className="font-semibold text-blue-800 mb-3">💡 Areas for Improvement</h3>
                      <p className="text-blue-700">{cleanText((venue as any).areas_for_improvement)}</p>
                    </div>
                  )}
                  
                  {(venue as any).unique_selling_points && (
                    <div className="p-6 bg-purple-50 rounded-xl border border-purple-200">
                      <h3 className="font-semibold text-purple-800 mb-3">🎯 Unique Selling Points</h3>
                      <p className="text-purple-700">{cleanText((venue as any).unique_selling_points)}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* FAQs */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-4 sm:p-6 md:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Frequently Asked Questions</h2>
                
                <div className="space-y-6">
                  {[
                    { q: venue.faq1, a: venue.faqans1 },
                    { q: venue.faq2, a: venue.faqans2 },
                    { q: venue.faq3, a: venue.faqans3 },
                    { q: venue.faq4, a: venue.faqans4 },
                    { q: venue.faq5, a: venue.faqans5 }
                  ].filter(faq => faq.q && faq.a).map((faq, index) => (
                    <div key={index} className="p-6 bg-gray-50 rounded-xl">
                      <h3 className="font-semibold text-gray-900 mb-3">{faq.q}</h3>
                      <p className="text-gray-700 leading-relaxed">{cleanText(faq.a)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Contact Info */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-4 sm:p-6">
                <h3 className="font-bold text-lg sm:text-xl mb-3 sm:mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">{venue.full_address}</p>
                      <p className="text-sm text-gray-600">{venue.neighborhood}</p>
                    </div>
                  </div>
                  {venue.phone_number && venue.phone_number !== '(Not provided in the data)' && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-gray-500" />
                      <p>{venue.phone_number}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Operating Hours */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                  <h3 className="font-bold text-lg sm:text-xl">Operating Hours</h3>
                </div>
                <div className="space-y-3">
                  {operatingHours.map((dayHour, index) => {
                    const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() === 
                                   dayHour.day.toLowerCase();
                    const isClosed = dayHour.time === 'Closed' || dayHour.time.toLowerCase().includes('closed');
                    
                    return (
                      <div key={index} className={`p-3 rounded-lg ${
                        isToday ? 'bg-rose-50 border border-rose-200' : 'bg-gray-50'
                      }`}>
                        <div className="flex justify-between items-start">
                          <span className={`font-medium ${isToday ? 'text-rose-700' : 'text-gray-700'}`}>
                            {dayHour.day}
                          </span>
                          <div className={`text-sm text-right ${
                            isToday ? 'text-rose-600 font-medium' : 'text-gray-600'
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

            {/* Visitor Information */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-4 sm:p-6">
                <h3 className="font-bold text-lg sm:text-xl mb-3 sm:mb-4">Visitor Information</h3>
                <div className="space-y-4">
                  {venue.entry_fee && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Entry Fee</h4>
                      <p className="text-sm text-gray-600">{cleanText(venue.entry_fee)}</p>
                    </div>
                  )}
                  {venue.guided_tours && venue.guided_tours !== '(Data not provided, needs further research)' && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Guided Tours</h4>
                      <p className="text-sm text-gray-600">{cleanText(venue.guided_tours)}</p>
                    </div>
                  )}
                 {venue.photography_policy && (
                   <div className="p-4 bg-gray-50 rounded-lg">
                     <div className="flex items-center gap-2 mb-2">
                       <Camera className="h-4 w-4" />
                       <h4 className="font-medium">Photography Policy</h4>
                     </div>
                     <p className="text-sm text-gray-600">{cleanText(venue.photography_policy)}</p>
                   </div>
                 )}
                 {(venue as any).audio_guides && (venue as any).audio_guides !== '(Data not provided, needs further research)' && (
                   <div className="p-4 bg-gray-50 rounded-lg">
                     <h4 className="font-medium mb-2">Audio Guides</h4>
                     <p className="text-sm text-gray-600">{cleanText((venue as any).audio_guides)}</p>
                   </div>
                 )}
                 {(venue as any).interactive_exhibits && (venue as any).interactive_exhibits !== '(Data not provided, needs further research)' && (
                   <div className="p-4 bg-gray-50 rounded-lg">
                     <h4 className="font-medium mb-2">Interactive Exhibits</h4>
                     <p className="text-sm text-gray-600">{cleanText((venue as any).interactive_exhibits)}</p>
                   </div>
                 )}
               </div>
             </CardContent>
           </Card>

           {/* Facilities */}
           <Card className="shadow-lg border-0">
             <CardContent className="p-4 sm:p-6">         
               <h3 className="font-bold text-lg sm:text-xl mb-3 sm:mb-4">Facilities & Access</h3>
                <div className="space-y-4">
                  {venue.visitor_amenities && venue.visitor_amenities !== '(Data not provided, needs further research)' && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Visitor Amenities</h4>
                      <p className="text-sm text-gray-600">{cleanText(venue.visitor_amenities)}</p>
                    </div>
                  )}
                  {venue.parking_availability && venue.parking_availability !== '(Data not provided, needs further research)' && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Parking</h4>
                      <p className="text-sm text-gray-600">{cleanText(venue.parking_availability)}</p>
                    </div>
                  )}
                  {venue.public_transport_access && venue.public_transport_access !== '(Data not provided, needs further research)' && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Public Transport</h4>
                      <p className="text-sm text-gray-600">{cleanText(venue.public_transport_access)}</p>
                    </div>
                  )}
                  {(venue as any).lighting_quality && (venue as any).lighting_quality !== '(Data not provided, needs further research)' && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Lighting Quality</h4>
                      <p className="text-sm text-gray-600">{cleanText((venue as any).lighting_quality)}</p>
                    </div>
                  )}
                  {(venue as any).climate_control && (venue as any).climate_control !== '(Data not provided, needs further research)' && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Climate Control</h4>
                      <p className="text-sm text-gray-600">{cleanText((venue as any).climate_control)}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
 
            {/* Market Position & Recommendations */}
            {(venue as any).market_position && (venue as any).market_position !== '(Data not provided, needs further research)' && (
              <Card className="shadow-lg border-0">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <Award className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                    <h3 className="font-bold text-lg sm:text-xl">Market Position</h3>
                  </div>
                  <p className="text-sm text-gray-600">{cleanText((venue as any).market_position)}</p>
                  
                  {(venue as any).best_days_to_visit && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium mb-2 text-blue-800">Best Days to Visit</h4>
                      <p className="text-sm text-blue-700">{cleanText((venue as any).best_days_to_visit)}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Recommendations Section */}
      {venue && (
        <RecommendationSection
          recommendations={getArtsCultureRecommendations(venue, id || '')}
          title="You Might Also Like"
          subtitle="Discover more amazing cultural experiences"
        />
      )}
      
      <Footer />
    </div>
  );
 };
 
 export default ArtsCultureDetail;
