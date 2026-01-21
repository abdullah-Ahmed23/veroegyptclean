import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Search, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUIStore } from '@/lib/store';
import { searchProducts, products } from '@/data/products';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/store';

export function SearchModal() {
  const { t } = useTranslation();
  const { isSearchOpen, setIsSearchOpen, language } = useUIStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(products.slice(0, 4));

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    if (value.trim()) {
      setResults(searchProducts(value));
    } else {
      setResults(products.slice(0, 4));
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/90 backdrop-blur-md z-50"
            onClick={() => setIsSearchOpen(false)}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 left-0 right-0 z-50 p-4 sm:p-8"
          >
            <div className="max-w-2xl mx-auto bg-card border border-border rounded-sm overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-4 p-4 border-b border-border">
                <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder={t('nav.search')}
                  className="flex-1 bg-transparent text-lg outline-none placeholder:text-muted-foreground"
                  autoFocus
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="btn-ghost p-2 flex-shrink-0"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto p-4">
                {query && results.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No products found for "{query}"
                  </p>
                ) : (
                  <div className="space-y-2">
                    <p className="caption text-muted-foreground mb-4">
                      {query ? 'Results' : 'Popular Products'}
                    </p>
                    <ul className="space-y-2">
                      {results.map((product) => (
                        <motion.li
                          key={product.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <Link
                            to={`/product/${product.handle}`}
                            onClick={() => {
                              setIsSearchOpen(false);
                              setQuery('');
                            }}
                            className="flex items-center gap-4 p-3 rounded-sm hover:bg-secondary transition-colors group"
                          >
                            <div className="w-16 h-20 bg-secondary rounded-sm overflow-hidden flex-shrink-0">
                              <img
                                src={product.images[0]}
                                alt={product.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm truncate">
                                {product.title}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {product.variants[0] && formatPrice(product.variants[0].price, language)}
                              </p>
                            </div>
                            <ArrowRight className={cn(
                              'h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity',
                              language === 'ar' && 'rotate-180'
                            )} />
                          </Link>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border">
                <Link
                  to="/shop"
                  onClick={() => {
                    setIsSearchOpen(false);
                    setQuery('');
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  {t('common.viewAll')} <ArrowRight className={cn('h-4 w-4', language === 'ar' && 'rotate-180')} />
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
