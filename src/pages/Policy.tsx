import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const policyContent = {
  shipping: {
    title: 'Shipping Policy',
    content: `
## Delivery Areas
We currently ship to all areas within Egypt.

## Shipping Rates
- **Free Shipping**: On all orders over 2,000 EGP
- **Standard Shipping**: 75 EGP for orders under 2,000 EGP

## Delivery Times
- Cairo & Giza: 2-3 business days
- Alexandria: 3-4 business days
- Other governorates: 4-7 business days

## Order Processing
Orders are processed within 1-2 business days. You will receive a tracking number once your order ships.
    `,
  },
  returns: {
    title: 'Returns & Exchanges',
    content: `
## Return Policy
We offer free returns within 14 days of delivery for unworn items in original condition with tags attached.

## How to Return
1. Email us at returns@vero.eg with your order number
2. We'll send you a prepaid shipping label
3. Pack items securely and drop off at any shipping point
4. Refund processed within 5-7 business days after inspection

## Exchanges
For size exchanges, please return the item and place a new order to ensure availability.

## Non-Returnable Items
Items marked as "Final Sale" cannot be returned or exchanged.
    `,
  },
  privacy: {
    title: 'Privacy Policy',
    content: `
## Information We Collect
We collect information you provide directly: name, email, shipping address, and payment information.

## How We Use Your Information
- Process and fulfill your orders
- Send order confirmations and shipping updates
- Improve our products and services
- Send marketing communications (with your consent)

## Data Security
We use industry-standard encryption to protect your personal information.

## Your Rights
You may request access to, correction of, or deletion of your personal data at any time.

## Contact Us
For privacy inquiries: privacy@vero.eg
    `,
  },
  terms: {
    title: 'Terms of Service',
    content: `
## Agreement
By using our website, you agree to these terms of service.

## Products
All products are subject to availability. Prices are in Egyptian Pounds (EGP) and may change without notice.

## Orders
We reserve the right to refuse or cancel any order for any reason, including suspected fraud.

## Intellectual Property
All content on this site is property of VERO and may not be reproduced without permission.

## Limitation of Liability
VERO is not liable for any indirect, incidental, or consequential damages.

## Governing Law
These terms are governed by the laws of Egypt.

## Contact
For questions: legal@vero.eg
    `,
  },
};

const Policy = () => {
  const { type } = useParams<{ type: string }>();
  const { t } = useTranslation();
  
  const policy = policyContent[type as keyof typeof policyContent];

  if (!policy) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Policy not found</p>
      </div>
    );
  }

  return (
    <div className="pt-24">
      <div className="container-vero section-padding max-w-3xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="heading-1 mb-8"
        >
          {policy.title}
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="prose prose-neutral dark:prose-invert max-w-none"
        >
          {policy.content.split('\n').map((line, i) => {
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
