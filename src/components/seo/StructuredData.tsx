import React from 'react';

interface StructuredDataProps {
  type: 'restaurant' | 'cafe' | 'shopping' | 'entertainment' | 'sports' | 'health' | 'arts' | 'localBusiness';
  data: any;
}

const StructuredData: React.FC<StructuredDataProps> = ({ type, data }) => {
  const generateStructuredData = () => {
    const baseUrl = window.location.origin;
    
    switch (type) {
      case 'restaurant':
        return {
          "@context": "https://schema.org",
          "@type": "Restaurant",
          "name": data.place_name || data.name,
          "description": data.description || `Discover ${data.place_name || data.name} - a premium dining experience in ${data.city || 'Pakistan'}`,
          "url": `${baseUrl}/restaurant/${data.restaurant_index || data.id}`,
          "telephone": data.phone || data.contact_number,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": data.address || data.full_address,
            "addressLocality": data.city || data.neighborhood,
            "addressCountry": "PK"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": data.latitude || data.lat,
            "longitude": data.longitude || data.lng
          },
          "servesCuisine": data.cuisine_type || data.food_type,
          "priceRange": data.price_range || data.priceRange,
          "openingHours": data.hours || data.opening_hours,
          "aggregateRating": data.rating ? {
            "@type": "AggregateRating",
            "ratingValue": data.rating,
            "reviewCount": data.review_count || 1
          } : undefined,
          "image": data.imageUrl || data.images?.[0],
          "sameAs": data.website || data.social_media
        };
        
      case 'cafe':
        return {
          "@context": "https://schema.org",
          "@type": "Cafe",
          "name": data.place_name || data.name,
          "description": data.description || `Visit ${data.place_name || data.name} - a cozy cafe in ${data.city || 'Pakistan'}`,
          "url": `${baseUrl}/cafe/${data.cafe_index || data.id}`,
          "telephone": data.phone || data.contact_number,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": data.address || data.full_address,
            "addressLocality": data.city || data.neighborhood,
            "addressCountry": "PK"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": data.latitude || data.lat,
            "longitude": data.longitude || data.lng
          },
          "servesCuisine": data.cafe_category || data.food_type,
          "priceRange": data.price_range || data.priceRange,
          "openingHours": data.hours || data.opening_hours,
          "aggregateRating": data.rating ? {
            "@type": "AggregateRating",
            "ratingValue": data.rating,
            "reviewCount": data.review_count || 1
          } : undefined,
          "image": data.imageUrl || data.images?.[0],
          "amenityFeature": data.wifi ? "WiFi Available" : undefined
        };
        
      case 'shopping':
        return {
          "@context": "https://schema.org",
          "@type": "Store",
          "name": data.place_name || data.name,
          "description": data.description || `Shop at ${data.place_name || data.name} - your premier shopping destination in ${data.city || 'Pakistan'}`,
          "url": `${baseUrl}/shopping/${data.venue_index || data.id}`,
          "telephone": data.phone || data.contact_number,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": data.address || data.full_address,
            "addressLocality": data.city || data.neighborhood,
            "addressCountry": "PK"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": data.latitude || data.lat,
            "longitude": data.longitude || data.lng
          },
          "openingHours": data.hours || data.opening_hours,
          "image": data.imageUrl || data.images?.[0]
        };
        
      case 'entertainment':
        return {
          "@context": "https://schema.org",
          "@type": "EntertainmentBusiness",
          "name": data.place_name || data.name,
          "description": data.description || `Experience entertainment at ${data.place_name || data.name} in ${data.city || 'Pakistan'}`,
          "url": `${baseUrl}/entertainment/${data.venue_index || data.id}`,
          "telephone": data.phone || data.contact_number,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": data.address || data.full_address,
            "addressLocality": data.city || data.neighborhood,
            "addressCountry": "PK"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": data.latitude || data.lat,
            "longitude": data.longitude || data.lng
          },
          "openingHours": data.hours || data.opening_hours,
          "image": data.imageUrl || data.images?.[0]
        };
        
      case 'sports':
        return {
          "@context": "https://schema.org",
          "@type": "SportsActivityLocation",
          "name": data.place_name || data.name,
          "description": data.description || `Stay fit at ${data.place_name || data.name} - your fitness destination in ${data.city || 'Pakistan'}`,
          "url": `${baseUrl}/sports-fitness/${data.venue_index || data.id}`,
          "telephone": data.phone || data.contact_number,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": data.address || data.full_address,
            "addressLocality": data.city || data.neighborhood,
            "addressCountry": "PK"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": data.latitude || data.lat,
            "longitude": data.longitude || data.lng
          },
          "openingHours": data.hours || data.opening_hours,
          "image": data.imageUrl || data.images?.[0]
        };
        
      case 'health':
        return {
          "@context": "https://schema.org",
          "@type": "HealthAndBeautyBusiness",
          "name": data.place_name || data.name,
          "description": data.description || `Wellness services at ${data.place_name || data.name} in ${data.city || 'Pakistan'}`,
          "url": `${baseUrl}/health-wellness/${data.venue_index || data.id}`,
          "telephone": data.phone || data.contact_number,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": data.address || data.full_address,
            "addressLocality": data.city || data.neighborhood,
            "addressCountry": "PK"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": data.latitude || data.lat,
            "longitude": data.longitude || data.lng
          },
          "openingHours": data.hours || data.opening_hours,
          "image": data.imageUrl || data.images?.[0]
        };
        
      case 'arts':
        return {
          "@context": "https://schema.org",
          "@type": "Museum",
          "name": data.place_name || data.name,
          "description": data.description || `Explore culture at ${data.place_name || data.name} in ${data.city || 'Pakistan'}`,
          "url": `${baseUrl}/arts-culture/${data.venue_index || data.id}`,
          "telephone": data.phone || data.contact_number,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": data.address || data.full_address,
            "addressLocality": data.city || data.neighborhood,
            "addressCountry": "PK"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": data.latitude || data.lat,
            "longitude": data.longitude || data.lng
          },
          "openingHours": data.hours || data.opening_hours,
          "image": data.imageUrl || data.images?.[0]
        };
        
      case 'localBusiness':
        return {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": data.place_name || data.name,
          "description": data.description || `Visit ${data.place_name || data.name} in ${data.city || 'Pakistan'}`,
          "url": `${baseUrl}${data.url || ''}`,
          "telephone": data.phone || data.contact_number,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": data.address || data.full_address,
            "addressLocality": data.city || data.neighborhood,
            "addressCountry": "PK"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": data.latitude || data.lat,
            "longitude": data.longitude || data.lng
          },
          "openingHours": data.hours || data.opening_hours,
          "image": data.imageUrl || data.images?.[0]
        };
        
      default:
        return null;
    }
  };

  const structuredData = generateStructuredData();
  
  if (!structuredData) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  );
};

export default StructuredData;

