import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { SITE } from '@/lib/site';

export type LeadFormKind = 'list' | 'advertise' | 'contact';

interface LeadFormProps {
  kind: LeadFormKind;
  submitLabel?: string;
}

const SUBJECTS: Record<LeadFormKind, string> = {
  list: 'KLIspots: List my business',
  advertise: 'KLIspots: Advertising inquiry',
  contact: 'KLIspots: Contact form',
};

const LeadForm = ({ kind, submitLabel = 'Send request' }: LeadFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    business: '',
    city: 'Karachi',
    category: 'Restaurants',
    package: 'Featured listing',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload: Record<string, string> = {
        _subject: SUBJECTS[kind],
        _template: 'table',
        _captcha: 'false',
        kind,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      };

      if (kind === 'list') {
        payload.business = formData.business;
        payload.city = formData.city;
        payload.category = formData.category;
      }

      if (kind === 'advertise') {
        payload.business = formData.business;
        payload.package = formData.package;
        payload.city = formData.city;
      }

      const response = await fetch(SITE.formEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Form service rejected the request');
      }

      toast({
        title: 'Request sent',
        description: `We’ll reply at ${formData.email}. Check ${SITE.email} if this is your first submit — FormSubmit needs one confirmation.`,
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        business: '',
        city: 'Karachi',
        category: 'Restaurants',
        package: 'Featured listing',
        message: '',
      });
    } catch {
      toast({
        title: 'Could not send from the browser',
        description: `Email us directly at ${SITE.email} and we will get back to you.`,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={`${kind}-name`} className="block text-sm font-medium text-gray-700 mb-2">
            Your name *
          </label>
          <Input
            id={`${kind}-name`}
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Full name"
          />
        </div>
        <div>
          <label htmlFor={`${kind}-email`} className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <Input
            id={`${kind}-email`}
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="you@business.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={`${kind}-phone`} className="block text-sm font-medium text-gray-700 mb-2">
            WhatsApp / phone *
          </label>
          <Input
            id={`${kind}-phone`}
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="+92 3XX XXXXXXX"
          />
        </div>
        {(kind === 'list' || kind === 'advertise') && (
          <div>
            <label htmlFor={`${kind}-business`} className="block text-sm font-medium text-gray-700 mb-2">
              Business name *
            </label>
            <Input
              id={`${kind}-business`}
              name="business"
              required
              value={formData.business}
              onChange={handleChange}
              placeholder="Venue or brand name"
            />
          </div>
        )}
      </div>

      {kind === 'list' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${kind}-city`} className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <select
              id={`${kind}-city`}
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              {SITE.cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`${kind}-category`} className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id={`${kind}-category`}
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option>Restaurants</option>
              <option>Cafes</option>
              <option>Shopping</option>
              <option>Entertainment</option>
              <option>Health & Wellness</option>
              <option>Arts & Culture</option>
              <option>Sports & Fitness</option>
            </select>
          </div>
        </div>
      )}

      {kind === 'advertise' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${kind}-package`} className="block text-sm font-medium text-gray-700 mb-2">
              Package
            </label>
            <select
              id={`${kind}-package`}
              name="package"
              value={formData.package}
              onChange={handleChange}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option>Featured listing</option>
              <option>Homepage spotlight</option>
              <option>Category banner</option>
              <option>Custom campaign</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${kind}-ad-city`} className="block text-sm font-medium text-gray-700 mb-2">
              Target city
            </label>
            <select
              id={`${kind}-ad-city`}
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option>All cities</option>
              {SITE.cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div>
        <label htmlFor={`${kind}-message`} className="block text-sm font-medium text-gray-700 mb-2">
          Details
        </label>
        <Textarea
          id={`${kind}-message`}
          name="message"
          rows={5}
          value={formData.message}
          onChange={handleChange}
          placeholder={
            kind === 'list'
              ? 'Address, hours, website, and anything we should highlight.'
              : kind === 'advertise'
                ? 'Budget, dates, and what you want to promote.'
                : 'How can we help?'
          }
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700"
      >
        {isSubmitting ? 'Sending…' : submitLabel}
      </Button>
    </form>
  );
};

export default LeadForm;
