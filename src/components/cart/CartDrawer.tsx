import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore, formatPrice } from '@/lib/store';
import { useUIStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

export function CartDrawer() {
  const { t } = useTranslation();
  const { language } = useUIStore();
  const { 
    items, 
    isOpen, 
    setIsOpen, 
    removeItem, 
    updateQuantity, 
    getSubtotal 
  } = useCartStore();

  const subtotal = getSubtotal();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: language === 'ar' ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: language === 'ar' ? '-100%' : '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={cn(
              'fixed top-0 bottom-0 w-full max-w-md bg-background z-50 flex flex-col',
              language === 'ar' ? 'left-0 border-r' : 'right-0 border-l',
              'border-border'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="heading-4">{t('cart.title')}</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="btn-ghost p-2"
                aria-label={t('common.close')}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="text-muted-foreground mb-6">{t('cart.empty')}</p>
                  <Link
                    to="/shop"
                    onClick={() => setIsOpen(false)}
                    className="btn-primary"
                  >
                    {t('cart.continueShopping')}
                  </Link>
                </div>
              ) : (
                <ul className="space-y-6">
                  {items.map((item) => (
                    <motion.li
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-4"
                    >
                      {/* Image */}
                      <div className="w-24 h-32 bg-secondary rounded-sm overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col">
                        <h3 className="font-medium text-sm">{item.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.size} / {item.color}
                        </p>
                        <p className="price-display text-sm mt-2">
                          {formatPrice(item.price, language)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center border border-border rounded-sm">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-2 hover:bg-secondary transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-4 text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 hover:bg-secondary transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                            aria-label={t('cart.remove')}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-border space-y-4">
                {/* Promo Code */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={t('cart.promoCode')}
                    className="input-vero flex-1 border border-border rounded-sm px-3 py-2 text-sm"
                  />
                  <button className="btn-secondary px-4 py-2 text-xs">
                    {t('cart.apply')}
                  </button>
                </div>

                {/* Totals */}
                <div className="space-y-2 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('cart.subtotal')}</span>
                    <span className="font-medium">{formatPrice(subtotal, language)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('cart.shipping')}</span>
                    <span className="text-muted-foreground">{t('cart.shippingNote')}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button className="btn-primary w-full">
                  {t('cart.checkout')}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
