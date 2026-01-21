import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Search, ShoppingBag, Menu, X, Sun, Moon, Globe } from 'lucide-react';
import { useUIStore, useCartStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import React from 'react';
import LogoWhite from '@/assets/main logo white.png';
import LogoBlack from '@/assets/logo.png';

const navLinks = [
  { key: 'shop', href: '/shop', label: 'Shop' },
  { key: 'newArrivals', href: '/collections/new-arrivals', label: 'New Arrivals' },
  { key: 'hoodies', href: '/collections/hoodies', label: 'Oversized Hoodies' },
  { key: 'sweatpants', href: '/collections/sweatpants', label: 'Sweatpants' },
  { key: 'lookbook', href: '/lookbook', label: 'Lookbook' },
  { key: 'brandStory', href: '/brand-story', label: 'Our Story' },
];

const MagneticLink = ({ title, href, isActive, isLightMode }: { title: string, href: string, isActive: boolean, isLightMode: boolean }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Magnetic Pull Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const xPos = e.clientX - left - width / 2;
    const yPos = e.clientY - top - height / 2;
    x.set(xPos * 0.3); // Magnetic strength
    y.set(yPos * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div style={{ x: mouseX, y: mouseY }}>
      <Link
        to={href}
        ref={ref}
        onMouseEnter={() => setIsHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          'relative px-5 py-2.5 rounded-full text-sm font-medium transition-colors duration-300 block',
          isActive
            ? (isLightMode ? 'text-white' : 'text-black')
            : (isLightMode ? 'text-white/60 hover:text-white' : 'text-black/60 hover:text-black')
        )}
      >
        {/* Sliding Background Pill */}
        {isHovered && (
          <motion.div
            layoutId="navbar-hover-pill"
            className={cn(
              "absolute inset-0 rounded-full -z-10 backdrop-blur-md",
              isLightMode ? "bg-white/10" : "bg-black/5"
            )}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}

        {/* Active Pill Background */}
        {isActive && (
          <motion.div
            layoutId="navbar-active-pill"
            className={cn(
              "absolute inset-0 rounded-full -z-10 shadow-[0_0_15px_rgba(255,255,255,0.1)]",
              isLightMode ? "bg-white/5 border border-white/10" : "bg-black/5 border border-black/10"
            )}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}

        <div className="relative overflow-hidden flex flex-col items-center">
          {/* Primary Text */}
          <span className="flex items-center gap-[3px] antialiased">
            {title.split(" ").map((word, i) => (
              <span key={i} className="relative overflow-hidden flex">
                <motion.span
                  animate={isHovered ? { y: "-100%" } : { y: 0 }}
                  transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1], delay: i * 0.05 }}
                  className="block"
                >
                  {word}
                </motion.span>
                <motion.span
                  initial={{ y: "100%" }}
                  animate={isHovered ? { y: 0 } : { y: "100%" }}
                  transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1], delay: i * 0.05 }}
                  className="absolute inset-0 block text-[#4ade80]" // Green hover text
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </span>
        </div>
      </Link>
    </motion.div>
  );
};

export function Navbar() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { isDarkMode, toggleDarkMode, setIsSearchOpen, language, setLanguage, heroTheme } = useUIStore();
  const { getItemCount, setIsOpen: setCartOpen } = useCartStore();
  const itemCount = getItemCount();

  const isHomePage = location.pathname === '/';

  // Logic for adaptive colors:
  // 1. If scrolled: Follow the global theme (Dark mode background needs white text).
  // 2. If not scrolled AND on Home: Follow the hero image theme.
  // 3. Otherwise: Follow the global theme.
  const useLightContent = isScrolled
    ? isDarkMode
    : (isHomePage ? heroTheme === 'dark' : isDarkMode);

  // Container Tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], ["5deg", "-5deg"]), { stiffness: 100, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], ["-5deg", "5deg"]), { stiffness: 100, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Scroll Listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'py-3 bg-background/80 backdrop-blur-md shadow-md border-b border-foreground/5'
            : 'py-6 bg-transparent'
        )}
      >
        <div className="container-vero pointer-events-auto">
          <nav className="flex items-center justify-between relative">
            {/* Logo */}
            <Link
              to="/"
              className="relative z-50 transition-colors duration-200"
            >
              <img
                src={useLightContent ? LogoWhite : LogoBlack}
                alt="VERO"
                className="h-8 md:h-10 w-auto object-contain"
              />
            </Link>

            {/* Desktop Navigation - Magnetic & Glass */}
            <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 perspective-1000">
              <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                  rotateX,
                  rotateY,
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden"
                }}
                className={cn(
                  "flex items-center gap-1.5 px-2 py-2 rounded-full border transition-all duration-500",
                  isScrolled
                    ? "bg-[#0a0a0a]/80 backdrop-blur-2xl border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] ring-1 ring-white/[0.05]"
                    : useLightContent
                      ? "bg-white/10 backdrop-blur-md border-white/20"
                      : "bg-black/5 backdrop-blur-md border-black/10"
                )}
              >
                {navLinks.map((link) => (
                  <MagneticLink
                    key={link.key}
                    title={link.label}
                    href={link.href}
                    isActive={location.pathname === link.href}
                    isLightMode={useLightContent}
                  />
                ))}
              </motion.div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3 relative z-50">
              <button
                onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                className={cn(
                  "btn-ghost flex items-center gap-1.5 text-xs uppercase tracking-wider hover:bg-white/10 transition-colors duration-200",
                  useLightContent ? "!text-white" : "!text-black"
                )}
              >
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">{language === 'en' ? 'AR' : 'EN'}</span>
              </button>

              <button
                onClick={toggleDarkMode}
                className={cn(
                  "btn-ghost p-2 hover:bg-white/10 transition-colors duration-200",
                  useLightContent ? "!text-white" : "!text-black"
                )}
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <button
                onClick={() => setIsSearchOpen(true)}
                className={cn(
                  "btn-ghost p-2 hover:bg-white/10 transition-colors duration-200",
                  useLightContent ? "!text-white" : "!text-black"
                )}
              >
                <Search className="h-5 w-5" />
              </button>

              <button
                onClick={() => setCartOpen(true)}
                className={cn(
                  "btn-ghost p-2 relative hover:bg-white/10 transition-colors duration-200",
                  useLightContent ? "!text-white" : "!text-black"
                )}
              >
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] font-medium flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className={cn(
                  "btn-ghost p-2 lg:hidden hover:bg-white/10 transition-colors duration-200",
                  useLightContent ? "!text-white" : "!text-black"
                )}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: language === 'ar' ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: language === 'ar' ? '-100%' : '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className={cn(
                'fixed top-0 bottom-0 w-full max-w-sm bg-[#0a0a0a] border-r border-white/10 z-50 p-6',
                language === 'ar' ? 'left-0' : 'right-0'
              )}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center justify-center w-full">
                  <img src={LogoWhite} alt="VERO" className="h-8 w-auto object-contain" />
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-ghost p-2 text-white hover:bg-white/10 absolute top-6 right-6"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <nav className="flex flex-col gap-6 mt-8 px-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.key}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="group flex items-center justify-between py-2 border-b border-white/5"
                  >
                    <span className="text-3xl font-display font-light text-white/80 group-hover:text-white transition-colors duration-300">
                      {link.label}
                    </span>
                    <span className="text-white/40 group-hover:text-[#4ade80] transition-colors duration-300">
                      →
                    </span>
                  </Link>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
