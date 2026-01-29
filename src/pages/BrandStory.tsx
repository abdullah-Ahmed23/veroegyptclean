import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/lib/store';

// Import images
import heroImage from '@/assets/hero-1.jpg';
import lookbook1 from '@/assets/lookbook-1.jpg';

// --- Glitch Text Component (Hover RGB Shift) ---
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

// --- Scramble Text Component (Scroll Reveal) ---
const ScrambleText = ({ text, className }: { text: string, className?: string }) => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";
  const [display, setDisplay] = useState(text);
  const containerRef = useRef(null);

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

// --- Timeline Item Component ---
const TimelineItem = ({ item, index, language }: { item: any, index: number, language: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className={`relative flex flex-col md:flex-row gap-8 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
    >
      {/* Content Box */}
      <div className="flex-1 w-full group">
        <div className={cn(
          "relative p-6 border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-foreground/50",
          language === 'ar' ? 'text-right' : 'text-left'
        )}>
          {/* Glitch Hover Effect Background */}
          <div className="absolute inset-0 bg-foreground/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />

          {/* Corner Accents */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-foreground/30" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-foreground/30" />

          <span className="block text-xs font-mono text-muted-foreground mb-2 group-hover:text-foreground transition-colors">
            [ {item.year} ]
          </span>
          <h3 className="heading-3 mb-2 relative z-10 group-hover:translate-x-1 transition-transform">
            {item.title}
          </h3>
          <p className="text-muted-foreground relative z-10 text-sm md:text-base leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>

      {/* Center Line Node */}
      <div className="relative flex items-center justify-center">
        <div className="w-px h-24 md:h-full bg-border absolute top-0 bottom-0 md:left-1/2 md:-translate-x-px" />
        <div className="w-3 h-3 bg-background border-2 border-foreground relative z-10 rotate-45 transform transition-transform duration-500 hover:rotate-180 hover:scale-125 hover:bg-foreground" />
      </div>

      <div className="flex-1 w-full hidden md:block" />
    </motion.div>
  );
};

const BrandStory = () => {
  const { t } = useTranslation();
  const { language } = useUIStore();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const protocols = [
    { key: 'zeroCompromise' },
    { key: 'engineeredFit' },
    { key: 'silentLuxury' }
  ];

  const timeline = [
    {
      year: t('brandStory.timeline.inception.year'),
      title: t('brandStory.timeline.inception.title'),
      description: t('brandStory.timeline.inception.desc'),
    },
    {
      year: t('brandStory.timeline.prototype.year'),
      title: t('brandStory.timeline.prototype.title'),
      description: t('brandStory.timeline.prototype.desc'),
    },
    {
      year: t('brandStory.timeline.growth.year'),
      title: t('brandStory.timeline.growth.title'),
      description: t('brandStory.timeline.growth.desc'),
    },
    {
      year: t('brandStory.timeline.expansion.year'),
      title: t('brandStory.timeline.expansion.title'),
      description: t('brandStory.timeline.expansion.desc'),
    },
  ];

  return (
    <div ref={containerRef} className="bg-background min-h-screen text-foreground overflow-x-hidden">

      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-black">
        {/* Background Image with Scanlines */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="VERO Origin"
            className="w-full h-full object-cover grayscale opacity-60"
          />
          <div className="absolute inset-0 bg-black/50" /> {/* Dark Tint */}

          {/* Scanline Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_4px,6px_100%] pointer-events-none opacity-40 mix-blend-overlay" />
        </div>

        <div className="relative z-20 text-center px-4">
          <h1 className="heading-display text-6xl md:text-8xl lg:text-9xl tracking-tighter mix-blend-difference text-white">
            <GlitchText text={t('brandStory.title')} />
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-2xl mx-auto mt-6 text-lg md:text-xl font-light text-[#F5DEB3]"
          >
            <ScrambleText text={t('brandStory.tagline')} /> <br />
            <span className="text-white font-medium">{t('brandStory.builtForNewWorld')}</span>
          </motion.div>
        </div>
      </section>

      {/* Manifesto - Tech Terminal Style */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-900 border-y border-border relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <div className="w-32 h-32 border-r-2 border-t-2 border-foreground" />
        </div>

        <div className="container-vero max-w-4xl relative z-10">
          <div className={cn("flex items-start gap-4 md:gap-8", language === 'ar' ? 'flex-row-reverse text-right' : 'flex-row text-left')}>
            <span className="text-6xl text-foreground/10 font-mono hidden md:block">"</span>
            <blockquote className="space-y-6">
              <p className="heading-3 md:heading-2 leading-tight">
                {t('brandStory.manifesto.line1')}
                <span className="text-muted-foreground line-through decoration-red-500/50">{t('brandStory.manifesto.loudLogos')}</span>
                {t('brandStory.manifesto.vs')}
                <span className="bg-foreground text-background px-2">{t('brandStory.manifesto.quietPower')}</span>.
                {t('brandStory.manifesto.line2')}
              </p>
              <footer className={cn("text-sm font-mono text-muted-foreground flex items-center gap-4", language === 'ar' ? 'flex-row-reverse' : 'flex-row')}>
                <span className="h-px w-12 bg-border" />
                <span>{t('brandStory.founders')}</span>
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="section-padding">
        <div className="container-vero">
          <div className={cn("flex flex-col md:flex-row justify-between items-end mb-16 gap-4", language === 'ar' ? 'md:flex-row-reverse' : '')}>
            <h2 className="heading-2 uppercase tracking-tighter"><ScrambleText text={t('brandStory.protocols.title')} /></h2>
            <span className="text-xs font-mono text-muted-foreground">{t('brandStory.protocols.loading')}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {protocols.map((val, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "group border border-border p-8 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-300 relative overflow-hidden",
                  language === 'ar' ? 'text-right' : 'text-left'
                )}
              >
                {/* Hover Glitch Line */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-foreground scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                <h3 className="font-mono text-lg font-bold mb-4">{t(`brandStory.protocols.${val.key}.title`)}</h3>
                <p className="text-muted-foreground leading-relaxed">{t(`brandStory.protocols.${val.key}.desc`)}</p>

                <div className={cn("absolute bottom-4 opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[10px] text-muted-foreground", language === 'ar' ? 'left-4' : 'right-4')}>
                  SEC_{i + 1}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding relative">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-border/50 hidden md:block" />

        <div className="container-vero relative z-10 space-y-2">
          <div className="text-center mb-16">
            <h2 className="heading-2"><ScrambleText text={t('brandStory.timeline.title')} /></h2>
          </div>

          <div className="max-w-5xl mx-auto space-y-12 md:space-y-0">
            {timeline.map((item, index) => (
              <TimelineItem key={index} item={item} index={index} language={language} />
            ))}
          </div>
        </div>
      </section>

      {/* Atelier Image */}
      <section className="h-[50vh] relative overflow-hidden group">
        <img src={lookbook1} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Atelier" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="heading-1 text-white mix-blend-overlay opacity-50 select-none"><ScrambleText text={t('brandStory.designLab')} /></h2>
        </div>
      </section>

    </div>
  );
};

export default BrandStory;
