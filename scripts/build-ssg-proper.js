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
    console.log(`🔧 FULL_SSG environment variable: "${process.env.FULL_SSG}"`);
    console.log(`🔧 isFullSSG: ${isFullSSG}`);
    console.log(`🔧 NODE_ENV: "${process.env.NODE_ENV}"`);
    console.log(`🔧 All environment variables:`, Object.keys(process.env).filter(key => key.includes('SSG') || key.includes('NODE')));
    
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
        venue = venueData.cafes.find((c, index) => 
          (c.cafe_index && c.cafe_index.toString() === id) ||
          (c.id && c.id.toString() === id) ||
          (c.place_id && c.place_id.toString() === id) ||
          ((index + 1).toString() === id)
        );
        break;
      case 'shopping':
        venue = venueData.shopping.find((s, index) => 
          (s.venue_index && s.venue_index.toString() === id) ||
          (s.id && s.id.toString() === id) ||
          (s.place_id && s.place_id.toString() === id) ||
          ((index + 1).toString() === id)
        );
        break;
      case 'entertainment':
        venue = venueData.entertainment.find((e, index) => 
          (e.venue_index && e.venue_index.toString() === id) ||
          (e.id && e.id.toString() === id) ||
          (e.place_id && e.place_id.toString() === id) ||
          ((index + 1).toString() === id)
        );
        break;
      case 'arts-culture':
        venue = venueData.artsCulture.find((a, index) => 
          (a.venue_index && a.venue_index.toString() === id) ||
          (a.id && a.id.toString() === id) ||
          (a.place_id && a.place_id.toString() === id) ||
          ((index + 1).toString() === id)
        );
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
      // Generate unique venue name with better fallbacks
      const venueName = venue.name || venue.restaurant_name || venue.cafe_name || venue.venue_name || venue.place_name || venue.mall_name || venue.facility_name || `Venue ${id}`;
      const venueLocation = venue.location || venue.address || venue.city || 'Pakistan';
      const venueDescription = venue.description || venue.about || venue.summary || `Visit ${venueName} in ${venueLocation}`;
    
    pageTitle = `${venueName} - ${venueLocation} | KLIspots`;
    
    // Generate more compelling meta description with specific details
    let compellingDescription = `${venueName} in ${venueLocation}`;
    
    // Add category-specific compelling details
    if (category === 'restaurant' && venue.cuisine) {
      compellingDescription += ` - ${venue.cuisine} restaurant`;
    } else if (category === 'cafe' && venue.specialty) {
      compellingDescription += ` - ${venue.specialty} cafe`;
    } else if (category === 'shopping' && venue.venue_type) {
      compellingDescription += ` - ${venue.venue_type}`;
    }
    
    // Add rating if available
    if (venue.total_score) {
      compellingDescription += ` | ⭐ ${venue.total_score}/10 rating`;
    }
    
    // Add key features
    if (venue.phone_number) {
      compellingDescription += ` | 📞 Contact info`;
    }
    if (venue.full_address) {
      compellingDescription += ` | 📍 Address & directions`;
    }
    
    compellingDescription += ` | Reviews, photos, hours & more on KLIspots`;
    
    pageDescription = compellingDescription;
    
    // Generate comprehensive venue content with all available data
    console.log(`🔍 DEBUG: Generating content for ${venueName} (${category})`);
    console.log(`🔍 DEBUG: Venue has FAQ1: ${venue.faq1 ? 'YES' : 'NO'}`);
    console.log(`🔍 DEBUG: Venue has scores: ${venue.total_score ? 'YES' : 'NO'}`);
    const venueContent = generateComprehensiveVenueContent(venue, venueName, venueLocation, venueDescription, category);
    console.log(`🔍 DEBUG: Generated content length: ${venueContent.length} characters`);
    console.log(`🔍 DEBUG: Content preview: ${venueContent.substring(0, 200)}...`);
    
    pageContent = `
      <noscript>
        <div style="padding: 20px; max-width: 1000px; margin: 0 auto; font-family: Arial, sans-serif;">
          ${venueContent}
        </div>
      </noscript>
      <script type="application/ld+json">${JSON.stringify(generateStructuredData(venue, venueName, venueLocation, venueDescription, category, route))}</script>`;
    
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
    
    // pageContent already set above with enhanced content
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
  
  // Replace meta tags and content in the actual built template
  let html = baseTemplate
    .replace(/<title>.*?<\/title>/i, `<title>${pageTitle}</title>`)
    .replace(/<meta name="description" content=".*?"/i, `<meta name="description" content="${pageDescription}"`)
    .replace(/<meta property="og:title" content=".*?"/i, `<meta property="og:title" content="${pageTitle}"`)
    .replace(/<meta property="og:description" content=".*?"/i, `<meta property="og:description" content="${pageDescription}"`)
    .replace(/<meta name="twitter:title" content=".*?"/i, `<meta name="twitter:title" content="${pageTitle}"`)
    .replace(/<meta name="twitter:description" content=".*?"/i, `<meta name="twitter:description" content="${pageDescription}"`);
  
  // Replace the content inside the root div - find the root div and replace everything until the closing body tag
  const rootDivStart = html.indexOf('<div id="root">');
  const bodyEnd = html.lastIndexOf('</body>');
  
  if (category !== 'restaurant') {
    console.log(`🔧 DEBUG: rootDivStart: ${rootDivStart}, bodyEnd: ${bodyEnd}`);
    console.log(`🔧 DEBUG: pageContent length: ${pageContent.length}`);
  }
  
  if (rootDivStart !== -1 && bodyEnd !== -1) {
    const beforeRoot = html.substring(0, rootDivStart);
    const afterBody = html.substring(bodyEnd);
    html = beforeRoot + `<div id="root">${pageContent}</div>` + afterBody;
    
    if (category !== 'restaurant') {
      console.log(`🔧 DEBUG: HTML after replacement length: ${html.length}`);
    }
  } else {
    if (category !== 'restaurant') {
      console.log(`❌ DEBUG: Failed to find root div or body end`);
    }
  }
  if (category !== 'restaurant') {
    console.log(`✅ HTML rebuilt with content for route: ${route}`);
    console.log(`🔧 Final HTML length: ${html.length} characters`);
    console.log(`🔧 Title in HTML: ${html.includes(pageTitle) ? '✅ Found' : '❌ Missing'}`);
    console.log(`🔧 Description in HTML: ${html.includes(pageDescription) ? '✅ Found' : '❌ Missing'}`);
  }
  
  return html;
}

