
import RestaurantCard from '../restaurant/RestaurantCard';

const FeaturedRestaurants = () => {
  // Sample data with Chandni Restaurant and others
  const featuredRestaurants = [
    {
      id: '1772',
      name: 'The Basil Leaf',
      cuisine: 'Italian, Mediterranean, Pakistani',
      city: 'Lahore',
      neighborhood: 'DHA Phase 6',
      totalScore: 9.27,
      priceRange: 'Rs 1500 - Rs 3500',
      category: 'Fine Dining',
      halalStatus: 'Halal',
      specialties: ['Grilled Burgers', 'Pasta', 'Mushrooms'],
      features: ['WiFi', 'Parking', 'Fine Dining'],
      phone: '+92 300 700 0000',
      imageUrl: '/lovable-uploads/The_Basil_Leaf_ChIJl3IsuNQFGTkR4EhEnVaxMv0_3.jpg',
      currentStatus: 'Open' as const
    },
    {
      id: '2',
      name: 'Café Flo',
      cuisine: 'Continental, French',
      city: 'Karachi',
      neighborhood: 'Clifton',
      totalScore: 8.2,
      priceRange: 'Rs 2,500-3,500 per person',
      category: 'Casual Dining',
      halalStatus: 'Halal',
      specialties: ['Breakfast', 'Coffee', 'French Pastries'],
      features: ['WiFi', 'Outdoor Seating'],
      currentStatus: 'Open' as const
    },
    {
      id: '3',
      name: 'Cooco\'s Den',
      cuisine: 'Pakistani, Mughlai',
      city: 'Lahore',
      neighborhood: 'Old City',
      totalScore: 8.5,
      priceRange: 'Rs 3,000-4,000 per person',
      category: 'Heritage Dining',
      halalStatus: 'Halal',
      specialties: ['Traditional Pakistani', 'Rooftop Dining', 'Cultural Shows'],
      features: ['Cultural Significance', 'Traditional Decor'],
      currentStatus: 'Open' as const
    },
    {
      id: '4',
      name: 'Monal Restaurant',
      cuisine: 'Pakistani, Chinese',
      city: 'Islamabad',
      neighborhood: 'Margalla Hills',
      totalScore: 8.1,
      priceRange: 'Rs 2,000-3,000 per person',
      category: 'Fine Dining',
      halalStatus: 'Halal',
      specialties: ['Mountain Views', 'Pakistani BBQ', 'Chinese'],
      features: ['Scenic Views', 'Parking', 'Family Friendly'],
      currentStatus: 'Open' as const
    },
    {
      id: '5',
      name: 'Okra',
      cuisine: 'Contemporary Pakistani',
      city: 'Karachi',
      neighborhood: 'Defence',
      totalScore: 8.7,
      priceRange: 'Rs 3,500-4,500 per person',
      category: 'Fine Dining',
      halalStatus: 'Halal',
      specialties: ['Modern Pakistani', 'Chef Specials', 'Wine Pairing'],
      features: ['WiFi', 'Valet Parking', 'Private Dining'],
      currentStatus: 'Open' as const
    },
    {
      id: '6',
      name: 'Bundu Khan',
      cuisine: 'Pakistani BBQ',
      city: 'Lahore',
      neighborhood: 'MM Alam Road',
      totalScore: 7.8,
      priceRange: 'Rs 1,500-2,500 per person',
      category: 'Casual Dining',
      halalStatus: 'Halal',
      specialties: ['Seekh Kebabs', 'Karahi', 'Traditional BBQ'],
      features: ['Takeaway', 'Family Friendly'],
      currentStatus: 'Open' as const
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Featured Restaurants
          </h2>
          <p className="text-xl text-gray-600">
            Handpicked dining experiences across Pakistan's culinary landscape
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
            View All Restaurants
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedRestaurants;
