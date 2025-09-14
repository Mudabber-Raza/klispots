import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getRoutes } from './generate-routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Proper SSG Build Script
 * This actually prerenders content with venue-specific data
 */
async function buildSSG() {
  console.log('🚀 Starting proper SSG build process...');
  console.log(`🔧 Current working directory: ${process.cwd()}`);
  console.log(`🔧 Script directory: ${__dirname}`);
  
  try {
    // Check if we should generate all routes - match generate-routes.js logic exactly
    const isFullSSG = process.env.FULL_SSG === 'true' || process.env.FULL_SSG === true || process.env.FULL_SSG?.trim() === 'true';
    console.log(`🔧 FULL_SSG environment variable: ${process.env.FULL_SSG}`);
    console.log(`🔧 isFullSSG: ${isFullSSG}`);
    console.log(`🔧 NODE_ENV: ${process.env.NODE_ENV}`);
    
    // Get routes based on environment
    const routes = getRoutes();
    
    console.log(`📋 Building ${routes.length} pages...`);
    
    // Load all venue data
    const venueData = await loadVenueData();
    
    // Read the main index.html to get the correct asset references
    const mainIndexPath = path.join(__dirname, '../dist/index.html');
    let baseTemplate;
    
    if (fs.existsSync(mainIndexPath)) {
      baseTemplate = fs.readFileSync(mainIndexPath, 'utf8');
      console.log('✅ Using built index.html as base template');
    } else {
      console.error('❌ Built index.html not found. Run vite build first.');
      process.exit(1);
    }
    
    // Ensure dist directory exists
    const distDir = path.join(__dirname, '../dist');
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }
    
    // Generate HTML files for all routes
    let successCount = 0;
    let errorCount = 0;
    
    for (const route of routes) {
      try {
        const routePath = route === '/' ? '/index.html' : `${route}/index.html`;
        const fullPath = path.join(distDir, routePath);
        
        // Create directory if it doesn't exist
        const dir = path.dirname(fullPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        // Generate venue-specific HTML
        const html = generateVenueHTML(route, baseTemplate, venueData);
        fs.writeFileSync(fullPath, html);
        
        // Verify file was created and has content
        if (fs.existsSync(fullPath) && fs.statSync(fullPath).size > 0) {
          console.log(`✅ Generated: ${routePath} (${fs.statSync(fullPath).size} bytes)`);
          successCount++;
        } else {
          console.error(`❌ Failed to generate: ${routePath}`);
          errorCount++;
        }
      } catch (error) {
        console.error(`❌ Error generating ${route}:`, error.message);
        errorCount++;
      }
    }
    
    console.log(`\n📊 SSG Build Summary:`);
    console.log(`✅ Successfully generated: ${successCount} files`);
    console.log(`❌ Failed to generate: ${errorCount} files`);
    console.log(`📁 Total files in dist: ${fs.readdirSync(distDir).length}`);
    
    console.log('🎉 Proper SSG build completed successfully!');
    console.log(`📊 Generated ${routes.length} static pages with unique content`);
    
  } catch (error) {
    console.error('❌ SSG build failed:', error);
    process.exit(1);
  }
}

/**
 * Load all venue data from JSON files
 */
