import { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { name } = req.query;
  
  // Default to main sitemap if no name provided
  const sitemapName = name || 'sitemap';
  
  try {
    // Read the sitemap file from the dist directory
    const sitemapPath = path.join(process.cwd(), 'dist', `${sitemapName}.xml`);
    
    if (!fs.existsSync(sitemapPath)) {
      return res.status(404).json({ error: 'Sitemap not found' });
    }

    const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
    
    // Set proper headers for XML
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    
    return res.status(200).send(sitemapContent);
  } catch (error) {
    console.error('Error serving sitemap:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
