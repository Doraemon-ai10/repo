import type { Metadata } from 'next';
import AIAssistantMount from '@/components/AIAssistantMount';
import SiteFooter from '@/components/SiteFooter';
import CreatorLinks from '@/components/CreatorLinks';
import GamingExtras from '@/components/GamingExtras';
import PWARegister from './PWARegister';
import './globals.css';

export const metadata: Metadata = {
  title: 'RBLXFinder',
  description: 'Roblox and Free Fire tools by Noobie',
  manifest: '/manifest.webmanifest',
  themeColor: '#111827',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>
        {children}
        <CreatorLinks />
        <GamingExtras />
        <SiteFooter />
        <AIAssistantMount />
        <PWARegister />
      </body>
    </html>
  );
}
