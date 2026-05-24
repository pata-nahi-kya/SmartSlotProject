import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import apiClient from '../../api/apiClient';
import { type BookingResponseDto } from '../../types/apiTypes';
import { 
  Calendar, 
  Phone, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Search,
  TrendingUp,
  ArrowUpDown,
  Download,
  Eye
} from 'lucide-react';

export default function ManageBookings() {
  const [bookings, setBookings] = useState<BookingResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const fetchBookings = () => {
    setIsLoading(true);
    apiClient.get('/booking')
      .then(res => {
        setBookings(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleStatusChange = async (id: string, nextStatus: string) => {
    try {
      await apiClient.put(`/booking/${id}/status`, { status: nextStatus });
      fetchBookings();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Unable to update booking status. Please try again.');
    }
  };

  // Get status badge configuration
  const getStatusConfig = (status: string) => {
    const config: Record<string, { color: string; icon: any; label: string; bgClass: string; textClass: string }> = {
      pending: { 
        color: 'amber', 
        icon: Clock, 
        label: 'Pending', 
        bgClass: 'bg-amber-50', 
        textClass: 'text-amber-700' 
      },
      confirmed: { 
        color: 'green', 
        icon: CheckCircle, 
        label: 'Confirmed', 
        bgClass: 'bg-green-50', 
        textClass: 'text-green-700' 
      },
      cancelled: { 
        color: 'red', 
        icon: XCircle, 
        label: 'Cancelled', 
        bgClass: 'bg-red-50', 
        textClass: 'text-red-700' 
      },
      completed: { 
        color: 'blue', 
        icon: CheckCircle, 
        label: 'Completed', 
        bgClass: 'bg-blue-50', 
        textClass: 'text-blue-700' 
      }
    };
    return config[status.toLowerCase()] || config.pending;
  };

  // Filter and sort bookings
  const filteredBookings = bookings
    .filter(booking => {
      const matchesSearch = booking.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           booking.customerPhone?.includes(searchTerm) ||
                           booking.bookingReference?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !statusFilter || booking.status?.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return (a.customerName || '').localeCompare(b.customerName || '');
      }
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

  // Statistics
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status?.toLowerCase() === 'pending').length,
    confirmed: bookings.filter(b => b.status?.toLowerCase() === 'confirmed').length,
    completed: bookings.filter(b => b.status?.toLowerCase() === 'completed').length,
    cancelled: bookings.filter(b => b.status?.toLowerCase() === 'cancelled').length,
    totalPax: bookings.reduce((sum, b) => sum + (b.peopleCount || 0), 0)
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const config = getStatusConfig(status);
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${config.bgClass} ${config.textClass}`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30">
      <Sidebar />
      
      <main className="flex-1 p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-6 w-6 text-blue-600" />
                <h2 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Reservations Control Engine
                </h2>
              </div>
              <p className="text-gray-500 mt-1">Monitor, manage, and update booking statuses in real-time</p>
            </div>
            
            <button 
              onClick={() => {/* Export functionality */}}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:shadow-md transition-all duration-200"
            >
              <Download className="h-4 w-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Bookings</p>
                <p className="text-2xl font-black text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Guests</p>
                <p className="text-2xl font-black text-gray-900 mt-1">{stats.totalPax}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pending</p>
                <p className="text-2xl font-black text-amber-600 mt-1">{stats.pending}</p>
              </div>
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Confirmed</p>
                <p className="text-2xl font-black text-green-600 mt-1">{stats.confirmed}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Completed</p>
                <p className="text-2xl font-black text-blue-600 mt-1">{stats.completed}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, phone, or booking reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200"
            />
          </div>
          
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div className="sm:w-40">
            <button
              onClick={() => setSortBy(sortBy === 'date' ? 'name' : 'date')}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white/80 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <ArrowUpDown className="h-4 w-4" />
              Sort by {sortBy === 'date' ? 'Date' : 'Name'}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 bg-white/40 backdrop-blur-sm rounded-2xl">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
            </div>
            <p className="mt-4 text-gray-500">Loading bookings...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredBookings.length === 0 && (
          <div className="text-center py-20 bg-white/40 backdrop-blur-sm rounded-2xl">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No bookings found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter ? 'Try adjusting your filters' : 'No reservations have been made yet'}
            </p>
          </div>
        )}

        {/* Bookings Table */}
        {!isLoading && filteredBookings.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gradient-to-r from-gray-50 to-white border-b-2 border-gray-100">
                  <tr>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Reference</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer Details</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Party</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-600 divide-y divide-gray-100">
                  {filteredBookings.map((booking) => (
                      <tr 
                        key={booking.id} 
                        className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent transition-all duration-200 group"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                              {booking.bookingReference || `BK-${booking.id?.slice(-6)}`}
                            </span>
                          </div>
                        </td>
                        
                        <td className="p-4">
                          <div>
                            <p className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                              {booking.customerName}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {new Date(booking.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </td>
                        
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5 text-gray-400" />
                            <span className="font-medium">{booking.customerPhone}</span>
                          </div>
                        </td>
                        
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Users className="h-3.5 w-3.5 text-gray-400" />
                            <span className="font-bold">{booking.peopleCount || 1} Pax</span>
                          </div>
                        </td>
                        
                        <td className="p-4">
                          <StatusBadge status={booking.status || 'pending'} />
                        </td>
                        
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <select
                              value={booking.status}
                              onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                              className="rounded-lg border border-gray-200 p-2 text-xs focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                              <option value="NoShow">No Show</option>
                            </select>
                            <button
                              onClick={() => setShowDetails(showDetails === booking.id ? null : booking.id)}
                              className="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                  ))}
                </tbody>
               </table>
            </div>
          </div>
        )}

        {/* Expanded Details View */}
        {showDetails && (
          <div className="mt-4 bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-gray-800">Booking Details</h4>
              <button 
                onClick={() => setShowDetails(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {bookings.find(b => b.id === showDetails) && (
                <>
                  <div>
                    <p className="text-gray-500">Booking Reference</p>
                    <p className="font-mono font-semibold text-gray-800">
                      {bookings.find(b => b.id === showDetails)?.bookingReference}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Created At</p>
                    <p className="text-gray-800">
                      {new Date(bookings.find(b => b.id === showDetails)?.createdAt || '').toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Status</p>
                    <p className="text-gray-800 font-semibold">
                      {bookings.find(b => b.id === showDetails)?.status}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Footer Stats */}
        {!isLoading && filteredBookings.length > 0 && (
          <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
            <span>Showing {filteredBookings.length} of {bookings.length} bookings</span>
            <div className="flex gap-3">
              <span>✓ Confirmed: {stats.confirmed}</span>
              <span>⏳ Pending: {stats.pending}</span>
              <span>✔ Completed: {stats.completed}</span>
              <span>✗ Cancelled: {stats.cancelled}</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}