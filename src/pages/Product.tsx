import { useParams } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Minus, Plus, Truck, RotateCcw, Ruler, Check } from 'lucide-react';
import { getProductByHandle, products } from '@/data/products';
import { useCartStore, useUIStore, formatPrice } from '@/lib/store';
import { ProductCard } from '@/components/product/ProductCard';
import { cn } from '@/lib/utils';

import { toast } from 'sonner';
import { useProduct } from '@/hooks/useProduct';
import { useProducts } from '@/hooks/useProducts';

const Product = () => {
  const { handle } = useParams<{ handle: string }>();
  const { t } = useTranslation();
  const { language } = useUIStore();
  const { addItem, setIsOpen } = useCartStore();

  const { product, loading: productLoading } = useProduct(handle);
  const { products: allProducts, loading: productsLoading } = useProducts();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [expandedSection, setExpandedSection] = useState<string | null>('details');
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const uniqueColors = useMemo(() => {
    if (!product) return [];
    const colors = new Set(product.variants.map(v => v.color));
    return Array.from(colors);
  }, [product]);

  const uniqueSizes = useMemo(() => {
    if (!product) return [];
    const sizes = new Set(product.variants.map(v => v.size));
    return Array.from(sizes);
  }, [product]);

  const selectedVariant = useMemo(() => {
    if (!product || !selectedSize || !selectedColor) return null;
    return product.variants.find(v => v.size === selectedSize && v.color === selectedColor);
  }, [product, selectedSize, selectedColor]);

  // Handle color selection to switch image
  useEffect(() => {
    if (product && selectedColor) {
      const variantWithImage = product.variants.find(v => v.color === selectedColor && v.image_url);
      if (variantWithImage?.image_url) {
        // If the main images contain this variant image, find its index
        const index = product.images.indexOf(variantWithImage.image_url);
        if (index !== -1) {
          setSelectedImageIndex(index);
        } else {
          // If not in the main images array (unlikely but possible), 
          // we could either add it or just display it.
          // For now, let's assume if it exists, it might be one of the images.
          // Better: If it has a specific image_url, we show that.
        }
      }
    }
  }, [selectedColor, product]);

  const displayImages = useMemo(() => {
    if (!product) return [];
    // If a variant image is selected, we might want to emphasize it.
    // However, the user wants "change the image".
    return product.images;
  }, [product]);

  const mainImageToShow = useMemo(() => {
    if (!product) return '';
    // If we have a selected variant with an image, use it, otherwise use selectedImageIndex
    if (selectedColor) {
      const variantWithImage = product.variants.find(v => v.color === selectedColor && v.image_url);
      if (variantWithImage?.image_url) return variantWithImage.image_url;
    }
    return product.images[selectedImageIndex] || '';
  }, [product, selectedColor, selectedImageIndex]);

  const isAddToCartDisabled = !selectedVariant || !selectedVariant.available || productLoading;

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    // Check if cart has custom items
    const hasCustomItems = useCartStore.getState().items.some(i => i.price === 0);
    if (hasCustomItems) {
      toast.error(t('cart.clearCustomFirst'));
      return;
    }

    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      title: language === 'ar' ? (product.title_ar || product.title_en) : (product.title_en || product.title_ar),
      image: selectedVariant.image_url || product.images[0] || '/placeholder.svg',
      size: selectedVariant.size,
      color: selectedVariant.color,
      price: selectedVariant.price,
      quantity,
      stock: selectedVariant.stock,
    });

    setIsOpen(true);
  };

  // Related products
  const relatedProducts = useMemo(() => {
    if (!product || !allProducts) return [];
    return allProducts
      .filter(p => p.id !== product.id && p.category === product.category)
      .slice(0, 4);
  }, [product, allProducts]);

  if (productLoading || productsLoading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

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
              key={mainImageToShow}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-[3/4] bg-secondary overflow-hidden"
            >
              <img
                src={mainImageToShow}
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

            <h1 className="heading-2 mb-4">{language === 'ar' ? (product.title_ar || product.title_en) : (product.title_en || product.title_ar)}</h1>

            {/* Price */}
            <p className="price-display text-xl mb-6">
              {selectedVariant
                ? formatPrice(selectedVariant.price, language)
                : formatPrice(product.variants[0].price, language)}
            </p>

            {/* Color Selection */}
            <div className="mb-6">
              <p className="text-sm font-medium mb-3">
                {t('product.selectColor')}: <span className="text-white">{selectedColor || '—'}</span>
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
                  {t('product.selectSize')}: <span className="text-white">{selectedSize || '—'}</span>
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

            <div className="mb-6">
              <p className="text-sm font-medium mb-3">{t('common.quantity')}</p>
              <div className="inline-flex items-center border border-border">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-secondary transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-6 font-medium">{quantity}</span>
                <button
                  onClick={() => {
                    if (selectedVariant && quantity < selectedVariant.stock) {
                      setQuantity(prev => prev + 1);
                    } else if (selectedVariant) {
                      toast.error(language === 'ar' ? `الكمية القصوى المتاحة هي ${selectedVariant.stock}` : `Maximum available quantity is ${selectedVariant.stock}`);
                    }
                  }}
                  disabled={selectedVariant && quantity >= selectedVariant.stock}
                  className={cn(
                    "p-3 hover:bg-secondary transition-colors",
                    selectedVariant && quantity >= selectedVariant.stock && "opacity-20 cursor-not-allowed"
                  )}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {selectedVariant && selectedVariant.stock <= 3 && selectedVariant.stock > 0 && (
                <p className="text-xs text-vero-gold mt-2 font-medium">
                  {language === 'ar' ? `بقي ${selectedVariant.stock} فقط!` : `Only ${selectedVariant.stock} left!`}
                </p>
              )}
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
                ? t('product.selectOptions')
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
                    <p className="text-sm text-muted-foreground">{language === 'ar' ? (product.description_ar || product.description_en) : (product.description_en || product.description_ar)}</p>
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
                        <p className="text-sm font-medium">{t('shipping.standardTitle')}</p>
                        <p className="text-sm text-muted-foreground">
                          {t('shipping.standardDesc')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <RotateCcw className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">{t('shipping.returnTitle')}</p>
                        <p className="text-sm text-muted-foreground">
                          {t('shipping.returnDesc')}
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
                  <td className="py-2">1X</td>
                  <td className="py-2">118</td>
                  <td className="py-2">72</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2">2X</td>
                  <td className="py-2">124</td>
                  <td className="py-2">74</td>
                </tr>
                <tr>
                  <td className="py-2">3X</td>
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
