import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, Clock, MessageSquare, Facebook, ArrowUpRight } from 'lucide-react';
import { useUIStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const ContactItem = ({ icon: Icon, title, content, href }: { icon: any, title: string, content: string, href?: string }) => {
    const { isDarkMode } = useUIStore();

    const Wrapper = href ? 'a' : 'div';
    const wrapperProps = href ? { href, target: "_blank", rel: "noopener noreferrer" } : {};

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn(
                "group p-8 rounded-2xl border transition-all duration-500",
                isDarkMode
                    ? "bg-zinc-900/50 border-white/5 hover:border-vero-gold/40 hover:bg-zinc-900"
                    : "bg-zinc-50 border-black/5 hover:border-vero-gold/40 hover:bg-white"
            )}
        >
            <Wrapper {...wrapperProps} className="flex flex-col gap-6">
                <div className="w-12 h-12 rounded-xl bg-vero-gold/10 flex items-center justify-center text-vero-gold group-hover:scale-110 transition-transform duration-500">
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-2">{title}</h3>
                    <p className="text-xl font-black uppercase tracking-tighter italic flex items-center gap-2 group-hover:text-vero-gold transition-colors">
                        {content}
                        {href && <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />}
                    </p>
                </div>
            </Wrapper>
        </motion.div>
    );
};

export default function Contact() {
    const { t } = useTranslation();
    const { isDarkMode } = useUIStore();

    const contactNumbers = [
        {
            icon: Phone,
            title: t('contact.phone'),
            content: '+20 10 61326808',
            href: 'tel:+201061326808'
        },
        {
            icon: MessageSquare,
            title: 'WhatsApp',
            content: '+20 10 61326808',
            href: 'https://wa.me/201061326808'
        },
        {
            icon: Smartphone,
            title: t('contact.methods.instapay'),
            content: '01061326808',
        }
    ];

    return (
        <div className={cn(
            "min-h-screen pt-32 pb-20 transition-colors duration-500",
            isDarkMode ? "bg-black text-white" : "bg-white text-black"
        )}>
            {/* Hero Section */}
            <section className="container-vero mb-24">
                <div className="max-w-4xl">
                    <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-block text-vero-gold text-[10px] font-black uppercase tracking-[0.5em] mb-6"
                    >
                        [ {t('footer.contact')} ]
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] italic mb-8"
                    >
                        {t('contact.title')}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-muted-foreground text-lg md:text-xl font-light italic leading-relaxed max-w-xl"
                    >
                        {t('contact.subtitle')}
                    </motion.p>
                </div>
            </section>

            {/* Grid Section */}
            <section className="container-vero">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ContactItem
                        icon={Phone}
                        title={t('contact.phone')}
                        content="+20 10 61326808"
                        href="tel:+201061326808"
                    />
                    <ContactItem
                        icon={MessageSquare}
                        title="WhatsApp"
                        content="+20 10 61326808"
                        href="https://wa.me/201061326808"
                    />
                    <ContactItem
                        icon={Mail}
                        title={t('contact.email')}
                        content="contact@vero.eg"
                        href="mailto:contact@vero.eg"
                    />
                    <ContactItem
                        icon={Smartphone}
                        title={t('contact.methods.instapay')}
                        content="01061326808"
                    />
                    <ContactItem
                        icon={Clock}
                        title={t('contact.hours')}
                        content={t('contact.hoursDetail')}
                    />
                    <ContactItem
                        icon={Facebook}
                        title="Facebook"
                        content="Vero Egypt"
                        href="https://www.facebook.com/profile.php?id=61586541811286"
                    />
                </div>
            </section>

            {/* Map Placeholder or Visual Element */}
            <section className="container-vero mt-32">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className={cn(
                        "h-[400px] rounded-[2.5rem] overflow-hidden border relative group",
                        isDarkMode ? "bg-zinc-900 border-white/5" : "bg-zinc-50 border-black/5"
                    )}
                >
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center space-y-4">
                            <h2 className="text-2xl font-black uppercase italic tracking-widest text-vero-gold">Cairo, Egypt</h2>
                            <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">Premium Streetwear Headquarters</p>
                        </div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}

// Helper icons that were missing
const Smartphone = (props: any) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
        <path d="M12 18h.01" />
    </svg>
);
