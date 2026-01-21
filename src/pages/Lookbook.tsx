import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// Import images
import heroImage from '@/assets/hero-1.jpg';
import lookbook1 from '@/assets/lookbook-1.jpg';
import productHoodie1 from '@/assets/product-hoodie-1.jpg';
import productSweatpants1 from '@/assets/product-sweatpants-1.jpg';

const lookbookImages = [
  { src: heroImage, title: 'Oversized Silhouettes', subtitle: 'Fall 2024' },
  { src: lookbook1, title: 'Neutral Tones', subtitle: 'Essential Layers' },
  { src: productHoodie1, title: 'Premium Textures', subtitle: 'Heavyweight Fleece' },
  { src: productSweatpants1, title: 'Relaxed Fits', subtitle: 'Everyday Comfort' },
];

const Lookbook = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <div ref={containerRef} className="pt-24">
      {/* Header */}
      <section className="container-vero py-16 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="caption text-muted-foreground mb-4"
        >
          Fall/Winter 2024
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="heading-display mb-6"
        >
          Lookbook
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="body-large text-muted-foreground max-w-xl mx-auto"
        >
          A visual exploration of our latest collection.
          Understated luxury meets everyday comfort.
        </motion.p>
      </section>

      {/* Editorial Grid */}
      <section className="container-vero pb-24">
        <div className="space-y-8">
          {lookbookImages.map((image, index) => (
            <LookbookItem
              key={index}
              image={image}
              index={index}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-card text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="heading-2 mb-6">Shop the Collection</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Every piece in this lookbook is available now.
            Explore our full range of premium streetwear.
          </p>
          <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
            Shop All <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

interface LookbookItemProps {
  image: { src: string; title: string; subtitle: string };
  index: number;
  scrollYProgress: any;
}

const LookbookItem = ({ image, index }: LookbookItemProps) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  return (
    <motion.div
      ref={itemRef}
      style={{ opacity }}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${index % 2 === 1 ? 'lg:grid-flow-dense' : ''
        }`}
    >
      {/* Image */}
      <motion.div
        style={{ y, scale }}
        className={`relative aspect-[3/4] overflow-hidden ${index % 2 === 1 ? 'lg:col-start-2' : ''
          }`}
      >
        <img
          src={image.src}
          alt={image.title}
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Text */}
      <div className={`${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1 lg:text-right' : ''}`}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="caption text-muted-foreground mb-2"
        >
          {image.subtitle}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="heading-2"
        >
          {image.title}
        </motion.h2>
      </div>
    </motion.div>
  );
};

export default Lookbook;
