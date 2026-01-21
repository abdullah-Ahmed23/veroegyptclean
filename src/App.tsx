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

const queryClient = new QueryClient();

// Lazy Load Pages
const Index = lazy(() => import("./pages/Index"));
const Shop = lazy(() => import("./pages/Shop"));
const Product = lazy(() => import("./pages/Product"));
const Collection = lazy(() => import("./pages/Collection"));
const Cart = lazy(() => import("./pages/Cart"));
const BrandStory = lazy(() => import("./pages/BrandStory"));
const Lookbook = lazy(() => import("./pages/Lookbook"));
const Policy = lazy(() => import("./pages/Policy"));
const NotFound = lazy(() => import("./pages/NotFound"));

const AppContent = () => {
  const { isDarkMode } = useUIStore();
  const location = useLocation();
  const [isLoading, setIsLoading] = React.useState(true);
  const isFirstRender = React.useRef(true);

  React.useLayoutEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);

    let timer: NodeJS.Timeout;

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

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    document.body.style.cursor = 'none';
    return () => { document.body.style.cursor = 'auto'; };
  }, [isDarkMode]);

  return (
    <>
      <CustomCursor />

      {/* Global Glitch Overlay */}
      <AnimatePresence mode="wait">
        {isLoading && <GlitchTransition key="loader" />}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!isLoading && (
          <Routes location={location} key={location.pathname}>
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
              <Route path="*" element={
                <PageWrapper>
                  <Suspense fallback={null}>
                    <NotFound />
                  </Suspense>
                </PageWrapper>
              } />
            </Route>
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
