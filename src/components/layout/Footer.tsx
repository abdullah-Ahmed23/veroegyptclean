import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Facebook } from 'lucide-react';
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
    ],
    legal: [
      { label: t('footer.privacy'), href: '/policies/privacy' },
      { label: t('footer.terms'), href: '/policies/terms' },
    ],
  };

  return (
    <footer className="bg-card border-t border-border">
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
                href="https://www.facebook.com/profile.php?id=61586541811286"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-[#1877F2] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
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
        <div className="container-vero py-6 flex flex-col items-center gap-2">
          <p className="text-xs text-muted-foreground text-center">
            {t('footer.copyright')}
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 font-medium">
            website made by <span className="text-vero-gold">abdullah ahmed</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
