import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      nav: {
        shop: 'Shop',
        newArrivals: 'New Arrivals',
        essentials: 'Essentials',
        hoodies: 'Oversized Hoodies',
        sweatpants: 'Sweatpants',
        footwear: 'Footwear',
        accessories: 'Accessories',
        lookbook: 'Lookbook',
        brandStory: 'Our Story',
        search: 'Search',
        cart: 'Cart',
        account: 'Account',
      },
      // Hero
      hero: {
        tagline: 'Understated Luxury',
        headline: 'Redefining\nCasual Elegance',
        subheadline: 'Premium streetwear crafted for those who appreciate the art of subtle distinction.',
        cta: 'Shop Collection',
        ctaSecondary: 'Explore Lookbook',
      },
      // Product
      product: {
        addToCart: 'Add to Cart',
        selectSize: 'Select Size',
        selectColor: 'Select Color',
        sizeGuide: 'Size Guide',
        details: 'Details',
        shipping: 'Shipping & Returns',
        outOfStock: 'Out of Stock',
        inStock: 'In Stock',
        completeTheLook: 'Complete The Look',
        newArrival: 'New Arrival',
        soldOut: 'Sold Out',
      },
      // Cart
      cart: {
        title: 'Your Cart',
        empty: 'Your cart is empty',
        continueShopping: 'Continue Shopping',
        subtotal: 'Subtotal',
        shipping: 'Shipping',
        shippingNote: 'Calculated at checkout',
        total: 'Total',
        checkout: 'Proceed to Checkout',
        promoCode: 'Promo Code',
        apply: 'Apply',
        remove: 'Remove',
      },
      // Footer
      footer: {
        newsletter: {
          title: 'Join the Movement',
          subtitle: 'Be the first to know about new drops and exclusive releases.',
          placeholder: 'Enter your email',
          submit: 'Subscribe',
        },
        help: 'Help',
        about: 'About',
        legal: 'Legal',
        shipping: 'Shipping',
        returns: 'Returns',
        contact: 'Contact',
        faq: 'FAQ',
        ourStory: 'Our Story',
        careers: 'Careers',
        press: 'Press',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        copyright: '© 2024 VERO. All rights reserved.',
      },
      // Brand Story
      brandStory: {
        headline: 'The VERO Story',
        tagline: 'Born in Egypt. Crafted for the World.',
        manifesto: 'We believe luxury should whisper, not shout.',
        founders: 'Founded by Omar Nasseh and Mohamed El Deep',
      },
      // Common
      common: {
        viewAll: 'View All',
        learnMore: 'Learn More',
        close: 'Close',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        loading: 'Loading...',
        error: 'Something went wrong',
        currency: 'EGP',
      },
      // Collections
      collections: {
        newArrivals: 'New Arrivals',
        essentials: 'Essentials',
        hoodies: 'Oversized Hoodies',
        sweatpants: 'Sweatpants',
        footwear: 'Footwear',
        accessories: 'Accessories',
        all: 'All Products',
      },
      // Filters
      filters: {
        title: 'Filters',
        size: 'Size',
        color: 'Color',
        price: 'Price',
        sort: 'Sort',
        sortOptions: {
          featured: 'Featured',
          newest: 'Newest',
          priceLowHigh: 'Price: Low to High',
          priceHighLow: 'Price: High to Low',
        },
        clear: 'Clear All',
        apply: 'Apply Filters',
      },
      // Policies
      policies: {
        shipping: {
          title: 'Shipping Policy',
          subtitle: 'Free shipping on orders over 2,000 EGP',
        },
        returns: {
          title: 'Returns & Exchanges',
          subtitle: '14-day hassle-free returns',
        },
        privacy: {
          title: 'Privacy Policy',
          subtitle: 'How we protect your data',
        },
        terms: {
          title: 'Terms of Service',
          subtitle: 'Our terms and conditions',
        },
      },
    },
  },
  ar: {
    translation: {
      // Navigation
      nav: {
        shop: 'تسوق',
        newArrivals: 'وصل حديثاً',
        essentials: 'الأساسيات',
        hoodies: 'هوديز أوفرسايز',
        sweatpants: 'بناطيل رياضية',
        footwear: 'أحذية',
        accessories: 'إكسسوارات',
        lookbook: 'لوك بوك',
        brandStory: 'قصتنا',
        search: 'بحث',
        cart: 'السلة',
        account: 'الحساب',
      },
      // Hero
      hero: {
        tagline: 'فخامة هادئة',
        headline: 'نعيد تعريف\nالأناقة اليومية',
        subheadline: 'ملابس شوارع فاخرة صُنعت لمن يقدرون فن التميز الراقي.',
        cta: 'تسوق المجموعة',
        ctaSecondary: 'استكشف اللوك بوك',
      },
      // Product
      product: {
        addToCart: 'أضف للسلة',
        selectSize: 'اختر المقاس',
        selectColor: 'اختر اللون',
        sizeGuide: 'دليل المقاسات',
        details: 'التفاصيل',
        shipping: 'الشحن والإرجاع',
        outOfStock: 'نفذت الكمية',
        inStock: 'متوفر',
        completeTheLook: 'أكمل الإطلالة',
        newArrival: 'وصل حديثاً',
        soldOut: 'نفذت الكمية',
      },
      // Cart
      cart: {
        title: 'سلة التسوق',
        empty: 'سلتك فارغة',
        continueShopping: 'تابع التسوق',
        subtotal: 'المجموع الفرعي',
        shipping: 'الشحن',
        shippingNote: 'يُحسب عند الدفع',
        total: 'الإجمالي',
        checkout: 'متابعة الدفع',
        promoCode: 'كود خصم',
        apply: 'تطبيق',
        remove: 'إزالة',
      },
      // Footer
      footer: {
        newsletter: {
          title: 'انضم للحركة',
          subtitle: 'كن أول من يعرف عن الإصدارات الجديدة والحصرية.',
          placeholder: 'أدخل بريدك الإلكتروني',
          submit: 'اشترك',
        },
        help: 'المساعدة',
        about: 'عن فيرو',
        legal: 'القانونية',
        shipping: 'الشحن',
        returns: 'الإرجاع',
        contact: 'تواصل معنا',
        faq: 'الأسئلة الشائعة',
        ourStory: 'قصتنا',
        careers: 'وظائف',
        press: 'الصحافة',
        privacy: 'سياسة الخصوصية',
        terms: 'شروط الخدمة',
        copyright: '© 2024 فيرو. جميع الحقوق محفوظة.',
      },
      // Brand Story
      brandStory: {
        headline: 'قصة فيرو',
        tagline: 'ولدت في مصر. صُنعت للعالم.',
        manifesto: 'نؤمن أن الفخامة يجب أن تهمس، لا أن تصرخ.',
        founders: 'أسسها عمر ناصح ومحمد الديب',
      },
      // Common
      common: {
        viewAll: 'عرض الكل',
        learnMore: 'اعرف المزيد',
        close: 'إغلاق',
        back: 'رجوع',
        next: 'التالي',
        previous: 'السابق',
        loading: 'جاري التحميل...',
        error: 'حدث خطأ ما',
        currency: 'ج.م',
      },
      // Collections
      collections: {
        newArrivals: 'وصل حديثاً',
        essentials: 'الأساسيات',
        hoodies: 'هوديز أوفرسايز',
        sweatpants: 'بناطيل رياضية',
        footwear: 'أحذية',
        accessories: 'إكسسوارات',
        all: 'جميع المنتجات',
      },
      // Filters
      filters: {
        title: 'الفلاتر',
        size: 'المقاس',
        color: 'اللون',
        price: 'السعر',
        sort: 'ترتيب',
        sortOptions: {
          featured: 'مميز',
          newest: 'الأحدث',
          priceLowHigh: 'السعر: من الأقل للأعلى',
          priceHighLow: 'السعر: من الأعلى للأقل',
        },
        clear: 'مسح الكل',
        apply: 'تطبيق الفلاتر',
      },
      // Policies
      policies: {
        shipping: {
          title: 'سياسة الشحن',
          subtitle: 'شحن مجاني للطلبات فوق 2,000 ج.م',
        },
        returns: {
          title: 'الإرجاع والاستبدال',
          subtitle: 'إرجاع مجاني خلال 14 يوم',
        },
        privacy: {
          title: 'سياسة الخصوصية',
          subtitle: 'كيف نحمي بياناتك',
        },
        terms: {
          title: 'شروط الخدمة',
          subtitle: 'الشروط والأحكام',
        },
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
