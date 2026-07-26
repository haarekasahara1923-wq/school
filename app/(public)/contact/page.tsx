import type { Metadata } from 'next';
import ContactPageClient from './ContactPageClient';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Contact Progressive Smart Kids School, Prani Chhavani, Gwalior (MP). Phone: 8962678915. Email: info@progressivesmartkids.in',
};

export default function ContactPage() {
  return <ContactPageClient />;
}
