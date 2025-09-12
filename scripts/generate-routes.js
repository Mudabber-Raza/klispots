import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate all venue routes for SSG prerendering
 * This creates routes for all 5,500+ venue pages
 */
function generateVenueRoutes() {
  const routes = [];
  
  try {
    // Read all data files
    console.log('📖 Reading venue data files...');
    
    // Restaurants
    const restaurantsPath = path.join(__dirname, '../src/data/Restaurants1.json');
    if (fs.existsSync(restaurantsPath)) {
      const restaurants = JSON.parse(fs.readFileSync(restaurantsPath, 'utf8'));
      console.log(`🍽️ Found ${restaurants.length} restaurants`);
      
      restaurants.forEach((restaurant, index) => {
        const id = restaurant.restaurant_index || restaurant.id || (index + 1);
        const name = restaurant.name || restaurant.restaurant_name || restaurant.place_name || 'restaurant';
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        routes.push(`/restaurant/${id}-${slug}`);
      });
    }
    
    // Cafes
    const cafesPath = path.join(__dirname, '../src/data/Cafes1.json');
    if (fs.existsSync(cafesPath)) {
      const cafes = JSON.parse(fs.readFileSync(cafesPath, 'utf8'));
      console.log(`☕ Found ${cafes.length} cafes`);
      
      cafes.forEach((cafe, index) => {
        const id = cafe.cafe_index || cafe.id || (index + 1);
        const name = cafe.name || cafe.cafe_name || cafe.place_name || 'cafe';
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        routes.push(`/cafe/${id}-${slug}`);
      });
    }
    
    // Shopping
    const shoppingPath = path.join(__dirname, '../src/data/Shopping.json');
    if (fs.existsSync(shoppingPath)) {
      const shopping = JSON.parse(fs.readFileSync(shoppingPath, 'utf8'));
      console.log(`🛍️ Found ${shopping.length} shopping venues`);
      
      shopping.forEach((venue, index) => {
        const id = venue.venue_index || venue.id || venue.place_id || (index + 1);
        const name = venue.name || venue.venue_name || venue.place_name || 'shopping';
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        routes.push(`/shopping/${id}-${slug}`);
      });
    }
    
    // Entertainment
    const entertainmentPath = path.join(__dirname, '../src/data/entertainment.json');
    if (fs.existsSync(entertainmentPath)) {
      const entertainment = JSON.parse(fs.readFileSync(entertainmentPath, 'utf8'));
      console.log(`🎭 Found ${entertainment.length} entertainment venues`);
      
      entertainment.forEach((venue, index) => {
        const id = venue.venue_index || venue.id || venue.place_id || (index + 1);
        const name = venue.name || venue.venue_name || venue.place_name || 'entertainment';
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        routes.push(`/entertainment/${id}-${slug}`);
      });
    }
    
    // Arts & Culture
    const artsCulturePath = path.join(__dirname, '../src/data/Arts and Culture.json');
    if (fs.existsSync(artsCulturePath)) {
      const artsCulture = JSON.parse(fs.readFileSync(artsCulturePath, 'utf8'));
      console.log(`🎨 Found ${artsCulture.length} arts & culture venues`);
      
      artsCulture.forEach((venue, index) => {
        const id = venue.venue_index || venue.id || venue.place_id || (index + 1);
        const name = venue.name || venue.venue_name || venue.place_name || 'arts-culture';
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        routes.push(`/arts-culture/${id}-${slug}`);
      });
    }
    
    // Sports & Fitness
    const sportsFitnessPath = path.join(__dirname, '../src/data/sports and fitness.json');
    if (fs.existsSync(sportsFitnessPath)) {
      const sportsFitness = JSON.parse(fs.readFileSync(sportsFitnessPath, 'utf8'));
      console.log(`🏃 Found ${sportsFitness.length} sports & fitness venues`);
      
      sportsFitness.forEach((venue, index) => {
        const id = venue.venue_index || venue.id || venue.place_id || (index + 1);
        const name = venue.name || venue.venue_name || venue.place_name || 'sports-fitness';
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        routes.push(`/sports-fitness/${id}-${slug}`);
      });
    }
    
    // Health & Wellness
    const healthWellnessPath = path.join(__dirname, '../src/data/Health and wellness.json');
    if (fs.existsSync(healthWellnessPath)) {
      const healthWellness = JSON.parse(fs.readFileSync(healthWellnessPath, 'utf8'));
      console.log(`🏥 Found ${healthWellness.length} health & wellness venues`);
      
      healthWellness.forEach((venue, index) => {
        const id = venue.venue_index || venue.id || venue.place_id || (index + 1);
        const name = venue.name || venue.venue_name || venue.place_name || 'health-wellness';
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        routes.push(`/health-wellness/${id}-${slug}`);
      });
    }
    
    console.log(`✅ Generated ${routes.length} total routes`);
    return routes;
    
  } catch (error) {
    console.error('❌ Error generating routes:', error);
    return [];
  }
}

/**
 * Get main category routes (for initial testing)
 */
function getMainRoutes() {
  return [
    '/',
    '/restaurants',
    '/cafes',
    '/shopping',
    '/entertainment',
    '/arts-culture',
    '/sports-fitness',
    '/health-wellness'
  ];
}

/**
 * Export routes based on environment
 * - Development: Main routes only (faster builds)
 * - Production: All routes (full SSG)
 */
export function getRoutes() {
  const isProduction = process.env.NODE_ENV === 'production';
  const isFullSSG = process.env.FULL_SSG === 'true' || process.env.FULL_SSG === true || process.env.FULL_SSG?.trim() === 'true';
  
  console.log(`🔧 Environment check - NODE_ENV: ${process.env.NODE_ENV}, FULL_SSG: "${process.env.FULL_SSG}"`);
  console.log(`🔧 isProduction: ${isProduction}, isFullSSG: ${isFullSSG}`);
  
  if (isProduction || isFullSSG) {
    console.log('🚀 Generating full SSG routes (5,500+ pages)');
    return [...getMainRoutes(), ...generateVenueRoutes()];
  } else {
    console.log('⚡ Using main routes only (faster development builds)');
    return getMainRoutes();
  }
}

// If run directly, output routes
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1].endsWith('generate-routes.js')) {
  const routes = getRoutes();
  console.log('\n📋 Generated routes:');
  routes.forEach(route => console.log(`  ${route}`));
  console.log(`\nTotal: ${routes.length} routes`);
}


