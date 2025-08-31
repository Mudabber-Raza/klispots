
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Brain, Users, MapPin, Star, Target } from 'lucide-react';

const WhyKLIspots = () => {
  const features = [
    {
      icon: <Brain className="w-8 h-8 text-emerald-600" />,
      title: 'AI-Powered Analysis',
      description: 'Advanced algorithms analyze 50+ data points to provide comprehensive scoring and insights.',
      stats: '50+ Data Points'
    },
    {
      icon: <Shield className="w-8 h-8 text-emerald-600" />,
      title: 'Local Expert Verification',
      description: 'Every place is personally verified by our local experts who understand Pakistani culture and preferences.',
      stats: '100% Verified'
    },
    {
      icon: <Target className="w-8 h-8 text-emerald-600" />,
      title: 'Comprehensive Data',
      description: 'Detailed information including cultural significance, halal status, family-friendliness, and local insights.',
      stats: '2,300+ Places'
    },
    {
      icon: <MapPin className="w-8 h-8 text-emerald-600" />,
      title: 'Pakistani Context',
      description: 'Designed specifically for Pakistani cities with local preferences, cultural nuances, and practical considerations.',
      stats: '3 Major Cities'
    },
    {
      icon: <Users className="w-8 h-8 text-emerald-600" />,
      title: 'Community Driven',
      description: 'Real reviews from verified users who share your cultural background and dining preferences.',
      stats: '25K+ Happy Users'
    },
    {
      icon: <Star className="w-8 h-8 text-emerald-600" />,
      title: 'Quality Assurance',
      description: 'Continuous monitoring and updates ensure information accuracy and relevance for current conditions.',
      stats: '98% Accuracy'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full mb-6">
            <Shield className="w-4 h-4" />
            <span className="font-semibold">5500+ Verified Places • 25K+ Happy Users</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Why Choose KLIspots?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The most trusted and comprehensive lifestyle discovery platform designed specifically for Pakistan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                
                <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="font-semibold text-sm">{feature.stats}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-700 mb-2">4.8/5</div>
              <div className="text-gray-600">User Rating</div>
              <div className="flex justify-center mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                ))}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-700 mb-2">98%</div>
              <div className="text-gray-600">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-700 mb-2">24/7</div>
              <div className="text-gray-600">Data Updates</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-700 mb-2">100%</div>
              <div className="text-gray-600">Verified Places</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyKLIspots;
