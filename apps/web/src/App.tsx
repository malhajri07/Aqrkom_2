import { Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { PublicLayout } from './components/PublicLayout';
import { AdminLayout } from './components/AdminLayout';

// Public pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { SearchMap } from './pages/SearchMap';
import { BrokerRegister } from './pages/BrokerRegister';
import { PublicRequest } from './pages/PublicRequest';
import { SubmitListing } from './pages/SubmitListing';

// Platform pages (broker/agent)
import { Dashboard } from './pages/Dashboard';
import { Properties } from './pages/Properties';
import { PropertyDetail } from './pages/PropertyDetail';
import { PropertyForm } from './pages/PropertyForm';
import { Requests } from './pages/Requests';
import { RequestDetail } from './pages/RequestDetail';
import { RequestSubmit } from './pages/RequestSubmit';
import { Contacts } from './pages/Contacts';
import { ContactDetail } from './pages/ContactDetail';
import { Pipeline } from './pages/Pipeline';
import { Transactions } from './pages/Transactions';
import { TransactionDetail } from './pages/TransactionDetail';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';

// Admin pages
import { AdminDashboard } from './pages/AdminDashboard';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Routes>
          {/* Public pages - no auth */}
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<BrokerRegister />} />
          <Route path="/search" element={<PublicLayout><SearchMap /></PublicLayout>} />
          <Route path="/submit-request" element={<PublicLayout><PublicRequest /></PublicLayout>} />
          <Route path="/submit-listing" element={<PublicLayout><SubmitListing /></PublicLayout>} />

          {/* Platform pages - broker/agent auth required */}
          <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
          <Route path="/properties" element={<ProtectedRoute><Layout><Properties /></Layout></ProtectedRoute>} />
          <Route path="/properties/new" element={<ProtectedRoute><Layout><PropertyForm /></Layout></ProtectedRoute>} />
          <Route path="/properties/:id" element={<ProtectedRoute><Layout><PropertyDetail /></Layout></ProtectedRoute>} />
          <Route path="/properties/:id/edit" element={<ProtectedRoute><Layout><PropertyForm /></Layout></ProtectedRoute>} />
          <Route path="/requests" element={<ProtectedRoute><Layout><Requests /></Layout></ProtectedRoute>} />
          <Route path="/requests/new" element={<ProtectedRoute><Layout><RequestSubmit /></Layout></ProtectedRoute>} />
          <Route path="/requests/:id" element={<ProtectedRoute><Layout><RequestDetail /></Layout></ProtectedRoute>} />
          <Route path="/contacts" element={<ProtectedRoute><Layout><Contacts /></Layout></ProtectedRoute>} />
          <Route path="/contacts/:id" element={<ProtectedRoute><Layout><ContactDetail /></Layout></ProtectedRoute>} />
          <Route path="/pipeline" element={<ProtectedRoute><Layout><Pipeline /></Layout></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute><Layout><Transactions /></Layout></ProtectedRoute>} />
          <Route path="/transactions/:id" element={<ProtectedRoute><Layout><TransactionDetail /></Layout></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Layout><Reports /></Layout></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />

          {/* Admin pages */}
          <Route path="/admin" element={<ProtectedRoute><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />

          {/* Catch-all: redirect to landing */}
          <Route path="*" element={<Navigate to="/landing" replace />} />
        </Routes>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
