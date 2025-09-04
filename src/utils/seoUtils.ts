// World-Class SEO System for KLIspots
// This system enhances SEO without modifying existing functionality

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  structuredData?: any;
}

// Comprehensive Keyword Database
export const SEO_KEYWORDS = {
  // Primary Keywords
  primary: [
    'Pakistan restaurants',
    'Pakistani food',
    'best restaurants in Pakistan',
    'cafes in Pakistan',
    'dining in Pakistan',
    'food delivery Pakistan',
    'restaurant reviews Pakistan',
    'halal restaurants Pakistan',
    'fine dining Pakistan',
    'casual dining Pakistan'
  ],

  // City-Specific Keywords
  cities: {
    karachi: [
      'restaurants in Karachi',
      'best food Karachi',
      'Karachi restaurants',
      'dining Karachi',
      'cafes Karachi',
      'food Karachi',
      'restaurant reviews Karachi',
      'fine dining Karachi',
      'casual dining Karachi',
      'street food Karachi'
    ],
    lahore: [
      'restaurants in Lahore',
      'best food Lahore',
      'Lahore restaurants',
      'dining Lahore',
      'cafes Lahore',
      'food Lahore',
      'restaurant reviews Lahore',
      'fine dining Lahore',
      'casual dining Lahore',
      'street food Lahore'
    ],
    islamabad: [
      'restaurants in Islamabad',
      'best food Islamabad',
      'Islamabad restaurants',
      'dining Islamabad',
      'cafes Islamabad',
      'food Islamabad',
      'restaurant reviews Islamabad',
      'fine dining Islamabad',
      'casual dining Islamabad',
      'street food Islamabad'
    ]
  },

  // Cuisine-Specific Keywords
  cuisines: {
    pakistani: [
      'Pakistani cuisine',
      'traditional Pakistani food',
      'authentic Pakistani restaurants',
      'Pakistani dishes',
      'local Pakistani food',
      'Pakistani cooking',
      'Pakistani recipes',
      'Pakistani street food'
    ],
    indian: [
      'Indian restaurants Pakistan',
      'Indian cuisine Pakistan',
      'Indian food Pakistan',
      'authentic Indian restaurants',
      'Indian dishes Pakistan'
    ],
    chinese: [
      'Chinese restaurants Pakistan',
      'Chinese cuisine Pakistan',
      'Chinese food Pakistan',
      'authentic Chinese restaurants',
      'Chinese dishes Pakistan'
    ],
    italian: [
      'Italian restaurants Pakistan',
      'Italian cuisine Pakistan',
      'Italian food Pakistan',
      'authentic Italian restaurants',
      'Italian dishes Pakistan'
    ],
    continental: [
      'Continental restaurants Pakistan',
      'Continental cuisine Pakistan',
      'Continental food Pakistan',
      'fine dining Continental',
      'Continental dishes Pakistan'
    ]
  },

  // Category-Specific Keywords
  categories: {
    restaurants: [
      'restaurants near me',
      'best restaurants',
      'restaurant finder',
      'restaurant directory',
      'restaurant search',
      'restaurant recommendations',
      'restaurant ratings',
      'restaurant reviews',
      'restaurant booking',
      'restaurant reservations'
    ],
    cafes: [
      'cafes near me',
      'best cafes',
      'coffee shops',
      'cafe finder',
      'cafe directory',
      'cafe search',
      'cafe recommendations',
      'cafe ratings',
      'cafe reviews',
      'coffee houses'
    ],
    shopping: [
      'shopping malls Pakistan',
      'retail stores Pakistan',
      'shopping centers',
      'mall directory',
      'shopping destinations',
      'retail therapy',
      'shopping guide',
      'fashion stores',
      'lifestyle stores'
    ],
    entertainment: [
      'entertainment venues Pakistan',
      'cinemas Pakistan',
      'movie theaters',
      'entertainment centers',
      'recreation facilities',
      'leisure activities',
      'entertainment guide',
      'fun activities'
    ],
    'arts-culture': [
      'museums Pakistan',
      'art galleries',
      'cultural centers',
      'heritage sites',
      'cultural attractions',
      'art exhibitions',
      'cultural events',
      'historical sites'
    ],
    'sports-fitness': [
      'gyms Pakistan',
      'fitness centers',
      'sports facilities',
      'workout centers',
      'fitness clubs',
      'sports clubs',
      'training centers',
      'health clubs'
    ],
    'health-wellness': [
      'spas Pakistan',
      'wellness centers',
      'beauty salons',
      'health clinics',
      'massage therapy',
      'wellness services',
      'health services',
      'beauty services'
    ]
  },

  // Long-tail Keywords
  longTail: [
    'best restaurants in Karachi for family dining',
    'romantic restaurants in Lahore for couples',
    'affordable cafes in Islamabad',
    'fine dining restaurants in Pakistan with outdoor seating',
    'best coffee shops in Karachi for work',
    'traditional Pakistani restaurants in Lahore',
    'modern cafes in Islamabad with WiFi',
    'best shopping malls in Pakistan for clothes',
    'entertainment venues in Karachi for kids',
    'cultural attractions in Lahore for tourists',
    'fitness centers in Islamabad for women',
    'spa services in Pakistan for relaxation',
    'restaurant delivery services in Pakistan',
    'restaurant takeaway options in Pakistan',
    'restaurant catering services in Pakistan',
    'restaurant private dining rooms in Pakistan',
    'restaurant outdoor dining in Pakistan',
    'restaurant rooftop dining in Pakistan',
    'restaurant live music in Pakistan',
    'restaurant halal certified in Pakistan'
  ],

  // Seasonal Keywords
  seasonal: {
    ramadan: [
      'Ramadan restaurants Pakistan',
      'Iftar restaurants',
      'Suhoor restaurants',
      'Ramadan dining',
      'Ramadan food',
      'Ramadan specials',
      'Ramadan menus',
      'Ramadan deals'
    ],
    eid: [
      'Eid restaurants Pakistan',
      'Eid dining',
      'Eid celebrations',
      'Eid food',
      'Eid specials',
      'Eid menus',
      'Eid deals'
    ],
    valentines: [
      'Valentine restaurants Pakistan',
      'romantic dining',
      'couple restaurants',
      'Valentine specials',
      'romantic cafes',
      'Valentine menus'
    ]
  }
};

