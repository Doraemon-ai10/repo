import type { Metadata } from 'next';
import AIAssistantMount from '@/components/AIAssistantMount';
import SiteFooter from '@/components/SiteFooter';
import CreatorLinks from '@/components/CreatorLinks';
import GamingExtras from '@/components/GamingExtras';
import SettingsCenter from '@/components/SettingsCenter';
import PWARegister from './PWARegister';
import './globals.css';

export const metadata: Metadata = {
  title: 'RBLXFinder — Noobie Gaming Hub',
  description: 'Roblox and Free Fire tools by Noobie',
  manifest: '/manifest.webmanifest',
  themeColor: '#071326',
  icons: {
    icon: '/rblxfinder-icon.webp',
    shortcut: '/rblxfinder-icon.webp',
    apple: '/rblxfinder-icon.webp',
  },
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
        <SettingsCenter />
        <PWARegister />
      </body>
    </html>
  );
}
