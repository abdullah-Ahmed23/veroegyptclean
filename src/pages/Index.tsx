import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { useRef } from 'react';
import { useUIStore } from '@/lib/store';
import { ProductCard } from '@/components/product/ProductCard';
import { Hero } from "@/components/home/Hero";
import { GlitchCard } from '@/components/home/GlitchCard';

import { products } from '@/data/products';
import { cn } from '@/lib/utils';

// Import images
import heroImage from '@/assets/hero-1.jpg';
import productHoodie1 from '@/assets/product-hoodie-1.jpg';
import productHoodie2 from '@/assets/product-hoodie-2.jpg';
import productSweatpants1 from '@/assets/product-sweatpants-1.jpg';
import productSweatpants2 from '@/assets/product-sweatpants-2.jpg';
import heroImage3 from '@/assets/hero-3.png';
import lookbook1 from '@/assets/lookbook-1.jpg';

// Update product images with actual images
const productsWithImages = products.map((product, index) => ({
  ...product,
  images: [
    index % 2 === 0 ? productHoodie1 : productSweatpants1,
    index % 2 === 0 ? productHoodie2 : productSweatpants2,
    lookbook1, // Keep lookbook1 for product images if needed, or replace if that was the intent. 
    // User specifically pointed to the SECTION background.
  ],
}));

