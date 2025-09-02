
import { Search, Menu, X, ChevronDown, MapPin, Building2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useCallback, useRef, useEffect } from 'react';
import { categories } from '@/data/categories';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close categories dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setIsCategoriesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Focus search input when search modal opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Handle escape key to close search modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isSearchOpen]);

  const handleCategoriesToggle = useCallback(() => {
    setIsCategoriesOpen(!isCategoriesOpen);
  }, [isCategoriesOpen]);

  const handleMobileMenuToggle = useCallback(() => {
    setIsMenuOpen(!isMenuOpen);
  }, [isMenuOpen]);

  const handleSearchToggle = useCallback(() => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setSearchQuery('');
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  }, [searchQuery, navigate]);

  const handleListBusiness = useCallback(() => {
    navigate('/about');
    // Scroll to advertise section after navigation
    setTimeout(() => {
      const advertiseSection = document.getElementById('advertise');
      if (advertiseSection) {
        advertiseSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }, [navigate]);

  const isActiveRoute = useCallback((path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  }, [location.pathname]);

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
          : 'bg-white shadow-sm border-b border-gray-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo with enhanced animation */}
            <div className="flex items-center">
              <Link 
                to="/" 
                className="text-2xl lg:text-3xl font-bold text-gray-900 hover:text-emerald-600 transition-colors duration-300 transform hover:scale-105"
              >
                KLI<span className="text-emerald-600">spots</span>
              </Link>
            </div>

            {/* Desktop Navigation with enhanced animations */}
            <nav className="hidden lg:flex space-x-8">
              <Link 
                to="/" 
                className={`relative font-medium transition-all duration-300 hover:text-emerald-600 ${
                  isActiveRoute('/') ? 'text-emerald-600' : 'text-gray-700'
                }`}
              >
                Home
                {isActiveRoute('/') && (
                  <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-emerald-600 transform scale-x-100 transition-transform duration-300"></div>
                )}
              </Link>
              
              {/* Enhanced Categories Dropdown */}
              <div className="relative" ref={categoriesRef}>
                <button 
                  className={`relative font-medium transition-all duration-300 hover:text-emerald-600 flex items-center ${
                    isCategoriesOpen ? 'text-emerald-600' : 'text-gray-700'
                  }`}
                  onMouseEnter={() => setIsCategoriesOpen(true)}
                  onMouseLeave={() => setIsCategoriesOpen(false)}
                  onClick={handleCategoriesToggle}
                >
                  Categories
                  <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-300 ${
                    isCategoriesOpen ? 'rotate-180' : ''
                  }`} />
                </button>
                
                {isCategoriesOpen && (
                  <div 
                    className="absolute top-full left-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-100 p-6 transform opacity-100 scale-100 transition-all duration-300 origin-top-left"
                    onMouseEnter={() => setIsCategoriesOpen(true)}
                    onMouseLeave={() => setIsCategoriesOpen(false)}
                  >
                    <div className="grid grid-cols-2 gap-4">
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          to={category.slug === 'restaurants' ? '/restaurants' : category.slug === 'cafes' ? '/cafes' : `/${category.slug}`}
                          className="flex items-center p-3 rounded-lg hover:bg-emerald-50 transition-all duration-300 group hover:scale-105"
                        >
                          <span className="text-2xl mr-3 group-hover:scale-110 transition-transform duration-300">{category.icon}</span>
                          <div>
                            <span className="text-sm font-semibold text-gray-700 group-hover:text-emerald-700 transition-colors duration-300">{category.name}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link 
                to="/cities" 
                className={`relative font-medium transition-all duration-300 hover:text-emerald-600 ${
                  isActiveRoute('/cities') ? 'text-emerald-600' : 'text-gray-700'
                }`}
              >
                Cities
                {isActiveRoute('/cities') && (
                  <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-emerald-600 transform scale-x-100 transition-transform duration-300"></div>
                )}
              </Link>
              
              <Link 
                to="/about" 
                className={`relative font-medium transition-all duration-300 hover:text-emerald-600 ${
                  isActiveRoute('/about') ? 'text-emerald-600' : 'text-gray-700'
                }`}
              >
                About
                {isActiveRoute('/about') && (
                  <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-emerald-600 transform scale-x-100 transition-transform duration-300"></div>
                )}
              </Link>
            </nav>

            {/* Right side actions with enhanced animations */}
            <div className="flex items-center space-x-3 lg:space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden sm:inline-flex hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-300 transform hover:scale-105"
                onClick={handleSearchToggle}
              >
                <Search className="w-4 h-4" />
              </Button>
              
              <Button 
                variant="outline" 
                className="hidden sm:inline-flex border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300 transform hover:scale-105"
                onClick={handleListBusiness}
              >
                <Building2 className="w-4 h-4 mr-2" />
                List Your Business
              </Button>
              
              {/* Mobile search icon - visible on mobile */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="lg:hidden hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-300 transform hover:scale-105"
                onClick={handleSearchToggle}
              >
                <Search className="w-5 h-5" />
              </Button>
              
              {/* Enhanced Mobile menu button */}
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                onClick={handleMobileMenuToggle}
                aria-label="Toggle mobile menu"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>

          {/* Enhanced Mobile Navigation with smooth animations */}
          <div className={`lg:hidden overflow-y-auto transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="border-t border-gray-100 py-4 space-y-2">
              <Link 
                to="/" 
                className={`block px-3 py-3 rounded-lg transition-all duration-300 ${
                  isActiveRoute('/') 
                    ? 'bg-emerald-50 text-emerald-700 font-semibold' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-emerald-600'
                }`}
              >
                Home
              </Link>
              
              <div className="px-3 py-2">
                <span className="text-gray-500 text-sm font-medium mb-2 block">Categories</span>
                <div className="space-y-1 pl-4">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      to={category.slug === 'restaurants' ? '/restaurants' : category.slug === 'cafes' ? '/cafes' : `/${category.slug}`}
                      className="flex items-center py-2 px-3 rounded-lg text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 text-sm transition-all duration-300"
                    >
                      <span className="mr-3 text-lg">{category.icon}</span>
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
              
              <Link 
                to="/cities" 
                className={`block px-3 py-3 rounded-lg transition-all duration-300 ${
                  isActiveRoute('/cities') 
                    ? 'bg-emerald-50 text-emerald-700 font-semibold' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-emerald-600'
                }`}
              >
                Cities
              </Link>
              
              <Link 
                to="/about" 
                className={`block px-3 py-3 rounded-lg transition-all duration-300 ${
                  isActiveRoute('/about') 
                    ? 'bg-emerald-50 text-emerald-700 font-semibold' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-emerald-600'
                }`}
              >
                About
              </Link>
              
              {/* Mobile action buttons */}
              <div className="px-3 pt-4 border-t border-gray-100 space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-center border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                  onClick={handleListBusiness}
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  List Your Business
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 p-6 transform transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Search Venues</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSearchToggle}
                className="hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <form onSubmit={handleSearchSubmit} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search for restaurants, cafes, entertainment, or anything..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 py-3 text-lg border-2 border-gray-200 focus:border-emerald-500"
                />
              </div>
              
              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                  disabled={!searchQuery.trim()}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSearchToggle}
                >
                  Cancel
                </Button>
              </div>
            </form>
            
            {/* Quick search suggestions */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-600 mb-3">Popular searches:</h3>
              <div className="flex flex-wrap gap-2">
                {['Fine Dining', 'Coffee Shops', 'Cinemas', 'Shopping Malls', 'Museums', 'Gyms'].map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery(suggestion);
                      navigate(`/search?search=${encodeURIComponent(suggestion)}`);
                      setIsSearchOpen(false);
                    }}
                    className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
