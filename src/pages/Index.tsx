import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { useRef, useMemo } from 'react';
import { useUIStore } from '@/lib/store';
import { ProductCard } from '@/components/product/ProductCard';
import { Hero } from "@/components/home/Hero";
import { ScrollingCarousel } from '@/components/home/ScrollingCarousel';
import { FeedbackSection } from '@/components/home/FeedbackSection';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { cn } from '@/lib/utils';
import { useProducts } from '@/hooks/useProducts';

// Import images
import heroImage from '@/assets/hero-1.jpg';
import productHoodie1 from '@/assets/product-hoodie-1.jpg';
import productHoodie2 from '@/assets/product-hoodie-2.jpg';
import productSweatpants1 from '@/assets/product-sweatpants-1.jpg';
import productSweatpants2 from '@/assets/product-sweatpants-2.jpg';
import heroImage3 from '@/assets/hero-3.png';
import lookbook1 from '@/assets/lookbook-1.jpg';

const Index = () => {
  const { t } = useTranslation();
  const { language } = useUIStore();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const { products: allProducts, loading } = useProducts();

  const heroImageY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Mouse Parallax Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 150 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  // Parallax transforms - subtle movement in opposite directions
  const bgX = useTransform(mouseXSpring, [-0.5, 0.5], ["2%", "-2%"]);
  const bgY = useTransform(mouseYSpring, [-0.5, 0.5], ["2%", "-2%"]);
  const textX = useTransform(mouseXSpring, [-0.5, 0.5], ["-1%", "1%"]);
  const textY = useTransform(mouseYSpring, [-0.5, 0.5], ["-1%", "1%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const newArrivals = useMemo(() =>
    allProducts.filter(p => p.isNew || p.collection === 'new-arrivals').slice(0, 3)
    , [allProducts]);

  const essentials = useMemo(() =>
    allProducts.filter(p => p.collection === 'essentials').slice(0, 4)
    , [allProducts]);

  return (
    <div className="overflow-hidden bg-background">
      {/* Hero Section */}
      <Hero />


      {/* Marquee - Consistent with Shop Page */}
      <section className="py-4 border-y border-border overflow-hidden bg-foreground text-background">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap gap-12"
        >
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-sm md:text-base font-bold uppercase tracking-[0.3em] flex items-center gap-12">
              {t('home.marquee.freeShipping')} <span className="w-1.5 h-1.5 rounded-full bg-background" />
              {t('home.marquee.premiumQuality')} <span className="w-1.5 h-1.5 rounded-full bg-background" />
              {t('home.marquee.madeInEgypt')} <span className="w-1.5 h-1.5 rounded-full bg-background" />
            </span>
          ))}
        </motion.div>
      </section>

      {/* Fresh Drops - Editorial Gallery Layout */}
      <section id="fresh-drops" className="relative min-h-screen bg-background py-32 overflow-hidden">
        {/* Background Parallax Content */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <motion.div
            style={{
              y: useTransform(scrollYProgress, [0.1, 0.4], [0, -200]),
              opacity: useTransform(scrollYProgress, [0.1, 0.2, 0.35], [0, 0.05, 0])
            }}
            className="absolute top-20 left-10 flex flex-col gap-0 select-none whitespace-nowrap"
          >
            <span className="text-[25rem] font-black leading-[0.8] text-foreground/[0.03] dark:text-white tracking-tighter">{t('home.drops.bgNew')}</span>
            <span className="text-[25rem] font-black leading-[0.8] text-foreground/[0.03] dark:text-white tracking-tighter ml-48">{t('home.drops.bgDrops')}</span>
          </motion.div>

          {/* Subtle noise texture */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
        </div>

        <div className="container-vero relative z-10 px-4 md:px-10">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 mb-6"
              >
                <span className="w-12 h-[1px] bg-red-500" />
                <span className="text-xs font-bold uppercase tracking-[0.4em] text-red-500">{t('home.drops.seasonalRelease')}</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-6xl md:text-8xl lg:text-9xl text-foreground font-black leading-[0.9] tracking-tighter uppercase"
              >
                {t('home.drops.title')} <br /> <span className="text-outline-foreground dark:text-outline-white text-transparent">{t('home.drops.titleOutline')}</span>
              </motion.h2>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-8"
            >
              <div className="hidden md:block text-right">
                <p className="text-foreground/40 text-xs font-bold uppercase tracking-widest mb-2">{t('home.drops.curatedSelection')}</p>
                <p className="text-foreground/60 text-sm max-w-[200px]">{t('home.drops.curatedDescription')}</p>
              </div>
              <Link
                to="/collections/new-arrivals"
                className="group flex flex-col items-center justify-center w-24 h-24 rounded-full border border-foreground/20 text-foreground hover:bg-foreground hover:text-background transition-all duration-500"
              >
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform mb-1" />
                <span className="text-[10px] font-bold uppercase tracking-tighter">{t('home.drops.viewAll')}</span>
              </Link>
            </motion.div>
          </div>

          {/* Staggered Grid Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-y-24 md:gap-y-0 md:gap-x-12">
            {/* Item 1 - Large, Left */}
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="md:col-span-7"
            >
              <div className="group relative">
                {newArrivals[0] && <ProductCard product={newArrivals[0]} index={0} />}
                <div className="absolute -bottom-10 -right-6 md:-right-12 z-20 pointer-events-none hidden md:block">
                  <span className="text-8xl font-black text-foreground/5 dark:text-white/5 tracking-tighter">01</span>
                </div>
              </div>
            </motion.div>

            {/* Item 2 - Smaller, Right, Offset */}
            <motion.div
              initial={{ opacity: 0, y: 150 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="md:col-span-5 md:mt-48"
            >
              <div className="group relative max-w-[400px] mx-auto md:mr-0">
                {newArrivals[1] && <ProductCard product={newArrivals[1]} index={1} />}
                <div className="absolute -top-10 -left-6 md:-left-12 z-20 pointer-events-none hidden md:block">
                  <span className="text-8xl font-black text-foreground/5 dark:text-white/5 tracking-tighter">02</span>
                </div>
              </div>
            </motion.div>

            {/* Item 3 - Center Right, Large */}
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="md:col-span-6 md:col-start-4 md:mt-24"
            >
              <div className="group relative">
                {newArrivals[2] && <ProductCard product={newArrivals[2]} index={2} />}
                <div className="absolute -bottom-10 -left-6 md:-left-12 z-20 pointer-events-none hidden md:block">
                  <span className="text-8xl font-black text-white/5 tracking-tighter">03</span>
                </div>
              </div>

              {/* View More Inline */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="mt-20 flex flex-col items-center justify-center text-center px-4"
              >
                <div className="w-[1px] h-32 bg-gradient-to-b from-white/0 via-white/20 to-white/0 mb-12" />
                <p className="text-[#e8ba30] text-xs font-bold uppercase tracking-[0.5em] mb-8">{t('home.drops.endOfPreview')}</p>
                <Link
                  to="/collections/new-arrivals"
                  className="group relative px-12 py-5 bg-foreground text-background font-black uppercase tracking-widest text-xs hover:bg-background hover:text-foreground border border-foreground transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-4">
                    {t('home.drops.exploreFullDrop')}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-x-0 bottom-0 h-0 bg-background dark:bg-black group-hover:h-full transition-all duration-300 -z-0" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Collection Banner - Bigger Impact */}
      {/* Featured Collection Banner - Bigger Impact */}
      <section
        className="relative h-screen flex items-center overflow-hidden bg-background perspective-1000"
        onMouseMove={handleMouseMove}
      >
        {/* Parallax Background Group */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div
            style={{
              scale: useTransform(scrollYProgress, [0, 1], [1.1, 1.2]),
              x: bgX,
              y: bgY
            }}
            className="h-full w-full relative"
          >
            {/* Main Image */}
            <OptimizedImage
              src={heroImage3}
              alt="Essentials Collection"
              className="w-full h-full object-cover opacity-90"
            />

            {/* Glitch Layer 1 - Red Shift (Cyan/Red Anaglyph vibe) */}
            <motion.div
              animate={{
                x: [-3, 3, -1, 0, 2],
                y: [1, -1, 0],
                opacity: [0, 0.4, 0, 0.2, 0]
              }}
              transition={{
                duration: 0.4,
                repeat: Infinity,
                repeatDelay: 2,
                times: [0, 0.1, 0.2, 0.3, 1]
              }}
              className="absolute inset-0 mix-blend-screen opacity-0"
            >
              {/* Use the same image but tinted or filtered */}
              <div className="w-full h-full bg-red-500/50 absolute inset-0 mix-blend-multiply" />
              <OptimizedImage
                src={heroImage3}
                alt=""
                className="w-full h-full object-cover"
                style={{ filter: 'grayscale(100%) contrast(1.2)' }}
              />
            </motion.div>

            {/* Glitch Layer 2 - Blue/Cyan Shift */}
            <motion.div
              animate={{
                x: [3, -3, 1, 0, -2],
                y: [-1, 1, 0],
                opacity: [0, 0.4, 0, 0.2, 0]
              }}
              transition={{
                duration: 0.35,
                repeat: Infinity,
                repeatDelay: 2.1, // Offset timing
                times: [0, 0.1, 0.2, 0.3, 1]
              }}
              className="absolute inset-0 mix-blend-screen opacity-0"
            >
              <div className="w-full h-full bg-cyan-500/50 absolute inset-0 mix-blend-multiply" />
              <OptimizedImage
                src={heroImage3}
                alt=""
                className="w-full h-full object-cover"
                style={{ filter: 'grayscale(100%) contrast(1.2)' }}
              />
            </motion.div>
          </motion.div>

          {/* Sophisticated Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />

          {/* Scanline Texture */}
          <div className="absolute inset-0 opacity-[0.2] pointer-events-none z-10"
            style={{
              backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
              backgroundSize: '100% 4px, 6px 100%'
            }}
          />

          {/* Noise Texture */}
          <div className="absolute inset-0 opacity-[0.1] pointer-events-none mix-blend-overlay"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
          />
        </div>

        <motion.div
          style={{ x: textX, y: textY }}
          className="relative z-20 w-full px-4 md:px-10 h-full flex flex-col justify-center"
        >
          <div className="max-w-[90%] md:max-w-5xl mx-auto text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-6 md:mb-10 justify-center md:justify-start"
            >
              <span className="w-12 h-[2px] bg-red-500" />
              <p className="text-white/90 text-sm font-bold uppercase tracking-[0.5em] glow-text">
                {t('home.essentials.tagline')}
              </p>
            </motion.div>

            {/* Glitch Title */}
            {/* Glitch Title */}
            <div className="relative inline-block mb-10 overflow-visible">
              <motion.h2
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="heading-display text-5xl sm:text-7xl md:text-[9rem] lg:text-[11rem] leading-[0.85] text-foreground tracking-tighter mix-blend-difference relative z-10"
              >
                {t('home.essentials.title')}
              </motion.h2>

              {/* Text Glitch Overlay - Red */}
              <motion.h2
                className="heading-display text-5xl sm:text-7xl md:text-[9rem] lg:text-[11rem] leading-[0.85] text-[#ff003c] tracking-tighter absolute top-0 left-0 -z-10 opacity-70 mix-blend-screen select-none"
                animate={{
                  x: [-2, 4, -1, 3, 0],
                  clipPath: [
                    'inset(10% 0 80% 0)',
                    'inset(80% 0 1% 0)',
                    'inset(30% 0 10% 0)',
                    'inset(10% 0 80% 0)',
                    'inset(0% 0 100% 0)'
                  ]
                }}
                transition={{
                  duration: 0.25,
                  repeat: Infinity,
                  repeatDelay: 3,
                  repeatType: "mirror",
                  ease: "linear"
                }}
              >
                {t('home.essentials.title')}
              </motion.h2>

              {/* Text Glitch Overlay - Cyan */}
              <motion.h2
                className="heading-display text-5xl sm:text-7xl md:text-[9rem] lg:text-[11rem] leading-[0.85] text-[#00f3ff] tracking-tighter absolute top-0 left-0 -z-10 opacity-70 mix-blend-screen select-none"
                animate={{
                  x: [2, -3, 1, -3, 0],
                  clipPath: [
                    'inset(80% 0 10% 0)',
                    'inset(1% 0 80% 0)',
                    'inset(40% 0 20% 0)',
                    'inset(10% 0 80% 0)',
                    'inset(100% 0 0% 0)'
                  ]
                }}
                transition={{
                  duration: 0.3,
                  repeat: Infinity,
                  repeatDelay: 2.1,
                  repeatType: "mirror",
                  ease: "linear"
                }}
              >
                {t('home.essentials.title')}
              </motion.h2>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-white dark:text-white/80 font-light mb-12 max-w-xl leading-relaxed mx-auto md:mx-0 mix-blend-screen"
            >
              {t('home.essentials.description')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex justify-center md:justify-start"
            >
              <Link to="/collections/essentials" className="group relative bg-foreground text-background px-12 py-6 uppercase tracking-widest font-bold text-sm overflow-hidden hover:text-foreground transition-colors duration-300">
                <span className="relative z-10 flex items-center gap-4">
                  {t('home.essentials.exploreCollection')}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-background translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Customer Feedback Section */}
      <FeedbackSection />

      {/* Categories - 50/50 Split */}
      <section className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 h-[80vh] min-h-[600px]">
          {/* Hoodies - Left */}
          <Link to="/collections/hoodies" className="group relative block overflow-hidden w-full h-full">
            <OptimizedImage
              src={productHoodie1}
              alt="Oversized Hoodies"
              className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            />
            {/* Dark Overlay for Text Contrast */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-500" />

            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center p-6">
              <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-6 drop-shadow-lg transform transition-transform duration-500 group-hover:-translate-y-2">
                {t('home.categories.hoodies')}
              </h2>
              <span className="inline-block text-white text-sm font-bold tracking-[0.2em] uppercase border-b-2 border-white pb-2 hover:text-white/80 hover:border-white/80 transition-all opacity-90 group-hover:opacity-100">
                {t('home.categories.shopHoodies')}
              </span>
            </div>
          </Link>

          {/* Sweatpants - Right */}
          <div className="group relative block overflow-hidden w-full h-full cursor-not-allowed">
            <OptimizedImage
              src={productSweatpants1}
              alt="Sweatpants"
              className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105 opacity-60"
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors duration-500" />

            {/* Coming Soon Overlay for Split Section */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="border-2 border-white px-8 py-4 mb-4">
                <span className="text-2xl md:text-4xl font-black text-white uppercase tracking-[0.3em]">
                  {t('home.categories.comingSoon')}
                </span>
              </div>
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center p-6 group-hover:opacity-20 transition-opacity duration-500">
              <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-6 drop-shadow-lg transform transition-transform duration-500 group-hover:-translate-y-2">
                {t('home.categories.sweatpants')}
              </h2>
              <span className="inline-block text-white text-sm font-bold tracking-[0.2em] uppercase border-b-2 border-white pb-2 opacity-90">
                {t('home.categories.comingSoon')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Statement - Minimal */}
      <section className="section-padding bg-background">
        <div className="container-vero">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="heading-1 mb-8"
            >
              {t('home.brandStatement')}
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Link to="/brand-story" className="text-sm font-bold uppercase tracking-widest border-b border-foreground pb-1 hover:text-muted-foreground transition-colors">
                {t('common.learnMore')}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div >
  );
};

export default Index;