const Index = () => {
  const { t } = useTranslation();
  const { language } = useUIStore();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

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

  const newArrivals = productsWithImages.filter(p => p.collection === 'new-arrivals').slice(0, 3); // 3 items for bigger cards
  const essentials = productsWithImages.filter(p => p.collection === 'essentials').slice(0, 4);

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
              FREE SHIPPING ON ORDERS OVER 2,000 EGP <span className="w-1.5 h-1.5 rounded-full bg-background" />
              PREMIUM QUALITY <span className="w-1.5 h-1.5 rounded-full bg-background" />
              MADE IN EGYPT <span className="w-1.5 h-1.5 rounded-full bg-background" />
            </span>
          ))}
        </motion.div>
      </section>

      {/* New Arrivals -> FRESH DROPS */}
      <section id="fresh-drops" className="section-padding bg-background relative overflow-hidden min-h-[80vh] flex flex-col justify-center">
        {/* Background decorative element - Ticker */}
        <div className="absolute top-0 left-0 w-full overflow-hidden opacity-[0.03] select-none pointer-events-none">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="flex whitespace-nowrap"
          >
            <span className="text-[15rem] font-black leading-none text-foreground tracking-tighter">
              FRESH DROPS — FRESH DROPS — FRESH DROPS —
            </span>
          </motion.div>
        </div>

        <div className="w-full px-4 md:px-10 relative z-10">
          <div className="flex flex-col mb-16 gap-8">
            {/* Header Layout: Centered Symmetrical */}
            <div className="relative flex flex-col items-center justify-center border-b border-foreground/10 pb-12 gap-8 text-center">

              {/* Available Now - Top */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-2"
              >
                <span className="w-2 h-2 bg-[#4ade80] rounded-full animate-pulse shadow-[0_0_10px_#4ade80]" />
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-foreground/60">
                  Available Now
                </p>
              </motion.div>

              {/* Title - Center */}
              <motion.h2
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="heading-display text-6xl md:text-8xl lg:text-9xl text-foreground leading-none tracking-tighter"
              >
                FRESH DROPS
              </motion.h2>

              {/* View All - Bottom */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Link
                  to="/collections/new-arrivals"
                  className="group inline-flex items-center gap-4 text-sm font-bold uppercase tracking-widest bg-foreground text-background px-10 py-4 hover:bg-foreground/90 transition-all hover:scale-105 shadow-xl"
                >
                  View All
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Horizontal Scroll Showcase */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-12 -mx-4 md:-mx-10 px-4 md:px-10"
          >
            {newArrivals.map((product, index) => (
              <motion.div
                key={product.id}
                className="flex-none w-[85vw] md:w-[450px] snap-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard product={product} index={index} />
              </motion.div>
            ))}

            {/* View More Card at the end */}
            <motion.div
              className="flex-none w-[85vw] md:w-[300px] snap-center flex items-center justify-center bg-foreground/5"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <Link to="/collections/new-arrivals" className="group flex flex-col items-center gap-4 text-center p-8">
                <span className="w-16 h-16 rounded-full border border-foreground/20 flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all duration-300">
                  <ArrowRight className="w-6 h-6" />
                </span>
                <span className="text-xl font-bold uppercase tracking-widest">View All<br />Drops</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Collection Banner - Bigger Impact */}
      {/* Featured Collection Banner - Bigger Impact */}
      <section
        className="relative h-screen flex items-center overflow-hidden bg-black perspective-1000"
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
            <img
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
              <img
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
              <img
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
                The Foundation
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
                className="heading-display text-5xl sm:text-7xl md:text-[9rem] lg:text-[11rem] leading-[0.85] text-white tracking-tighter mix-blend-difference relative z-10"
              >
                ESSENTIALS
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
                ESSENTIALS
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
                ESSENTIALS
              </motion.h2>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-white/80 font-light mb-12 max-w-xl leading-relaxed mx-auto md:mx-0 mix-blend-screen"
            >
              Timeless pieces designed to anchor your wardrobe. <span className="text-white font-medium">Premium fabrics</span>,
              considered details, enduring style.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex justify-center md:justify-start"
            >
              <Link to="/collections/essentials" className="group relative bg-white text-black px-12 py-6 uppercase tracking-widest font-bold text-sm overflow-hidden hover:text-white transition-colors duration-300">
                <span className="relative z-10 flex items-center gap-4">
                  Explore Collection
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Essentials Grid */}
      <section className="section-padding bg-zinc-50 dark:bg-zinc-900/50">
        <div className="container-vero">
          <div className="text-center mb-16">
            <h2 className="heading-2 uppercase tracking-tight">Essential Base Layers</h2>
            <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
              Curated foundations for your everyday rotation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[800px]">
            {/* Item 1: Oversized Hoodies (Big Square 2x2) */}
            <GlitchCard
              className="md:col-span-2 md:row-span-2"
              image={productHoodie1}
              title="Oversized Hoodies"
              subtitle="Heavyweight cotton blended for the perfect drape. The ultimate everyday essential."
              link="/collections/hoodies"
              tag="Signature Fit"
            />

            {/* Item 2: Sweatpants (Tall 1x2) */}
            <GlitchCard
              className="md:col-span-1 md:row-span-2"
              image={productSweatpants1}
              title="Sweatpants"
              subtitle="Tailored comfort for home and street."
              link="/collections/sweatpants"
              tag="Relaxed Comfort"
            />

            {/* Item 3: Tees / Layering (Small 1x1) */}
            <GlitchCard
              className="md:col-span-1 md:row-span-1"
              image={lookbook1}
              title="Essential Tees"
              subtitle="Premium lightweight cotton."
              link="/collections/tees"
            />

            {/* Item 4: Accessories / Details (Small 1x1) */}
            <GlitchCard
              className="md:col-span-1 md:row-span-1"
              image={productHoodie2}
              title="The Details"
              subtitle="View the full lookbook."
              link="/collections/accessories"
            />
          </div>
        </div>
      </section>

      {/* Categories - 50/50 Split */}
      <section className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 h-[80vh] min-h-[600px]">
          {/* Hoodies - Left */}
          <Link to="/collections/hoodies" className="group relative block overflow-hidden w-full h-full">
            <img
              src={productHoodie1}
              alt="Oversized Hoodies"
              className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            />
            {/* Dark Overlay for Text Contrast */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-500" />

            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center p-6">
              <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-6 drop-shadow-lg transform transition-transform duration-500 group-hover:-translate-y-2">
                Oversized Hoodies
              </h2>
              <span className="inline-block text-white text-sm font-bold tracking-[0.2em] uppercase border-b-2 border-white pb-2 hover:text-white/80 hover:border-white/80 transition-all opacity-90 group-hover:opacity-100">
                Shop Hoodies
              </span>
            </div>
          </Link>

          {/* Sweatpants - Right */}
          <Link to="/collections/sweatpants" className="group relative block overflow-hidden w-full h-full">
            <img
              src={productSweatpants1}
              alt="Sweatpants"
              className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-500" />

            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center p-6">
              <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-6 drop-shadow-lg transform transition-transform duration-500 group-hover:-translate-y-2">
                Sweatpants
              </h2>
              <span className="inline-block text-white text-sm font-bold tracking-[0.2em] uppercase border-b-2 border-white pb-2 hover:text-white/80 hover:border-white/80 transition-all opacity-90 group-hover:opacity-100">
                Shop Sweatpants
              </span>
            </div>
          </Link>
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
              "LUXURY SHOULD WHISPER, NOT SHOUT."
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
