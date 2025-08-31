
import Header from '@/components/layout/Header';
import SearchHero from '@/components/home/SearchHero';
import FeaturedPlaces from '@/components/home/FeaturedPlaces';
import CategoryGrid from '@/components/home/CategoryGrid';
import CitySpotlight from '@/components/home/CitySpotlight';
import TrendingInsights from '@/components/home/TrendingInsights';
import WhyKLIspots from '@/components/home/WhyKLIspots';
import Footer from '@/components/layout/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
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
