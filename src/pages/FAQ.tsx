import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

const FAQ = () => {
    const { t } = useTranslation();

    const faqItems = ['shipping', 'payment', 'returns', 'restock'];

    return (
        <div className="pt-24 min-h-screen">
            <div className="container-vero section-padding max-w-3xl">
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="heading-1 mb-4"
                    >
                        {t('faq.title')}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground"
                    >
                        {t('faq.tagline')}
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    <Accordion type="single" collapsible className="w-full">
                        {faqItems.map((item) => (
                            <AccordionItem key={item} value={item} className="border-border">
                                <AccordionTrigger className="text-left py-6 hover:no-underline">
                                    <span className="font-mono text-sm tracking-widest uppercase">
                                        {t(`faq.items.${item}.q`)}
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                                    {t(`faq.items.${item}.a`)}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </motion.div>
            </div>
        </div>
    );
};

export default FAQ;
