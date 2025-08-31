
import { categories } from '@/data/categories';
import PlaceCard from '@/components/shared/PlaceCard';
import { Place } from '@/types/categories';

const TrendingPlaces = () => {
  // Sample trending places across different categories
  const trendingPlaces: Place[] = [
    {
      id: '1772',
      categoryId: '1',
      name: 'The Basil Leaf',
      address: 'Building #3, Sector G Block - G DHA Phase 6, Lahore',
      city: 'lahore',
      phone: '+92 300 700 0000',
      rating: 9.27,
      priceRange: 'Rs 1500 - Rs 3500',
      imageUrl: '/lovable-uploads/The_Basil_Leaf_ChIJl3IsuNQFGTkR4EhEnVaxMv0_3.jpg',
      isOpen: true,
      features: ['WiFi', 'Parking', 'Fine Dining'],
      neighborhood: 'DHA Phase 6'
    },
    {
      id: '2',
      categoryId: '2',
      name: 'Sindhri Coffee Roasters',
      address: 'Zamzama Boulevard',
      city: 'karachi',
      rating: 8.2,
      priceRange: 'Rs 500-1,000 per person',
      imageUrl: '/placeholder.svg',
      isOpen: true,
      features: ['WiFi', 'Study Friendly', 'Outdoor Seating'],
      neighborhood: 'DHA'
    },
    {
      id: '3',
      categoryId: '3',
      name: 'Centaurus Mall',
      address: 'Jinnah Avenue',
      city: 'islamabad',
      rating: 8.0,
      priceRange: 'Budget to Premium',
      imageUrl: '/placeholder.svg',
      isOpen: true,
      features: ['Parking', 'Food Court', 'Cinema'],
      neighborhood: 'F-8'
    },
    {
      id: '4',
      categoryId: '6',
      name: 'Shapes Fitness Club',
      address: 'MM Alam Road',
      city: 'lahore',
      rating: 7.8,
      priceRange: 'Rs 8,000-15,000/month',
      imageUrl: '/placeholder.svg',
      isOpen: true,
      features: ['Swimming Pool', 'Personal Training', 'Sauna'],
      neighborhood: 'Gulberg'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Trending This Week
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Popular spots across all categories that people are talking about
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingPlaces.map((place) => (
            <PlaceCard key={place.id} place={place} showCategory={true} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingPlaces;
