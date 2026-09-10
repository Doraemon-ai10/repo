import type { Metadata } from 'next';
import AIAssistantMount from '@/components/AIAssistantMount';
import SiteFooter from '@/components/SiteFooter';
import './globals.css';

export const metadata: Metadata = { title: 'RBLXFinder', description: 'Roblox and Free Fire tools' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>
        {children}
        <SiteFooter />
        <AIAssistantMount />
      </body>
    </html>
  );
}
