import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useRef } from 'react';

// Import images
import heroImage from '@/assets/hero-1.jpg';
import lookbook1 from '@/assets/lookbook-1.jpg';

const BrandStory = () => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const timeline = [
    {
      year: '2021',
      title: 'The Beginning',
      titleAr: 'البداية',
      description: 'Omar Nasseh and Mohamed El Deep met in Cairo, united by a shared vision: to create luxury streetwear that speaks through quality, not logos.',
      descriptionAr: 'التقى عمر ناصح ومحمد الديب في القاهرة، متحدين برؤية مشتركة: إنشاء ملابس شارع فاخرة تتحدث من خلال الجودة، وليس الشعارات.',
    },
    {
      year: '2022',
      title: 'First Collection',
      titleAr: 'المجموعة الأولى',
      description: 'After 18 months of fabric sourcing, pattern development, and countless prototypes, we launched our first collection: Essentials.',
      descriptionAr: 'بعد 18 شهرًا من البحث عن الأقمشة وتطوير الأنماط والنماذج الأولية التي لا تعد ولا تحصى، أطلقنا مجموعتنا الأولى: الأساسيات.',
    },
    {
      year: '2023',
      title: 'Growing Community',
      titleAr: 'نمو المجتمع',
      description: 'VERO gained recognition among those who appreciate understated luxury. Our community grew organically, built on word of mouth and genuine appreciation.',
      descriptionAr: 'حصلت فيرو على اعتراف بين أولئك الذين يقدرون الفخامة الهادئة. نما مجتمعنا بشكل عضوي، مبني على التوصيات والتقدير الحقيقي.',
    },
    {
      year: '2024',
      title: 'The Future',
      titleAr: 'المستقبل',
      description: 'We continue to refine our craft, expanding into footwear and accessories while staying true to our founding principles: quality, fit, and quiet confidence.',
      descriptionAr: 'نواصل صقل حرفتنا، والتوسع في الأحذية والإكسسوارات مع البقاء وفيين لمبادئنا التأسيسية: الجودة والملاءمة والثقة الهادئة.',
    },
  ];

  return (
    <div ref={containerRef} className="pt-24">
      {/* Hero */}
      <section className="relative h-[70vh] flex items-center overflow-hidden">
        <motion.div style={{ y: imageY }} className="absolute inset-0">
          <img
            src={heroImage}
            alt="VERO Brand Story"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/30 to-background" />
        </motion.div>

        <div className="relative z-10 container-vero text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="caption text-white/80 mb-6"
          >
            {t('brandStory.tagline')}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="heading-display mb-8"
          >
            {t('brandStory.headline')}
          </motion.h1>
        </div>
      </section>

      {/* Manifesto */}
      <section className="section-padding bg-card">
        <div className="container-vero">
          <motion.blockquote
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <p className="heading-1 italic mb-8">
              "{t('brandStory.manifesto')}"
            </p>
            <cite className="text-muted-foreground not-italic">
              — {t('brandStory.founders')}
            </cite>
          </motion.blockquote>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding">
        <div className="container-vero">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: 'Craftsmanship',
                titleAr: 'الحرفية',
                description: 'Every stitch, every seam, every detail is considered. We partner with the finest manufacturers who share our obsession with quality.',
                descriptionAr: 'كل غرزة، كل درزة، كل تفصيلة مدروسة. نتشارك مع أفضل المصنعين الذين يشاركوننا هوسنا بالجودة.',
              },
              {
                title: 'Fit',
                titleAr: 'القياس',
                description: 'Oversized doesn\'t mean shapeless. Our pieces are engineered to drape perfectly, creating a silhouette that\'s relaxed yet refined.',
                descriptionAr: 'الأوفرسايز لا يعني بلا شكل. قطعنا مصممة لتنسدل بشكل مثالي، مما يخلق صورة ظلية مريحة ولكنها راقية.',
              },
              {
                title: 'Restraint',
                titleAr: 'الاعتدال',
                description: 'We let materials speak. No excessive branding, no loud graphics—just pure, considered design that stands the test of time.',
                descriptionAr: 'نترك المواد تتحدث. لا علامات تجارية مفرطة، لا رسومات صاخبة - فقط تصميم نقي ومدروس يصمد أمام اختبار الزمن.',
              },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <h3 className="heading-4 mb-4">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-secondary/30">
        <div className="container-vero">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="heading-2 text-center mb-16"
          >
            Our Journey
          </motion.h2>

          <div className="space-y-16">
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col md:flex-row gap-8 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''
                  }`}
              >
                <div className="flex-1 text-center md:text-left">
                  <span className="caption text-muted-foreground">{item.year}</span>
                  <h3 className="heading-3 mt-2 mb-4">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
                <div className="w-24 h-px md:w-px md:h-24 bg-border" />
                <div className="flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Section */}
      <section className="relative h-[60vh]">
        <img
          src={lookbook1}
          alt="VERO Atelier"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </section>

      {/* Founders */}
      <section className="section-padding">
        <div className="container-vero text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="heading-2 mb-8">The Founders</h2>
            <p className="body-large text-muted-foreground mb-8">
              Omar Nasseh and Mohamed El Deep founded VERO with a simple belief:
              that true luxury is felt, not flaunted. Their shared background in
              design and fashion led them to create a brand that prioritizes
              substance over spectacle.
            </p>
            <div className="flex justify-center gap-8">
              <div>
                <p className="font-medium">Omar Nasseh</p>
                <p className="text-sm text-muted-foreground">Co-Founder & Creative Director</p>
              </div>
              <div className="w-px bg-border" />
              <div>
                <p className="font-medium">Mohamed El Deep</p>
                <p className="text-sm text-muted-foreground">Co-Founder & CEO</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default BrandStory;
