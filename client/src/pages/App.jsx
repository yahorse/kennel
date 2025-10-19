import { Routes, Route, Navigate } from 'react-router-dom';

import AppLayout from '../layouts/AppLayout.jsx';
import ClientDashboard from './ClientDashboard.jsx';
import PetManagement from './PetManagement.jsx';
import NewBookingWizard from './NewBooking/NewBookingWizard.jsx';
import AdminDashboard from './admin/AdminDashboard.jsx';
import BookingManagement from './admin/BookingManagement.jsx';
import PetRoster from './admin/PetRoster.jsx';

const App = () => (
  <AppLayout>
    <Routes>
      <Route path="/" element={<ClientDashboard />} />
      <Route path="/pets" element={<PetManagement />} />
      <Route path="/bookings/new" element={<NewBookingWizard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/bookings" element={<BookingManagement />} />
      <Route path="/admin/roster" element={<PetRoster />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </AppLayout>
);

export default App;
