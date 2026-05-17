import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TripProvider } from './context/TripContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import { FullPageSpinner } from './components/ui/Spinner';

// Lazy-loaded pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CreateTripPage = lazy(() => import('./pages/CreateTripPage'));
const TripDetailPage = lazy(() => import('./pages/TripDetailPage'));
const ItineraryPage = lazy(() => import('./pages/ItineraryPage'));
const BudgetPage = lazy(() => import('./pages/BudgetPage'));
const PackingPage = lazy(() => import('./pages/PackingPage'));

export default function App() {
  return (
    <AuthProvider>
      <TripProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-navy-950">
            <Navbar />
            <Suspense fallback={<FullPageSpinner />}>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/* Protected routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute><Dashboard /></ProtectedRoute>
                } />
                <Route path="/trips/new" element={
                  <ProtectedRoute><CreateTripPage /></ProtectedRoute>
                } />
                <Route path="/trips/:id" element={
                  <ProtectedRoute><TripDetailPage /></ProtectedRoute>
                } />
                <Route path="/trips/:id/itinerary" element={
                  <ProtectedRoute><ItineraryPage /></ProtectedRoute>
                } />
                <Route path="/trips/:id/budget" element={
                  <ProtectedRoute><BudgetPage /></ProtectedRoute>
                } />
                <Route path="/trips/:id/packing" element={
                  <ProtectedRoute><PackingPage /></ProtectedRoute>
                } />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </div>
        </BrowserRouter>
      </TripProvider>
    </AuthProvider>
  );
}
