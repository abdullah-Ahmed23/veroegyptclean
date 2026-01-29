import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { SlidersHorizontal, X, ChevronDown, Check } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { cn } from '@/lib/utils';
import { useProducts } from '@/hooks/useProducts';

type SortOption = 'featured' | 'newest' | 'price-low-high' | 'price-high-low';

const Shop = () => {
  const { t } = useTranslation();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  const { products: allProducts, loading } = useProducts();

  const sizes = useMemo(() => {
    const s = new Set<string>();
    allProducts.forEach(p => p.variants.forEach(v => s.add(v.size)));
    return Array.from(s).sort();
  }, [allProducts]);

  const colors = useMemo(() => {
    const c = new Set<string>();
    allProducts.forEach(p => p.variants.forEach(v => c.add(v.color)));
    return Array.from(c).sort();
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Filter by size
    if (selectedSizes.length > 0) {
      result = result.filter(p =>
        p.variants.some(v => selectedSizes.includes(v.size) && v.available)
      );
    }

    // Filter by color
    if (selectedColors.length > 0) {
      result = result.filter(p =>
        p.variants.some(v => selectedColors.includes(v.color))
      );
    }

    // Filter by price
    result = result.filter(p =>
      p.variants.some(v => v.price >= priceRange[0] && v.price <= priceRange[1])
    );

    // Sort
    switch (sortBy) {
      case 'newest':
        result = result.filter(p => p.isNew).concat(result.filter(p => !p.isNew));
        break;
      case 'price-low-high':
        result.sort((a, b) => (a.variants[0]?.price || 0) - (b.variants[0]?.price || 0));
        break;
      case 'price-high-low':
        result.sort((a, b) => (b.variants[0]?.price || 0) - (a.variants[0]?.price || 0));
        break;
    }

    return result;
  }, [allProducts, selectedSizes, selectedColors, priceRange, sortBy]);

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const clearFilters = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange([0, 5000]);
  };

  const hasActiveFilters = selectedSizes.length > 0 || selectedColors.length > 0 || priceRange[0] > 0 || priceRange[1] < 5000;

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">

      {/* Marquee Banner */}
      <div className="overflow-hidden border-b border-border bg-foreground text-background py-3 mb-10">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap gap-8"
        >
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-sm font-bold uppercase tracking-[0.2em] flex items-center gap-8">
              {t('shop.marquee.newCollection')} <span className="w-2 h-2 rounded-full bg-background" />
              {t('shop.marquee.limitedEdition')} <span className="w-2 h-2 rounded-full bg-background" />
              {t('shop.marquee.freeShipping')} <span className="w-2 h-2 rounded-full bg-background" />
            </span>
          ))}
        </motion.div>
      </div>

      <div className="container-vero">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="heading-display mb-4"
            >
              {t('shop.title')}
            </motion.h1>
            <p className="text-muted-foreground max-w-sm">
              {t('shop.description')}
            </p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="btn-secondary flex-1 md:flex-none flex items-center justify-center gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>{t('shop.filters')}</span>
              {hasActiveFilters && (
                <span className="flex h-1.5 w-1.5 rounded-full bg-foreground" />
              )}
            </button>

            <div className="relative group">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none bg-transparent border border-border px-4 py-4 pr-10 text-sm font-medium uppercase tracking-wider focus:outline-none w-full cursor-pointer hover:bg-secondary transition-colors"
              >
                <option value="featured">{t('shop.sort.featured')}</option>
                <option value="newest">{t('shop.sort.newest')}</option>
                <option value="price-low-high">{t('shop.sort.priceLowHigh')}</option>
                <option value="price-high-low">{t('shop.sort.priceHighLow')}</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Filters Drawer (Expandable) */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-12"
            >
              <div className="p-6 border border-border bg-secondary/30 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-muted-foreground">{t('product.selectSize')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={cn(
                          "h-10 w-10 flex items-center justify-center border text-sm font-medium transition-all",
                          selectedSizes.includes(size)
                            ? "bg-foreground text-background border-foreground"
                            : "bg-transparent border-border hover:border-foreground"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-muted-foreground">{t('product.selectColor')}</h3>
                  <div className="flex flex-wrap gap-3">
                    {colors.map(color => (
                      <button
                        key={color}
                        onClick={() => toggleColor(color)}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 border text-sm transition-all",
                          selectedColors.includes(color)
                            ? "bg-foreground text-background border-foreground"
                            : "bg-transparent border-border hover:border-foreground"
                        )}
                      >
                        <div className="w-3 h-3 rounded-full border border-border" style={{ backgroundColor: color.toLowerCase() }} />
                        <span className="capitalize">{color}</span>
                        {selectedColors.includes(color) && <Check className="w-3 h-3 ml-1" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-end justify-end">
                  <button
                    onClick={clearFilters}
                    className="text-sm underline underline-offset-4 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t('shop.clearFilters')}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Grid */}
        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12">
          <AnimatePresence mode='popLayout'>
            {loading ? (
              // Loading Skeleton Grid
              [...Array(8)].map((_, i) => (
                <div key={i} className="space-y-4 animate-pulse">
                  <div className="aspect-[3/4] bg-muted rounded-sm" />
                  <div className="h-4 bg-muted w-2/3 rounded" />
                  <div className="h-4 bg-muted w-1/3 rounded" />
                </div>
              ))
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-20 text-center"
              >
                <p className="text-xl text-muted-foreground">{t('shop.noProducts')}</p>
                <button onClick={clearFilters} className="mt-4 underline text-foreground">{t('shop.clearFilters')}</button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Shop;
