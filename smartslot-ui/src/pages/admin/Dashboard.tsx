import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import apiClient from '../../api/apiClient';
import { ShoppingBag, Calendar, Users, DollarSign } from 'lucide-react';

export default function Dashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    Promise.all([
      apiClient.get('/dashboard/summary'),
      apiClient.get('/dashboard/recent-bookings')
    ]).then(([mRes, rRes]) => {
      setMetrics(mRes.data);
      setRecent(rRes.data);
    }).catch(err => console.error(err));
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">Dashboard Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Offers</p>
              <h3 className="text-3xl font-black text-slate-800 mt-1">{metrics?.totalOffers || 0}</h3>
            </div>
            <div className="p-4 bg-blue-50 text-blue-600 rounded-xl"><ShoppingBag /></div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Bookings</p>
              <h3 className="text-3xl font-black text-slate-800 mt-1">{metrics?.totalBookings || 0}</h3>
            </div>
            <div className="p-4 bg-green-50 text-green-600 rounded-xl"><Calendar /></div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Occupancy Rate</p>
              <h3 className="text-3xl font-black text-slate-800 mt-1">{metrics?.occupancyRate || 0}%</h3>
            </div>
            <div className="p-4 bg-purple-50 text-purple-600 rounded-xl"><Users /></div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Revenue</p>
              <h3 className="text-3xl font-black text-slate-800 mt-1">₹{metrics?.totalRevenue || 0}</h3>
            </div>
            <div className="p-4 bg-amber-50 text-amber-600 rounded-xl"><DollarSign /></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Bookings Activity</h3>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                <th className="p-4">Reference</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Offer</th>
                <th className="p-4">Size</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-600 divide-y divide-slate-100">
              {recent.map((b: any) => (
                <tr key={b.bookingReference}>
                  <td className="p-4 font-mono text-xs text-blue-600">{b.bookingReference}</td>
                  <td className="p-4 font-semibold">{b.customerName}</td>
                  <td className="p-4">{b.offerTitle}</td>
                  <td className="p-4">{b.peopleCount} Pax</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
