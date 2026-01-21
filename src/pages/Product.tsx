import { useParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Minus, Plus, Truck, RotateCcw, Ruler, Check } from 'lucide-react';
import { getProductByHandle, products } from '@/data/products';
import { useCartStore, useUIStore, formatPrice } from '@/lib/store';
import { ProductCard } from '@/components/product/ProductCard';
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

const Product = () => {
  const { handle } = useParams<{ handle: string }>();
  const { t } = useTranslation();
  const { language } = useUIStore();
  const { addItem, setIsOpen } = useCartStore();

  const productIndex = products.findIndex(p => p.handle === handle);
  const baseProduct = getProductByHandle(handle || '');
  const product = baseProduct ? {
    ...baseProduct,
    images: getProductImages(productIndex),
  } : null;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [expandedSection, setExpandedSection] = useState<string | null>('details');
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const uniqueColors = useMemo(() => {
    if (!product) return [];
    return [...new Set(product.variants.map(v => v.color))];
  }, [product]);

  const uniqueSizes = useMemo(() => {
    if (!product) return [];
    return [...new Set(product.variants.map(v => v.size))];
  }, [product]);

  const selectedVariant = useMemo(() => {
    if (!product || !selectedSize || !selectedColor) return null;
    return product.variants.find(v => v.size === selectedSize && v.color === selectedColor);
  }, [product, selectedSize, selectedColor]);

  const isAddToCartDisabled = !selectedVariant || !selectedVariant.available;

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      title: product.title,
      image: product.images[0],
      size: selectedVariant.size,
      color: selectedVariant.color,
      price: selectedVariant.price,
      quantity,
    });

    setIsOpen(true);
  };

  // Related products
  const relatedProducts = products
    .filter(p => p.id !== product?.id && p.category === product?.category)
    .slice(0, 4)
    .map((p, i) => ({
      ...p,
      images: getProductImages(i + 1),
    }));

  if (!product) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Product not found</p>
      </div>
    );
  }

  return (
    <div className="pt-24">
      <div className="container-vero section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <motion.div
              key={selectedImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-[3/4] bg-secondary overflow-hidden"
            >
              <img
                src={product.images[selectedImageIndex]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Thumbnails */}
            <div className="flex gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={cn(
                    'w-20 h-24 bg-secondary overflow-hidden border-2 transition-colors',
                    selectedImageIndex === index ? 'border-foreground' : 'border-transparent'
                  )}
                >
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            {/* Badges */}
            {product.isNew && (
              <span className="badge-vero mb-4 inline-block">
                {t('product.newArrival')}
              </span>
            )}

            <h1 className="heading-2 mb-4">{product.title}</h1>

            {/* Price */}
            <p className="price-display text-xl mb-6">
              {selectedVariant
                ? formatPrice(selectedVariant.price, language)
                : formatPrice(product.variants[0].price, language)}
            </p>

            {/* Color Selection */}
            <div className="mb-6">
              <p className="text-sm font-medium mb-3">
                {t('product.selectColor')}: {selectedColor || '—'}
              </p>
              <div className="flex gap-2">
                {uniqueColors.map(color => {
                  const variant = product.variants.find(v => v.color === color);
                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        'w-10 h-10 rounded-full border-2 transition-all',
                        selectedColor === color ? 'border-foreground scale-110' : 'border-border'
                      )}
                      style={{ backgroundColor: variant?.colorHex }}
                      title={color}
                    />
                  );
                })}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium">
                  {t('product.selectSize')}: {selectedSize || '—'}
                </p>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <Ruler className="h-4 w-4" />
                  {t('product.sizeGuide')}
                </button>
              </div>
              <div className="flex gap-2">
                {uniqueSizes.map(size => {
                  const variant = product.variants.find(
                    v => v.size === size && v.color === (selectedColor || uniqueColors[0])
                  );
                  const isAvailable = variant?.available ?? false;

                  return (
                    <button
                      key={size}
                      onClick={() => isAvailable && setSelectedSize(size)}
                      disabled={!isAvailable}
                      className={cn(
                        'w-14 h-14 border text-sm font-medium transition-all',
                        selectedSize === size
                          ? 'border-foreground bg-foreground text-background'
                          : isAvailable
                            ? 'border-border hover:border-foreground'
                            : 'border-border/50 text-muted-foreground/50 cursor-not-allowed line-through'
                      )}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <p className="text-sm font-medium mb-3">Quantity</p>
              <div className="inline-flex items-center border border-border">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-secondary transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-6 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-secondary transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={isAddToCartDisabled}
              className={cn(
                'btn-primary w-full mb-4',
                isAddToCartDisabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {!selectedSize || !selectedColor
                ? 'Select Options'
                : selectedVariant?.available
                  ? t('product.addToCart')
                  : t('product.outOfStock')}
            </button>

            {/* Availability */}
            {selectedVariant && (
              <p className={cn(
                'text-sm mb-6 flex items-center gap-2',
                selectedVariant.available ? 'text-foreground' : 'text-muted-foreground'
              )}>
                <Check className="h-4 w-4" />
                {selectedVariant.available ? t('product.inStock') : t('product.outOfStock')}
              </p>
            )}

            {/* Accordion */}
            <div className="border-t border-border">
              {/* Details */}
              <div className="border-b border-border">
                <button
                  onClick={() => setExpandedSection(expandedSection === 'details' ? null : 'details')}
                  className="w-full flex items-center justify-between py-4"
                >
                  <span className="font-medium">{t('product.details')}</span>
                  <ChevronDown className={cn(
                    'h-5 w-5 transition-transform',
                    expandedSection === 'details' && 'rotate-180'
                  )} />
                </button>
                {expandedSection === 'details' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="pb-4"
                  >
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                  </motion.div>
                )}
              </div>

              {/* Shipping */}
              <div className="border-b border-border">
                <button
                  onClick={() => setExpandedSection(expandedSection === 'shipping' ? null : 'shipping')}
                  className="w-full flex items-center justify-between py-4"
                >
                  <span className="font-medium">{t('product.shipping')}</span>
                  <ChevronDown className={cn(
                    'h-5 w-5 transition-transform',
                    expandedSection === 'shipping' && 'rotate-180'
                  )} />
                </button>
                {expandedSection === 'shipping' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="pb-4 space-y-4"
                  >
                    <div className="flex items-start gap-3">
                      <Truck className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Free Shipping</p>
                        <p className="text-sm text-muted-foreground">
                          On orders over 2,000 EGP. Standard delivery 3-5 business days.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <RotateCcw className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">14-Day Returns</p>
                        <p className="text-sm text-muted-foreground">
                          Free returns within 14 days of delivery.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-24">
            <h2 className="heading-3 mb-8">{t('product.completeTheLook')}</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {relatedProducts.map((p, index) => (
                <ProductCard key={p.id} product={p} index={index} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border max-w-lg w-full p-8"
          >
            <h3 className="heading-4 mb-6">{t('product.sizeGuide')}</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2">Size</th>
                  <th className="text-left py-2">Chest (cm)</th>
                  <th className="text-left py-2">Length (cm)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-2">S</td>
                  <td className="py-2">112</td>
                  <td className="py-2">70</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2">M</td>
                  <td className="py-2">118</td>
                  <td className="py-2">72</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2">L</td>
                  <td className="py-2">124</td>
                  <td className="py-2">74</td>
                </tr>
                <tr>
                  <td className="py-2">XL</td>
                  <td className="py-2">130</td>
                  <td className="py-2">76</td>
                </tr>
              </tbody>
            </table>
            <button
              onClick={() => setShowSizeGuide(false)}
              className="btn-primary w-full mt-8"
            >
              {t('common.close')}
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Product;
