import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

// Basic Functional Component Placeholders for initial routing safety compilation
const Dashboard = () => <div className="p-8 text-2xl font-bold">Admin Dashboard Panel</div>;
const CreateOffer = () => <div className="p-8 text-2xl font-bold">Create Offer Workspace</div>;
const ManageOffers = () => <div className="p-8 text-2xl font-bold">Manage Existing Business Offers</div>;
const ManageBookings = () => <div className="p-8 text-2xl font-bold">Customer Reservations Tracking Engine</div>;
const PublicListing = () => <div className="p-8 text-2xl font-bold">Public Storefront Marketplace Listings</div>;
const PublicDetail = () => <div className="p-8 text-2xl font-bold">Individual Deal Detailed Specification Page</div>;
const BookingConfirm = () => <div className="p-8 text-2xl font-bold">Successful Reservation Complete Voucher</div>;

export default function App() {
  return (
    <Router>
      <Routes>
      
        <Route path="/login" element={<Login />} />
        <Route path="/offers" element={<PublicListing />} />
        <Route path="/offers/:id" element={<PublicDetail />} />
        <Route path="/bookings/confirmation" element={<BookingConfirm />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/offers/create" element={<CreateOffer />} />
          <Route path="/admin/offers/manage" element={<ManageOffers />} />
          <Route path="/admin/bookings" element={<ManageBookings />} />
        </Route>

     
        <Route path="*" element={<Navigate to="/offers" replace />} />
      </Routes>
    </Router>
  );
}
