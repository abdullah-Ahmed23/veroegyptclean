import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { collections, getProductsByCollection, products } from '@/data/products';
import { useUIStore } from '@/lib/store';
import { cn } from '@/lib/utils';

// Import images
import productHoodie1 from '@/assets/product-hoodie-1.jpg';
import productHoodie2 from '@/assets/product-hoodie-2.jpg';
import productSweatpants1 from '@/assets/product-sweatpants-1.jpg';
import productSweatpants2 from '@/assets/product-sweatpants-2.jpg';
import lookbook1 from '@/assets/lookbook-1.jpg';

const getProductImages = (index: number) => [
  index % 2 === 0 ? productHoodie1 : productSweatpants1,
  index % 2 === 0 ? productHoodie2 : productSweatpants2,
  lookbook1,
];

const Collection = () => {
  const { handle } = useParams<{ handle: string }>();
  const { t, i18n } = useTranslation();
  const { language } = useUIStore();

  const collection = collections.find(c => c.handle === handle);
  const collectionProducts = getProductsByCollection(handle || '').map((p, i) => ({
    ...p,
    images: getProductImages(i),
  }));

  if (!collection) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Collection not found</p>
      </div>
    );
  }

  const title = language === 'ar' ? collection.titleAr : collection.title;
  const description = language === 'ar' ? collection.descriptionAr : collection.description;

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
      {collection.comingSoon ? (
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
