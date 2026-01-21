import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { ShoppingBag, Eye } from 'lucide-react';

interface ProductCardProps {
  product: any;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const { addItem, setIsOpen } = useCartStore();
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [isHovered, setIsHovered] = useState(false);

  // Determine secondary image (use second image if available, else standard fallback)
  const secondaryImage = product.images[1] || product.images[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    setIsOpen(true);
  };

  // Get unique colors from variants
  const uniqueColors = Array.from(new Set(product.variants.map((v: any) => v.color)));

  return (
    <Link
      to={`/product/${product.id}`}
      className="group relative block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary mb-4 w-full">
        {/* Main Image Layer */}
        <div className="absolute inset-0">
          {/* Base Image */}
          <motion.img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Glitch/Swap Image Overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{
                  opacity: 0,
                  clipPath: [
                    "inset(0 0 0 0)",
                    "inset(10% 0 90% 0)",
                    "inset(80% 0 5% 0)",
                    "inset(0 0 0 0)"
                  ],
                  x: [0, -5, 5, 0],
                }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 z-10 bg-background"
              >
                <img
                  src={secondaryImage}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
                {/* Glitch Color Channels */}
                <div className="absolute inset-0 bg-red-500/10 mix-blend-color-dodge animate-pulse opacity-50" style={{ transform: 'translateX(2px)' }} />
                <div className="absolute inset-0 bg-blue-500/10 mix-blend-color-dodge animate-pulse opacity-50" style={{ transform: 'translateX(-2px)' }} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
          {product.isNew && (
            <span className="bg-foreground text-background text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
              New
            </span>
          )}
          {product.onSale && (
            <span className="bg-[#ef4444] text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
              Sale
            </span>
          )}
        </div>

        {/* Quick Add Button - Always visible on mobile */}
        <div className="absolute bottom-4 right-4 z-20 md:translate-y-4 md:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={handleAddToCart}
            className="bg-white/90 backdrop-blur text-black p-3 hover:bg-black hover:text-white transition-colors shadow-lg group/btn overflow-hidden relative"
          >
            <ShoppingBag className="w-5 h-5 relative z-10" />
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="font-bold text-sm uppercase tracking-wide group-hover:text-muted-foreground transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mt-3">
          <p className="text-sm font-medium text-muted-foreground">
            {product.variants[0]?.price?.toLocaleString()} EGP
          </p>
        </div>

        {/* Modern Interactive Color Swatches - Bigger & Separated */}
        <div className="flex gap-2 mt-2" onClick={(e) => e.preventDefault()}>
          {uniqueColors.slice(0, 5).map((color: any, i) => {
            const variant = product.variants.find((v: any) => v.color === color);
            const isActive = activeImage === product.images[i] || (i === 0 && activeImage === product.images[0]); // Simple check logic

            return (
              <div
                key={color}
                className={cn(
                  "w-6 h-6 rounded-full border border-border cursor-pointer transition-all duration-300 relative",
                  "hover:scale-110 hover:border-black dark:hover:border-white",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  // Disable hover effects on touch devices
                  "@media (pointer: coarse) { hover:scale-100 hover:border-border }"
                )}
                style={{ backgroundColor: variant?.colorHex }}
                title={color}
                onMouseEnter={() => {
                  // Optionally preview on hover
                  if (product.images[i]) setActiveImage(product.images[i]);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (product.images[i]) setActiveImage(product.images[i]);
                }}
              >
                {/* Active Indicator Ring if needed, or just rely on border */}
              </div>
            );
          })}
          {uniqueColors.length > 5 && (
            <div className="w-6 h-6 rounded-full bg-muted border border-border flex items-center justify-center text-[10px] font-bold text-muted-foreground">
              +{uniqueColors.length - 5}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