async function loadVenueData() {
  const dataDir = path.join(__dirname, '../src/data');
  const venueData = {
    restaurants: [],
    cafes: [],
    shopping: [],
    entertainment: [],
    artsCulture: [],
    sportsFitness: [],
    healthWellness: []
  };
  
  try {
    // Load restaurants
    const restaurantsPath = path.join(dataDir, 'Restaurants1.json');
    if (fs.existsSync(restaurantsPath)) {
      venueData.restaurants = JSON.parse(fs.readFileSync(restaurantsPath, 'utf8'));
    }
    
    // Load cafes
    const cafesPath = path.join(dataDir, 'Cafes1.json');
    if (fs.existsSync(cafesPath)) {
      const rawCafes = JSON.parse(fs.readFileSync(cafesPath, 'utf8'));
      // Process cafes data the same way as frontend (cafes.ts)
      venueData.cafes = rawCafes.map((cafe, index) => ({
        ...cafe,
        cafe_index: index + 1, // Override with sequential index like frontend
        location_and_accessibility_score: cafe.location_and_accessibility_score || 8.0
      }));
      console.log(`☕ Loaded ${venueData.cafes.length} cafes (processed with sequential cafe_index)`);
    }
    
    // Load shopping
    const shoppingPath = path.join(dataDir, 'Shopping.json');
    if (fs.existsSync(shoppingPath)) {
      venueData.shopping = JSON.parse(fs.readFileSync(shoppingPath, 'utf8'));
      console.log(`🛍️ Loaded ${venueData.shopping.length} shopping venues`);
    }
    
    // Load entertainment
    const entertainmentPath = path.join(dataDir, 'entertainment.json');
    if (fs.existsSync(entertainmentPath)) {
      venueData.entertainment = JSON.parse(fs.readFileSync(entertainmentPath, 'utf8'));
      console.log(`🎭 Loaded ${venueData.entertainment.length} entertainment venues`);
    }
    
    // Load arts & culture
    const artsCulturePath = path.join(dataDir, 'Arts and Culture.json');
    if (fs.existsSync(artsCulturePath)) {
      venueData.artsCulture = JSON.parse(fs.readFileSync(artsCulturePath, 'utf8'));
      console.log(`🎨 Loaded ${venueData.artsCulture.length} arts & culture venues`);
    }
    
    // Load sports & fitness
    const sportsFitnessPath = path.join(dataDir, 'sports and fitness.json');
    if (fs.existsSync(sportsFitnessPath)) {
      venueData.sportsFitness = JSON.parse(fs.readFileSync(sportsFitnessPath, 'utf8'));
      console.log(`🏃 Loaded ${venueData.sportsFitness.length} sports & fitness venues`);
    }
    
    // Load health & wellness
    const healthWellnessPath = path.join(dataDir, 'Health and wellness.json');
    if (fs.existsSync(healthWellnessPath)) {
      venueData.healthWellness = JSON.parse(fs.readFileSync(healthWellnessPath, 'utf8'));
      console.log(`🏥 Loaded ${venueData.healthWellness.length} health & wellness venues`);
    }
    
  } catch (error) {
    console.error('❌ Error loading venue data:', error);
  }
  
  return venueData;
}

/**
 * Generate venue-specific HTML content
 */