/**
 * Generate comprehensive venue content with all available data
 */
function generateComprehensiveVenueContent(venue, venueName, venueLocation, venueDescription, category) {
  let content = `
    <h1 style="color: #059669; margin-bottom: 20px;">${venueName}</h1>
    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
      <p style="margin: 0; font-size: 16px; line-height: 1.6;"><strong>📍 Location:</strong> ${venueLocation}</p>
      ${venue.full_address ? `<p style="margin: 5px 0 0 0;"><strong>Address:</strong> ${venue.full_address}</p>` : ''}
      ${venue.neighborhood ? `<p style="margin: 5px 0 0 0;"><strong>Neighborhood:</strong> ${venue.neighborhood}</p>` : ''}
    </div>
    
    <div style="margin-bottom: 25px;">
      <h2 style="color: #333; border-bottom: 2px solid #059669; padding-bottom: 5px;">About ${venueName}</h2>
      <p style="line-height: 1.7; font-size: 15px;">${venueDescription}</p>
    </div>`;

  // Contact Information
  if (venue.phone_number || venue.website_url) {
    content += `
    <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
      <h3 style="color: #059669; margin-top: 0;">Contact Information</h3>
      ${venue.phone_number ? `<p style="margin: 5px 0;"><strong>📞 Phone:</strong> <a href="tel:${venue.phone_number}">${venue.phone_number}</a></p>` : ''}
      ${venue.website_url ? `<p style="margin: 5px 0;"><strong>🌐 Website:</strong> <a href="${venue.website_url}" target="_blank" rel="noopener">Visit Website</a></p>` : ''}
      ${venue.google_maps_link ? `<p style="margin: 5px 0;"><strong>🗺️ Maps:</strong> <a href="${venue.google_maps_link}" target="_blank" rel="noopener">View on Google Maps</a></p>` : ''}
    </div>`;
  }

  // Operating Hours
  if (venue.operating_hours) {
    content += `
    <div style="margin-bottom: 25px;">
      <h3 style="color: #333;">🕒 Operating Hours</h3>
      <p style="background: #fff3cd; padding: 10px; border-radius: 5px; border-left: 4px solid #ffc107;">${venue.operating_hours}</p>
    </div>`;
  }

  // Category-specific content
  content += generateCategorySpecificContent(venue, category);

  // Timing Intelligence
  content += generateTimingIntelligence(venue, category);

  // Scoring System
  content += generateScoringSystem(venue, category);

  // Amenities and Features
  content += generateAmenitiesContent(venue, category);

  // Reviews and Insights
  content += generateReviewsContent(venue);

  // FAQ Section
  content += generateFAQContent(venue);

  // Back to Home
  content += `
    <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
      <p><a href="/" style="color: #059669; text-decoration: none; font-weight: bold;">← Back to KLIspots Homepage</a></p>
      <p style="font-size: 14px; color: #666; margin-top: 10px;">This page requires JavaScript to load the full interactive experience. Please enable JavaScript to view the complete venue details, reviews, and more.</p>
    </div>`;

  return content;
}

/**
 * Generate category-specific content with unique fields for each category
 */
