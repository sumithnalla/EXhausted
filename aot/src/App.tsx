import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import VenueSpaces from './components/Artists';
import Venue from './components/Venue';
import Gallery from './components/Gallery';
import Footer from './components/Footer';
import AddOns from './components/AddOns';
import BookingSuccess from './components/BookingSuccess';
import NotFound from './components/NotFound';

// Lazy load non-critical components
const PaymentPage = React.lazy(() => import('./components/PaymentPage'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-t-pink-500 border-gray-800 rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Routes>
          <Route 
            path="/payment" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <PaymentPage />
              </Suspense>
            } 
          />
          <Route path="/add-ons" element={<AddOns />} />
          <Route path="/booking-success" element={<BookingSuccess />} />
          <Route
            path="/"
            element={
              <>
                <Header />
                <main>
                  <Hero />
                  <VenueSpaces />
                  <Venue />
                  <Gallery />
                </main>
                <Footer />
              </>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;