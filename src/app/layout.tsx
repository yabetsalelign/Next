import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { AppProvider } from '@/lib/store';
import { Navbar } from '@/components/layout/Navbar';
import { ModalRoot } from '@/components/modals/ModalRoot';

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
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Allow pinch-zoom for accessibility — do not set maximumScale: 1
  // Capacitor handles native zoom prevention at the WebView level
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F7F8FA' },
    { media: '(prefers-color-scheme: dark)', color: '#0F141C' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-canvas dark:bg-canvas-dark text-ink-primary dark:text-slate-100 font-sans selection:bg-brand-100 selection:text-brand-900">
        <AppProvider>
          {/* Keep the app shell inside the visible viewport; only main content scrolls. */}
          <div className="flex h-dvh min-h-0 overflow-hidden">
            {/* Responsive Navigation: Sidebar on desktop, Bottom nav on mobile */}
            <Navbar />

            {/* Main Content Area
                - md:pl-64 offsets the desktop sidebar
                - On mobile: full width with horizontal padding
                - pb-nav ensures content doesn't hide behind the bottom nav on mobile
                - md:pb-0 removes that on desktop where sidebar is used instead
            */}
            <main className="flex-1 min-h-0 overflow-y-auto overscroll-contain scroll-smooth-touch md:pl-64 px-4 sm:px-5 lg:px-8 pt-[calc(0.75rem+env(safe-area-inset-top,0px))] sm:pt-[calc(1.25rem+env(safe-area-inset-top,0px))] pb-[calc(5.25rem+env(safe-area-inset-bottom,0px))] md:pb-10">
              {children}
            </main>
          </div>

          {/* Unified Modal Root */}
          <ModalRoot />
        </AppProvider>

        {/* Service Worker Registration */}
        <Script id="sw-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);

              window.addEventListener('load', function() {
                if (isLocalhost) {
                  navigator.serviceWorker.getRegistrations().then(function(registrations) {
                    return Promise.all(registrations.map(function(reg) {
                      return reg.unregister();
                    }));
                  }).catch(function(err) {
                    console.warn('[SW] Local dev cleanup failed:', err);
                  });
                  return;
                }

                navigator.serviceWorker.register('/sw.js')
                  .then(function(reg) {
                    console.log('[SW] Registered, scope:', reg.scope);
                  })
                  .catch(function(err) {
                    console.warn('[SW] Registration failed:', err);
                  });
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
