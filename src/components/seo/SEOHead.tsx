import React from 'react';
import { useSEO, generatePageSEOConfig, generateOrganizationData, generateWebsiteData } from '@/utils/seoUtils';

interface SEOHeadProps {
  page: string;
  venue?: any;
  city?: string;
  category?: string;
  customTitle?: string;
  customDescription?: string;
  customKeywords?: string[];
  customImage?: string;
  breadcrumbs?: Array<{name: string, url: string}>;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  page,
  venue,
  city,
  category,
  customTitle,
  customDescription,
  customKeywords,
  customImage,
  breadcrumbs
}) => {
  // Generate SEO config
  const seoConfig = generatePageSEOConfig(page, venue, city, category);
  
  // Override with custom values if provided
  if (customTitle) seoConfig.title = customTitle;
  if (customDescription) seoConfig.description = customDescription;
  if (customKeywords) seoConfig.keywords = [...seoConfig.keywords, ...customKeywords];
  if (customImage) {
    seoConfig.ogImage = customImage;
    seoConfig.twitterImage = customImage;
  }

  // Use the SEO hook
  useSEO(seoConfig);

  // Generate additional structured data
  const organizationData = generateOrganizationData();
  const websiteData = generateWebsiteData();

  React.useEffect(() => {
    // Add organization structured data
    let orgScript = document.querySelector('script[data-seo="organization"]');
    if (!orgScript) {
      orgScript = document.createElement('script');
      orgScript.setAttribute('type', 'application/ld+json');
      orgScript.setAttribute('data-seo', 'organization');
      document.head.appendChild(orgScript);
    }
    orgScript.textContent = JSON.stringify(organizationData);

    // Add website structured data
    let websiteScript = document.querySelector('script[data-seo="website"]');
    if (!websiteScript) {
      websiteScript = document.createElement('script');
      websiteScript.setAttribute('type', 'application/ld+json');
      websiteScript.setAttribute('data-seo', 'website');
      document.head.appendChild(websiteScript);
    }
    websiteScript.textContent = JSON.stringify(websiteData);

    // Add breadcrumb structured data if provided
    if (breadcrumbs && breadcrumbs.length > 0) {
      const breadcrumbData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((crumb, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": crumb.name,
          "item": `https://klispots.com${crumb.url}`
        }))
      };

      let breadcrumbScript = document.querySelector('script[data-seo="breadcrumb"]');
      if (!breadcrumbScript) {
        breadcrumbScript = document.createElement('script');
        breadcrumbScript.setAttribute('type', 'application/ld+json');
        breadcrumbScript.setAttribute('data-seo', 'breadcrumb');
        document.head.appendChild(breadcrumbScript);
      }
      breadcrumbScript.textContent = JSON.stringify(breadcrumbData);
    }

    // Add FAQ structured data for common questions
    const faqData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": `What are the best ${page} in ${city || 'Pakistan'}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `Discover the top-rated ${page} in ${city || 'Pakistan'} with reviews, ratings, and contact information on KLIspots.`
          }
        },
        {
          "@type": "Question",
          "name": `How can I find ${page} near me?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `Use KLIspots to search for ${page} near your location with detailed information, photos, and reviews.`
          }
        },
        {
          "@type": "Question",
          "name": `Are there halal ${page} available?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `Yes, KLIspots features many halal-certified ${page} across Pakistan with verified information and reviews.`
          }
        }
      ]
    };

    let faqScript = document.querySelector('script[data-seo="faq"]');
    if (!faqScript) {
      faqScript = document.createElement('script');
      faqScript.setAttribute('type', 'application/ld+json');
      faqScript.setAttribute('data-seo', 'faq');
      document.head.appendChild(faqScript);
    }
    faqScript.textContent = JSON.stringify(faqData);

  }, [breadcrumbs]);

  // This component doesn't render anything visible
  return null;
};

export default SEOHead;
