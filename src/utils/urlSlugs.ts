// Utility functions for creating URL-friendly slugs from venue names

export const createSlug = (text: string): string => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .trim()
    // Replace spaces and special characters with hyphens
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    // Remove multiple consecutive hyphens
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');
};

export const createVenueUrl = (category: string, id: string | number, venueName: string): string => {
  const slug = createSlug(venueName);
  return `/${category}/${id}${slug ? `-${slug}` : ''}`;
};

export const parseVenueUrl = (url: string): { category: string; id: string; slug?: string } | null => {
  // Match pattern: /category/id-slug or /category/id
  const match = url.match(/^\/([^/]+)\/(\d+)(?:-(.+))?$/);
  if (!match) return null;
  
  return {
    category: match[1],
    id: match[2],
    slug: match[3] || undefined
  };
};

// Test the slug creation
export const testSlugs = () => {
  const testCases = [
    'Universal Cinemas',
    'The Basil Leaf Restaurant',
    'DOLMEN MALL - Clifton',
    'Arts Council of Pakistan Karachi',
    'EVOKE FITNESS ARENA - GYM',
    'Maharani Jindan Kaur Haveli: Sarkar-i Khalsa Gallery'
  ];
  
  console.log('Testing URL slug creation:');
  testCases.forEach(name => {
    console.log(`"${name}" -> "${createSlug(name)}"`);
  });
};