// Generate SEO-optimized title
export const generateSEOTitle = (page: string, venue?: string, city?: string): string => {
  const baseTitle = 'KLIspots - Discover Pakistan\'s Premium Lifestyle';
  
  if (venue && city) {
    return `${venue} - Best ${page} in ${city} | ${baseTitle}`;
  } else if (venue) {
    return `${venue} - Best ${page} in Pakistan | ${baseTitle}`;
  } else if (city) {
    return `Best ${page} in ${city} | ${baseTitle}`;
  } else {
    return `${page.charAt(0).toUpperCase() + page.slice(1)} in Pakistan | ${baseTitle}`;
  }
};

// Generate SEO-optimized description
export const generateSEODescription = (page: string, venue?: string, city?: string): string => {
  const baseDesc = 'AI-powered insights, local expert verification, and comprehensive data to find your perfect dining and lifestyle experiences in Pakistan.';
  
  if (venue && city) {
    return `Discover ${venue}, one of the best ${page} in ${city}. Read reviews, view photos, check ratings, and find contact information. ${baseDesc}`;
  } else if (venue) {
    return `Discover ${venue}, one of the best ${page} in Pakistan. Read reviews, view photos, check ratings, and find contact information. ${baseDesc}`;
  } else if (city) {
    return `Find the best ${page} in ${city}. Discover top-rated venues with reviews, photos, ratings, and contact information. ${baseDesc}`;
  } else {
    return `Discover the best ${page} across Pakistan. Find top-rated venues with reviews, photos, ratings, and contact information. ${baseDesc}`;
  }
};

// Generate keyword list for page
export const generateKeywords = (page: string, venue?: string, city?: string): string[] => {
  const keywords = [...SEO_KEYWORDS.primary];
  
  // Add category-specific keywords
  if (SEO_KEYWORDS.categories[page as keyof typeof SEO_KEYWORDS.categories]) {
    keywords.push(...SEO_KEYWORDS.categories[page as keyof typeof SEO_KEYWORDS.categories]);
  }
  
  // Add city-specific keywords
  if (city && SEO_KEYWORDS.cities[city.toLowerCase() as keyof typeof SEO_KEYWORDS.cities]) {
    keywords.push(...SEO_KEYWORDS.cities[city.toLowerCase() as keyof typeof SEO_KEYWORDS.cities]);
  }
  
  // Add venue-specific keywords
  if (venue) {
    keywords.push(`${venue} restaurant`, `${venue} reviews`, `${venue} ${city || 'Pakistan'}`);
  }
  
  // Add long-tail keywords
  keywords.push(...SEO_KEYWORDS.longTail.slice(0, 10));
  
  return [...new Set(keywords)]; // Remove duplicates
};

