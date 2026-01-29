import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Search, ShoppingBag, Menu, X, Sun, Moon, Globe, ChevronDown } from 'lucide-react';
import { useUIStore, useCartStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import React from 'react';
import LogoWhite from '@/assets/main logo white.png';
import LogoDark from '@/assets/logo.png';



interface NavLinkItem {
  key: string;
  href: string;
  label: string;
  comingSoon?: boolean;
  children?: NavLinkItem[];
}

const getNavLinks = (t: any) => [
  {
    key: 'shop',
    href: '#',
    label: t('nav.shop'),
    children: [
      { key: 'all', href: '/shop', label: t('collections.all') },
      { key: 'hoodies', href: '/collections/hoodies', label: t('collections.hoodies') },
      { key: 'sweatpants', href: '#', label: t('collections.sweatpants'), comingSoon: true },
      { key: 'footwear', href: '#', label: t('collections.footwear'), comingSoon: true },
    ]
  },
  { key: 'newArrivals', href: '/collections/new-arrivals', label: t('nav.newArrivals') },
  { key: 'customStudio', href: '/custom-studio', label: t('nav.customDesign') || 'Custom Design' },
  { key: 'lookbook', href: '/lookbook', label: t('nav.lookbook') },
  { key: 'brandStory', href: '/brand-story', label: t('nav.brandStory') },
];

const GlitchText = ({ text, isActive }: { text: string, isActive: boolean }) => {
  const { t } = useTranslation();
  const [isGlitching, setIsGlitching] = useState(false);

  // Trigger intense glitch on click
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 600); // 600ms intense glitch
  };

  return (
    <motion.span
      className="relative inline-block overflow-hidden"
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
    >
      <span className="relative z-10 flex items-center gap-2">
        {text}
        <span className="text-[10px] bg-red-500 text-white px-1 rounded uppercase tracking-widest font-bold">
          {isActive ? (t('product.live') || 'Live') : (t('product.soon') || 'Soon')}
        </span>
      </span>

      {/* Glitch Layers */}
      <AnimatePresence>
        {(isGlitching || isActive) && (
          <>
            <motion.span
              className="absolute top-0 left-0 -z-10 text-red-500 mix-blend-screen opacity-70"
              animate={{
                x: isGlitching ? [-2, 2, -1, 3, -2] : [-1, 1, -1],
                y: isGlitching ? [1, -1, 2, -2, 1] : 0,
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ repeat: Infinity, duration: isGlitching ? 0.1 : 0.2 }}
            >
              {text} <span className="text-[10px] uppercase">{t('product.soon') || 'Soon'}</span>
            </motion.span>
            <motion.span
              className="absolute top-0 left-0 -z-10 text-blue-500 mix-blend-screen opacity-70"
              animate={{
                x: isGlitching ? [2, -2, 1, -3, 2] : [1, -1, 1],
                y: isGlitching ? [-1, 1, -2, 2, -1] : 0,
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ repeat: Infinity, duration: isGlitching ? 0.1 : 0.25, delay: 0.05 }}
            >
              {text} <span className="text-[10px] uppercase">{t('product.soon') || 'Soon'}</span>
            </motion.span>
          </>
        )}
      </AnimatePresence>
    </motion.span>
  );
};

