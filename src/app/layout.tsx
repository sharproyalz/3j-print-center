import '~/styles/globals.css';

import { type Viewport } from 'next';
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

export const metadata = {
  title: { default: siteConfig.name, template: `%s ${siteConfig.separator} ${siteConfig.name}` },
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
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
