import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Star, 
  Users, 
  Award, 
  Heart,
  Send,
  CheckCircle,
  Building2,
  Lightbulb,
  Shield,
  Zap,
  Coffee,
  Camera,
  Music,
  Utensils,
  Map,
  TrendingUp,
  Target,
  Check,
  FileText
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import PageSEO from '@/components/seo/PageSEO';

const About = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. We'll get back to you soon.",
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  const stats = [
    { icon: Users, label: 'Happy Users', value: '25K+', description: 'Active monthly users discovering amazing venues' },
    { icon: Building2, label: 'Verified Places', value: '5500+', description: 'Carefully curated restaurants, cafes, and entertainment spots' },
    { icon: Award, label: 'Categories', value: '7', description: 'Complete categories covering all lifestyle needs' },
    { icon: Heart, label: 'Major Cities', value: '3', description: 'Prime coverage across Karachi, Lahore, and Islamabad' }
  ];

  const features = [
    {
      icon: Map,
      title: 'Smart Discovery',
      description: 'AI-powered recommendations based on your preferences and location'
    },
    {
      icon: Star,
      title: 'Authentic Reviews',
      description: 'Real reviews from real customers to help you make the best choices'
    },
    {
      icon: Shield,
      title: 'Verified Venues',
      description: 'All our listed venues are verified for quality and authenticity'
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description: 'Live information about venue availability, hours, and special offers'
    },
    {
      icon: Camera,
      title: 'Visual Experience',
      description: 'High-quality photos and virtual tours of venues before you visit'
    },
    {
      icon: Lightbulb,
      title: 'Smart Suggestions',
      description: 'Personalized recommendations that learn from your preferences'
    }
  ];

  const categories = [
    { name: 'Restaurants', icon: Utensils, count: '2000+', color: 'bg-red-100 text-red-800' },
    { name: 'Cafes', icon: Coffee, count: '1200+', color: 'bg-amber-100 text-amber-800' },
    { name: 'Entertainment', icon: Music, count: '800+', color: 'bg-purple-100 text-purple-800' },
    { name: 'Shopping', icon: Building2, count: '600+', color: 'bg-blue-100 text-blue-800' },
    { name: 'Arts & Culture', icon: Camera, count: '450+', color: 'bg-green-100 text-green-800' },
    { name: 'Sports & Fitness', icon: Zap, count: '300+', color: 'bg-orange-100 text-orange-800' }
  ];

  const successStories = [
    {
      quote: "KLIspots helped me discover the most amazing hidden gems in Karachi. The reviews are spot-on!",
      author: "Sarah Ahmed",
      location: "Karachi"
    },
    {
      quote: "As a food blogger, KLIspots has become my go-to platform for finding authentic dining experiences.",
      author: "Muhammad Hassan",
      location: "Lahore"
    },
    {
      quote: "The venue recommendations are always perfect for my business meetings and family outings.",
      author: "Fatima Khan",
      location: "Islamabad"
    }
  ];

  return (
    <>
      <PageSEO
        title="About KLIspots - Pakistan's Premier Lifestyle Discovery Platform"
        description="Learn about KLIspots, Pakistan's leading platform for discovering premium dining, shopping, entertainment, and lifestyle experiences. AI-powered insights with local expert verification."
        keywords="about KLIspots, Pakistan lifestyle platform, dining discovery, venue verification, local experts, AI insights"
        type="website"
      />
      
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-emerald-50 to-emerald-100">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-full mb-6">
                <Heart className="w-5 h-5" />
                <span className="font-semibold">About KLIspots</span>
              </div>
              
              <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
                Discover Pakistan's Best <span className="text-emerald-700">Venues</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
                We're your trusted companion for discovering amazing restaurants, cafes, entertainment venues, 
                and hidden gems across Pakistan. Join thousands who trust us for their venue discoveries.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-200">
                    <stat.icon className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                ))}
              </div>
              

            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Why Choose KLIspots?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We're more than just a venue discovery platform. We're your trusted guide to Pakistan's vibrant dining and entertainment scene.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Overview */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Explore by Category
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                From fine dining to casual cafes, entertainment venues to shopping destinations - we've got every experience covered.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((category, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <category.icon className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
                    <h3 className="font-bold text-gray-900 mb-2">{category.name}</h3>
                    <Badge className={category.color}>{category.count}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                What Our Users Say
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Real stories from real people who've discovered amazing places through KLIspots.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {successStories.map((story, index) => (
                <Card key={index} className="bg-white hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                        <Star className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{story.author}</h4>
                        <p className="text-sm text-gray-600">{story.location}</p>
                      </div>
                    </div>
                    <blockquote className="text-gray-700 italic">
                      "{story.quote}"
                    </blockquote>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Advertise With Us Section */}
        <section id="advertise" className="py-16 bg-gradient-to-br from-emerald-50 to-emerald-100">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-full mb-6">
                <TrendingUp className="w-5 h-5" />
                <span className="font-semibold">Partnership Opportunity</span>
              </div>
              
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                Advertise With <span className="text-emerald-700">KLIspots</span>
              </h2>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Reach thousands of potential customers actively searching for dining and lifestyle experiences. 
                Partner with Pakistan's premier venue discovery platform to grow your business.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">25K+ Happy Users</h3>
                    <p className="text-gray-600">Monthly engaged users actively seeking new venues and experiences</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Globe className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">3 Major Cities</h3>
                    <p className="text-gray-600">Prime coverage across Karachi, Lahore, and Islamabad markets</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">High Conversion</h3>
                    <p className="text-gray-600">Users actively looking to visit and spend at quality venues</p>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Advertising Packages</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="p-6 border-2 border-emerald-200 rounded-xl hover:border-emerald-400 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Star className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">Featured Listing</h4>
                        <Badge className="bg-emerald-100 text-emerald-800 text-xs">Most Popular</Badge>
                      </div>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        Priority placement in search results
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        Enhanced listing with photos
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        Featured badge display
                      </li>
                    </ul>
                  </div>

                  <div className="p-6 border-2 border-gray-200 rounded-xl hover:border-emerald-400 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Zap className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">Banner Advertising</h4>
                        <Badge variant="outline" className="text-xs">Premium</Badge>
                      </div>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                        Homepage banner placement
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                        Category page advertising
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                        Custom creative design support
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="text-center">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Ready to Partner With Us?
                  </h4>
                  <p className="text-gray-600 mb-6">
                    Contact our business development team to discuss custom advertising solutions for your venue.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                      <Mail className="w-5 h-5 mr-2" />
                      Get Advertising Info
                    </Button>
                    <Button size="lg" variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                      <Phone className="w-5 h-5 mr-2" />
                      Schedule a Call
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Form - Takes 2/3 of the width */}
              <div className="lg:col-span-2">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Get In Touch</h2>
                <p className="text-gray-600 mb-8">
                  Have questions, suggestions, or want to partner with us? 
                  We'd love to hear from you!
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                      placeholder="What's this about?"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </div>

              {/* Contact Info - Takes 1/3 of the width */}
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-2xl border border-emerald-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>
                <div className="space-y-5">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">Email</h4>
                      <p className="text-gray-600 text-sm">hello@klispots.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <Phone className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">Phone</h4>
                      <p className="text-gray-600 text-sm">+92 300 123 4567</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">Office</h4>
                      <p className="text-gray-600 text-sm">Lahore, Pakistan</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <Globe className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">Website</h4>
                      <p className="text-gray-600 text-sm">www.klispots.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Discover Amazing Venues?
            </h2>
            <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already finding the best places to eat, 
              relax, and have fun across Pakistan.
            </p>
            <div className="flex justify-center">
              <Link to="/restaurants">
                <Button size="lg" className="bg-white text-emerald-700 hover:bg-gray-100 px-8">
                  <Utensils className="w-5 h-5 mr-2" />
                  Explore Venues
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

export default About;