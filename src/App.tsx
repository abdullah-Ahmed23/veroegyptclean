import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { useUIStore } from "@/lib/store";
import { Layout } from "@/components/layout/Layout";
import { GlitchTransition } from "@/components/layout/GlitchTransition";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { CustomCursor } from "@/components/ui/CustomCursor";

import "@/lib/i18n";

import { useAuthStore } from "@/lib/authStore";
import { usePresenceTracking } from "@/hooks/usePresence";

const queryClient = new QueryClient();

// Lazy Load Pages
const Index = lazy(() => import("@/pages/Index"));
const Shop = lazy(() => import("@/pages/Shop"));
const Product = lazy(() => import("@/pages/Product"));
const Collection = lazy(() => import("@/pages/Collection"));
const Cart = lazy(() => import("@/pages/Cart"));
const BrandStory = lazy(() => import("@/pages/BrandStory"));
const Lookbook = lazy(() => import("@/pages/Lookbook"));
const Policy = lazy(() => import("@/pages/Policy"));
const FAQ = lazy(() => import("@/pages/FAQ"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const CustomStudio = lazy(() => import("@/pages/CustomStudio"));
const Checkout = lazy(() => import("@/pages/Checkout"));
const Contact = lazy(() => import("@/pages/Contact"));

// Admin Pages
const AdminLogin = lazy(() => import("@/pages/admin/Login"));
const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const AdminCategories = lazy(() => import("@/pages/admin/Categories"));
const AdminProducts = lazy(() => import("@/pages/admin/Products"));
const AdminOrders = lazy(() => import("@/pages/admin/Orders"));
const AdminCustomDesigns = lazy(() => import("@/pages/admin/CustomDesigns"));
const AdminCustomDesignDetail = lazy(() => import("@/pages/admin/CustomDesignDetail"));
const AdminFeedbacks = lazy(() => import("@/pages/admin/Feedbacks"));
const AdminLayout = lazy(() => import("@/components/admin/AdminLayout"));

const AppContent = () => {
  const { isDarkMode, language } = useUIStore();
  const { initialize } = useAuthStore();
  const location = useLocation();
  const [isLoading, setIsLoading] = React.useState(true);
  const isFirstRender = React.useRef(true);

  usePresenceTracking();

  useEffect(() => {
    initialize();
  }, [initialize]);

  React.useLayoutEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);

    let timer: any;

    if (isFirstRender.current) {
      // Initial Load - 3 Seconds
      setIsLoading(true);
      timer = setTimeout(() => {
        setIsLoading(false);
        isFirstRender.current = false;
      }, 3000);
    } else {
      // Route Change - 2 Seconds
      setIsLoading(true);
      timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);
    }

    return () => clearTimeout(timer);
  }, [location.pathname]);

  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    if (!isAdminRoute) {
      document.body.classList.add('custom-cursor-area');
    } else {
      document.body.classList.remove('custom-cursor-area');
    }
  }, [isDarkMode, isAdminRoute]);

  // Handle RTL/LTR direction
  useEffect(() => {
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  return (
    <>
      {!isAdminRoute && <CustomCursor />}

      {/* Global Glitch Overlay */}
      <AnimatePresence mode="wait">
        {isLoading && !isAdminRoute && <GlitchTransition key="loader" />}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {(!isLoading || isAdminRoute) && (
          <Routes location={location} key={location.pathname}>
            {/* Storefront Routes */}
            <Route element={<Layout />}>
              <Route path="/" element={
                <PageWrapper>
                  <Suspense fallback={null}>
                    <Index />
                  </Suspense>
                </PageWrapper>
              } />
              <Route path="/shop" element={
                <PageWrapper>
                  <Suspense fallback={null}>
                    <Shop />
                  </Suspense>
                </PageWrapper>
              } />
              <Route path="/product/:handle" element={
                <PageWrapper>
                  <Suspense fallback={null}>
                    <Product />
                  </Suspense>
                </PageWrapper>
              } />
              <Route path="/collections/:handle" element={
                <PageWrapper>
                  <Suspense fallback={null}>
                    <Collection />
                  </Suspense>
                </PageWrapper>
              } />
              <Route path="/cart" element={
                <PageWrapper>
                  <Suspense fallback={null}>
                    <Cart />
                  </Suspense>
                </PageWrapper>
              } />
              <Route path="/brand-story" element={
                <PageWrapper>
                  <Suspense fallback={null}>
                    <BrandStory />
                  </Suspense>
                </PageWrapper>
              } />
              <Route path="/lookbook" element={
                <PageWrapper>
                  <Suspense fallback={null}>
                    <Lookbook />
                  </Suspense>
                </PageWrapper>
              } />
              <Route path="/policies/:type" element={
                <PageWrapper>
                  <Suspense fallback={null}>
                    <Policy />
                  </Suspense>
                </PageWrapper>
              } />
              <Route path="/faq" element={
                <PageWrapper>
                  <Suspense fallback={<div className="pt-24 text-center">Loading FAQ...</div>}>
                    <FAQ />
                  </Suspense>
                </PageWrapper>
              } />
              <Route path="/custom-studio" element={
                <PageWrapper>
                  <Suspense fallback={null}>
                    <CustomStudio />
                  </Suspense>
                </PageWrapper>
              } />
              <Route path="/contact" element={
                <PageWrapper>
                  <Suspense fallback={null}>
                    <Contact />
                  </Suspense>
                </PageWrapper>
              } />
              <Route path="/checkout" element={
                <PageWrapper>
                  <Suspense fallback={null}>
                    <Checkout />
                  </Suspense>
                </PageWrapper>
              } />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin/login" element={
              <Suspense fallback={null}>
                <AdminLogin />
              </Suspense>
            } />
            <Route path="/admin" element={
              <Suspense fallback={null}>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </Suspense>
            } />
            <Route path="/admin/categories" element={
              <Suspense fallback={null}>
                <AdminLayout>
                  <AdminCategories />
                </AdminLayout>
              </Suspense>
            } />
            <Route path="/admin/products" element={
              <Suspense fallback={null}>
                <AdminLayout>
                  <AdminProducts />
                </AdminLayout>
              </Suspense>
            } />
            <Route path="/admin/orders" element={
              <Suspense fallback={null}>
                <AdminLayout>
                  <AdminOrders />
                </AdminLayout>
              </Suspense>
            } />
            <Route path="/admin/custom-designs" element={
              <Suspense fallback={null}>
                <AdminLayout>
                  <AdminCustomDesigns />
                </AdminLayout>
              </Suspense>
            } />
            <Route path="/admin/custom-designs/:id" element={
              <Suspense fallback={null}>
                <AdminLayout>
                  <AdminCustomDesignDetail />
                </AdminLayout>
              </Suspense>
            } />
            <Route path="/admin/feedbacks" element={
              <Suspense fallback={null}>
                <AdminLayout>
                  <AdminFeedbacks />
                </AdminLayout>
              </Suspense>
            } />

            <Route path="*" element={
              <PageWrapper>
                <Suspense fallback={null}>
                  <NotFound />
                </Suspense>
              </PageWrapper>
            } />
          </Routes>
        )}
      </AnimatePresence>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
