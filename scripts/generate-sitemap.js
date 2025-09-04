import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import venue data
const restaurants = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/Restaurants1.json'), 'utf8'));
const cafes = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/Cafes1.json'), 'utf8'));
const shopping = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/Shopping.json'), 'utf8'));
const entertainment = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/entertainment.json'), 'utf8'));
const artsCulture = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/Arts and Culture.json'), 'utf8'));
const sportsFitness = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/sports and fitness.json'), 'utf8'));
const healthWellness = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/Health and wellness.json'), 'utf8'));

// Create slug function
const createSlug = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Escape XML special characters
const escapeXml = (text) => {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

// Generate sitemap XML
const generateSitemapXML = (urls) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return xml;
};

// Generate sitemap index
const generateSitemapIndex = (sitemaps) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(sitemap => `  <sitemap>
    <loc>${sitemap.loc}</loc>
    <lastmod>${sitemap.lastmod}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;

  return xml;
};

// Main sitemap generation
const generateSitemaps = () => {
  const baseUrl = 'https://klispots.com';
  const today = new Date().toISOString().split('T')[0];
  
  // Static pages
  const staticPages = [
    { loc: `${baseUrl}/`, lastmod: today, changefreq: 'daily', priority: '1.0' },
    { loc: `${baseUrl}/restaurants`, lastmod: today, changefreq: 'daily', priority: '0.9' },
    { loc: `${baseUrl}/cafes`, lastmod: today, changefreq: 'daily', priority: '0.9' },
    { loc: `${baseUrl}/shopping`, lastmod: today, changefreq: 'daily', priority: '0.8' },
    { loc: `${baseUrl}/entertainment`, lastmod: today, changefreq: 'daily', priority: '0.8' },
    { loc: `${baseUrl}/arts-culture`, lastmod: today, changefreq: 'daily', priority: '0.8' },
    { loc: `${baseUrl}/sports-fitness`, lastmod: today, changefreq: 'daily', priority: '0.8' },
    { loc: `${baseUrl}/health-wellness`, lastmod: today, changefreq: 'daily', priority: '0.8' },
    { loc: `${baseUrl}/cities`, lastmod: today, changefreq: 'weekly', priority: '0.7' },
    { loc: `${baseUrl}/about`, lastmod: today, changefreq: 'monthly', priority: '0.6' },
    { loc: `${baseUrl}/search`, lastmod: today, changefreq: 'daily', priority: '0.5' }
  ];

  // Restaurant pages (top 100 for main sitemap)
  const restaurantPages = restaurants.slice(0, 100).map(restaurant => ({
    loc: `${baseUrl}/restaurant/${restaurant.restaurant_index}-${createSlug(restaurant.place_name)}`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.7'
  }));

  // Cafe pages (top 100 for main sitemap)
  const cafePages = cafes.slice(0, 100).map(cafe => ({
    loc: escapeXml(`${baseUrl}/cafe/${cafe.cafe_index}-${createSlug(cafe.place_name)}`),
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.7'
  }));

  // Shopping pages (top 50 for main sitemap)
  const shoppingPages = shopping.slice(0, 50).map(venue => ({
    loc: `${baseUrl}/shopping/${venue.venue_index || venue.id || venue.place_id}-${createSlug(venue.place_name)}`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.6'
  }));

  // Entertainment pages (top 50 for main sitemap)
  const entertainmentPages = entertainment.slice(0, 50).map(venue => ({
    loc: `${baseUrl}/entertainment/${venue.venue_index || venue.id || venue.place_id}-${createSlug(venue.place_name)}`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.6'
  }));

  // Arts & Culture pages (top 50 for main sitemap)
  const artsCulturePages = artsCulture.slice(0, 50).map(venue => ({
    loc: `${baseUrl}/arts-culture/${venue.venue_index || venue.id || venue.place_id}-${createSlug(venue.place_name)}`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.6'
  }));

  // Sports & Fitness pages (top 50 for main sitemap)
  const sportsFitnessPages = sportsFitness.slice(0, 50).map(venue => ({
    loc: `${baseUrl}/sports-fitness/${venue.venue_index || venue.id || venue.place_id}-${createSlug(venue.place_name)}`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.6'
  }));

  // Health & Wellness pages (top 50 for main sitemap)
  const healthWellnessPages = healthWellness.slice(0, 50).map(venue => ({
    loc: `${baseUrl}/health-wellness/${venue.venue_index || venue.id || venue.place_id}-${createSlug(venue.place_name)}`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.6'
  }));

  // Full category sitemaps (ALL pages) - with validation
  const fullRestaurantPages = restaurants
    .filter(restaurant => restaurant.restaurant_index && restaurant.place_name)
    .map(restaurant => ({
      loc: `${baseUrl}/restaurant/${restaurant.restaurant_index}-${createSlug(restaurant.place_name)}`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.7'
    }));

  const fullCafePages = cafes
    .filter(cafe => cafe.cafe_index && cafe.place_name)
    .map(cafe => ({
      loc: escapeXml(`${baseUrl}/cafe/${cafe.cafe_index}-${createSlug(cafe.place_name)}`),
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.7'
    }));

  const fullShoppingPages = shopping
    .filter(venue => venue.place_name)
    .map(venue => ({
      loc: `${baseUrl}/shopping/${venue.venue_index || venue.id || venue.place_id}-${createSlug(venue.place_name)}`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.6'
    }));

  const fullEntertainmentPages = entertainment
    .filter(venue => venue.place_name)
    .map(venue => ({
      loc: `${baseUrl}/entertainment/${venue.venue_index || venue.id || venue.place_id}-${createSlug(venue.place_name)}`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.6'
    }));

  const fullArtsCulturePages = artsCulture
    .filter(venue => venue.place_name)
    .map(venue => ({
      loc: `${baseUrl}/arts-culture/${venue.venue_index || venue.id || venue.place_id}-${createSlug(venue.place_name)}`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.6'
    }));

  const fullSportsFitnessPages = sportsFitness
    .filter(venue => venue.place_name)
    .map(venue => ({
      loc: `${baseUrl}/sports-fitness/${venue.venue_index || venue.id || venue.place_id}-${createSlug(venue.place_name)}`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.6'
    }));

  const fullHealthWellnessPages = healthWellness
    .filter(venue => venue.place_name)
    .map(venue => ({
      loc: `${baseUrl}/health-wellness/${venue.venue_index || venue.id || venue.place_id}-${createSlug(venue.place_name)}`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.6'
    }));

  // Combine all URLs
  const allUrls = [
    ...staticPages,
    ...restaurantPages,
    ...cafePages,
    ...shoppingPages,
    ...entertainmentPages,
    ...artsCulturePages,
    ...sportsFitnessPages,
    ...healthWellnessPages
  ];

  // Generate main sitemap
  const mainSitemap = generateSitemapXML(allUrls);
  fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), mainSitemap);

  // Generate category-specific sitemaps (FULL coverage with chunking)
  const categorySitemaps = [
    { name: 'restaurants', urls: fullRestaurantPages },
    { name: 'cafes', urls: fullCafePages },
    { name: 'shopping', urls: fullShoppingPages },
    { name: 'entertainment', urls: fullEntertainmentPages },
    { name: 'arts-culture', urls: fullArtsCulturePages },
    { name: 'sports-fitness', urls: fullSportsFitnessPages },
    { name: 'health-wellness', urls: fullHealthWellnessPages }
  ];

  // Function to split large sitemaps into chunks
  const splitSitemapIntoChunks = (urls, categoryName, maxUrlsPerChunk = 1000) => {
    const chunks = [];
    for (let i = 0; i < urls.length; i += maxUrlsPerChunk) {
      chunks.push(urls.slice(i, i + maxUrlsPerChunk));
    }
    
    if (chunks.length === 1) {
      // Single sitemap
      const sitemap = generateSitemapXML(chunks[0]);
      fs.writeFileSync(path.join(__dirname, `../public/sitemap-${categoryName}.xml`), sitemap);
      return [{ name: categoryName, urls: chunks[0] }];
    } else {
      // Multiple sitemaps
      const sitemapList = [];
      chunks.forEach((chunk, index) => {
        const sitemapName = index === 0 ? categoryName : `${categoryName}-${index + 1}`;
        const sitemap = generateSitemapXML(chunk);
        fs.writeFileSync(path.join(__dirname, `../public/sitemap-${sitemapName}.xml`), sitemap);
        sitemapList.push({ name: sitemapName, urls: chunk });
      });
      return sitemapList;
    }
  };

  // Generate sitemaps with chunking
  const allSitemaps = [];
  categorySitemaps.forEach(category => {
    const sitemapList = splitSitemapIntoChunks(category.urls, category.name, 1000);
    allSitemaps.push(...sitemapList);
  });

  // Generate sitemap index (simplified - only main sitemap)
  const sitemapIndex = generateSitemapIndex([
    { loc: `${baseUrl}/sitemap.xml`, lastmod: today }
  ]);

  fs.writeFileSync(path.join(__dirname, '../public/sitemap-index.xml'), sitemapIndex);

  console.log(`✅ Generated sitemaps:`);
  console.log(`- Main sitemap: ${allUrls.length} URLs`);
  allSitemaps.forEach(sitemap => {
    console.log(`- ${sitemap.name} sitemap: ${sitemap.urls.length} URLs`);
  });
  console.log(`- Sitemap index with 1 sitemap (main only)`);
  console.log(`\n📋 Submit these URLs to Google Search Console:`);
  console.log(`1. https://klispots.com/sitemap.xml (main sitemap)`);
  allSitemaps.forEach(sitemap => {
    console.log(`${allSitemaps.indexOf(sitemap) + 2}. https://klispots.com/sitemap-${sitemap.name}.xml`);
  });
};

// Run the generator
generateSitemaps();
