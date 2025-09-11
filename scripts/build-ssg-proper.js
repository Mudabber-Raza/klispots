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
  
  try {
    // Check if we should generate all routes
    const isFullSSG = process.env.FULL_SSG === 'true' || process.env.FULL_SSG === true;
    console.log(`🔧 FULL_SSG environment variable: ${process.env.FULL_SSG}`);
    console.log(`🔧 isFullSSG: ${isFullSSG}`);
    
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
    for (const route of routes) {
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
      console.log(`✅ Generated: ${routePath}`);
    }
    
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
      console.log(`🍽️ Loaded ${venueData.restaurants.length} restaurants`);
    }
    
    // Load cafes
    const cafesPath = path.join(dataDir, 'Cafes1.json');
    if (fs.existsSync(cafesPath)) {
      venueData.cafes = JSON.parse(fs.readFileSync(cafesPath, 'utf8'));
      console.log(`☕ Loaded ${venueData.cafes.length} cafes`);
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
    console.log(`🔍 Looking for ${category} with ID: ${id}`);
    switch (category) {
      case 'restaurant':
        venue = venueData.restaurants.find((r, index) => 
          (r.restaurant_index && r.restaurant_index.toString() === id) ||
          (r.id && r.id.toString() === id) ||
          ((index + 1).toString() === id)
        );
        if (venue) {
          console.log(`✅ Found restaurant: ${venue.place_name || venue.name || 'Unknown'}`);
        } else {
          console.log(`❌ No restaurant found with ID: ${id}`);
        }
        break;
      case 'cafe':
        console.log(`🔍 Looking for cafe with ID: ${id}`);
        console.log(`📋 First 5 cafe IDs in data: ${venueData.cafes.slice(0, 5).map(c => c.cafe_index || c.id || 'no-id').join(', ')}`);
        
        venue = venueData.cafes.find((c, index) => 
          (c.cafe_index && c.cafe_index.toString() === id) ||
          (c.id && c.id.toString() === id) ||
          ((index + 1).toString() === id)
        );
        if (venue) {
          console.log(`✅ Found cafe: ${venue.place_name || venue.name || 'Unknown'} with ID: ${venue.cafe_index || venue.id || 'no-id'}`);
        } else {
          console.log(`❌ No cafe found with ID: ${id}`);
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
        // Match the same logic as route generation: venue_index || id || place_id || (index + 1)
        venue = venueData.sportsFitness.find((s, index) => 
          (s.venue_index && s.venue_index.toString() === id) ||
          (s.id && s.id.toString() === id) ||
          (s.place_id && s.place_id.toString() === id) ||
          ((index + 1).toString() === id)
        );
        if (venue) {
          console.log(`✅ Found sports & fitness venue: ${venue.place_name || venue.name || 'Unknown'}`);
        } else {
          console.log(`❌ No sports & fitness venue found with ID: ${id}`);
        }
        break;
      case 'health-wellness':
        // Match the same logic as route generation: venue_index || id || place_id || (index + 1)
        venue = venueData.healthWellness.find((h, index) => 
          (h.venue_index && h.venue_index.toString() === id) ||
          (h.id && h.id.toString() === id) ||
          (h.place_id && h.place_id.toString() === id) ||
          ((index + 1).toString() === id)
        );
        if (venue) {
          console.log(`✅ Found health & wellness venue: ${venue.place_name || venue.name || 'Unknown'}`);
        } else {
          console.log(`❌ No health & wellness venue found with ID: ${id}`);
        }
        break;
    }
  }
  
  // Generate venue-specific content
  if (venue) {
    console.log(`🎯 Generating content for venue: ${JSON.stringify(venue, null, 2).substring(0, 200)}...`);
    const venueName = venue.name || venue.restaurant_name || venue.cafe_name || venue.venue_name || venue.place_name || 'Unknown Venue';
    const venueLocation = venue.location || venue.address || venue.city || 'Pakistan';
    const venueDescription = venue.description || venue.about || venue.summary || `Visit ${venueName} in ${venueLocation}`;
    
    pageTitle = `${venueName} - ${venueLocation} | KLIspots`;
    pageDescription = `${venueDescription} | Located in ${venueLocation}. Find more details, reviews, and contact information on KLIspots.`;
    
    console.log(`📝 Generated title: ${pageTitle}`);
    console.log(`📝 Generated description: ${pageDescription}`);
    
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
  } else {
    console.log(`⚠️ No venue found for route: ${route}`);
    console.log(`⚠️ Using default template for: ${route}`);
  }
  
  // Replace placeholders in the base template
  let html = baseTemplate
    .replace(/{route}/g, route)
    .replace(/<title>.*?<\/title>/i, `<title>${pageTitle}</title>`)
    .replace(/<meta name="description" content=".*?"/i, `<meta name="description" content="${pageDescription}"`)
    .replace(/<meta property="og:title" content=".*?"/i, `<meta property="og:title" content="${pageTitle}"`)
    .replace(/<meta property="og:description" content=".*?"/i, `<meta property="og:description" content="${pageDescription}"`)
    .replace(/<meta name="twitter:title" content=".*?"/i, `<meta name="twitter:title" content="${pageTitle}"`)
    .replace(/<meta name="twitter:description" content=".*?"/i, `<meta name="twitter:description" content="${pageDescription}"`);
  
  // Fix the root div content injection - handle malformed HTML
  // The base template has malformed HTML with content outside root div
  // We need to clean this up and properly structure the HTML
  
  // Extract the head section (everything before <body>)
  const headMatch = html.match(/<head>(.*?)<\/head>/s);
  const headContent = headMatch ? headMatch[1] : '';
  
  // Extract the body opening tag
  const bodyMatch = html.match(/<body[^>]*>/);
  const bodyTag = bodyMatch ? bodyMatch[0] : '<body>';
  
  // Extract scripts and other content that should be at the end
  const scriptMatches = html.match(/<script[^>]*>.*?<\/script>/gs) || [];
  const otherScripts = scriptMatches.join('\n');
  
  // Rebuild the HTML with proper structure
  console.log(`🔧 Injecting pageContent: ${pageContent.substring(0, 100)}...`);
  html = `<!DOCTYPE html>
<html lang="en">
<head>
${headContent}
</head>
${bodyTag}
<div id="root">${pageContent}</div>
${otherScripts}
</body>
</html>`;
  console.log(`✅ HTML rebuilt with content for route: ${route}`);
  
  return html;
}

// Run the build
buildSSG();
