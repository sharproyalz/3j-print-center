import '~/styles/globals.css';

import { type Metadata, type Viewport } from 'next';
import { Inter } from 'next/font/google';

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
  title: { default: siteConfig.name, template: `%s ${siteConfig.separator} ${siteConfig.name}` },
  icons: [{ rel: 'icon', url: '/3J-icon.png' }],
  description:
    'Three J Print Center provide variety of personalized printing in mugs, tumblers, lanyards, keychains, and many others. We also have different kinds of process in t-shirt printing from silkscreen process to digital process.',
  keywords: [
    'three j print center',
    'three j print',
    'three j center',
    'three j',
    '3j',
    'tree j',
    'three',
    'printing services',
    'custom printing',
    'print shop',
    'silkscreen',
    'full sublimation',
    'digital printing',
    'print solutions',
    'printing company',
    'graphic design',
    'business printing',
    'promotional printing',
    'printing materials',
    'print marketing',
    'printing products',
    'professional printing',
    'printing expertise',
    'high-quality printing',
    'affordable printing',
    'print on demand',
    'printing technology',
    'printing innovation',
  ],
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

              <main className="flex-1">{children}</main>

              <Toaster richColors />
            </div>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