// Generate structured data for venues
export const generateStructuredData = (venue: any, category: string) => {
  const baseData = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": venue.place_name || venue.name,
    "description": venue.description || `Best ${category} in ${venue.city || 'Pakistan'}`,
    "url": `https://klispots.com/${category}/${venue.venue_index || venue.id}`,
    "telephone": venue.phone_number,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": venue.city,
      "addressCountry": "Pakistan"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": venue.total_score || venue.rating || 8.0,
      "reviewCount": venue.review_count || 50
    },
    "priceRange": venue.price_range || "$$",
    "servesCuisine": venue.cuisine || venue.venue_type || category,
    "openingHours": venue.opening_hours || "Mo-Su 11:00-23:00"
  };

  return baseData;
};

// Generate breadcrumb structured data
export const generateBreadcrumbData = (breadcrumbs: Array<{name: string, url: string}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `https://klispots.com${crumb.url}`
    }))
  };
};

// Generate organization structured data
export const generateOrganizationData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "KLIspots",
    "url": "https://klispots.com",
    "logo": "https://klispots.com/logo.png",
    "description": "AI-powered insights, local expert verification, and comprehensive data to find your perfect dining and lifestyle experiences in Pakistan.",
    "sameAs": [
      "https://twitter.com/klispots",
      "https://facebook.com/klispots"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "contact@klispots.com"
    }
  };
};

// Generate website structured data
export const generateWebsiteData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "KLIspots",
    "url": "https://klispots.com",
    "description": "Discover Pakistan's Premium Lifestyle - Find the best restaurants, cafes, shopping, entertainment, and more.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://klispots.com/search?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };
};

// SEO Meta Tag Generator
export const generateSEOMetaTags = (config: SEOConfig) => {
  const metaTags = {
    title: config.title,
    description: config.description,
    keywords: config.keywords.join(', '),
    canonical: config.canonicalUrl,
    ogTitle: config.ogTitle || config.title,
    ogDescription: config.ogDescription || config.description,
    ogImage: config.ogImage || 'https://klispots.com/og-image.png',
    ogType: config.ogType || 'website',
    twitterCard: config.twitterCard || 'summary_large_image',
    twitterTitle: config.twitterTitle || config.title,
    twitterDescription: config.twitterDescription || config.description,
    twitterImage: config.twitterImage || 'https://klispots.com/og-image.png'
  };

  return metaTags;
};

// SEO Page Config Generator
export const generatePageSEOConfig = (
  page: string,
  venue?: any,
  city?: string,
  category?: string
): SEOConfig => {
  const title = generateSEOTitle(page, venue?.place_name || venue?.name, city);
  const description = generateSEODescription(page, venue?.place_name || venue?.name, city);
  const keywords = generateKeywords(page, venue?.place_name || venue?.name, city);
  
  const config: SEOConfig = {
    title,
    description,
    keywords,
    canonicalUrl: venue ? `https://klispots.com/${category}/${venue.venue_index || venue.id}` : `https://klispots.com/${page}`,
    structuredData: venue ? generateStructuredData(venue, category || page) : undefined
  };

  return config;
};

// SEO Hook for React Components
export const useSEO = (config: SEOConfig) => {
  React.useEffect(() => {
    // Update document title
    document.title = config.title;
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', config.description);
    
    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', config.keywords.join(', '));
    
    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', config.canonicalUrl || window.location.href);
    
    // Update Open Graph tags
    const ogTags = [
      { property: 'og:title', content: config.ogTitle || config.title },
      { property: 'og:description', content: config.ogDescription || config.description },
      { property: 'og:image', content: config.ogImage || 'https://klispots.com/og-image.png' },
      { property: 'og:type', content: config.ogType || 'website' },
      { property: 'og:url', content: config.canonicalUrl || window.location.href }
    ];
    
    ogTags.forEach(tag => {
      let metaTag = document.querySelector(`meta[property="${tag.property}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('property', tag.property);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', tag.content);
    });
    
    // Update Twitter Card tags
    const twitterTags = [
      { name: 'twitter:card', content: config.twitterCard || 'summary_large_image' },
      { name: 'twitter:title', content: config.twitterTitle || config.title },
      { name: 'twitter:description', content: config.twitterDescription || config.description },
      { name: 'twitter:image', content: config.twitterImage || 'https://klispots.com/og-image.png' }
    ];
    
    twitterTags.forEach(tag => {
      let metaTag = document.querySelector(`meta[name="${tag.name}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('name', tag.name);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', tag.content);
    });
    
    // Add structured data
    if (config.structuredData) {
      let script = document.querySelector('script[type="application/ld+json"]');
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(config.structuredData);
    }
  }, [config]);
};

// Import React for the hook
import React from 'react';
