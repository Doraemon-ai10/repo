export const metadata = {
  title: 'RBX Insight — Roblox Account Inspector',
  description: 'Public Roblox account information dashboard',
  icons: {
    icon: 'https://www.roblox.com/favicon.ico',
    shortcut: 'https://www.roblox.com/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
