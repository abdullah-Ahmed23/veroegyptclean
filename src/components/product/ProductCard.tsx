import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore, formatPrice } from '@/lib/store';
import { cn } from '@/lib/utils';
import { ShoppingBag, Eye, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { QuickShopModal } from './QuickShopModal';

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
  const { language } = useUIStore();
  const { t } = useTranslation();
  const [activeImage, setActiveImage] = useState(product.images[0]);
  // ...
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickShopOpen, setIsQuickShopOpen] = useState(false);

  const secondaryImage = product.images[1] || product.images[0];

  const handleQuickShop = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickShopOpen(true);
  };

  const uniqueColors = Array.from(new Set(product.variants.map((v: any) => v.color)));
  const uniqueSizes = Array.from(new Set(product.variants.map((v: any) => v.size)));

  return (
    <>
      <Link
        to={`/product/${product.handle}`}
        className="group relative block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-muted mb-4 w-full">
          {/* Main Image Layer */}
          <div className="absolute inset-0">
            <motion.img
              src={activeImage}
              alt={language === 'ar' ? (product.title_ar || product.title_en) : (product.title_en || product.title_ar)}
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
                {t('product.newArrival')}
              </span>
            )}
            {product.onSale && (
              <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 uppercase">
                {t('common.sale')}
              </span>
            )}
          </div>

          {/* Slide Up Bar */}
          <div className="absolute bottom-0 left-0 right-0 z-30 translate-y-full group-hover:translate-y-0 transition-transform duration-200 ease-out">
            <button
              onClick={handleQuickShop}
              className="w-full bg-black text-white py-3 uppercase tracking-widest text-[10px] font-black hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-2 group/btn"
            >
              <Zap className="w-3 h-3 text-vero-gold fill-vero-gold group-hover/btn:animate-pulse" />
              {t('common.quickAdd')}
            </button>
          </div>
        </div>

        <div className="space-y-1.5 text-center">
          <h3 className="font-display font-bold text-sm uppercase tracking-wider text-foreground">
            <ProductTitle text={language === 'ar' ? (product.title_ar || product.title_en) : (product.title_en || product.title_ar)} />
          </h3>

          <div className="flex items-center justify-center gap-2">
            <p className="text-sm font-bold text-vero-gold font-mono">
              {formatPrice(product.variants[0]?.price || 0, language)}
            </p>
            {product.variants[0]?.compareAtPrice && (
              <p className="text-xs font-medium text-muted-foreground/60 line-through font-mono">
                {formatPrice(product.variants[0].compareAtPrice, language)}
              </p>
            )}
          </div>

          {/* Size Selection Preview */}
          {uniqueSizes.length > 0 && (
            <div className="flex justify-center gap-2 pt-2">
              {uniqueSizes.map((size: string) => (
                <span key={size} className="text-[10px] font-bold text-muted-foreground/60 border border-border/30 px-1.5 py-0.5 rounded">
                  {size}
                </span>
              ))}
            </div>
          )}

          {/* Color Swatches */}
          {uniqueColors.length > 0 && (
            <div className="flex justify-center gap-1.5 pt-2" onClick={(e) => e.preventDefault()}>
              {uniqueColors.slice(0, 5).map((color: any, i) => {
                const variant = product.variants.find((v: any) => v.color === color);

                return (
                  <div
                    key={color}
                    className={cn(
                      "w-3 h-3 border border-border/50 cursor-pointer transition-all duration-300",
                      activeImage === (variant?.image_url || product.images[i]) ? "bg-foreground scale-110" : "bg-transparent hover:bg-foreground/20"
                    )}
                    style={{ backgroundColor: activeImage === (variant?.image_url || product.images[i]) ? undefined : variant?.colorHex }}
                    title={color}
                    onMouseEnter={() => {
                      const img = variant?.image_url || product.images[i];
                      if (img) setActiveImage(img);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      const img = variant?.image_url || product.images[i];
                      if (img) setActiveImage(img);
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>
      </Link>

      <QuickShopModal
        product={product}
        isOpen={isQuickShopOpen}
        onClose={() => setIsQuickShopOpen(false)}
      />
    </>
  );
}
