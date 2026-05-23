import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import apiClient from '../../api/apiClient';
import { BookingResponseDto } from '../../types/apiTypes';

export default function ManageBookings() {
  const [bookings, setBookings] = useState<BookingResponseDto[]>([]);

  const fetchBookings = () => {
    apiClient.get('/booking').then(res => setBookings(res.data)).catch(err => console.error(err));
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleStatusChange = async (id: string, nextStatus: string) => {
    await apiClient.put(`/booking/${id}/status`, { status: nextStatus });
    fetchBookings();
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">Reservations Control Engine</h2>
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase border-b border-slate-100">
              <tr>
                <th className="p-4">Reference</th>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Phone Contact</th>
                <th className="p-4">Party Count</th>
                <th className="p-4">Current Status</th>
                <th className="p-4">Modify Execution</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-600 divide-y divide-slate-100">
              {bookings.map(b => (
                <tr key={b.id}>
                  <td className="p-4 font-mono text-xs text-blue-600 font-bold">{b.bookingReference}</td>
                  <td className="p-4 font-semibold text-slate-800">{b.customerName}</td>
                  <td className="p-4 font-medium">{b.customerPhone}</td>
                  <td className="p-4 font-bold">{b.peopleCount} Pax</td>
                  <td className="p-4"><span className="text-xs font-bold uppercase tracking-wider text-amber-600">{b.status}</span></td>
                  <td className="p-4">
                    <select value={b.status} onChange={e => handleStatusChange(b.id, e.target.value)} className="rounded-lg border border-slate-300 p-1.5 text-xs focus:ring-1 focus:ring-blue-500">
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
