import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { useUIStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { useCollections } from '@/hooks/useCollections';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';

const Collection = () => {
  const { handle } = useParams<{ handle: string }>();
  const { t, i18n } = useTranslation();
  const { language } = useUIStore();

  const { collections: allCollections, loading: collectionsLoading } = useCollections();
  const { categories: allCategories, loading: categoriesLoading } = useCategories();
  const { products: allProducts, loading: productsLoading } = useProducts(handle);

  const collection = allCollections.find(c => c.handle === handle);
  const category = allCategories.find(c => c.handle === handle);

  const activeEntity = collection || category;
  const collectionProducts = allProducts;

  if (collectionsLoading || categoriesLoading || productsLoading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }
  if (!activeEntity) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Collection not found</p>
      </div>
    );
  }

  const title = activeEntity.title;
  const description = activeEntity.description;

  return (
    <div className="pt-24">
      {/* Header */}
      <div className="container-vero py-12 border-b border-border">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className={cn('h-4 w-4', language === 'ar' && 'rotate-180')} />
          {t('common.back')}
        </Link>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="heading-1 mb-4"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground max-w-xl"
        >
          {description}
        </motion.p>
      </div>

      {/* Coming Soon */}
      {('comingSoon' in activeEntity && activeEntity.comingSoon) ? (
        <div className="container-vero section-padding text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <p className="caption text-vero-gold mb-4">Coming Soon</p>
            <h2 className="heading-3 mb-4">Stay Tuned</h2>
            <p className="text-muted-foreground mb-8">
              We're working on something special. Sign up to be notified when this collection drops.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="input-vero flex-1 border border-border px-4 py-3"
              />
              <button type="submit" className="btn-primary">
                Notify Me
              </button>
            </form>
          </motion.div>
        </div>
      ) : (
        /* Product Grid */
        <div className="container-vero section-padding">
          {collectionProducts.length === 0 ? (
            <p className="text-center text-muted-foreground">No products in this collection yet.</p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {collectionProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Collection;
