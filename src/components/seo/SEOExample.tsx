import React from 'react';
import SEOHead from './SEOHead';

// Example: How to add SEO to your existing pages
// This component shows the different ways to use the SEO system

const SEOExample: React.FC = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">SEO Integration Examples</h1>
      
      {/* Example 1: Homepage SEO */}
      <div className="border p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">1. Homepage SEO</h2>
        <SEOHead 
          page="home"
          customTitle="KLIspots - Discover Pakistan's Premium Lifestyle & Best Restaurants"
          customDescription="Find the best restaurants, cafes, shopping, entertainment, and lifestyle venues across Pakistan. AI-powered insights and expert verification for authentic experiences."
          customKeywords={[
            'Pakistan lifestyle',
            'best restaurants Pakistan',
            'cafes Pakistan',
            'shopping Pakistan',
            'entertainment Pakistan'
          ]}
        />
        <p className="text-sm text-gray-600">
          This adds comprehensive SEO for the homepage with custom title, description, and keywords.
        </p>
      </div>

      {/* Example 2: Category Page SEO */}
      <div className="border p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">2. Category Page SEO</h2>
        <SEOHead 
          page="restaurants"
          city="Karachi"
          breadcrumbs={[
            { name: 'Home', url: '/' },
            { name: 'Restaurants', url: '/restaurants' },
            { name: 'Karachi', url: '/restaurants?city=karachi' }
          ]}
        />
        <p className="text-sm text-gray-600">
          This automatically generates SEO for restaurant listings in Karachi with breadcrumb navigation.
        </p>
      </div>

      {/* Example 3: Venue Detail Page SEO */}
      <div className="border p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">3. Venue Detail Page SEO</h2>
        <SEOHead 
          page="restaurants"
          venue={{
            place_name: 'Istanbul Restaurant',
            restaurant_index: '1862',
            city: 'Karachi',
            total_score: 8.8,
            phone_number: '+92-21-1234567',
            cuisine: 'Turkish',
            neighborhood: 'Clifton'
          }}
          category="restaurant"
          city="Karachi"
          customImage="https://klispots.com/images/istanbul-restaurant.jpg"
          breadcrumbs={[
            { name: 'Home', url: '/' },
            { name: 'Restaurants', url: '/restaurants' },
            { name: 'Karachi', url: '/restaurants?city=karachi' },
            { name: 'Istanbul Restaurant', url: '/restaurant/1862-istanbul-restaurant' }
          ]}
        />
        <p className="text-sm text-gray-600">
          This creates comprehensive SEO for a specific restaurant with structured data, custom image, and breadcrumbs.
        </p>
      </div>

      {/* Example 4: Search Results Page SEO */}
      <div className="border p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">4. Search Results Page SEO</h2>
        <SEOHead 
          page="search"
          customTitle="Search Results for 'Fine Dining' in Pakistan | KLIspots"
          customDescription="Find the best fine dining restaurants in Pakistan. Browse reviews, ratings, and contact information for top-rated dining establishments."
          customKeywords={[
            'fine dining Pakistan',
            'luxury restaurants',
            'upscale dining',
            'premium restaurants',
            'gourmet food Pakistan'
          ]}
        />
        <p className="text-sm text-gray-600">
          This optimizes search results pages with dynamic titles and descriptions based on search terms.
        </p>
      </div>

      {/* Example 5: City Page SEO */}
      <div className="border p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">5. City Page SEO</h2>
        <SEOHead 
          page="cities"
          city="Lahore"
          customTitle="Best Places to Visit in Lahore - Restaurants, Cafes & Entertainment | KLIspots"
          customDescription="Discover the best restaurants, cafes, shopping, and entertainment venues in Lahore. Find top-rated places with reviews, photos, and contact information."
          customKeywords={[
            'Lahore restaurants',
            'Lahore cafes',
            'Lahore shopping',
            'Lahore entertainment',
            'things to do Lahore',
            'Lahore attractions'
          ]}
        />
        <p className="text-sm text-gray-600">
          This creates city-specific SEO with local keywords and location-based optimization.
        </p>
      </div>

      <div className="bg-blue-50 p-4 rounded">
        <h3 className="font-semibold text-blue-800">💡 Pro Tips:</h3>
        <ul className="text-sm text-blue-700 space-y-1 mt-2">
          <li>• Add SEOHead as the first component in your page</li>
          <li>• Use breadcrumbs for better navigation and SEO</li>
          <li>• Include custom images for better social media sharing</li>
          <li>• Add venue data for rich snippets in search results</li>
          <li>• Use city-specific keywords for local SEO</li>
        </ul>
      </div>
    </div>
  );
};

export default SEOExample;
