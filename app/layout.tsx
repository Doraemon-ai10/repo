import type { Metadata } from 'next';
import AIAssistantMount from '@/components/AIAssistantMount';
import './globals.css';

export const metadata: Metadata = { title: 'RBLXFinder', description: 'Roblox and Free Fire tools' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body>{children}<AIAssistantMount /></body></html>;
}
