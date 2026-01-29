import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Policy = () => {
  const { type } = useParams<{ type: string }>();
  const { t } = useTranslation();

  // Directly access the localized policy content
  const title = t(`policies.${type}.title`);
  const content = t(`policies.${type}.content`);

  // If the translation returns the key itself (meaning it was not found)
  if (title === `policies.${type}.title` || !content) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">{t('common.error')}</p>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen">
      <div className="container-vero section-padding max-w-3xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="heading-1 mb-8"
        >
          {title}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="prose prose-neutral dark:prose-invert max-w-none"
        >
          {content.split('\n').map((line, i) => {
            if (line.startsWith('## ')) {
              return <h2 key={i} className="heading-4 mt-8 mb-4">{line.replace('## ', '')}</h2>;
            }
            if (line.startsWith('- ')) {
              return <li key={i} className="text-muted-foreground ml-4">{line.replace('- ', '')}</li>;
            }
            if (line.match(/^\d\./)) {
              return <li key={i} className="text-muted-foreground ml-4">{line}</li>;
            }
            if (line.trim()) {
              return <p key={i} className="text-muted-foreground mb-4">{line}</p>;
            }
            return null;
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default Policy;
