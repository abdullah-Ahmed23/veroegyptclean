import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Import images
import heroImage from '@/assets/hero-1.jpg';
import lookbook1 from '@/assets/lookbook-1.jpg';
import productHoodie1 from '@/assets/product-hoodie-1.jpg';
import productSweatpants1 from '@/assets/product-sweatpants-1.jpg';

// --- Shared Glitch Components (could be extracted later) ---
const GlitchText = ({ text, className, size = "large" }: { text: string, className?: string, size?: "large" | "small" }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn("relative inline-block overflow-hidden", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="relative z-10 block">{text}</span>
      <AnimatePresence>
        {isHovered && (
          <>
            <motion.span
              className="absolute top-0 left-0 -z-10 text-red-500/80 mix-blend-screen select-none"
              animate={{ x: [-2, 2, -1, 0], opacity: [0, 1, 0.5, 0] }}
              transition={{ repeat: Infinity, duration: 0.15, ease: "linear" }}
            >
              {text}
            </motion.span>
            <motion.span
              className="absolute top-0 left-0 -z-10 text-cyan-500/80 mix-blend-screen select-none"
              animate={{ x: [2, -2, 1, 0], opacity: [0, 1, 0.5, 0] }}
              transition={{ repeat: Infinity, duration: 0.2, delay: 0.05, ease: "linear" }}
            >
              {text}
            </motion.span>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const ScrambleText = ({ text, className }: { text: string, className?: string }) => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";
  const [display, setDisplay] = useState(text);
  const containerRef = useRef(null);

  // Trigger animation when in view
  const animateScramble = () => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplay(prev =>
        text.split("").map((letter, index) => {
          if (index < iteration) return text[index];
          return letters[Math.floor(Math.random() * 26)];
        }).join("")
      );
      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 3;
    }, 30);
  };

  return (
    <motion.span
      ref={containerRef}
      className={className}
      onViewportEnter={animateScramble}
      viewport={{ once: true }}
    >
      {display}
    </motion.span>
  );
};

const lookbookImages = [
  { src: heroImage, titleKey: 'oversizedSilhouettes', subtitleKey: 'log01' },
  { src: lookbook1, titleKey: 'neutralTones', subtitleKey: 'log02' },
  { src: productHoodie1, titleKey: 'premiumTextures', subtitleKey: 'log03' },
  { src: productSweatpants1, titleKey: 'relaxedFits', subtitleKey: 'log04' },
];

const Lookbook = () => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <div ref={containerRef} className="bg-background min-h-screen text-foreground overflow-x-hidden">

      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <img
            src={lookbook1} // Using lookbook image for header
            alt="Lookbook Header"
            className="w-full h-full object-cover grayscale opacity-50"
          />
          <div className="absolute inset-0 bg-black/60" />

          {/* Scanline Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_4px,6px_100%] pointer-events-none opacity-40 mix-blend-overlay" />
        </div>

        <div className="relative z-20 text-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4"
          >
            <span className="inline-block px-3 py-1 border border-white/30 bg-black/50 backdrop-blur-md text-xs font-mono uppercase tracking-[0.2em] text-white">
              {t('lookbook.visualDatabase')}
            </span>
          </motion.div>

          <h1 className="heading-display text-6xl md:text-9xl tracking-tighter text-white mix-blend-difference">
            <GlitchText text={t('lookbook.title')} />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-xl mx-auto mt-6 text-lg font-light text-[#F5DEB3]"
          >
            <ScrambleText text={t('lookbook.tagline')} />
          </motion.p>
        </div>
      </section>

      {/* Editorial Grid */}
      <section className="relative py-24">
        {/* Vertical Guide Line */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-border/30 hidden lg:block h-full z-0" />

        <div className="container-vero space-y-32 relative z-10">
          {lookbookImages.map((image, index) => (
            <LookbookItem
              key={index}
              image={image}
              index={index}
            />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding relative overflow-hidden bg-black text-white text-center border-t border-white/10">
        <div className="relative z-10">
          <h2 className="heading-2 mb-6"><ScrambleText text={t('lookbook.ctaTitle')} /></h2>
          <p className="text-white/60 mb-8 max-w-md mx-auto">
            {t('lookbook.ctaSubtitle')}
          </p>
          <Link to="/shop" className="group relative inline-flex items-center gap-4 px-8 py-3 bg-white text-black font-bold uppercase tracking-widest overflow-hidden hover:bg-white/90 transition-colors">
            <span className="relative z-10">{t('lookbook.ctaButton')}</span>
            <ArrowRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Background noise/grain */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />
      </section>
    </div>
  );
};

interface LookbookItemProps {
  image: { src: string; titleKey: string; subtitleKey: string };
  index: number;
}

const LookbookItem = ({ image, index }: LookbookItemProps) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8 }}
      className={`flex flex-col lg:flex-row gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
    >
      {/* Image Container with Glitch Border */}
      <div className="flex-1 w-full relative group">
        <div className="absolute inset-0 border border-foreground/30 translate-x-2 translate-y-2 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform duration-500" />
        <div className="relative aspect-[3/4] overflow-hidden bg-zinc-900 border border-border">
          <div className="absolute inset-0 bg-foreground/10 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none mix-blend-overlay" />
          <img
            src={image.src}
            alt={t(`lookbook.items.${image.titleKey}`)}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out scale-100 group-hover:scale-105"
          />
        </div>

        {/* Tech Decorators */}
        <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-foreground" />
        <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-foreground" />
      </div>

      {/* Text Container */}
      <div className={`flex-1 text-center ${index % 2 === 1 ? 'lg:text-right' : 'lg:text-left'}`}>
        <motion.div
          initial={{ opacity: 0, x: index % 2 === 1 ? -20 : 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="font-mono text-xs text-muted-foreground mb-4 uppercase tracking-widest">
            <ScrambleText text={t(`lookbook.items.${image.subtitleKey}`)} />
          </p>
          <h2 className="heading-2 mb-6 group cursor-default">
            <GlitchText text={t(`lookbook.items.${image.titleKey}`)} />
          </h2>
          <div className={`h-px w-24 bg-foreground/30 ${index % 2 === 1 ? 'ml-auto mr-auto lg:mr-0' : 'mx-auto lg:mx-0'}`} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Lookbook;
