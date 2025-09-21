import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, HelpCircle, MessageCircle, Users, Star, Shield } from 'lucide-react';
import Footer from '@/components/layout/Footer';

const HelpCenter = () => {
  const faqs = [
    {
      question: "How do I find restaurants near me?",
      answer: "Use our search feature on the homepage to search by location, cuisine, or restaurant name. You can also browse by city or neighborhood to discover local dining options."
    },
    {
      question: "Are the ratings and reviews authentic?",
      answer: "Yes! All our ratings are based on verified customer experiences and expert evaluations. We use a comprehensive scoring system that considers food quality, service, ambiance, and value for money."
    },
    {
      question: "How often is venue information updated?",
      answer: "We regularly update venue information including hours, contact details, and menu changes. Our team visits venues and verifies information to ensure accuracy."
    },
    {
      question: "Can I suggest a venue to be added?",
      answer: "Absolutely! We welcome suggestions for new venues. Contact us through our contact form or email us at hello@klispots.com with venue details."
    },
    {
      question: "Is KLIspots free to use?",
      answer: "Yes, KLIspots is completely free to use. We provide all venue information, reviews, and ratings at no cost to help you discover the best places in Pakistan."
    },
    {
      question: "How do I contact a venue directly?",
      answer: "Each venue page includes contact information including phone numbers, addresses, and website links. You can call directly or visit their website for reservations."
    },
    {
      question: "Do you cover all cities in Pakistan?",
      answer: "We currently focus on major cities including Karachi, Lahore, and Islamabad. We're continuously expanding to cover more cities across Pakistan."
    },
    {
      question: "How accurate are the price ranges?",
      answer: "Price ranges are based on recent visits and customer feedback. Prices may vary, so we recommend calling the venue directly for current pricing information."
    }
  ];

  const helpCategories = [
    {
      icon: Users,
      title: "Getting Started",
      description: "Learn how to use KLIspots to discover amazing venues",
      link: "#getting-started"
    },
    {
      icon: Star,
      title: "Reviews & Ratings",
      description: "Understand how our rating system works",
      link: "#reviews"
    },
    {
      icon: MessageCircle,
      title: "Contact Support",
      description: "Get help from our support team",
      link: "#contact"
    },
    {
      icon: Shield,
      title: "Privacy & Safety",
      description: "Learn about our privacy practices",
      link: "/privacy-policy"
    }
  ];

  return (
    <>
      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <Link 
              to="/" 
              className="inline-flex items-center text-emerald-600 hover:text-emerald-700 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Help Center</h1>
            <p className="text-gray-600 mt-2">Get answers to your questions about KLIspots</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          
          {/* Help Categories */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How can we help you?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {helpCategories.map((category, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                      <category.icon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{category.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                  <Link 
                    to={category.link} 
                    className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                  >
                    Learn more →
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <HelpCircle className="w-6 h-6 text-emerald-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
            </div>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="font-semibold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Getting Started Guide */}
          <div id="getting-started" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Getting Started with KLIspots</h2>
            
            <div className="bg-white p-8 rounded-lg shadow-sm border">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">1. Search for Venues</h3>
                  <p className="text-gray-700 mb-4">
                    Use our powerful search feature to find restaurants, cafes, shopping malls, and entertainment venues. 
                    You can search by location, cuisine type, or venue name.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Tip:</strong> Try searching for "Italian restaurants in Karachi" or "cafes near me" for location-based results.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">2. Browse by Category</h3>
                  <p className="text-gray-700 mb-4">
                    Explore our curated categories to discover venues by type. Each category includes detailed information 
                    about venues, their specialties, and customer reviews.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link to="/restaurants" className="text-center p-3 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">
                      <div className="text-2xl mb-2">🍽️</div>
                      <div className="text-sm font-medium text-emerald-800">Restaurants</div>
                    </Link>
                    <Link to="/cafes" className="text-center p-3 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">
                      <div className="text-2xl mb-2">☕</div>
                      <div className="text-sm font-medium text-emerald-800">Cafes</div>
                    </Link>
                    <Link to="/shopping" className="text-center p-3 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">
                      <div className="text-2xl mb-2">🛍️</div>
                      <div className="text-sm font-medium text-emerald-800">Shopping</div>
                    </Link>
                    <Link to="/entertainment" className="text-center p-3 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">
                      <div className="text-2xl mb-2">🎬</div>
                      <div className="text-sm font-medium text-emerald-800">Entertainment</div>
                    </Link>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">3. Read Reviews and Ratings</h3>
                  <p className="text-gray-700 mb-4">
                    Each venue includes comprehensive reviews, ratings, and detailed information to help you make 
                    informed decisions about where to visit.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Our Rating System:</strong> We use a 10-point scale evaluating food quality, service, 
                      ambiance, value for money, and overall experience.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">4. Get Contact Information</h3>
                  <p className="text-gray-700">
                    Find complete contact details including phone numbers, addresses, and website links. 
                    You can call venues directly or visit their websites for reservations and more information.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div id="contact" className="bg-emerald-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Need Help?</h2>
            <p className="text-gray-700 mb-6">
              Can't find what you're looking for? Our support team is here to help you discover 
              the best venues in Pakistan.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Email:</strong> hello@klispots.com</p>
                  <p><strong>Phone:</strong> +92 300 123 4567</p>
                  <p><strong>Response Time:</strong> Within 24 hours</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Business Hours</h3>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM</p>
                  <p><strong>Saturday:</strong> 10:00 AM - 4:00 PM</p>
                  <p><strong>Sunday:</strong> Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default HelpCenter;
