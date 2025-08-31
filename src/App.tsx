import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";


import LoadingSpinner from './components/ui/loading-spinner';
import PerformanceMonitor from './components/ui/performance-monitor';
import ScrollToTop from './components/shared/ScrollToTop';

// Lazy load all detail and listing pages for better performance
const RestaurantDetail = lazy(() => import("./pages/RestaurantDetail"));
const RestaurantListing = lazy(() => import("./pages/RestaurantListing"));
const CafeDetail = lazy(() => import("./pages/CafeDetail"));
const CafeListing = lazy(() => import("./pages/CafeListing"));
const ShoppingListing = lazy(() => import("./pages/ShoppingListing"));
const ShoppingDetail = lazy(() => import("./pages/ShoppingDetail"));
const EntertainmentListing = lazy(() => import("./pages/EntertainmentListing"));
const EntertainmentDetail = lazy(() => import("./pages/EntertainmentDetail"));
const HealthWellnessListing = lazy(() => import("./pages/HealthWellnessListing"));
const HealthWellnessDetail = lazy(() => import("./pages/HealthWellnessDetail"));
const ArtsCultureListing = lazy(() => import("./pages/ArtsCultureListing"));
const ArtsCultureDetail = lazy(() => import("./pages/ArtsCultureDetail"));
const SportsFitnessListing = lazy(() => import("./pages/SportsFitnessListing"));
const SportsFitnessDetail = lazy(() => import("./pages/SportsFitnessDetail"));
const About = lazy(() => import("./pages/About"));
const Cities = lazy(() => import("./pages/Cities"));
const CityDetail = lazy(() => import("./pages/CityDetail"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
import './App.css';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <PerformanceMonitor />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={
            <Suspense fallback={<LoadingSpinner />}>
              <About />
            </Suspense>
          } />
          <Route path="/cities" element={
            <Suspense fallback={<LoadingSpinner />}>
              <Cities />
            </Suspense>
          } />
          <Route path="/cities/:cityName" element={
            <Suspense fallback={<LoadingSpinner />}>
              <CityDetail />
            </Suspense>
          } />
          <Route path="/search" element={
            <Suspense fallback={<LoadingSpinner />}>
              <SearchResults />
            </Suspense>
          } />


          
          {/* Lazy-loaded routes with Suspense boundaries */}
          <Route path="/restaurant/:id" element={
            <Suspense fallback={<LoadingSpinner />}>
              <RestaurantDetail />
            </Suspense>
          } />
          <Route path="/restaurants" element={
            <Suspense fallback={<LoadingSpinner />}>
              <RestaurantListing />
            </Suspense>
          } />
          <Route path="/cafe/:id" element={
            <Suspense fallback={<LoadingSpinner />}>
              <CafeDetail />
            </Suspense>
          } />
          <Route path="/cafes" element={
            <Suspense fallback={<LoadingSpinner />}>
              <CafeListing />
            </Suspense>
          } />
          <Route path="/shopping" element={
            <Suspense fallback={<LoadingSpinner />}>
              <ShoppingListing />
            </Suspense>
          } />
          <Route path="/shopping/:id" element={
            <Suspense fallback={<LoadingSpinner />}>
              <ShoppingDetail />
            </Suspense>
          } />
          <Route path="/entertainment" element={
            <Suspense fallback={<LoadingSpinner />}>
              <EntertainmentListing />
            </Suspense>
          } />
          <Route path="/entertainment/:id" element={
            <Suspense fallback={<LoadingSpinner />}>
              <EntertainmentDetail />
            </Suspense>
          } />
          <Route path="/health-wellness" element={
            <Suspense fallback={<LoadingSpinner />}>
              <HealthWellnessListing />
            </Suspense>
          } />
          <Route path="/health-wellness/:id" element={
            <Suspense fallback={<LoadingSpinner />}>
              <HealthWellnessDetail />
            </Suspense>
          } />
          <Route path="/arts-culture" element={
            <Suspense fallback={<LoadingSpinner />}>
              <ArtsCultureListing />
            </Suspense>
          } />
          <Route path="/arts-culture/:id" element={
            <Suspense fallback={<LoadingSpinner />}>
              <ArtsCultureDetail />
            </Suspense>
          } />
          <Route path="/sports-fitness" element={
            <Suspense fallback={<LoadingSpinner />}>
              <SportsFitnessListing />
            </Suspense>
          } />
          <Route path="/sports-fitness/:id" element={
            <Suspense fallback={<LoadingSpinner />}>
              <SportsFitnessDetail />
            </Suspense>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
