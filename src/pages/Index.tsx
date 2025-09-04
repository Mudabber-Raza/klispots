
import Header from '@/components/layout/Header';
import SearchHero from '@/components/home/SearchHero';
import FeaturedPlaces from '@/components/home/FeaturedPlaces';
import CategoryGrid from '@/components/home/CategoryGrid';
import CitySpotlight from '@/components/home/CitySpotlight';
import TrendingInsights from '@/components/home/TrendingInsights';
import WhyKLIspots from '@/components/home/WhyKLIspots';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/seo/SEOHead';

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEOHead 
        page="home"
        customTitle="KLIspots - Discover Pakistan's Premium Lifestyle & Best Restaurants"
        customDescription="Find the best restaurants, cafes, shopping, entertainment, and lifestyle venues across Pakistan. AI-powered insights and expert verification for authentic experiences."
        customKeywords={[
          'Pakistan lifestyle',
          'best restaurants Pakistan',
          'cafes Pakistan',
          'shopping Pakistan',
          'entertainment Pakistan',
          'Pakistan dining',
          'Pakistani food',
          'restaurant reviews Pakistan',
          'halal restaurants Pakistan',
          'fine dining Pakistan'
        ]}
      />
      <Header />
      <main>
        <SearchHero />
        <FeaturedPlaces />
        <CategoryGrid />
        <CitySpotlight />
        <TrendingInsights />
        <WhyKLIspots />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
