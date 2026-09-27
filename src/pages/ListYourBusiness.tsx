import { CheckCircle, Building2 } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageSEO from '@/components/seo/PageSEO';
import LeadForm from '@/components/forms/LeadForm';
import { SITE } from '@/lib/site';

const ListYourBusiness = () => {
  return (
    <div className="min-h-screen bg-white">
      <PageSEO
        title="List Your Business on KLIspots"
        description="Add or claim your restaurant, cafe, shop, or venue on KLIspots. Reach people searching Karachi, Lahore, and Islamabad."
        keywords="list business Pakistan, claim listing KLIspots, advertise restaurant Karachi Lahore Islamabad"
      />
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-sm mb-4">
            <Building2 className="w-4 h-4" />
            For venue owners
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">List your business on KLIspots</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            {SITE.venueCountLabel} places already live across Karachi, Lahore, and Islamabad.
            Send your details and we will add or update your listing.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <LeadForm kind="list" submitLabel="Submit listing request" />
          </div>
          <aside className="lg:col-span-2 space-y-4">
            {[
              'Show up when people search your city and category',
              'Correct hours, phone, and location so they can actually visit',
              'Upgrade later to a featured or homepage spot',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                <p className="text-gray-700">{item}</p>
              </div>
            ))}
            <p className="text-sm text-gray-500 pt-4">
              Prefer email? Write to{' '}
              <a className="text-emerald-700 underline" href={`mailto:${SITE.email}`}>
                {SITE.email}
              </a>
            </p>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ListYourBusiness;
