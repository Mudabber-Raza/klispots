
import { MapPin, Phone, Mail } from 'lucide-react';
import { categories } from '@/data/categories';
import { Link } from 'react-router-dom';

const Footer = () => {
  const popularCategories = categories; // Include all categories including Sports & Fitness

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="text-2xl font-bold mb-4 block hover:scale-105 transition-transform duration-300">
              KLI<span className="text-emerald-400">spots</span>
            </Link>
            <p className="text-gray-400 mb-6">
              Pakistan's premier lifestyle discovery platform. Find the best restaurants, cafes, 
              shopping, entertainment, and services across Karachi, Lahore, and Islamabad.
            </p>
            <div className="flex items-center text-emerald-400">
              <span className="text-sm">5500+ verified places • 25K+ happy users</span>
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Popular Categories</h3>
            <ul className="space-y-2">
              {popularCategories.map((category) => (
                <li key={category.id}>
                  <Link 
                    to={category.slug === 'restaurants' ? '/restaurants' : category.slug === 'cafes' ? '/cafes' : `/${category.slug}`} 
                    className="text-gray-400 hover:text-emerald-400 transition-colors flex items-center hover:scale-105 transform duration-300"
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Cities</h3>
            <ul className="space-y-2">
              <li><Link to="/cities/Karachi" className="text-gray-400 hover:text-emerald-400 transition-all duration-300 hover:scale-105 transform">Karachi Spots</Link></li>
              <li><Link to="/cities/Lahore" className="text-gray-400 hover:text-emerald-400 transition-all duration-300 hover:scale-105 transform">Lahore Spots</Link></li>
              <li><Link to="/cities/Islamabad" className="text-gray-400 hover:text-emerald-400 transition-all duration-300 hover:scale-105 transform">Islamabad Spots</Link></li>
              <li><Link to="/cities" className="text-gray-400 hover:text-emerald-400 transition-all duration-300 hover:scale-105 transform">All Cities</Link></li>
            </ul>
          </div>

          {/* Business */}
          <div>
            <h3 className="font-semibold text-lg mb-4">For Business</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-emerald-400 transition-all duration-300 hover:scale-105 transform">List Your Business</Link></li>
              <li><Link to="/about#advertise" className="text-gray-400 hover:text-emerald-400 transition-all duration-300 hover:scale-105 transform">Advertise With Us</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-emerald-400 transition-all duration-300 hover:scale-105 transform">Support</Link></li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center">
              <MapPin className="w-5 h-5 text-emerald-400 mr-3" />
              <div>
                <div className="font-medium">Our Cities</div>
                <div className="text-gray-400 text-sm">Karachi • Lahore • Islamabad</div>
              </div>
            </div>
            <div className="flex items-center">
              <Phone className="w-5 h-5 text-emerald-400 mr-3" />
              <div>
                <div className="font-medium">Customer Support</div>
                <div className="text-gray-400 text-sm">+92-XXX-XXXXXXX</div>
              </div>
            </div>
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-emerald-400 mr-3" />
              <div>
                <div className="font-medium">Email Us</div>
                <div className="text-gray-400 text-sm">hello@klispots.com</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm">
            © 2024 KLIspots. All rights reserved. Discover Pakistan's best lifestyle experiences.
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/about" className="text-gray-400 hover:text-emerald-400 text-sm transition-all duration-300 hover:scale-105 transform">Privacy Policy</Link>
            <Link to="/about" className="text-gray-400 hover:text-emerald-400 text-sm transition-all duration-300 hover:scale-105 transform">Terms of Service</Link>
            <Link to="/about" className="text-gray-400 hover:text-emerald-400 text-sm transition-all duration-300 hover:scale-105 transform">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
