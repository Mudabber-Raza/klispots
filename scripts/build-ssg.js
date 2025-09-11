import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getRoutes } from './generate-routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Simple SSG Build Script
 * This generates static HTML files for all venue pages
 * Uses a different approach than prerendering plugins
 */
async function buildSSG() {
  console.log('🚀 Starting SSG build process...');
  
  try {
    // Check if we should generate all routes
    const isFullSSG = process.env.FULL_SSG === 'true' || process.env.FULL_SSG === true;
    console.log(`🔧 FULL_SSG environment variable: ${process.env.FULL_SSG}`);
    console.log(`🔧 isFullSSG: ${isFullSSG}`);
    
    // Get routes based on environment
    const routes = getRoutes();
    
    console.log(`📋 Building ${routes.length} pages...`);
    
    // Read the main index.html to get the correct asset references
    const mainIndexPath = path.join(__dirname, '../dist/index.html');
    let htmlTemplate;
    
    if (fs.existsSync(mainIndexPath)) {
      // Use the actual built index.html as template
      htmlTemplate = fs.readFileSync(mainIndexPath, 'utf8');
      console.log('✅ Using built index.html as template');
    } else {
      // Fallback template if index.html doesn't exist
      htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pak Eatery Find - Discover Amazing Venues</title>
    <meta name="description" content="Discover the best restaurants, cafes, shopping, entertainment, and more across Pakistan">
    <link rel="canonical" href="https://pak-eatery-find.vercel.app{route}">
    <meta property="og:title" content="Pak Eatery Find - Discover Amazing Venues">
    <meta property="og:description" content="Discover the best restaurants, cafes, shopping, entertainment, and more across Pakistan">
    <meta property="og:url" content="https://pak-eatery-find.vercel.app{route}">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Pak Eatery Find - Discover Amazing Venues">
    <meta name="twitter:description" content="Discover the best restaurants, cafes, shopping, entertainment, and more across Pakistan">
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
</body>
</html>`;
      console.log('⚠️ Using fallback template (index.html not found)');
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
      
      // Write HTML file
      const html = htmlTemplate.replace(/{route}/g, route);
      fs.writeFileSync(fullPath, html);
      console.log(`✅ Generated: ${routePath}`);
    }
    
    console.log('🎉 SSG build completed successfully!');
    console.log(`📊 Generated ${routes.length} static pages`);
    
  } catch (error) {
    console.error('❌ SSG build failed:', error);
    process.exit(1);
  }
}

// Run the build
buildSSG();
