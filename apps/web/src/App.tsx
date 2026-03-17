import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { PublicLayout } from './components/PublicLayout';
import { AdminLayout } from './components/AdminLayout';

// Lazy-loaded pages for code-splitting
const Landing = lazy(() => import('./pages/Landing').then((m) => ({ default: m.Landing })));
const Login = lazy(() => import('./pages/Login').then((m) => ({ default: m.Login })));
const SearchMap = lazy(() => import('./pages/SearchMap').then((m) => ({ default: m.SearchMap })));
const BrokerRegister = lazy(() => import('./pages/BrokerRegister').then((m) => ({ default: m.BrokerRegister })));
const PublicRequest = lazy(() => import('./pages/PublicRequest').then((m) => ({ default: m.PublicRequest })));
const SubmitListing = lazy(() => import('./pages/SubmitListing').then((m) => ({ default: m.SubmitListing })));
const Dashboard = lazy(() => import('./pages/Dashboard').then((m) => ({ default: m.Dashboard })));
const Properties = lazy(() => import('./pages/Properties').then((m) => ({ default: m.Properties })));
const PropertyDetail = lazy(() => import('./pages/PropertyDetail').then((m) => ({ default: m.PropertyDetail })));
const PropertyForm = lazy(() => import('./pages/PropertyForm').then((m) => ({ default: m.PropertyForm })));
const Requests = lazy(() => import('./pages/Requests').then((m) => ({ default: m.Requests })));
const RequestDetail = lazy(() => import('./pages/RequestDetail').then((m) => ({ default: m.RequestDetail })));
const RequestSubmit = lazy(() => import('./pages/RequestSubmit').then((m) => ({ default: m.RequestSubmit })));
const Contacts = lazy(() => import('./pages/Contacts').then((m) => ({ default: m.Contacts })));
const ContactDetail = lazy(() => import('./pages/ContactDetail').then((m) => ({ default: m.ContactDetail })));
const Pipeline = lazy(() => import('./pages/Pipeline').then((m) => ({ default: m.Pipeline })));
const Transactions = lazy(() => import('./pages/Transactions').then((m) => ({ default: m.Transactions })));
const TransactionDetail = lazy(() => import('./pages/TransactionDetail').then((m) => ({ default: m.TransactionDetail })));
const RentRoll = lazy(() => import('./pages/RentRoll').then((m) => ({ default: m.RentRoll })));
const DocumentLibrary = lazy(() => import('./pages/DocumentLibrary').then((m) => ({ default: m.DocumentLibrary })));
const Reports = lazy(() => import('./pages/Reports').then((m) => ({ default: m.Reports })));
const Settings = lazy(() => import('./pages/Settings').then((m) => ({ default: m.Settings })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));

function PageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="animate-spin w-10 h-10 border-2 border-holly-600 border-t-transparent rounded-full" />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Suspense fallback={<PageFallback />}>
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
          <Route path="/rent-roll" element={<ProtectedRoute><Layout><RentRoll /></Layout></ProtectedRoute>} />
          <Route path="/documents" element={<ProtectedRoute><Layout><DocumentLibrary /></Layout></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Layout><Reports /></Layout></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />

          {/* Admin pages */}
          <Route path="/admin" element={<ProtectedRoute><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />

          {/* Catch-all: redirect to landing */}
          <Route path="*" element={<Navigate to="/landing" replace />} />
        </Routes>
        </Suspense>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
