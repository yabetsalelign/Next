import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { AppProvider } from '@/lib/store';
import { Navbar } from '@/components/layout/Navbar';
import { FloatingFocusBanner } from '@/components/layout/FloatingFocusBanner';
import { ModalRoot } from '@/components/modals/ModalRoot';
import { AndroidBackHandler } from '@/components/layout/AndroidBackHandler';

export const metadata: Metadata = {
  title: 'Next — Next. Not everything.',
  description: 'A calm, intuitive personal executive-function tool designed around task initiation, overwhelm reduction, routines, and returning after falling off.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Next',
  },
  icons: {
    apple: '/apple-touch-icon.png',
    icon: [
      { url: '/icon-light.svg', type: 'image/svg+xml', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark.svg', type: 'image/svg+xml', media: '(prefers-color-scheme: dark)' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F7F5F0' },
    { media: '(prefers-color-scheme: dark)', color: '#121317' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700&display=swap"
          rel="stylesheet"
        />

        {/* Theme and Accent synchronizer */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('next_settings_v1');var parsed=s?JSON.parse(s):{};var t=parsed.theme||'light';var a=parsed.accentPalette||'amber';document.documentElement.setAttribute('data-accent', a);if(t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}}catch(e){document.documentElement.classList.remove('dark');document.documentElement.setAttribute('data-accent','amber');}})();`,
          }}
        />
      </head>
      <body className="bg-background text-on-surface font-body-md text-body-md antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen">
        <AppProvider>
          {/* Main App Container */}
          <div className="flex h-dvh min-h-0 overflow-hidden bg-background">
            <Navbar />

            {/* Scrollable Main viewport */}
            <main className="flex-1 min-h-0 overflow-y-auto overscroll-contain scroll-smooth-touch md:pl-64">
              {children}
            </main>
          </div>

          <FloatingFocusBanner />
          <ModalRoot />
          <AndroidBackHandler />
        </AppProvider>

        {/* Service Worker Registration */}
        <Script id="sw-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
              window.addEventListener('load', function() {
                if (isLocalhost) {
                  navigator.serviceWorker.getRegistrations().then(function(regs) {
                    return Promise.all(regs.map(r => r.unregister()));
                  }).catch(console.warn);
                  return;
                }
                navigator.serviceWorker.register('/sw.js').catch(console.warn);
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