const MagneticLink = ({ link, isActive }: { link: NavLinkItem, isActive: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Magnetic Pull Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
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
    setIsDropdownOpen(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (link.children) setIsDropdownOpen(true);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: mouseX, y: mouseY }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative z-[100]"
    >
      <Link
        to={link.href}
        onClick={(e) => {
          if (link.href === '#') e.preventDefault();
        }}
        className={cn(
          'relative px-5 py-2.5 rounded-full text-sm font-medium transition-colors duration-300 block',
          isActive ? 'text-foreground' : 'text-foreground/60 hover:text-foreground',
          link.href === '#' && 'cursor-default' // Make parent 'Shop' cursor default if intended
        )}
      >
        {/* Sliding Background Pill */}
        {isHovered && (
          <motion.div
            layoutId="navbar-hover-pill"
            className="absolute inset-0 rounded-full -z-10 backdrop-blur-md bg-foreground/10"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}

        {/* Active Pill Background */}
        {isActive && (
          <motion.div
            layoutId="navbar-active-pill"
            className="absolute inset-0 rounded-full -z-10 shadow-[0_0_15px_rgba(0,0,0,0.05)] dark:shadow-[0_0_15px_rgba(255,255,255,0.1)] bg-foreground/5 border border-foreground/10"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}

        <div className="relative overflow-hidden flex flex-col items-center">
          {/* Primary Text with Split Animation */}
          <span className="flex items-center gap-[3px] antialiased">
            {link.label.split(" ").map((word, i) => (
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
                  className="absolute inset-0 block text-[#49d77e]"
                >
                  {word}
                </motion.span>
              </span>
            ))}
            {link.children && <ChevronDown className={cn("w-3 h-3 ml-1 transition-transform duration-300", isDropdownOpen ? "rotate-180" : "")} />}
          </span>
        </div>
      </Link>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isDropdownOpen && link.children && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 py-2 w-56 bg-background/90 backdrop-blur-xl border border-border rounded-xl shadow-xl overflow-hidden"
          >
            {link.children.map((child) => (
              child.comingSoon ? (
                <div
                  key={child.key}
                  className="block px-4 py-3 text-sm text-foreground cursor-not-allowed border-b border-border last:border-0"
                >
                  <GlitchText text={child.label} isActive={false} />
                </div>
              ) : (
                <Link
                  key={child.key}
                  to={child.href}
                  className="block px-4 py-3 text-sm text-foreground/70 hover:text-foreground hover:bg-foreground/10 transition-colors border-b border-border last:border-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  {child.label}
                </Link>
              )
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export function Navbar() {
  const { t, i18n } = useTranslation();
  const navLinks = getNavLinks(t);
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { isDarkMode, toggleDarkMode, setIsSearchOpen, language, setLanguage } = useUIStore();
  const { getItemCount, setIsOpen: setCartOpen } = useCartStore();
  const itemCount = getItemCount();
  const isHome = location.pathname === '/';
  const isCustomStudio = location.pathname === '/custom-studio';
  const isSecondaryPage = ['/shop', '/lookbook', '/brand-story', '/custom-studio', '/cart'].some(path => location.pathname === path) ||
    location.pathname.startsWith('/collections/') ||
    location.pathname.startsWith('/product/') ||
    location.pathname.startsWith('/policies/');

  // Enforce "Dark Mode" style (White text) always as per "one theme" request.
  // We ignore useLightContent logic and force light-on-dark styles.

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
          'fixed top-0 left-0 right-0 z-[100] transition-all duration-300',
          isScrolled
            ? (isSecondaryPage
              ? 'py-2 backdrop-blur-xl border-b border-border bg-background/80'
              : 'py-2 backdrop-blur-xl border-b border-white/10 bg-black/90') // High-end dark header for brand consistency
            : 'py-6 bg-transparent'
        )}
      >
        <div className="container-vero pointer-events-auto">
          <nav className="flex items-center justify-between relative">
            {/* Logo */}
            {/* Logo */}
            {/* Logo */}
            <Link
              to="/"
              className={cn(
                "relative z-50 transition-all duration-300",
                isSecondaryPage ? "bg-white p-2.5 rounded-xl shadow-xl border border-black/5" : (isScrolled ? "scale-100" : "scale-110")
              )}
            >
              <img
                src={isSecondaryPage ? LogoDark : (isHome && !isScrolled ? LogoWhite : LogoWhite)}
                alt="VERO"
                className="h-8 md:h-10 w-auto object-contain"
              />
            </Link>

            {/* Desktop Navigation - Magnetic & Glass */}
            <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 perspective-1000 z-[100]">
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
                  // Glass Background for visibility on all surfaces
                  "bg-background/60 dark:bg-black/60 backdrop-blur-xl border-border dark:border-white/10 shadow-2xl"
                )}
              >
                {navLinks.map((link) => (
                  <MagneticLink
                    key={link.key}
                    link={link}
                    isActive={location.pathname === link.href}
                  />
                ))}
              </motion.div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 relative z-50">
              {/* Wrapped in a glass pill for visibility */}
              <div className="flex items-center gap-1 px-2 py-1.5 rounded-full bg-background/60 dark:bg-black/60 backdrop-blur-xl border border-border dark:border-white/10 shadow-2xl">
                <button
                  onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                  className="btn-ghost flex items-center gap-1.5 text-xs uppercase tracking-wider hover:bg-foreground/10 p-2 rounded-full transition-colors duration-200 text-foreground"
                >
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">{language === 'en' ? 'AR' : 'EN'}</span>
                </button>

                <button
                  onClick={toggleDarkMode}
                  className="btn-ghost p-2 rounded-full hover:bg-foreground/10 transition-colors duration-200 text-foreground"
                >
                  {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>

                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="btn-ghost p-2 rounded-full hover:bg-foreground/10 transition-colors duration-200 text-foreground"
                >
                  <Search className="h-5 w-5" />
                </button>

                <button
                  onClick={() => setCartOpen(true)}
                  className="btn-ghost p-2 rounded-full relative hover:bg-foreground/10 transition-colors duration-200 text-foreground"
                >
                  <ShoppingBag className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] font-medium flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </button>
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="btn-ghost p-2 lg:hidden bg-background/60 dark:bg-black/60 backdrop-blur-xl border border-border dark:border-white/10 rounded-full hover:bg-foreground/10 transition-colors duration-200 text-foreground"
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
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200]"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className={cn(
                'fixed top-0 bottom-0 w-full max-w-sm bg-background border-l border-border z-[210] p-6 right-0'
              )}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center justify-center w-full">
                  <img src={isDarkMode ? LogoWhite : LogoDark} alt="VERO" className="h-8 w-auto object-contain" />
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-ghost p-2 text-foreground hover:bg-foreground/10 absolute top-6 right-6"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <nav className="flex flex-col gap-6 mt-8 px-4">
                {navLinks.map((link) => (
                  <div key={link.key}>
                    {/* Mobile Main Links */}
                    <div
                      onClick={() => {
                        if (link.href !== '#') setIsMobileMenuOpen(false);
                      }}
                      className="group flex flex-col py-2 border-b border-border"
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className={cn("text-3xl font-display font-light text-foreground group-hover:text-[#49d77e] transition-colors duration-300")}>
                          {link.href !== '#' ? <Link to={link.href}>{link.label}</Link> : link.label}
                        </span>
                        {link.href !== '#' && (
                          <span className="text-foreground/40 group-hover:text-[#49d77e] transition-colors duration-300">
                            →
                          </span>
                        )}
                      </div>

                      {/* Mobile Submenu */}
                      {link.children && (
                        <div className="pl-4 flex flex-col gap-3 mt-3">
                          {link.children.map(child => (
                            <div key={child.key}>
                              {child.comingSoon ? (
                                <div className="flex items-center gap-2 text-lg text-foreground font-medium">
                                  {child.label} <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded font-bold">{t('product.soon') || 'Soon'}</span>
                                </div>
                              ) : (
                                <Link
                                  to={child.href}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="text-lg text-foreground group-hover:text-foreground/80 block"
                                >
                                  {child.label}
                                </Link>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
