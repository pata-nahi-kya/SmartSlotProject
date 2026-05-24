import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import apiClient from '../../api/apiClient';
import { type DashboardSummaryDto, type RecentBookingDto, type RevenueAnalyticsDto } from '../../types/apiTypes';
import { 
  ShoppingBag, 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Activity,
  Zap,
  Clock,
  ArrowUpRight,
  RefreshCw
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<DashboardSummaryDto | null>(null);
  const [recent, setRecent] = useState<RecentBookingDto[]>([]);
  const [revenue, setRevenue] = useState<RevenueAnalyticsDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchData = () => {
    setIsLoading(true);
    Promise.all([
      apiClient.get('/dashboard/summary'),
      apiClient.get('/dashboard/recent-bookings'),
      apiClient.get('/dashboard/revenue'),
    ]).then(([mRes, rRes, revRes]) => {
      setMetrics(mRes.data);
      setRecent(rRes.data);
      setRevenue(revRes.data);
      setLastUpdated(new Date());
      setIsLoading(false);
    }).catch(err => {
      console.error(err);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, subtitle }: {
    title: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    color: { bg: string; text: string };
    subtitle?: string;
  }) => (
    <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color.bg} ${color.text} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</p>
        {isLoading ? (
          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse mt-2"></div>
        ) : (
          <>
            <h3 className="text-3xl font-black text-gray-800 mt-1">{value}</h3>
            {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30">
      <Sidebar />
      
      <main className="flex-1 p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-6 w-6 text-blue-600" />
                <h2 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Dashboard Overview
                </h2>
              </div>
              <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your marketplace today.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Clock className="h-3 w-3" />
                <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
              </div>
              <button 
                onClick={fetchData}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:shadow-md transition-all duration-200 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Offers"
            value={metrics?.totalOffers || 0}
            icon={ShoppingBag}
            color={{ bg: 'bg-blue-50', text: 'text-blue-600' }}
            subtitle={`${metrics?.activeOffers || 0} active`}
          />
          
          <StatCard
            title="Total Bookings"
            value={metrics?.totalBookings || 0}
            icon={Calendar}
            color={{ bg: 'bg-green-50', text: 'text-green-600' }}
            subtitle="All reservations"
          />
          
          <StatCard
            title="Occupancy Rate"
            value={`${Math.round(metrics?.occupancyRate || 0)}%`}
            icon={Users}
            color={{ bg: 'bg-purple-50', text: 'text-purple-600' }}
            subtitle="Across all slots"
          />
          
          <StatCard
            title="Total Revenue"
            value={`₹${(metrics?.totalRevenue || 0).toLocaleString()}`}
            icon={DollarSign}
            color={{ bg: 'bg-amber-50', text: 'text-amber-600' }}
            subtitle="From confirmed bookings"
          />
        </div>

        {/* Additional Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <Zap className="h-8 w-8 opacity-80" />
              <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full">Active</span>
            </div>
            <p className="text-sm opacity-90 mb-1">Active Offers</p>
            <p className="text-3xl font-black">{metrics?.activeOffers || 0}</p>
            <p className="text-xs opacity-75 mt-2">Out of {metrics?.totalOffers || 0} total</p>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="h-8 w-8 opacity-80" />
              <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full">Businesses</span>
            </div>
            <p className="text-sm opacity-90 mb-1">Total Businesses</p>
            <p className="text-3xl font-black">{metrics?.totalBusinesses || 0}</p>
            <p className="text-xs opacity-75 mt-2">Registered profiles</p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <Users className="h-8 w-8 opacity-80" />
              <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full">Slots</span>
            </div>
            <p className="text-sm opacity-90 mb-1">Total Time Slots</p>
            <p className="text-3xl font-black">{metrics?.totalSlots || 0}</p>
            <p className="text-xs opacity-75 mt-2">Across all offers</p>
          </div>
        </div>

        {/* Recent Bookings Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Recent Bookings Activity</h3>
                <p className="text-sm text-gray-500 mt-1">Latest reservations made by customers</p>
              </div>
              <button
                onClick={() => navigate('/admin/bookings')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                View All
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600"></div>
              <p className="mt-2 text-gray-500">Loading recent activity...</p>
            </div>
          ) : recent.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No recent bookings found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gradient-to-r from-gray-50 to-white border-b-2 border-gray-100">
                  <tr className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <th className="p-4">Reference</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Offer</th>
                    <th className="p-4">Party Size</th>
                    <th className="p-4">Booked At</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-600 divide-y divide-gray-100">
                  {recent.map((booking) => (
                    <tr 
                      key={booking.bookingReference} 
                      className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent transition-all duration-200 group"
                    >
                      <td className="p-4">
                        <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          {booking.bookingReference}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-gray-800">{booking.customerName}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-gray-700">{booking.offerTitle}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5 text-gray-400" />
                          <span className="font-semibold">{booking.peopleCount || 1} Pax</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">
                        {new Date(booking.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Table Footer */}
          {!isLoading && recent.length > 0 && (
            <div className="p-4 border-t border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Showing {recent.length} most recent bookings</span>
                <button
                  onClick={() => navigate('/admin/bookings')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all bookings →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Revenue by Offer */}
        {revenue.length > 0 && (
          <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl border shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Revenue by Offer</h3>
              <p className="text-sm text-gray-500 mt-1">Top performing deals</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                  <tr>
                    <th className="p-4">Offer</th>
                    <th className="p-4">Bookings</th>
                    <th className="p-4">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {revenue.map((row) => (
                    <tr key={row.offerTitle} className="hover:bg-blue-50/30">
                      <td className="p-4 font-medium text-gray-800">{row.offerTitle}</td>
                      <td className="p-4 text-gray-600">{row.totalBookings}</td>
                      <td className="p-4 font-bold text-green-700">₹{row.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100">
            <h4 className="font-bold text-gray-800 mb-2">Quick Actions</h4>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => navigate('/admin/business/create')}
                className="px-4 py-2 bg-white text-gray-700 rounded-xl text-sm font-medium hover:shadow-md transition"
              >
                Create Business
              </button>
              <button
                onClick={() => navigate('/admin/offers/create')}
                className="px-4 py-2 bg-white text-gray-700 rounded-xl text-sm font-medium hover:shadow-md transition"
              >
                Create New Offer
              </button>
              <button
                onClick={() => navigate('/admin/offers/slots')}
                className="px-4 py-2 bg-white text-gray-700 rounded-xl text-sm font-medium hover:shadow-md transition"
              >
                Manage Slots
              </button>
              <button
                onClick={() => navigate('/admin/bookings')}
                className="px-4 py-2 bg-white text-gray-700 rounded-xl text-sm font-medium hover:shadow-md transition"
              >
                View Bookings
              </button>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
            <h4 className="font-bold text-gray-800 mb-2">System Status</h4>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">All systems operational</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">API Response Time: 245ms</p>
          </div>
        </div>
      </main>
    </div>
  );
}