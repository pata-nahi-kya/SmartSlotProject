import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import apiClient from '../../api/apiClient';
import {
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Sparkles,
} from 'lucide-react';

const defaultForm = {
  name: '',
  businessType: '',
  ownerName: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  openingTime: '09:00',
  closingTime: '21:00',
};

export default function CreateBusiness() {
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultForm);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const toTimeSpan = (time: string) => (time.length === 5 ? `${time}:00` : time);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (form.openingTime >= form.closingTime) {
      setMessage({ type: 'error', text: 'Closing time must be after opening time.' });
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiClient.post('/business', {
        name: form.name.trim(),
        businessType: form.businessType.trim(),
        ownerName: form.ownerName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        openingTime: toTimeSpan(form.openingTime),
        closingTime: toTimeSpan(form.closingTime),
      });

      setMessage({
        type: 'success',
        text: `Business "${res.data.name}" created successfully. You can now create offers for it.`,
      });
      setForm(defaultForm);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to create business. Please check your inputs.';
      setMessage({ type: 'error', text: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30">
      <Sidebar />

      <main className="flex-1 p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="h-6 w-6 text-blue-600" />
              <h2 className="text-3xl font-black text-gray-900">Create Business</h2>
            </div>
            <p className="text-gray-500 mt-1">
              Register a business profile before creating offers and time slots
            </p>
          </div>

          {message && (
            <div
              className={`mb-6 p-4 rounded-xl border-l-4 flex items-start gap-2 ${
                message.type === 'success'
                  ? 'bg-green-50 border-green-500 text-green-700'
                  : 'bg-red-50 border-red-500 text-red-700'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle className="h-5 w-5 shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 shrink-0" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium">{message.text}</p>
                {message.type === 'success' && (
                  <button
                    type="button"
                    onClick={() => navigate('/admin/offers/create')}
                    className="mt-2 text-sm font-semibold text-green-800 underline hover:no-underline"
                  >
                    Create an offer for this business →
                  </button>
                )}
              </div>
              <button type="button" onClick={() => setMessage(null)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="bg-white/80 backdrop-blur-sm rounded-2xl border shadow-xl p-6 lg:p-8 space-y-5"
          >
            <div>
              <label className="text-xs font-bold uppercase text-gray-600 mb-2 block">
                <Building2 className="inline h-3 w-3 mr-1" /> Business Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                placeholder="e.g. Sunset Spa & Wellness"
                className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold uppercase text-gray-600 mb-2 block">Business Type</label>
                <input
                  type="text"
                  value={form.businessType}
                  onChange={(e) => setForm({ ...form, businessType: e.target.value })}
                  required
                  placeholder="Spa, Restaurant, Salon..."
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-gray-600 mb-2 block">
                  <User className="inline h-3 w-3 mr-1" /> Owner Name
                </label>
                <input
                  type="text"
                  value={form.ownerName}
                  onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                  required
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold uppercase text-gray-600 mb-2 block">
                  <Phone className="inline h-3 w-3 mr-1" /> Phone
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-gray-600 mb-2 block">
                  <Mail className="inline h-3 w-3 mr-1" /> Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-gray-600 mb-2 block">
                <MapPin className="inline h-3 w-3 mr-1" /> Address
              </label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                required
                className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-gray-600 mb-2 block">City</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                required
                placeholder="Mumbai"
                className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold uppercase text-gray-600 mb-2 block">
                  <Clock className="inline h-3 w-3 mr-1" /> Opening Time
                </label>
                <input
                  type="time"
                  value={form.openingTime}
                  onChange={(e) => setForm({ ...form, openingTime: e.target.value })}
                  required
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-gray-600 mb-2 block">Closing Time</label>
                <input
                  type="time"
                  value={form.closingTime}
                  onChange={(e) => setForm({ ...form, closingTime: e.target.value })}
                  required
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Create Business
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setForm(defaultForm)}
                className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50"
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
