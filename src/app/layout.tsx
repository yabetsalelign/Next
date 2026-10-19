import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import localFont from 'next/font/local';
import './globals.css';
import { AppProvider } from '@/lib/store';
import { Navbar } from '@/components/layout/Navbar';
import { FloatingFocusBanner } from '@/components/layout/FloatingFocusBanner';
import { ModalRoot } from '@/components/modals/ModalRoot';
import { AndroidBackHandler } from '@/components/layout/AndroidBackHandler';

const plusJakartaSans = localFont({
  src: './fonts/plus-jakarta-sans-latin-wght-normal.woff2',
  display: 'swap',
  style: 'normal',
  weight: '200 800',
  variable: '--font-plus-jakarta',
});

export const metadata: Metadata = {
  title: 'Next - one thing at a time',
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
    { media: '(prefers-color-scheme: light)', color: '#F8F6F1' },
    { media: '(prefers-color-scheme: dark)', color: '#121218' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={plusJakartaSans.variable} suppressHydrationWarning>
      <head>
        {/* Theme and Accent synchronizer */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var root=document.documentElement;try{var s=localStorage.getItem('next_settings_v1');var parsed=s?JSON.parse(s):{};var t=parsed&&['light','dark','system'].indexOf(parsed.theme)>=0?parsed.theme:'system';var a=parsed&&['amber','mint'].indexOf(parsed.accentPalette)>=0?parsed.accentPalette:'amber';root.setAttribute('data-accent',a);var dark=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);root.classList.toggle('dark',dark);}catch(e){root.setAttribute('data-accent','amber');root.classList.toggle('dark',window.matchMedia('(prefers-color-scheme: dark)').matches);}})();`,
          }}
        />
      </head>
      <body className="bg-background text-on-surface font-body-md text-body-md antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen">
        <AppProvider>
          {/* Main App Container */}
          <div className="flex h-dvh min-h-0 overflow-hidden bg-background">
            <Navbar />

            {/* Scrollable Main viewport */}
            <main className="flex-1 min-w-0 min-h-0 overflow-y-auto overscroll-contain scroll-smooth-touch md:pl-64">
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
