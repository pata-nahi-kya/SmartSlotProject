import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicLogin from './pages/public/PublicLogin';
import PublicRegister from './pages/public/PublicRegister';
import AdminLogin from './pages/admin/Login';
import AdminRegister from './pages/admin/AdminRegister';
import ProtectedRoute from './components/ProtectedRoute';
import OfferListing from './pages/public/OfferListing';
import OfferDetail from './pages/public/OfferDetail';
import BookingConfirmation from './pages/public/BookingConfirmation';
import Dashboard from './pages/admin/Dashboard';
import CreateBusiness from './pages/admin/CreateBusiness';
import CreateOffer from './pages/admin/CreateOffer';
import ManageOffers from './pages/admin/ManageOffers';
import ManageBookings from './pages/admin/ManageBookings';
import ManageSlots from './pages/admin/ManageSlots';
import MyBookings from './pages/public/MyBookings';
import TrackBooking from './pages/public/TrackBooking';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/offers" replace />} />
        <Route path="/login" element={<PublicLogin />} />
        <Route path="/register" element={<PublicRegister />} />
        <Route path="/offers" element={<OfferListing />} />
        <Route path="/offers/:id" element={<OfferDetail />} />
        <Route path="/bookings/confirmation" element={<BookingConfirmation />} />
        <Route path="/track-booking" element={<TrackBooking />} />

        <Route element={<ProtectedRoute allowedRole="Customer" />}>
          <Route path="/my-bookings" element={<MyBookings />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />

        <Route element={<ProtectedRoute allowedRole="Admin" />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/business/create" element={<CreateBusiness />} />
          <Route path="/admin/offers/create" element={<CreateOffer />} />
          <Route path="/admin/offers/manage" element={<ManageOffers />} />
          <Route path="/admin/offers/slots" element={<ManageSlots />} />
          <Route path="/admin/bookings" element={<ManageBookings />} />
        </Route>

        <Route path="*" element={<Navigate to="/offers" replace />} />
      </Routes>
    </Router>
  );
}
