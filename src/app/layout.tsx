import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/store';
import { Navbar } from '@/components/layout/Navbar';
import { ModalRoot } from '@/components/modals/ModalRoot';

export const metadata: Metadata = {
  title: 'Next — Next. Not everything.',
  description: 'A calm, intuitive personal executive-function tool designed around task initiation, overwhelm reduction, routines, and returning after falling off.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
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
      <body className="min-h-screen bg-canvas dark:bg-canvas-dark text-ink-primary dark:text-slate-100 font-sans selection:bg-brand-100 selection:text-brand-900">
        <AppProvider>
          <div className="flex min-h-screen">
            {/* Responsive Navigation: Sidebar on desktop, Bottom nav on mobile */}
            <Navbar />

            {/* Main Content Area */}
            <main className="flex-1 md:pl-64 min-h-screen px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
              {children}
            </main>
          </div>

          {/* Unified Modal Root for Help Me Start, Stuck Mode, Breakdown, etc. */}
          <ModalRoot />
        </AppProvider>
      </body>
    </html>
  );
}
