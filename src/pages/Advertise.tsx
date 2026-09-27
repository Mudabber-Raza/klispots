import { CheckCircle, Megaphone } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageSEO from '@/components/seo/PageSEO';
import LeadForm from '@/components/forms/LeadForm';
import { SITE } from '@/lib/site';

const packages = [
  {
    name: 'Featured listing',
    price: 'From Rs 8,000 / month',
    points: ['Badge on your venue page', 'Higher rank in category lists', 'City page mention'],
  },
  {
    name: 'Homepage spotlight',
    price: 'From Rs 20,000 / month',
    points: ['Home “best places” slot', 'Category + city coverage', 'Monthly performance note'],
  },
  {
    name: 'Category banner',
    price: 'Custom',
    points: ['Restaurants, cafes, or shopping pages', 'Your creative or ours', 'Fixed dates'],
  },
];

const Advertise = () => {
  return (
    <div className="min-h-screen bg-white">
      <PageSEO
        title="Advertise on KLIspots"
        description="Promote your venue to people searching restaurants, cafes, and lifestyle spots in Karachi, Lahore, and Islamabad."
        keywords="advertise Pakistan venues, featured restaurant listing, KLIspots advertising"
      />
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-sm mb-4">
            <Megaphone className="w-4 h-4" />
            For businesses
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Advertise with KLIspots</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Put your venue in front of people already looking for a place to eat, shop, or go out.
            Tell us the package and we will reply with availability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {packages.map((item) => (
            <div key={item.name} className="border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-1">{item.name}</h2>
              <p className="text-emerald-700 font-semibold mb-4">{item.price}</p>
              <ul className="space-y-2">
                {item.points.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="max-w-3xl bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Request a quote</h2>
          <LeadForm kind="advertise" submitLabel="Request advertising info" />
          <p className="text-sm text-gray-500 mt-4">
            Or email{' '}
            <a className="text-emerald-700 underline" href={`mailto:${SITE.email}`}>
              {SITE.email}
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Advertise;
