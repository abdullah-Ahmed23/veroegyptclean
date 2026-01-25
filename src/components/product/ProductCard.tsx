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

// Helper for Title (Standard)
const ProductTitle = ({ text }: { text: string }) => {
  return (
    <span className="block transition-transform duration-300 group-hover:-translate-y-[2px]">{text}</span>
  );
};

export function ProductCard({ product, index }: ProductCardProps) {
  const { addItem, setIsOpen } = useCartStore();
  const [activeImage, setActiveImage] = useState(product.images[0]);
  // ...
  const [isHovered, setIsHovered] = useState(false);

  const secondaryImage = product.images[1] || product.images[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    setIsOpen(true);
  };

  const uniqueColors = Array.from(new Set(product.variants.map((v: any) => v.color)));

  return (
    <Link
      to={`/product/${product.id}`}
      className="group relative block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-zinc-900 mb-4 w-full">
        {/* Main Image Layer */}
        <div className="absolute inset-0">
          <motion.img
            src={activeImage}
            alt={product.name}
            className="h-full w-full object-cover grayscale-[0.1] group-hover:grayscale-0 transition-all duration-300"
          />

          {/* Secondary Image Swap (Opaque - Fixes Ghosting) */}
          <AnimatePresence>
            {isHovered && secondaryImage !== activeImage && (
              <motion.img
                src={secondaryImage}
                alt=""
                className="absolute inset-0 w-full h-full object-cover z-10"
                initial={{ clipPath: "inset(0 0 100% 0)" }}
                animate={{ clipPath: "inset(0 0 0 0)" }}
                exit={{ clipPath: "inset(100% 0 0 0)" }}
                transition={{ duration: 0.3, ease: "circOut" }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Badges - clean */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-20">
          {product.isNew && (
            <span className="bg-white text-black text-[10px] font-bold px-1.5 py-0.5 uppercase border-2 border-transparent group-hover:border-black transition-colors">
              New
            </span>
          )}
          {product.onSale && (
            <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 uppercase">
              Sale
            </span>
          )}
        </div>

        {/* Slide Up Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-30 translate-y-full group-hover:translate-y-0 transition-transform duration-200 ease-out">
          <button
            onClick={handleAddToCart}
            className="w-full bg-black text-white py-3 uppercase tracking-widest text-xs font-bold hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-2"
          >
            Add to Cart
          </button>
        </div>
      </div>

      <div className="space-y-1.5 text-center">
        <h3 className="font-display font-bold text-sm uppercase tracking-wider text-foreground">
          <ProductTitle text={product.name} />
        </h3>

        <p className="text-sm font-medium text-muted-foreground/80 font-mono">
          {product.variants[0]?.price?.toLocaleString()} EGP
        </p>

        {/* Color Swatches */}
        {uniqueColors.length > 0 && (
          <div className="flex justify-center gap-1.5 pt-1" onClick={(e) => e.preventDefault()}>
            {uniqueColors.slice(0, 5).map((color: any, i) => {
              const variant = product.variants.find((v: any) => v.color === color);

              return (
                <div
                  key={color}
                  className={cn(
                    "w-3 h-3 border border-border/50 cursor-pointer transition-all duration-300",
                    activeImage === product.images[i] ? "bg-foreground scale-110" : "bg-transparent hover:bg-foreground/20"
                  )}
                  style={{ backgroundColor: activeImage === product.images[i] ? undefined : variant?.colorHex }}
                  title={color}
                  onMouseEnter={() => {
                    if (product.images[i]) setActiveImage(product.images[i]);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (product.images[i]) setActiveImage(product.images[i]);
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
    </Link>
  );
}

