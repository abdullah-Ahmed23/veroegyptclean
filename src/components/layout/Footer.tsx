import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Instagram, Twitter } from 'lucide-react';
import { useUIStore } from '@/lib/store';
import LogoWhite from '@/assets/main logo white.png';
import LogoBlack from '@/assets/logo.png';

export function Footer() {
  const { isDarkMode } = useUIStore();
  const { t } = useTranslation();

  const footerLinks = {
    help: [
      { label: t('footer.shipping'), href: '/policies/shipping' },
      { label: t('footer.returns'), href: '/policies/returns' },
      { label: t('footer.contact'), href: '/contact' },
      { label: t('footer.faq'), href: '/faq' },
    ],
    about: [
      { label: t('footer.ourStory'), href: '/brand-story' },
      { label: t('footer.careers'), href: '/careers' },
      { label: t('footer.press'), href: '/press' },
    ],
    legal: [
      { label: t('footer.privacy'), href: '/policies/privacy' },
      { label: t('footer.terms'), href: '/policies/terms' },
    ],
  };

  return (
    <footer className="bg-card border-t border-border">
      {/* Feedback Section */}
      <div className="container-vero section-padding border-b border-border">
        <div className="max-w-xl mx-auto text-center">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="heading-3 mb-3"
          >
            WE VALUE YOUR FEEDBACK
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mb-8"
          >
            Help us improve your experience. Share your thoughts with us.
          </motion.p>
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thank you for your feedback!");
            }}
          >
            <textarea
              placeholder="Your feedback..."
              rows={4}
              className="input-vero w-full border border-border rounded-none px-4 py-3 resize-none bg-background focus:ring-1 focus:ring-foreground transition-all"
            />
            <button type="submit" className="btn-primary w-full sm:w-auto self-center px-12">
              Values Your Feedback
            </button>
          </motion.form>
        </div>
      </div>

      {/* Links Section */}
      <div className="container-vero py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <img
                src={isDarkMode ? LogoWhite : LogoBlack}
                alt="VERO"
                className="h-8 w-auto object-contain"
              />
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Premium streetwear crafted in Egypt. Understated luxury for the discerning.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Help */}
          <div>
            <h4 className="caption text-foreground mb-4">{t('footer.help')}</h4>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="caption text-foreground mb-4">{t('footer.about')}</h4>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="caption text-foreground mb-4">{t('footer.legal')}</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-border">
        <div className="container-vero py-6">
          <p className="text-xs text-muted-foreground text-center">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
