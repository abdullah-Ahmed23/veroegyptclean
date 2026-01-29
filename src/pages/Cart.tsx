import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Trash2 } from 'lucide-react';
import { useCartStore, useUIStore, formatPrice } from '@/lib/store';
import { CustomHoodieThumbnail } from '@/components/product/CustomHoodieThumbnail';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const Cart = () => {
  const { t } = useTranslation();
  const { language } = useUIStore();
  const { items, removeItem, updateQuantity, getSubtotal, setIsOpen } = useCartStore();

  const subtotal = getSubtotal();

  if (items.length === 0) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
          <h1 className="heading-3 mb-4">{t('cart.empty')}</h1>
          <p className="text-muted-foreground mb-8">
            Discover our premium streetwear collection.
          </p>
          <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
            {t('cart.continueShopping')}
            <ArrowRight className={cn('h-4 w-4', language === 'ar' && 'rotate-180')} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24">
      <div className="container-vero section-padding">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="heading-1 mb-12"
        >
          {t('cart.title')}
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-6 py-6 border-b border-border"
              >
                {/* Image */}
                <div className="w-32 h-40 bg-secondary overflow-hidden flex-shrink-0 border border-border">
                  {item.productId === 'custom-hoodie' ? (
                    <CustomHoodieThumbnail
                      colorHex={item.colorHex || '#000000'}
                      frontImage={item.image}
                      backImage={item.backImage}
                      designState={item.customDesigns}
                      className="h-full w-full"
                    />
                  ) : (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.size} / {item.color}
                      </p>
                      {item.customDesigns && (
                        <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-vero-gold/10 border border-vero-gold/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-vero-gold animate-pulse" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-vero-gold">Custom Design</span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="flex items-end justify-between mt-4">
                    {/* Quantity */}
                    <div className="flex items-center border border-border">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-2 hover:bg-secondary transition-colors"
                      >
                        −
                      </button>
                      <span className="px-4 font-medium">{item.quantity}</span>
                      <button
                        onClick={() => {
                          if (!item.stock || item.quantity < item.stock) {
                            updateQuantity(item.id, item.quantity + 1);
                          } else {
                            toast.error(language === 'ar' ? 'عذراً، هذا هو أقصى كمية متاحة' : 'Sorry, this is the maximum available quantity');
                          }
                        }}
                        disabled={item.stock && item.quantity >= item.stock}
                        className={cn(
                          "px-3 py-2 hover:bg-secondary transition-colors",
                          item.stock && item.quantity >= item.stock && "opacity-20 cursor-not-allowed"
                        )}
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <p className="price-display">
                      {item.price === 0
                        ? (language === 'ar' ? 'السعر عند التواصل' : 'Contact for Price')
                        : formatPrice(item.price * item.quantity, language)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-border p-6"
            >
              <h2 className="heading-4 mb-6">Order Summary</h2>

              {/* Promo Code */}
              <div className="flex gap-2 mb-6">
                <input
                  type="text"
                  placeholder={t('cart.promoCode')}
                  className="input-vero flex-1 border border-border px-3 py-2 text-sm"
                />
                <button className="btn-secondary px-4 py-2 text-xs">
                  {t('cart.apply')}
                </button>
              </div>

              {/* Totals */}
              <div className="space-y-3 py-4 border-y border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('cart.subtotal')}</span>
                  <span>{formatPrice(subtotal, language)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('cart.shipping')}</span>
                  <span className={subtotal < 2000 ? "text-foreground" : "text-vero-gold"}>
                    {subtotal === 0 ? t('cart.shippingNote') : (subtotal < 2000 ? formatPrice(75, language) : t('shipping.standardTitle'))}
                  </span>
                </div>
              </div>

              <div className="flex justify-between py-4 mb-6">
                <span className="font-medium">{t('cart.total')}</span>
                <div className="text-right">
                  <span className="price-display text-lg">
                    {formatPrice(subtotal + (subtotal > 0 && subtotal < 2000 ? 75 : 0), language)}
                  </span>
                  {items.some(i => i.price === 0) && (
                    <p className="text-[10px] text-vero-gold font-black uppercase tracking-widest mt-1">
                      {language === 'ar' ? 'بانتظار عرض السعر' : 'Quotation Pending'}
                    </p>
                  )}
                </div>
              </div>

              {/* Checkout */}
              <Link
                to="/checkout"
                onClick={() => setIsOpen(false)}
                className="btn-primary w-full mb-4 text-center block"
              >
                {t('cart.checkout')}
              </Link>

              <p className="text-xs text-center text-muted-foreground">
                Taxes and shipping calculated at checkout.
              </p>
            </motion.div>

            {/* Payment Methods */}
            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground mb-3">Accepted Payment Methods</p>
              <div className="flex justify-center gap-4 text-xs text-muted-foreground">
                <span>Card</span>
                <span>•</span>
                <span>Instapay</span>
                <span>•</span>
                <span>Wallets</span>
                <span>•</span>
                <span>COD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
