import '~/styles/globals.css';

import { type Metadata, type Viewport } from 'next';
import { Inter } from 'next/font/google';

import Footer from '~/components/footer';
import { NavigationBar } from '~/components/navigation-bar';
import { ThemeProvider } from '~/components/theme-provider';
import { Toaster } from '~/components/ui/sonner';
import { siteConfig } from '~/config/site';
import { TRPCReactProvider } from '~/trpc/react';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: {
    default: `Quality Printing Shop in Bucandala Imus ${siteConfig.separator} ${siteConfig.name}`,
    template: `%s ${siteConfig.separator} ${siteConfig.name}`,
  },
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
  description: siteConfig.description,
  keywords: [
    'printing shop bucandala imus',
    'printing services bucandala imus',
    'printing center bucandala imus',
    '3j',
    '3j print center',
    'three j',
    'three j print center',
    'tarpaulin printing bucandala imus',
    'silkscreen bucandala imus',
    'full sublimation bucandala imus',
    'mug printing bucandala imus',
    'sintra board bucandala imus',
    'custom printing bucandala imus',
    'graphic design bucandala imus',
    'affordable printing bucandala imus',
    'high-quality printing bucandala imus',
  ],
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    description: siteConfig.description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <TRPCReactProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative flex min-h-screen flex-col">
              <NavigationBar />

              <div className="flex-1">{children}</div>

              <Footer />

              <Toaster richColors />
            </div>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
