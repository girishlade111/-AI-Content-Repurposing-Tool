import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';
import { ThemeProvider } from '@/contexts/ThemeContext';

export const metadata: Metadata = {
  title: 'AI Content Repurposing Tool',
  description: 'Transform one piece of content into 10 social posts, a newsletter, and a video script.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased page-enter">
        <ThemeProvider>
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}