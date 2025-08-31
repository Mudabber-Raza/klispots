import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Phone, MapPin, Clock, Star, Heart, Share2, Calendar, Coffee, Users, Car, Wifi, CreditCard, Book, Globe, Instagram, Facebook } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCafeById } from '@/data/cafes';
import ComprehensiveVenueImage from '@/components/shared/ComprehensiveVenueImage';
import RecommendationSection from '@/components/shared/RecommendationSection';
import { getCafeRecommendations } from '@/utils/recommendationEngine';

const CafeDetail = () => {
  const { id } = useParams();
  const cafe = getCafeById(id || '');

  if (!cafe) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Cafe Not Found</h1>
            <p className="text-gray-600 mb-8">Sorry, we couldn't find the cafe you're looking for.</p>
            <Link to="/cafes" className="text-blue-600 hover:text-blue-800">
              ← Back to Cafes
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

  // Helper function to convert numbered list to array
  const parseListText = (text) => {
    if (!text) return [];
    const cleaned = cleanText(text);
    // Split by numbers followed by period (1. 2. 3. etc)
    return cleaned.split(/\d+\.\s+/).filter(item => item.trim()).map(item => item.trim());
  };

  // Helper function to convert comma-separated text to array
  const parseCommaList = (text) => {
    if (!text) return [];
    const cleaned = cleanText(text);
    return cleaned.split(',').map(item => item.trim()).filter(item => item);
  };

  // Enhanced parsing for operating hours
  const parseOperatingHours = (hoursString) => {
    if (!hoursString) return [];
    
    // Clean the string first
    const cleanedHours = cleanText(hoursString);
    
    // Handle different formats
    let lines = [];
    
    // Check if it contains day names followed by colons
    if (cleanedHours.includes('Monday') || cleanedHours.includes('Tuesday') || cleanedHours.includes('Wednesday')) {
      // Split by day names
      const dayPattern = /(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/gi;
      const parts = cleanedHours.split(dayPattern).filter(part => part.trim());
      
      for (let i = 0; i < parts.length; i += 2) {
        if (parts[i] && parts[i + 1]) {
          const day = parts[i].trim();
          const time = parts[i + 1].replace(/^:/, '').trim();
          lines.push({ day, time });
        }
      }
    } else {
      // Handle line breaks and simple formats
      const splitLines = cleanedHours.split('\n').filter(line => line.trim());
      
      lines = splitLines.map(line => {
        // Handle "Day: Hours" format
        if (line.includes(':')) {
          const colonIndex = line.indexOf(':');
          const day = line.substring(0, colonIndex).trim();
          const time = line.substring(colonIndex + 1).trim();
          return { day, time };
        }
        // Handle simple formats like "8 AM to 2 AM daily"
        return { day: 'Daily', time: line.trim() };
      });
    }
    
    return lines;
  };
  
  // Enhanced parsing for signature items
  const parseSignatureItems = (itemsString) => {
    if (!itemsString) return [];
    
    const cleaned = cleanText(itemsString);
    
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
    // Check if there are multiple items that don't contain descriptive commas
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

  const operatingHours = parseOperatingHours(cafe.operating_hours);

  // Enhanced status checking
  const getCurrentStatus = () => {
    if (!cafe.operating_hours) return 'unknown';
    
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
    
    // Check if there are specific day schedules
    const todayHours = operatingHours.find(day => 
      day.day.toLowerCase() === currentDay.toLowerCase()
    );
    
    const hoursToCheck = todayHours ? todayHours.time : cafe.operating_hours;
    
    // Parse different time formats
    if (hoursToCheck.includes("8:00 AM - 1:30 AM") || hoursToCheck.includes("8 AM to 1:30 AM")) {
      if (currentHour >= 8 || currentHour < 2) {
        return 'open';
      }
    } else if (hoursToCheck.includes("4:00 PM - 2:00 AM") || hoursToCheck.includes("4 PM to 2 AM")) {
      if (currentHour >= 16 || currentHour < 2) {
        return 'open';
      }
    } else if (hoursToCheck.includes("4:00 PM - 3:00 AM") || hoursToCheck.includes("4 PM to 3 AM")) {
      if (currentHour >= 16 || currentHour < 3) {
        return 'open';
      }
    } else if (hoursToCheck.includes("4:00 AM - 3:00 AM") || hoursToCheck.includes("4 AM to 3 AM")) {
      if (currentHour >= 4 || currentHour < 3) {
        return 'open';
      }
    } else if (hoursToCheck.includes("24 hours") || hoursToCheck.includes("24/7")) {
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
    if (cafe.phone_number) {
      window.open(`tel:${cafe.phone_number}`, '_self');
    }
  };

  const handleDirections = () => {
    window.open(cafe.google_maps_link, '_blank');
  };

  const handleWebsite = () => {
    if (cafe.website_url) {
      window.open(cafe.website_url, '_blank');
    }
  };

  const handleSocialMedia = (url) => {
    window.open(url, '_blank');
  };

  // Check if website URL is valid (not a Google Maps link)
  const hasValidWebsite = cafe.website_url && 
    !cafe.website_url.includes('maps.google.com') && 
    !cafe.website_url.includes('google.com/maps') &&
    cafe.website_url !== 'N/A' &&
    cafe.website_url !== '';

  // Check for social media links - using safe property access
  const hasInstagram = (cafe as any).instagram_url && 
    (cafe as any).instagram_url !== 'N/A' && 
    (cafe as any).instagram_url !== '';

  const hasFacebook = (cafe as any).facebook_url && 
    (cafe as any).facebook_url !== 'N/A' && 
    (cafe as any).facebook_url !== '';

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
          to="/cafes" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Cafes
        </Link>

        {/* Hero Section with Image */}
        <div className="relative h-[500px] rounded-2xl overflow-hidden mb-8 shadow-xl">
          <ComprehensiveVenueImage
            category="cafes"
            placeId={(cafe as any).original_place_id || cafe.place_name}
            placeName={cafe.place_name}
            alt={cafe.place_name}
            className="detail-page-image"
            showSlider={true}
            showDots={true}
            showNavigation={true}
          />
          
          {/* Hero Content - Simplified */}
          <div className="absolute bottom-0 left-0 right-0 p-8 text-gray-900 bg-white/80 backdrop-blur-md rounded-t-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{cafe.place_name}</h1>
            
            <div className="flex flex-wrap items-center gap-6 text-lg">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{Number(cafe.total_score).toFixed(1)}/10</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>{cafe.city}</span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
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
          {cafe.phone_number && (
            <Button onClick={handleCall} size="lg" className="flex-1 min-w-48 bg-amber-600 hover:bg-amber-700">
              <Phone className="h-5 w-5 mr-2" />
              Call Cafe
            </Button>
          )}
          <Button onClick={handleDirections} variant="outline" size="lg" className="flex-1 min-w-48 border-amber-600 text-amber-600 hover:bg-amber-50">
            <MapPin className="h-5 w-5 mr-2" />
            Get Directions
          </Button>
          {hasValidWebsite && (
            <Button onClick={handleWebsite} variant="outline" size="lg" className="flex-1 min-w-48 border-blue-600 text-blue-600 hover:bg-blue-50">
              <Globe className="h-5 w-5 mr-2" />
              Visit Website
            </Button>
          )}
          {hasInstagram && (
            <Button 
              onClick={() => handleSocialMedia((cafe as any).instagram_url)} 
              variant="outline" 
              size="lg" 
              className="flex-1 min-w-48 border-pink-600 text-pink-600 hover:bg-pink-50"
            >
              <Instagram className="h-5 w-5 mr-2" />
              Instagram
            </Button>
          )}
          {hasFacebook && (
            <Button 
              onClick={() => handleSocialMedia((cafe as any).facebook_url)} 
              variant="outline" 
              size="lg" 
              className="flex-1 min-w-48 border-blue-700 text-blue-700 hover:bg-blue-50"
            >
              <Facebook className="h-5 w-5 mr-2" />
              Facebook
            </Button>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">

            {/* About Section */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">About {cafe.place_name}</h2>
                <p className="text-gray-700 leading-relaxed text-lg">{cleanText(cafe.about)}</p>
              </CardContent>
            </Card>
                

            {/* Cafe Scores */}
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Star className="h-6 w-6 text-amber-600" />
                  </div>
                  Cafe Experience Ratings
                  <Badge variant="outline" className="ml-auto">Verified by KLIspots</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Overall Score Highlight */}
                <div className="text-center p-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
                  <div className="text-6xl font-bold text-amber-600 mb-2">
                    {Number(cafe.total_score).toFixed(1)}
                  </div>
                  <div className="text-lg text-gray-600">Overall Rating</div>
                </div>
            
                {/* Individual Scores */}
                <div className="grid md:grid-cols-2 gap-8">
                  <ScoreBar label="Coffee & Beverages" score={cafe.coffee_and_beverages_score} />
                  <ScoreBar label="Ambiance & Comfort" score={cafe.ambiance_and_comfort_score} />
                  <ScoreBar label="WiFi & Study Environment" score={cafe.wifi_and_study_environment_score} />
                  <ScoreBar label="Service Excellence" score={cafe.service_score} />
                  <ScoreBar label="Value for Money" score={cafe.value_score} />
                  <ScoreBar label="Location & Accessibility" score={cafe.location_and_accessibility_score} />
                  <ScoreBar label="Cleanliness Standards" score={cafe.cleanliness_score} />
                  <ScoreBar label="Staff Friendliness" score={cafe.staff_friendliness_score} />
                  <ScoreBar label="Coffee Quality" score={cafe.coffee_quality_score} />
                  <ScoreBar label="Food Options" score={cafe.food_options_score} />
                  <ScoreBar label="Seating Comfort" score={cafe.seating_comfort_score} />
                </div>
            
                {/* Value Proposition & Unique Features - MOVED HERE */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Value Proposition */}
                  {cafe.value_proposition && (
                    <div className="p-6 bg-amber-50 rounded-xl border border-amber-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Coffee className="h-5 w-5 text-amber-600" />
                        <h3 className="font-semibold text-amber-800 text-center">What Makes Us Special</h3>
                      </div>
                      <p className="text-amber-700">{cleanText(cafe.value_proposition)}</p>
                    </div>
                  )}
            
                  {/* Unique Selling Points */}
                  {cafe.unique_selling_points && (
                    <div className="p-6 bg-orange-50 rounded-xl border border-orange-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Star className="h-5 w-5 text-orange-600" />
                        <h3 className="font-semibold text-orange-800 text-center">Unique Features</h3>
                      </div>
                      <p className="text-orange-700">{cleanText(cafe.unique_selling_points)}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Signature Items & Menu */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Coffee className="h-6 w-6 text-orange-600" />
                  </div>
                  <h2 className="text-3xl font-bold">Signature Items</h2>
                </div>
                
                {/* Signature Items */}
                {(cafe as any).signature_items && (
                  <div className="mb-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      {parseSignatureItems((cafe as any).signature_items).map((item, index) => (
                        <div 
                          key={index}
                          className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 text-center border border-red-200 hover:border-orange-300 transition-colors hover:shadow-md"
                        >
                          <span className="font-medium text-red-800">{item}</span>
                        </div>
                      ))}
                    </div>
                    
                    {cafe.specialty && (
                      <div className="p-4 bg-gray-50 rounded-xl mb-6">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Specialty:</span> {cleanText(cafe.specialty)}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Menu Categories */}
                <div className="grid md:grid-cols-2 gap-6">
                  {cafe.coffee_types && (
                    <div className="p-4 bg-amber-50 rounded-xl">
                      <h4 className="font-semibold text-amber-800 mb-2">Coffee Types</h4>
                      <p className="text-sm text-amber-700">{cleanText(cafe.coffee_types)}</p>
                    </div>
                  )}
                  
                  {(cafe as any).tea_selection && (
                    <div className="p-4 bg-green-50 rounded-xl">
                      <h4 className="font-semibold text-green-800 mb-2">Tea Selection</h4>
                      <p className="text-sm text-green-700">{cleanText((cafe as any).tea_selection)}</p>
                    </div>
                  )}

                  {cafe.food_options && (
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <h4 className="font-semibold text-blue-800 mb-2">Food Options</h4>
                      <p className="text-sm text-blue-700">{cleanText(cafe.food_options)}</p>
                    </div>
                  )}

                  {cafe.coffee_and_beverages && (
                    <div className="p-4 bg-purple-50 rounded-xl">
                      <h4 className="font-semibold text-purple-800 mb-2">Coffee & Beverages</h4>
                      <p className="text-sm text-purple-700">{cleanText(cafe.coffee_and_beverages)}</p>
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
                    {cafe.best_time_for_date_night && (
                      <div className="p-6 bg-rose-50 rounded-xl border border-rose-200">
                        <h3 className="font-semibold mb-3 flex items-center justify-center gap-2 text-rose-700">
                          💕 Perfect for Date Night
                        </h3>
                        <p className="text-sm text-rose-600">{cleanText(cafe.best_time_for_date_night)}</p>
                      </div>
                    )}
                    
                    {cafe.best_time_for_family && (
                      <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                        <h3 className="font-semibold mb-3 flex items-center justify-center gap-2 text-blue-700">
                          👨‍👩‍👧‍👦 Family Time
                        </h3>
                        <p className="text-sm text-blue-600">{cleanText(cafe.best_time_for_family)}</p>
                      </div>
                    )}

                    {cafe.best_time_for_study && (
                      <div className="p-6 bg-purple-50 rounded-xl border border-purple-200">
                        <h3 className="font-semibold mb-3 flex items-center justify-center gap-2 text-purple-700">
                          📚 Study Sessions
                        </h3>
                        <p className="text-sm text-purple-600">{cleanText(cafe.best_time_for_study)}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-6">
                    {cafe.least_crowded_hours && (
                      <div className="p-6 bg-green-50 rounded-xl border border-green-200">
                        <h3 className="font-semibold mb-3 text-green-700 text-center">✨ Least Crowded</h3>
                        <p className="text-sm text-green-600">{cleanText(cafe.least_crowded_hours)}</p>
                      </div>
                    )}
                    
                    {cafe.peak_hours && (
                      <div className="p-6 bg-orange-50 rounded-xl border border-orange-200">
                        <h3 className="font-semibold mb-3 text-orange-700 text-center">🔥 Peak Hours</h3>
                        <p className="text-sm text-orange-600">{cleanText(cafe.peak_hours)}</p>
                      </div>
                    )}

                    {cafe.best_time_for_business_meetings && (
                      <div className="p-6 bg-indigo-50 rounded-xl border border-indigo-200">
                        <h3 className="font-semibold mb-3 text-indigo-700 text-center">💼 Business Meetings</h3>
                        <p className="text-sm text-indigo-600">{cleanText(cafe.best_time_for_business_meetings)}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {cafe.weekend_vs_weekday && (
                  <div className="mt-6 p-6 bg-gray-50 rounded-xl">
                    <h4 className="font-medium mb-2">Weekend vs Weekday</h4>
                    <p className="text-sm text-gray-600">{cleanText(cafe.weekend_vs_weekday)}</p>
                  </div>
                )}

                {(cafe as any).best_days_to_visit && (
                  <div className="mt-6 p-6 bg-blue-50 rounded-xl">
                    <h4 className="font-medium mb-2">Best Days to Visit</h4>
                    <p className="text-sm text-blue-600">{cleanText((cafe as any).best_days_to_visit)}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Customer Reviews */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-8">Customer Reviews & Experience</h2>
                
                {cafe.review_summary && (
                  <p className="text-gray-700 mb-8 text-lg leading-relaxed">{cleanText(cafe.review_summary)}</p>
                )}
                
                <div className="space-y-6">
                  {cafe.common_praise && (
                    <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-200">
                      <h3 className="font-semibold text-emerald-800 mb-3">✅ What People Love</h3>
                      <div className="text-emerald-700">
                        {parseListText(cafe.common_praise).map((item, index) => (
                          <div key={index} className="mb-2">• {item}</div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {cafe.improvement_suggestions && (
                    <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                      <h3 className="font-semibold text-blue-800 mb-3">💡 Suggestions for Improvement</h3>
                      <p className="text-blue-700">{cleanText(cafe.improvement_suggestions)}</p>
                    </div>
                  )}
                  
                  {cafe.student_popularity && (
                    <div className="p-6 bg-purple-50 rounded-xl border border-purple-200">
                      <h3 className="font-semibold text-purple-800 mb-3">📚 Student Popularity</h3>
                      <p className="text-purple-700">{cleanText(cafe.student_popularity)}</p>
                    </div>
                  )}

                  {(cafe as any).market_position && (
                    <div className="p-6 bg-yellow-50 rounded-xl border border-yellow-200">
                      <h3 className="font-semibold text-yellow-800 mb-3">🏆 Market Position</h3>
                      <p className="text-yellow-700">{cleanText((cafe as any).market_position)}</p>
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
                     { q: cafe.faq1, a: cafe.faqans1 },
                     { q: cafe.faq2, a: cafe.faqans2 },
                     { q: cafe.faq3, a: cafe.faqans3 },
                     { q: cafe.faq4, a: cafe.faqans4 },
                     { q: cafe.faq5, a: cafe.faqans5 }
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
                       <p className="font-medium">{cafe.full_address}</p>
                       <p className="text-sm text-gray-600">{cafe.neighborhood}</p>
                     </div>
                   </div>
                   {cafe.phone_number && (
                     <div className="flex items-center gap-3">
                       <Phone className="h-5 w-5 text-gray-500" />
                       <p>{cafe.phone_number}</p>
                     </div>
                   )}
                 </div>
               </CardContent>
             </Card>

             {/* Quick Info */}
             <Card className="shadow-lg border-0">
               <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-6">Quick Info</h3>
                
                <div className="space-y-4">
                  {cafe.menu_price_range && (
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                      <div>
                        <span className="text-sm font-medium">Price Range: </span>
                        <span className="text-sm text-gray-600">{cleanText(cafe.menu_price_range)}</span>
                      </div>
                    </div>
                  )}
                  
                  {(cafe as any).seating_capacity && (
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-gray-400" />
                      <div>
                        <span className="text-sm font-medium">Seating Capacity: </span>
                        <span className="text-sm text-gray-600">{cleanText((cafe as any).seating_capacity)}</span>
                      </div>
                    </div>
                  )}
                  
                  {(cafe as any).average_visit_duration && (
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <div>
                        <span className="text-sm font-medium">Visit Duration: </span>
                        <span className="text-sm text-gray-600">{cleanText((cafe as any).average_visit_duration)}</span>
                      </div>
                    </div>
                  )}

                  {cafe.service_style && (
                    <div className="flex items-center gap-3">
                      <Coffee className="h-5 w-5 text-gray-400" />
                      <div>
                        <span className="text-sm font-medium">Service Style: </span>
                        <span className="text-sm text-gray-600">{cleanText(cafe.service_style)}</span>
                      </div>
                    </div>
                  )}

                  {cafe.wait_time && (
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <div>
                        <span className="text-sm font-medium">Wait Time: </span>
                        <span className="text-sm text-gray-600">{cleanText(cafe.wait_time)}</span>
                      </div>
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
                  <div className="space-y-2">
                    {operatingHours.map((dayHour, index) => {
                      const isToday = operatingHours.length > 1 ? 
                        new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() === 
                        dayHour.day.toLowerCase() : false;
                      
                      return (
                        <div key={index} className={`p-3 rounded-lg ${
                          isToday ? 'bg-amber-50 border border-amber-200' : 'bg-gray-50'
                        }`}>
                          <div className="flex justify-between items-center">
                            <span className={`font-medium ${isToday ? 'text-amber-700' : 'text-gray-700'}`}>
                              {dayHour.day}
                            </span>
                            <span className={`text-sm ${
                              isToday ? 'text-amber-600 font-medium' : 'text-gray-600'
                            }`}>
                              {dayHour.time}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Study Environment */}
            {((cafe as any).study_environment || (cafe as any).study_zones || cafe.wifi_and_study_environment_score >= 7) && (
              <Card className="shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Book className="h-5 w-5 text-gray-500" />
                    <h3 className="font-bold text-xl">Study Environment</h3>
                  </div>
                  
                   <div className="space-y-4">
                    {(cafe as any).study_environment && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm font-medium text-blue-700">Environment: </span>
                        <span className="text-sm text-blue-600">{cleanText((cafe as any).study_environment)}</span>
                      </div>
                    )}

                    {(cafe as any).study_zones && (
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <span className="text-sm font-medium text-purple-700">Study Zones: </span>
                        <span className="text-sm text-purple-600">{cleanText((cafe as any).study_zones)}</span>
                      </div>
                    )}

                    {cafe.wifi_and_study_environment_score >= 7 && (
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <Wifi className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium text-green-700">Great for Study</span>
                      </div>
                    )}

                    {cafe['work-friendly_hours'] && (
                      <div className="p-3 bg-amber-50 rounded-lg">
                        <span className="text-sm font-medium text-amber-700">Work-Friendly Hours: </span>
                        <span className="text-sm text-amber-600">{cleanText(cafe['work-friendly_hours'])}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Vibes & Seating */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-6">Vibes & Seating</h3>
                
                <div className="space-y-4">
                  {cafe.vibes && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-blue-700">Vibes: </span>
                      <span className="text-sm text-blue-600">{cleanText(cafe.vibes)}</span>
                    </div>
                  )}

                  {cafe.seating_areas && (
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium text-purple-700">Seating Areas: </span>
                      <span className="text-sm text-purple-600">{cleanText(cafe.seating_areas)}</span>
                    </div>
                  )}

                  {cafe.decor_style && (
                    <div className="p-3 bg-pink-50 rounded-lg">
                      <span className="text-sm font-medium text-pink-700">Decor Style: </span>
                      <span className="text-sm text-pink-600">{cleanText(cafe.decor_style)}</span>
                    </div>
                  )}

                  {cafe.noise_level && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-green-700">Noise Level: </span>
                      <span className="text-sm text-green-600">{cleanText(cafe.noise_level)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Features & Amenities */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-6">Features & Amenities</h3>
                
                <div className="space-y-4">
                  {cafe.parking_situation && (
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <Car className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-green-700">{cleanText(cafe.parking_situation)}</span>
                    </div>
                  )}

                  {(cafe as any).amenities && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-blue-700 block mb-2">Amenities:</span>
                      <div className="text-sm text-blue-600">
                        {parseCommaList((cafe as any).amenities).map((amenity, index) => (
                          <div key={index} className="mb-1">• {amenity}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {cafe.accessibility_features && (
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium text-purple-700">Accessibility: </span>
                      <span className="text-sm text-purple-600">{cleanText(cafe.accessibility_features)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
            </main>

      {/* Recommendations Section */}
      {cafe && (
        <RecommendationSection
          recommendations={getCafeRecommendations(cafe, id || '')}
          title="You Might Also Like"
          subtitle="Discover more amazing cafes and spots"
        />
      )}
      
      <Footer />
    </div>
  );
};
 
 export default CafeDetail;