function generateVenueHTML(route, baseTemplate, venueData) {
  // Parse route to get category and ID (handle slug format: /category/id-slug)
  const routeParts = route.split('/').filter(part => part);
  const category = routeParts[0];
  const idWithSlug = routeParts[1];
  const id = idWithSlug ? idWithSlug.split('-')[0] : null;
  
  let venue = null;
  let pageTitle = 'KLIspots - Discover Pakistan\'s Premium Lifestyle';
  let pageDescription = 'Discover the best restaurants, cafes, shopping, entertainment, and more across Pakistan';
  let pageContent = '';
  
  // Find venue data based on route
  if (category && id) {
    if (category !== 'restaurant') {
      console.log(`🔍 Looking for ${category} with ID: ${id}`);
    }
    switch (category) {
      case 'restaurant':
        venue = venueData.restaurants.find((r, index) => 
          (r.restaurant_index && r.restaurant_index.toString() === id) ||
          (r.id && r.id.toString() === id) ||
          ((index + 1).toString() === id)
        );
        break;
      case 'cafe':
        console.log(`🔍 Searching cafes for ID: ${id}`);
        console.log(`🔍 Total cafes loaded: ${venueData.cafes.length}`);
        console.log(`🔍 First 3 cafes:`, venueData.cafes.slice(0, 3).map(c => ({ cafe_index: c.cafe_index, place_name: c.place_name })));
        venue = venueData.cafes.find((c, index) => 
          (c.cafe_index && c.cafe_index.toString() === id) ||
          (c.id && c.id.toString() === id) ||
          (c.place_id && c.place_id.toString() === id) ||
          ((index + 1).toString() === id)
        );
        if (venue) {
          console.log(`✅ Found cafe: ${venue.place_name || venue.name || 'Unknown'}`);
          console.log(`✅ Cafe cafe_index: ${venue.cafe_index}, matched ID: ${id}`);
        } else {
          console.log(`❌ No cafe found with ID: ${id}`);
          console.log(`❌ Available cafe_index values:`, venueData.cafes.slice(0, 5).map(c => c.cafe_index));
        }
        break;
      case 'shopping':
        // Match the same logic as route generation: venue_index || id || place_id || (index + 1)
        venue = venueData.shopping.find((s, index) => 
          (s.venue_index && s.venue_index.toString() === id) ||
          (s.id && s.id.toString() === id) ||
          (s.place_id && s.place_id.toString() === id) ||
          ((index + 1).toString() === id)
        );
        if (venue) {
          console.log(`✅ Found shopping venue: ${venue.place_name || venue.name || 'Unknown'}`);
        } else {
          console.log(`❌ No shopping venue found with ID: ${id}`);
        }
        break;
      case 'entertainment':
        // Match the same logic as route generation: venue_index || id || place_id || (index + 1)
        venue = venueData.entertainment.find((e, index) => 
          (e.venue_index && e.venue_index.toString() === id) ||
          (e.id && e.id.toString() === id) ||
          (e.place_id && e.place_id.toString() === id) ||
          ((index + 1).toString() === id)
        );
        if (venue) {
          console.log(`✅ Found entertainment venue: ${venue.place_name || venue.name || 'Unknown'}`);
        } else {
          console.log(`❌ No entertainment venue found with ID: ${id}`);
        }
        break;
      case 'arts-culture':
        // Match the same logic as route generation: venue_index || id || place_id || (index + 1)
        venue = venueData.artsCulture.find((a, index) => 
          (a.venue_index && a.venue_index.toString() === id) ||
          (a.id && a.id.toString() === id) ||
          (a.place_id && a.place_id.toString() === id) ||
          ((index + 1).toString() === id)
        );
        if (venue) {
          console.log(`✅ Found arts & culture venue: ${venue.place_name || venue.name || 'Unknown'}`);
        } else {
          console.log(`❌ No arts & culture venue found with ID: ${id}`);
        }
        break;
      case 'sports-fitness':
        console.log(`🔍 Searching sports-fitness for ID: ${id}`);
        console.log(`🔍 Total sports venues loaded: ${venueData.sportsFitness.length}`);
        console.log(`🔍 First 3 sports venues:`, venueData.sportsFitness.slice(0, 3).map(s => ({ venue_index: s.venue_index, facility_name: s.facility_name, place_name: s.place_name })));
        venue = venueData.sportsFitness.find((s, index) => 
          (s.venue_index && s.venue_index.toString() === id) ||
          (s.id && s.id.toString() === id) ||
          (s.place_id && s.place_id.toString() === id) ||
          ((index + 1).toString() === id)
        );
        if (venue) {
          console.log(`✅ Found sports venue: ${venue.facility_name || venue.place_name || venue.name || 'Unknown'}`);
          console.log(`✅ Sports venue_index: ${venue.venue_index}, matched ID: ${id}`);
        } else {
          console.log(`❌ No sports venue found with ID: ${id}`);
          console.log(`❌ Available venue_index values:`, venueData.sportsFitness.slice(0, 5).map(s => s.venue_index));
        }
        break;
      case 'health-wellness':
        console.log(`🔍 Searching health-wellness for ID: ${id}`);
        console.log(`🔍 Total health venues loaded: ${venueData.healthWellness.length}`);
        console.log(`🔍 First 3 health venues:`, venueData.healthWellness.slice(0, 3).map(h => ({ cafe_index: h.cafe_index, venue_index: h.venue_index, place_name: h.place_name })));
        venue = venueData.healthWellness.find((h, index) => 
          (h.cafe_index && h.cafe_index.toString() === id) ||
          (h.venue_index && h.venue_index.toString() === id) ||
          (h.id && h.id.toString() === id) ||
          (h.place_id && h.place_id.toString() === id) ||
          ((index + 1).toString() === id)
        );
        if (venue) {
          console.log(`✅ Found health venue: ${venue.place_name || venue.name || 'Unknown'}`);
          console.log(`✅ Health cafe_index: ${venue.cafe_index}, venue_index: ${venue.venue_index}, matched ID: ${id}`);
        } else {
          console.log(`❌ No health venue found with ID: ${id}`);
          console.log(`❌ Available cafe_index values:`, venueData.healthWellness.slice(0, 5).map(h => h.cafe_index));
          console.log(`❌ Available venue_index values:`, venueData.healthWellness.slice(0, 5).map(h => h.venue_index));
        }
        break;
    }
  }
  
  // Generate venue-specific content
  if (venue) {
    if (category !== 'restaurant') {
      console.log(`🎯 Generating content for venue: ${JSON.stringify(venue, null, 2).substring(0, 200)}...`);
    }
    // Generate unique venue name with better fallbacks
    const venueName = venue.name || venue.restaurant_name || venue.cafe_name || venue.venue_name || venue.place_name || venue.mall_name || venue.facility_name || `Venue ${id}`;
    const venueLocation = venue.location || venue.address || venue.city || 'Pakistan';
    const venueDescription = venue.description || venue.about || venue.summary || `Visit ${venueName} in ${venueLocation}`;
    
    if (category !== 'restaurant') {
      console.log(`📝 Generated title: ${venueName} - ${venueLocation} | KLIspots`);
      console.log(`📝 Generated description: ${venueDescription.substring(0, 100)}...`);
    }
    
    pageTitle = `${venueName} - ${venueLocation} | KLIspots`;
    pageDescription = `${venueDescription} | Located in ${venueLocation}. Find more details, reviews, and contact information on KLIspots.`;
    
    // Generate rich content for better SEO
    pageContent = `
      <noscript>
        <div style="padding: 20px; max-width: 800px; margin: 0 auto;">
          <h1>${venueName}</h1>
          <p><strong>Location:</strong> ${venueLocation}</p>
          <p><strong>Description:</strong> ${venueDescription}</p>
          <p>Visit ${venueName} in ${venueLocation} for an amazing experience. Find more details, reviews, and contact information on KLIspots.</p>
          <p><a href="/">← Back to KLIspots</a></p>
        </div>
      </noscript>
      <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "${venueName}",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "${venueLocation}",
          "addressCountry": "Pakistan"
        },
        "description": "${venueDescription}",
        "url": "https://klispots.com${route}"
      }
      </script>`;
    
    if (category !== 'restaurant') {
      console.log(`📝 Generated title: ${pageTitle}`);
      console.log(`📝 Generated description: ${pageDescription}`);
    }
    
    // Generate structured data for SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      "name": venueName,
      "description": venueDescription,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": venueLocation
      },
      "url": `https://klispots.com${route}`
    };
    
    pageContent = `
    <noscript>
      <div style="padding: 20px; max-width: 800px; margin: 0 auto;">
        <h1>${venueName}</h1>
        <p><strong>Location:</strong> ${venueLocation}</p>
        <p><strong>Description:</strong> ${venueDescription}</p>
        ${venue.phone ? `<p><strong>Phone:</strong> ${venue.phone}</p>` : ''}
        ${venue.website ? `<p><strong>Website:</strong> <a href="${venue.website}" target="_blank">${venue.website}</a></p>` : ''}
        <p><em>This page requires JavaScript to load the full interactive experience. Please enable JavaScript to view the complete venue details, reviews, and more.</em></p>
      </div>
    </noscript>
    <script type="application/ld+json">${JSON.stringify(structuredData)}</script>`;
  } else if (category && !id) {
    // Category listing page
    const categoryNames = {
      'restaurants': 'Restaurants',
      'cafes': 'Cafes',
      'shopping': 'Shopping',
      'entertainment': 'Entertainment',
      'arts-culture': 'Arts & Culture',
      'sports-fitness': 'Sports & Fitness',
      'health-wellness': 'Health & Wellness'
    };
    
    const categoryName = categoryNames[category] || category;
    pageTitle = `${categoryName} in Pakistan | KLIspots`;
    pageDescription = `Discover the best ${categoryName.toLowerCase()} venues across Pakistan. Find top-rated locations, reviews, and detailed information.`;
    
    // Generate rich content for category pages
    pageContent = `
      <noscript>
        <div style="padding: 20px; max-width: 800px; margin: 0 auto;">
          <h1>${categoryName} in Pakistan</h1>
          <p>Explore the finest ${categoryName.toLowerCase()} venues across Pakistan. From bustling cities to charming towns, discover exceptional places that offer memorable experiences.</p>
          <h2>Popular Cities</h2>
          <ul>
            <li><strong>Karachi:</strong> Pakistan's largest city with diverse ${categoryName.toLowerCase()} options</li>
            <li><strong>Lahore:</strong> Cultural hub featuring traditional and modern venues</li>
            <li><strong>Islamabad:</strong> Capital city with premium ${categoryName.toLowerCase()} establishments</li>
            <li><strong>Rawalpindi:</strong> Historic city with authentic local experiences</li>
          </ul>
          <h2>What to Expect</h2>
          <p>Our curated collection of ${categoryName.toLowerCase()} venues includes:</p>
          <ul>
            <li>Top-rated establishments with verified reviews</li>
            <li>Detailed information about services and amenities</li>
            <li>Contact details and location information</li>
            <li>Photos and descriptions to help you choose</li>
          </ul>
          <p><a href="/">← Back to KLIspots Homepage</a></p>
        </div>
      </noscript>
      <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "${categoryName} in Pakistan",
        "description": "${pageDescription}",
        "url": "https://klispots.com/${category}",
        "mainEntity": {
          "@type": "ItemList",
          "name": "${categoryName}",
          "description": "Collection of ${categoryName.toLowerCase()} venues in Pakistan"
        }
      }
      </script>`;
  } else if (route === '/') {
    // Homepage
    pageTitle = 'KLIspots - Discover Pakistan\'s Premium Lifestyle';
    pageDescription = 'Discover the best restaurants, cafes, shopping, entertainment, and more across Pakistan. Find top-rated venues, read reviews, and plan your perfect experience.';
    
    pageContent = `
      <noscript>
        <div style="padding: 20px; max-width: 800px; margin: 0 auto;">
          <h1>Welcome to KLIspots</h1>
          <p>Your ultimate guide to Pakistan's premium lifestyle destinations. Discover exceptional venues across the country and create unforgettable experiences.</p>
          
          <h2>Explore Categories</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0;">
            <div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px;">
              <h3><a href="/restaurants">🍽️ Restaurants</a></h3>
              <p>Fine dining, casual eateries, and local favorites</p>
            </div>
            <div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px;">
              <h3><a href="/cafes">☕ Cafes</a></h3>
              <p>Cozy coffee shops and trendy hangout spots</p>
            </div>
            <div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px;">
              <h3><a href="/shopping">🛍️ Shopping</a></h3>
              <p>Malls, markets, and boutique stores</p>
            </div>
            <div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px;">
              <h3><a href="/entertainment">🎬 Entertainment</a></h3>
              <p>Cinemas, theaters, and entertainment venues</p>
            </div>
            <div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px;">
              <h3><a href="/arts-culture">🎨 Arts & Culture</a></h3>
              <p>Museums, galleries, and cultural centers</p>
            </div>
            <div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px;">
              <h3><a href="/sports-fitness">🏃 Sports & Fitness</a></h3>
              <p>Gyms, sports facilities, and fitness centers</p>
            </div>
            <div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px;">
              <h3><a href="/health-wellness">🏥 Health & Wellness</a></h3>
              <p>Spas, clinics, and wellness centers</p>
            </div>
          </div>
          
          <h2>Popular Cities</h2>
          <p>Explore venues in Pakistan's most vibrant cities:</p>
          <ul>
            <li><a href="/cities/karachi">Karachi</a> - Pakistan's largest metropolitan city</li>
            <li><a href="/cities/lahore">Lahore</a> - Cultural capital with rich heritage</li>
            <li><a href="/cities/islamabad">Islamabad</a> - Modern capital city</li>
            <li><a href="/cities/rawalpindi">Rawalpindi</a> - Historic twin city</li>
          </ul>
          
          <h2>Why Choose KLIspots?</h2>
          <ul>
            <li><strong>Curated Selection:</strong> Handpicked venues for quality assurance</li>
            <li><strong>Verified Reviews:</strong> Real experiences from genuine visitors</li>
            <li><strong>Detailed Information:</strong> Complete details to help you decide</li>
            <li><strong>Easy Navigation:</strong> Find exactly what you're looking for</li>
          </ul>
        </div>
      </noscript>
      <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "KLIspots",
        "description": "Discover Pakistan's premium lifestyle destinations",
        "url": "https://klispots.com",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://klispots.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
      </script>`;
  } else if (route.startsWith('/cities/')) {
    // Cities page
    const cityName = route.split('/')[2] || 'Pakistan';
    const cityDisplayName = cityName.charAt(0).toUpperCase() + cityName.slice(1);
    pageTitle = `${cityDisplayName} Venues | KLIspots`;
    pageDescription = `Discover the best restaurants, cafes, shopping, and entertainment in ${cityDisplayName}. Find top-rated venues and plan your perfect experience.`;
    
    pageContent = `
      <noscript>
        <div style="padding: 20px; max-width: 800px; margin: 0 auto;">
          <h1>${cityDisplayName} Venues</h1>
          <p>Explore the finest venues in ${cityDisplayName}, Pakistan. From traditional favorites to modern establishments, discover what makes this city special.</p>
          
          <h2>Popular Categories in ${cityDisplayName}</h2>
          <ul>
            <li><a href="/restaurants">🍽️ Restaurants</a> - Dining experiences in ${cityDisplayName}</li>
            <li><a href="/cafes">☕ Cafes</a> - Coffee culture and casual hangouts</li>
            <li><a href="/shopping">🛍️ Shopping</a> - Retail therapy destinations</li>
            <li><a href="/entertainment">🎬 Entertainment</a> - Fun and entertainment venues</li>
            <li><a href="/arts-culture">🎨 Arts & Culture</a> - Cultural experiences</li>
            <li><a href="/sports-fitness">🏃 Sports & Fitness</a> - Active lifestyle options</li>
            <li><a href="/health-wellness">🏥 Health & Wellness</a> - Wellness and healthcare</li>
          </ul>
          
          <h2>About ${cityDisplayName}</h2>
          <p>${cityDisplayName} offers a unique blend of traditional Pakistani culture and modern amenities. Whether you're a local resident or visiting, you'll find exceptional venues that cater to every taste and preference.</p>
          
          <h2>Getting Around</h2>
          <p>Navigate ${cityDisplayName} easily with our venue listings. Each location includes detailed address information, contact details, and helpful directions to ensure you reach your destination without hassle.</p>
          
          <p><a href="/">← Back to KLIspots Homepage</a></p>
        </div>
      </noscript>
      <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "City",
        "name": "${cityDisplayName}",
        "description": "Explore venues and attractions in ${cityDisplayName}, Pakistan",
        "url": "https://klispots.com${route}"
      }
      </script>`;
  } else if (route === '/about') {
    // About page
    pageTitle = 'About KLIspots - Pakistan\'s Premium Lifestyle Guide';
    pageDescription = 'Learn about KLIspots, your trusted guide to Pakistan\'s best restaurants, cafes, shopping, and entertainment venues. Discover our mission and commitment to quality.';
    
    pageContent = `
      <noscript>
        <div style="padding: 20px; max-width: 800px; margin: 0 auto;">
          <h1>About KLIspots</h1>
          <p>KLIspots is Pakistan's premier lifestyle guide, dedicated to helping you discover the finest venues across the country. We believe that every great experience starts with finding the right place.</p>
          
          <h2>Our Mission</h2>
          <p>To connect people with exceptional venues that offer memorable experiences. We curate and showcase the best restaurants, cafes, shopping destinations, entertainment venues, and more across Pakistan.</p>
          
          <h2>What We Offer</h2>
          <ul>
            <li><strong>Curated Selection:</strong> Every venue is carefully selected for quality and authenticity</li>
            <li><strong>Detailed Information:</strong> Complete details including contact info, hours, and amenities</li>
            <li><strong>Verified Reviews:</strong> Real experiences from genuine visitors</li>
            <li><strong>Easy Discovery:</strong> Find venues by category, location, or specific needs</li>
            <li><strong>Local Expertise:</strong> Deep knowledge of Pakistan's diverse cities and regions</li>
          </ul>
          
          <h2>Our Categories</h2>
          <p>We cover all aspects of lifestyle and entertainment:</p>
          <ul>
            <li><strong>Restaurants:</strong> From fine dining to street food, discover culinary excellence</li>
            <li><strong>Cafes:</strong> Cozy coffee shops and trendy hangout spots</li>
            <li><strong>Shopping:</strong> Malls, markets, and boutique stores</li>
            <li><strong>Entertainment:</strong> Cinemas, theaters, and entertainment venues</li>
            <li><strong>Arts & Culture:</strong> Museums, galleries, and cultural centers</li>
            <li><strong>Sports & Fitness:</strong> Gyms, sports facilities, and fitness centers</li>
            <li><strong>Health & Wellness:</strong> Spas, clinics, and wellness centers</li>
          </ul>
          
          <h2>Why Trust KLIspots?</h2>
          <p>We're committed to providing accurate, up-to-date information about venues across Pakistan. Our team regularly visits and verifies venues to ensure the information we provide is reliable and helpful.</p>
          
          <h2>Contact Us</h2>
          <p>Have questions or suggestions? We'd love to hear from you. Reach out to us through our website or social media channels.</p>
          
          <p><a href="/">← Back to KLIspots Homepage</a></p>
        </div>
      </noscript>
      <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "name": "About KLIspots",
        "description": "Learn about KLIspots, Pakistan's premium lifestyle guide",
        "url": "https://klispots.com/about",
        "mainEntity": {
          "@type": "Organization",
          "name": "KLIspots",
          "description": "Pakistan's premier lifestyle guide for discovering exceptional venues"
        }
      }
      </script>`;
  } else {
    console.log(`⚠️ No venue found for route: ${route}`);
    console.log(`⚠️ Using default template for: ${route}`);
  }
  
  // Fix the root div content injection - handle malformed HTML
  // The base template has malformed HTML with content outside root div
  // We need to clean this up and properly structure the HTML
  
  // Extract the head section (everything before <body>)
  const headMatch = baseTemplate.match(/<head>(.*?)<\/head>/s);
  let headContent = headMatch ? headMatch[1] : '';
  
  // Apply meta tag replacements to the head content
  headContent = headContent
    .replace(/{route}/g, route)
    .replace(/<title>.*?<\/title>/i, `<title>${pageTitle}</title>`)
    .replace(/<meta name="description" content=".*?"/i, `<meta name="description" content="${pageDescription}"`)
    .replace(/<meta property="og:title" content=".*?"/i, `<meta property="og:title" content="${pageTitle}"`)
    .replace(/<meta property="og:description" content=".*?"/i, `<meta property="og:description" content="${pageDescription}"`)
    .replace(/<meta name="twitter:title" content=".*?"/i, `<meta name="twitter:title" content="${pageTitle}"`)
    .replace(/<meta name="twitter:description" content=".*?"/i, `<meta name="twitter:description" content="${pageDescription}"`);
  
  // Extract the body opening tag
  const bodyMatch = baseTemplate.match(/<body[^>]*>/);
  const bodyTag = bodyMatch ? bodyMatch[0] : '<body>';
  
  // Extract scripts and other content that should be at the end
  const scriptMatches = baseTemplate.match(/<script[^>]*>.*?<\/script>/gs) || [];
  const otherScripts = scriptMatches.join('\n');
  
  // Rebuild the HTML with proper structure and correct meta tags
  if (category !== 'restaurant') {
    console.log(`🔧 Injecting pageContent: ${pageContent.substring(0, 100)}...`);
  }
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
${headContent}
</head>
${bodyTag}
<div id="root">${pageContent}</div>
${otherScripts}
</body>
</html>`;
  if (category !== 'restaurant') {
    console.log(`✅ HTML rebuilt with content for route: ${route}`);
    console.log(`🔧 Final HTML length: ${html.length} characters`);
    console.log(`🔧 Title in HTML: ${html.includes(pageTitle) ? '✅ Found' : '❌ Missing'}`);
    console.log(`🔧 Description in HTML: ${html.includes(pageDescription) ? '✅ Found' : '❌ Missing'}`);
  }
  
  return html;
}

// Run the build
buildSSG();