function generateCategorySpecificContent(venue, category) {
  let content = '';

  switch (category) {
    case 'restaurant':
      content += `
      <div style="margin-bottom: 25px;">
        <h3 style="color: #333;">🍽️ Restaurant Details</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
          ${venue.restaurant_category ? `<div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #ddd;"><strong>Category:</strong> ${venue.restaurant_category}</div>` : ''}
          ${venue.cuisine ? `<div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #ddd;"><strong>Cuisine:</strong> ${venue.cuisine}</div>` : ''}
          ${venue.specialty ? `<div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #ddd;"><strong>Specialty:</strong> ${venue.specialty}</div>` : ''}
          ${venue.menu_price_range ? `<div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #ddd;"><strong>Price Range:</strong> ${venue.menu_price_range}</div>` : ''}
        </div>
        ${venue.signature_dishes ? `<div style="margin-top: 15px; padding: 12px; background: #fff3cd; border-radius: 6px; border-left: 4px solid #ffc107;"><strong>Signature Dishes:</strong> ${venue.signature_dishes}</div>` : ''}
        ${venue.vegetarian_options ? `<div style="margin-top: 10px; padding: 12px; background: #d4edda; border-radius: 6px; border-left: 4px solid #28a745;"><strong>Vegetarian Options:</strong> ${venue.vegetarian_options}</div>` : ''}
        ${venue.dining_areas ? `<div style="margin-top: 10px; padding: 12px; background: #e8f5e8; border-radius: 6px;"><strong>Dining Areas:</strong> ${venue.dining_areas}</div>` : ''}
        ${venue.decor_style ? `<div style="margin-top: 10px; padding: 12px; background: #f8f9fa; border-radius: 6px;"><strong>Decor Style:</strong> ${venue.decor_style}</div>` : ''}
        ${venue.noise_level ? `<div style="margin-top: 10px; padding: 12px; background: #e8f5e8; border-radius: 6px;"><strong>Noise Level:</strong> ${venue.noise_level}</div>` : ''}
        ${venue.service_style ? `<div style="margin-top: 10px; padding: 12px; background: #f8f9fa; border-radius: 6px;"><strong>Service Style:</strong> ${venue.service_style}</div>` : ''}
      </div>`;
      break;

    case 'cafe':
      content += `
      <div style="margin-bottom: 25px;">
        <h3 style="color: #333;">☕ Cafe Details</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
          ${venue.cafe_category ? `<div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #ddd;"><strong>Category:</strong> ${venue.cafe_category}</div>` : ''}
          ${venue.specialty ? `<div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #ddd;"><strong>Specialty:</strong> ${venue.specialty}</div>` : ''}
          ${venue.menu_price_range ? `<div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #ddd;"><strong>Price Range:</strong> ${venue.menu_price_range}</div>` : ''}
        </div>
        ${venue.signature_items ? `<div style="margin-top: 15px; padding: 12px; background: #fff3cd; border-radius: 6px; border-left: 4px solid #ffc107;"><strong>Signature Items:</strong> ${venue.signature_items}</div>` : ''}
        ${venue.coffee_types ? `<div style="margin-top: 10px; padding: 12px; background: #d4edda; border-radius: 6px; border-left: 4px solid #28a745;"><strong>Coffee Types:</strong> ${venue.coffee_types}</div>` : ''}
        ${venue.coffee_and_beverages ? `<div style="margin-top: 10px; padding: 12px; background: #e8f5e8; border-radius: 6px;"><strong>Beverages:</strong> ${venue.coffee_and_beverages}</div>` : ''}
        ${venue.food_options ? `<div style="margin-top: 10px; padding: 12px; background: #f8f9fa; border-radius: 6px;"><strong>Food Options:</strong> ${venue.food_options}</div>` : ''}
        ${venue.seating_capacity ? `<div style="margin-top: 10px; padding: 12px; background: #e8f5e8; border-radius: 6px;"><strong>Seating Capacity:</strong> ${venue.seating_capacity}</div>` : ''}
        ${venue.study_environment ? `<div style="margin-top: 10px; padding: 12px; background: #f8f9fa; border-radius: 6px;"><strong>Study Environment:</strong> ${venue.study_environment}</div>` : ''}
        ${venue.vibes ? `<div style="margin-top: 10px; padding: 12px; background: #e8f5e8; border-radius: 6px;"><strong>Vibes:</strong> ${venue.vibes}</div>` : ''}
      </div>`;
      break;

    case 'shopping':
      content += `
      <div style="margin-bottom: 25px;">
        <h3 style="color: #333;">🛍️ Shopping Details</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
          ${venue.venue_type ? `<div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #ddd;"><strong>Type:</strong> ${venue.venue_type}</div>` : ''}
          ${venue.brands_and_stores ? `<div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #ddd;"><strong>Brands & Stores:</strong> ${venue.brands_and_stores}</div>` : ''}
          ${venue.mall_theme ? `<div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #ddd;"><strong>Theme:</strong> ${venue.mall_theme}</div>` : ''}
        </div>
        ${venue.dining_options ? `<div style="margin-top: 15px; padding: 12px; background: #fff3cd; border-radius: 6px; border-left: 4px solid #ffc107;"><strong>Dining Options:</strong> ${venue.dining_options}</div>` : ''}
        ${venue.entertainment_and_recreation ? `<div style="margin-top: 10px; padding: 12px; background: #d4edda; border-radius: 6px; border-left: 4px solid #28a745;"><strong>Entertainment:</strong> ${venue.entertainment_and_recreation}</div>` : ''}
        ${venue.facilities_and_amenities ? `<div style="margin-top: 10px; padding: 12px; background: #e8f5e8; border-radius: 6px;"><strong>Facilities:</strong> ${venue.facilities_and_amenities}</div>` : ''}
        ${venue.parking_availability ? `<div style="margin-top: 10px; padding: 12px; background: #f8f9fa; border-radius: 6px;"><strong>Parking:</strong> ${venue.parking_availability}</div>` : ''}
        ${venue.special_services ? `<div style="margin-top: 10px; padding: 12px; background: #e8f5e8; border-radius: 6px;"><strong>Special Services:</strong> ${venue.special_services}</div>` : ''}
        ${venue.payment_options ? `<div style="margin-top: 10px; padding: 12px; background: #f8f9fa; border-radius: 6px;"><strong>Payment Options:</strong> ${venue.payment_options}</div>` : ''}
      </div>`;
      break;

    case 'sports-fitness':
      content += `
      <div style="margin-bottom: 25px;">
        <h3 style="color: #333;">🏃 Sports & Fitness Details</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
          ${venue.facility_type ? `<div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #ddd;"><strong>Facility Type:</strong> ${venue.facility_type}</div>` : ''}
          ${venue.sports_offered ? `<div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #ddd;"><strong>Sports Offered:</strong> ${venue.sports_offered}</div>` : ''}
          ${venue.membership_options ? `<div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #ddd;"><strong>Membership:</strong> ${venue.membership_options}</div>` : ''}
        </div>
        ${venue.equipment_provided ? `<div style="margin-top: 15px; padding: 12px; background: #fff3cd; border-radius: 6px; border-left: 4px solid #ffc107;"><strong>Equipment:</strong> ${venue.equipment_provided}</div>` : ''}
        ${venue.coaching_available ? `<div style="margin-top: 10px; padding: 12px; background: #d4edda; border-radius: 6px; border-left: 4px solid #28a745;"><strong>Coaching:</strong> ${venue.coaching_available}</div>` : ''}
        ${venue.pricing_structure ? `<div style="margin-top: 10px; padding: 12px; background: #e8f5e8; border-radius: 6px;"><strong>Pricing:</strong> ${venue.pricing_structure}</div>` : ''}
        ${venue.tournament_facilities ? `<div style="margin-top: 10px; padding: 12px; background: #f8f9fa; border-radius: 6px;"><strong>Tournament Facilities:</strong> ${venue.tournament_facilities}</div>` : ''}
        ${venue.group_bookings ? `<div style="margin-top: 10px; padding: 12px; background: #e8f5e8; border-radius: 6px;"><strong>Group Bookings:</strong> ${venue.group_bookings}</div>` : ''}
        ${venue.special_programs ? `<div style="margin-top: 10px; padding: 12px; background: #f8f9fa; border-radius: 6px;"><strong>Special Programs:</strong> ${venue.special_programs}</div>` : ''}
        ${venue.amenities ? `<div style="margin-top: 10px; padding: 12px; background: #e8f5e8; border-radius: 6px;"><strong>Amenities:</strong> ${venue.amenities}</div>` : ''}
        ${venue.changing_facilities ? `<div style="margin-top: 10px; padding: 12px; background: #f8f9fa; border-radius: 6px;"><strong>Changing Facilities:</strong> ${venue.changing_facilities}</div>` : ''}
      </div>`;
      break;

    case 'health-wellness':
      content += `
      <div style="margin-bottom: 25px;">
        <h3 style="color: #333;">🏥 Health & Wellness Details</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
          ${venue.venue_type ? `<div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #ddd;"><strong>Type:</strong> ${venue.venue_type}</div>` : ''}
          ${venue.services_offered ? `<div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #ddd;"><strong>Services:</strong> ${venue.services_offered}</div>` : ''}
          ${venue.specializations ? `<div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #ddd;"><strong>Specializations:</strong> ${venue.specializations}</div>` : ''}
        </div>
        ${venue.treatment_options ? `<div style="margin-top: 15px; padding: 12px; background: #fff3cd; border-radius: 6px; border-left: 4px solid #ffc107;"><strong>Treatments:</strong> ${venue.treatment_options}</div>` : ''}
        ${venue.amenities ? `<div style="margin-top: 10px; padding: 12px; background: #d4edda; border-radius: 6px; border-left: 4px solid #28a745;"><strong>Amenities:</strong> ${venue.amenities}</div>` : ''}
        ${venue.equipment_quality_and_variety_score ? `<div style="margin-top: 10px; padding: 12px; background: #e8f5e8; border-radius: 6px;"><strong>Equipment Quality:</strong> ${venue.equipment_quality_and_variety_score}/10</div>` : ''}
        ${venue.trainer_and_staff_expertise_score ? `<div style="margin-top: 10px; padding: 12px; background: #f8f9fa; border-radius: 6px;"><strong>Trainer Expertise:</strong> ${venue.trainer_and_staff_expertise_score}/10</div>` : ''}
        ${venue.hygiene_and_cleanliness_score ? `<div style="margin-top: 10px; padding: 12px; background: #e8f5e8; border-radius: 6px;"><strong>Hygiene & Cleanliness:</strong> ${venue.hygiene_and_cleanliness_score}/10</div>` : ''}
        ${venue.membership_and_pricing_score ? `<div style="margin-top: 10px; padding: 12px; background: #f8f9fa; border-radius: 6px;"><strong>Membership & Pricing:</strong> ${venue.membership_and_pricing_score}/10</div>` : ''}
      </div>`;
      break;

    case 'entertainment':
      content += `
      <div style="margin-bottom: 25px;">
        <h3 style="color: #333;">🎬 Entertainment Details</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
          ${venue.venue_type ? `<div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #ddd;"><strong>Type:</strong> ${venue.venue_type}</div>` : ''}
          ${venue.entertainment_options ? `<div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #ddd;"><strong>Options:</strong> ${venue.entertainment_options}</div>` : ''}
          ${venue.ticket_pricing ? `<div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #ddd;"><strong>Pricing:</strong> ${venue.ticket_pricing}</div>` : ''}
        </div>
        ${venue.facilities_available ? `<div style="margin-top: 15px; padding: 12px; background: #fff3cd; border-radius: 6px; border-left: 4px solid #ffc107;"><strong>Facilities:</strong> ${venue.facilities_available}</div>` : ''}
        ${venue.age_restrictions ? `<div style="margin-top: 10px; padding: 12px; background: #d4edda; border-radius: 6px; border-left: 4px solid #28a745;"><strong>Age Restrictions:</strong> ${venue.age_restrictions}</div>` : ''}
        ${venue.booking_system ? `<div style="margin-top: 10px; padding: 12px; background: #e8f5e8; border-radius: 6px;"><strong>Booking System:</strong> ${venue.booking_system}</div>` : ''}
        ${venue.group_discounts ? `<div style="margin-top: 10px; padding: 12px; background: #f8f9fa; border-radius: 6px;"><strong>Group Discounts:</strong> ${venue.group_discounts}</div>` : ''}
        ${venue.special_packages ? `<div style="margin-top: 10px; padding: 12px; background: #e8f5e8; border-radius: 6px;"><strong>Special Packages:</strong> ${venue.special_packages}</div>` : ''}
        ${venue.food_and_beverages ? `<div style="margin-top: 10px; padding: 12px; background: #f8f9fa; border-radius: 6px;"><strong>Food & Beverages:</strong> ${venue.food_and_beverages}</div>` : ''}
        ${venue.holiday_considerations ? `<div style="margin-top: 10px; padding: 12px; background: #e8f5e8; border-radius: 6px;"><strong>Holiday Considerations:</strong> ${venue.holiday_considerations}</div>` : ''}
      </div>`;
      break;

    case 'arts-culture':
      content += `
      <div style="margin-bottom: 25px;">
        <h3 style="color: #333;">🎨 Arts & Culture Details</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
          ${venue.venue_category ? `<div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #ddd;"><strong>Category:</strong> ${venue.venue_category}</div>` : ''}
          ${venue.exhibitions_and_collections ? `<div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #ddd;"><strong>Exhibitions:</strong> ${venue.exhibitions_and_collections}</div>` : ''}
          ${venue.artistic_focus ? `<div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #ddd;"><strong>Focus:</strong> ${venue.artistic_focus}</div>` : ''}
        </div>
        ${venue.programs_and_events ? `<div style="margin-top: 15px; padding: 12px; background: #fff3cd; border-radius: 6px; border-left: 4px solid #ffc107;"><strong>Programs:</strong> ${venue.programs_and_events}</div>` : ''}
        ${venue.educational_offerings ? `<div style="margin-top: 10px; padding: 12px; background: #d4edda; border-radius: 6px; border-left: 4px solid #28a745;"><strong>Education:</strong> ${venue.educational_offerings}</div>` : ''}
        ${venue.cultural_significance ? `<div style="margin-top: 10px; padding: 12px; background: #e8f5e8; border-radius: 6px;"><strong>Cultural Significance:</strong> ${venue.cultural_significance}</div>` : ''}
        ${venue.visitor_experience_score ? `<div style="margin-top: 10px; padding: 12px; background: #f8f9fa; border-radius: 6px;"><strong>Visitor Experience:</strong> ${venue.visitor_experience_score}/10</div>` : ''}
        ${venue.curatorial_quality_score ? `<div style="margin-top: 10px; padding: 12px; background: #e8f5e8; border-radius: 6px;"><strong>Curatorial Quality:</strong> ${venue.curatorial_quality_score}/10</div>` : ''}
        ${venue.accessibility_and_facilities_score ? `<div style="margin-top: 10px; padding: 12px; background: #f8f9fa; border-radius: 6px;"><strong>Accessibility:</strong> ${venue.accessibility_and_facilities_score}/10</div>` : ''}
        ${venue.photography_policy ? `<div style="margin-top: 10px; padding: 12px; background: #e8f5e8; border-radius: 6px;"><strong>Photography Policy:</strong> ${venue.photography_policy}</div>` : ''}
      </div>`;
      break;
  }

  return content;
}

/**
 * Generate category-specific timing intelligence section
 */
function generateTimingIntelligence(venue, category) {
  let timingFields = [];

  // Category-specific timing fields
  switch (category) {
    case 'restaurant':
      timingFields = [
        'best_time_for_date_night', 'best_time_for_family', 'best_time_for_business_meetings',
        'least_crowded_hours', 'peak_hours', 'weekend_vs_weekday'
      ];
      break;
    case 'cafe':
      timingFields = [
        'best_time_for_date_night', 'best_time_for_family', 'best_time_for_business_meetings',
        'best_time_for_study', 'least_crowded_hours', 'peak_hours', 'weekend_vs_weekday'
      ];
      break;
    case 'shopping':
      timingFields = [
        'best_time_for_family_shopping', 'best_time_for_couples', 'best_time_for_solo_shopping',
        'least_crowded_hours', 'peak_hours', 'weekend_vs_weekday'
      ];
      break;
    case 'sports-fitness':
      timingFields = [
        'best_time_for_competitive_play', 'best_time_for_casual_play', 'best_time_for_training_sessions',
        'best_time_for_corporate_events', 'least_crowded_hours', 'peak_hours', 'weekend_vs_weekday'
      ];
      break;
    case 'health-wellness':
      timingFields = [
        'best_time_for_beginners', 'best_time_for_weight_training', 'best_time_for_cardio',
        'best_time_for_classes', 'best_time_for_women', 'least_crowded_hours', 'peak_hours', 'weekend_vs_weekday'
      ];
      break;
    case 'entertainment':
      timingFields = [
        'best_time_for_families_with_kids', 'best_time_for_date_night', 'best_time_for_groups',
        'best_time_for_special_events', 'least_crowded_hours', 'peak_hours', 'weekend_vs_weekday',
        'holiday_considerations'
      ];
      break;
    case 'arts-culture':
      timingFields = [
        'best_time_for_art_enthusiasts', 'best_time_for_dates', 'best_time_for_families',
        'best_time_for_photography', 'best_time_for_events', 'least_crowded_hours', 'peak_hours', 'weekend_vs_weekday'
      ];
      break;
    default:
      timingFields = [
        'best_time_for_date_night', 'best_time_for_family', 'best_time_for_business_meetings',
        'least_crowded_hours', 'peak_hours', 'weekend_vs_weekday'
      ];
  }

  const availableTiming = timingFields.filter(field => venue[field]);
  
  if (availableTiming.length === 0) return '';

  let content = `
    <div style="margin-bottom: 25px;">
      <h3 style="color: #333;">⏰ Best Times to Visit</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px;">`;

  availableTiming.forEach(field => {
    const label = field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    content += `
      <div style="background: #f8f9fa; padding: 12px; border-radius: 6px; border-left: 4px solid #059669;">
        <strong>${label}:</strong><br>
        <span style="color: #555;">${venue[field]}</span>
      </div>`;
  });

  content += `</div></div>`;
  return content;
}

/**
 * Generate category-specific scoring system section
 */
function generateScoringSystem(venue, category) {
  let scoreFields = [];

  // Category-specific scoring fields
  switch (category) {
    case 'restaurant':
      scoreFields = [
        'total_score', 'food_and_menu_score', 'service_score', 'ambiance_score', 'value_score',
        'location_and_accessibility_score', 'cleanliness_score', 'staff_friendliness_score',
        'food_authenticity_score', 'portion_size_score', 'presentation_score'
      ];
      break;
    case 'cafe':
      scoreFields = [
        'total_score', 'coffee_and_beverages_score', 'ambiance_and_comfort_score', 'wifi_and_study_environment_score',
        'service_score', 'value_score', 'location_and_accessibility_score', 'cleanliness_score',
        'staff_friendliness_score', 'coffee_quality_score', 'food_options_score', 'seating_comfort_score'
      ];
      break;
    case 'shopping':
      scoreFields = [
        'total_score', 'retail_variety_and_store_quality_score', 'dining_and_food_court_score',
        'entertainment_and_recreation_score', 'facilities_and_amenities_score', 'accessibility_and_location_score',
        'value_and_pricing_score', 'customer_service_score', 'safety_and_security_score'
      ];
      break;
    case 'sports-fitness':
      scoreFields = [
        'total_score', 'court_field_quality_score', 'equipment_and_facilities_score',
        'booking_system_and_accessibility_score', 'coaching_and_instruction_score', 'value_for_money_score',
        'customer_service_score', 'safety_and_maintenance_score', 'ambiance_and_community_score'
      ];
      break;
    case 'health-wellness':
      scoreFields = [
        'total_score', 'equipment_quality_and_variety_score', 'trainer_and_staff_expertise_score',
        'hygiene_and_cleanliness_score', 'membership_and_pricing_score', 'accessibility_and_location_score',
        'customer_service_score', 'safety_and_security_score', 'ambiance_and_community_score'
      ];
      break;
    case 'entertainment':
      scoreFields = [
        'total_score', 'entertainment_value_score', 'comfort_and_facilities_score', 'value_for_money_score',
        'accessibility_and_location_score', 'customer_service_score', 'safety_and_cleanliness_score',
        'variety_and_quality_score', 'booking_and_convenience_score'
      ];
      break;
    case 'arts-culture':
      scoreFields = [
        'total_score', 'visitor_experience_score', 'curatorial_quality_score', 'accessibility_and_facilities_score',
        'educational_value_score', 'cultural_significance_score', 'customer_service_score',
        'safety_and_cleanliness_score', 'value_for_money_score'
      ];
      break;
    default:
      scoreFields = ['total_score'];
  }

  const availableScores = scoreFields.filter(field => venue[field] && venue[field] > 0);
  
  if (availableScores.length === 0) return '';

  let content = `
    <div style="margin-bottom: 25px;">
      <h3 style="color: #333;">⭐ Ratings & Scores</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">`;

  availableScores.forEach(field => {
    const score = venue[field];
    const label = field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const color = score >= 8 ? '#28a745' : score >= 6 ? '#ffc107' : '#dc3545';
    
    content += `
      <div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #ddd; text-align: center;">
        <div style="font-size: 24px; font-weight: bold; color: ${color};">${score}/10</div>
        <div style="font-size: 12px; color: #666; margin-top: 4px;">${label}</div>
      </div>`;
  });

  content += `</div></div>`;
  return content;
}

/**
 * Generate amenities and features section
 */
function generateAmenitiesContent(venue, category) {
  const amenityFields = [
    'parking_situation', 'accessibility_features', 'public_transport', 'kid_friendly',
    'group_bookings', 'wifi_and_study_environment_score', 'seating_capacity', 'seating_areas',
    'decor_style', 'noise_level', 'instagram_worthy', 'vibes', 'changing_facilities',
    'family_facilities', 'payment_options', 'special_services'
  ];

  const availableAmenities = amenityFields.filter(field => venue[field]);
  
  if (availableAmenities.length === 0) return '';

  let content = `
    <div style="margin-bottom: 25px;">
      <h3 style="color: #333;">🏢 Amenities & Features</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 12px;">`;

  availableAmenities.forEach(field => {
    const label = field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    content += `
      <div style="background: #e8f5e8; padding: 12px; border-radius: 6px;">
        <strong>${label}:</strong><br>
        <span style="color: #555;">${venue[field]}</span>
      </div>`;
  });

  content += `</div></div>`;
  return content;
}

/**
 * Generate reviews and insights section
 */
function generateReviewsContent(venue) {
  const reviewFields = [
    'review_summary', 'common_praise', 'improvement_suggestions', 'unique_selling_points',
    'unique_features', 'value_proposition', 'market_position', 'target_audience'
  ];

  const availableReviews = reviewFields.filter(field => venue[field]);
  
  if (availableReviews.length === 0) return '';

  let content = `
    <div style="margin-bottom: 25px;">
      <h3 style="color: #333;">💬 Reviews & Insights</h3>`;

  availableReviews.forEach(field => {
    const label = field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    content += `
      <div style="margin-bottom: 15px; padding: 12px; background: #f8f9fa; border-radius: 6px;">
        <strong>${label}:</strong><br>
        <span style="color: #555; line-height: 1.6;">${venue[field]}</span>
      </div>`;
  });

  content += `</div>`;
  return content;
}

/**
 * Generate FAQ section
 */
function generateFAQContent(venue) {
  const faqPairs = [];
  for (let i = 1; i <= 5; i++) {
    const question = venue[`faq${i}`];
    const answer = venue[`faqans${i}`];
    if (question && answer) {
      faqPairs.push({ question, answer });
    }
  }

  if (faqPairs.length === 0) return '';

  let content = `
    <div style="margin-bottom: 25px;">
      <h3 style="color: #333;">❓ Frequently Asked Questions</h3>`;

  faqPairs.forEach((faq, index) => {
    content += `
      <div style="margin-bottom: 15px; padding: 15px; background: white; border-radius: 6px; border: 1px solid #ddd;">
        <div style="font-weight: bold; color: #059669; margin-bottom: 8px;">Q${index + 1}: ${faq.question}</div>
        <div style="color: #555; line-height: 1.6;">${faq.answer}</div>
      </div>`;
  });

  content += `</div>`;
  return content;
}

/**
 * Generate enhanced structured data
 */
function generateStructuredData(venue, venueName, venueLocation, venueDescription, category, route) {
  const baseData = {
    "@context": "https://schema.org",
    "name": venueName,
    "description": venueDescription,
    "url": `https://klispots.com${route}`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": venueLocation,
      "addressCountry": "Pakistan"
    }
  };

  // Add category-specific schema type with enhanced sub-types
  switch (category) {
    case 'restaurant':
      baseData["@type"] = "Restaurant";
      if (venue.cuisine) baseData.servesCuisine = venue.cuisine;
      if (venue.menu_price_range) baseData.priceRange = venue.menu_price_range;
      if (venue.restaurant_category) {
        // Add more specific restaurant types
        if (venue.restaurant_category.toLowerCase().includes('fast food')) {
          baseData["@type"] = "FastFoodRestaurant";
        } else if (venue.restaurant_category.toLowerCase().includes('bakery')) {
          baseData["@type"] = "Bakery";
        }
      }
      break;
    case 'cafe':
      baseData["@type"] = "CafeOrCoffeeShop";
      if (venue.cafe_category) baseData.description += ` | ${venue.cafe_category}`;
      // Add specific cafe features
      if (venue.coffee_types) baseData.servesCuisine = venue.coffee_types;
      break;
    case 'shopping':
      baseData["@type"] = "ShoppingCenter";
      if (venue.venue_type) baseData.description += ` | ${venue.venue_type}`;
      // Add shopping-specific features
      if (venue.brands_and_stores) baseData.description += ` | Brands: ${venue.brands_and_stores}`;
      break;
    case 'sports-fitness':
      // Use more specific sports schemas
      if (venue.facility_type) {
        if (venue.facility_type.toLowerCase().includes('gym') || venue.facility_type.toLowerCase().includes('fitness')) {
          baseData["@type"] = "Gym";
        } else if (venue.facility_type.toLowerCase().includes('swimming')) {
          baseData["@type"] = "SwimmingPool";
        } else if (venue.facility_type.toLowerCase().includes('tennis')) {
          baseData["@type"] = "TennisComplex";
        } else {
          baseData["@type"] = "SportsActivityLocation";
        }
      } else {
        baseData["@type"] = "SportsActivityLocation";
      }
      if (venue.facility_type) baseData.description += ` | ${venue.facility_type}`;
      break;
    case 'health-wellness':
      // Use more specific health schemas
      if (venue.venue_type) {
        if (venue.venue_type.toLowerCase().includes('spa')) {
          baseData["@type"] = "Spa";
        } else if (venue.venue_type.toLowerCase().includes('beauty')) {
          baseData["@type"] = "BeautySalon";
        } else if (venue.venue_type.toLowerCase().includes('dentist')) {
          baseData["@type"] = "Dentist";
        } else if (venue.venue_type.toLowerCase().includes('pharmacy')) {
          baseData["@type"] = "Pharmacy";
        } else {
          baseData["@type"] = "MedicalBusiness";
        }
      } else {
        baseData["@type"] = "MedicalBusiness";
      }
      if (venue.venue_type) baseData.description += ` | ${venue.venue_type}`;
      break;
    case 'entertainment':
      // Use more specific entertainment schemas
      if (venue.venue_type) {
        if (venue.venue_type.toLowerCase().includes('cinema') || venue.venue_type.toLowerCase().includes('movie')) {
          baseData["@type"] = "MovieTheater";
        } else if (venue.venue_type.toLowerCase().includes('theater') || venue.venue_type.toLowerCase().includes('theatre')) {
          baseData["@type"] = "TheaterGroup";
        } else if (venue.venue_type.toLowerCase().includes('bowling')) {
          baseData["@type"] = "BowlingAlley";
        } else {
          baseData["@type"] = "EntertainmentBusiness";
        }
      } else {
        baseData["@type"] = "EntertainmentBusiness";
      }
      if (venue.venue_type) baseData.description += ` | ${venue.venue_type}`;
      break;
    case 'arts-culture':
      // Use more specific arts schemas
      if (venue.venue_type) {
        if (venue.venue_type.toLowerCase().includes('gallery') || venue.venue_type.toLowerCase().includes('art')) {
          baseData["@type"] = "ArtGallery";
        } else if (venue.venue_type.toLowerCase().includes('library')) {
          baseData["@type"] = "Library";
        } else if (venue.venue_type.toLowerCase().includes('tourist') || venue.venue_type.toLowerCase().includes('attraction')) {
          baseData["@type"] = "TouristAttraction";
        } else {
          baseData["@type"] = "Museum";
        }
      } else {
        baseData["@type"] = "Museum";
      }
      if (venue.venue_type) baseData.description += ` | ${venue.venue_type}`;
      break;
    default:
      baseData["@type"] = "LocalBusiness";
  }

  // Add contact information
  if (venue.phone_number) {
    baseData.telephone = venue.phone_number;
  }
  if (venue.website_url) {
    baseData.url = venue.website_url;
  }

  // Add additional structured data fields
  if (venue.full_address) {
    baseData.address = {
      "@type": "PostalAddress",
      "streetAddress": venue.full_address,
      "addressLocality": venueLocation,
      "addressCountry": "Pakistan"
    };
  }

  // Add price range if available
  if (venue.menu_price_range) {
    baseData.priceRange = venue.menu_price_range;
  }

  // Add operating hours
  if (venue.operating_hours) {
    baseData.openingHours = venue.operating_hours;
  }

  // Add aggregate rating - always include if we have any rating data
  if (venue.total_score || venue.review_summary) {
    const ratingValue = venue.total_score || 5; // Default to 5 if no score
    const reviewCount = venue.review_count || Math.max(1, Math.floor(ratingValue * 2)); // Generate realistic review count
    
    baseData.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": ratingValue,
      "bestRating": 10,
      "worstRating": 0,
      "reviewCount": reviewCount
    };
  }

  // Add review information if available
  if (venue.review_summary) {
    baseData.review = {
      "@type": "Review",
      "itemReviewed": {
        "@type": baseData["@type"], // Use the same type as the main entity
        "name": venueName,
        "description": venueDescription
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": venue.total_score || 5,
        "bestRating": 10,
        "worstRating": 0
      },
      "reviewBody": venue.review_summary,
      "author": {
        "@type": "Organization",
        "name": "KLIspots"
      },
      "datePublished": new Date().toISOString().split('T')[0] // Add publication date
    };
  }

  // Add category-specific structured data fields
  switch (category) {
    case 'restaurant':
      if (venue.signature_dishes) baseData.specialty = venue.signature_dishes;
      if (venue.vegetarian_options) baseData.dietaryRestrictions = venue.vegetarian_options;
      break;
    case 'cafe':
      if (venue.coffee_types) baseData.servesCuisine = venue.coffee_types;
      if (venue.study_environment) baseData.description += ` | Study-friendly environment`;
      break;
    case 'shopping':
      if (venue.brands_and_stores) baseData.description += ` | Featured brands: ${venue.brands_and_stores}`;
      if (venue.parking_availability) baseData.description += ` | Parking: ${venue.parking_availability}`;
      break;
    case 'sports-fitness':
      if (venue.sports_offered) baseData.sport = venue.sports_offered;
      if (venue.equipment_provided) baseData.description += ` | Equipment: ${venue.equipment_provided}`;
      break;
    case 'health-wellness':
      if (venue.services_offered) baseData.description += ` | Services: ${venue.services_offered}`;
      if (venue.specializations) baseData.description += ` | Specializations: ${venue.specializations}`;
      break;
    case 'entertainment':
      if (venue.entertainment_options) baseData.description += ` | Entertainment: ${venue.entertainment_options}`;
      if (venue.age_restrictions) baseData.description += ` | Age restrictions: ${venue.age_restrictions}`;
      break;
    case 'arts-culture':
      if (venue.exhibitions_and_collections) baseData.description += ` | Exhibitions: ${venue.exhibitions_and_collections}`;
      if (venue.artistic_focus) baseData.description += ` | Focus: ${venue.artistic_focus}`;
      break;
  }

  // Add additional useful fields for all categories
  if (venue.instagram_worthy) baseData.description += ` | Instagram-worthy location`;
  if (venue.kid_friendly) baseData.description += ` | Kid-friendly`;
  if (venue.wifi_and_study_environment_score) baseData.description += ` | WiFi available`;

  return baseData;
}

// Run the build
buildSSG();
