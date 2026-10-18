'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, Check, CircleHelp, House, ListTodo, Plus, Settings2 } from 'lucide-react';
import { useApp } from '@/lib/store';

const navItems = [
  { label: 'Today', href: '/', Icon: House },
  { label: 'Plan', href: '/plan', Icon: ListTodo },
  { label: 'Routines', href: '/routines', Icon: CalendarDays },
  { label: 'Check-in', href: '/check-in', Icon: CircleHelp },
  { label: 'History', href: '/history', Icon: Check },
];

export function Navbar() {
  const pathname = usePathname();
  const { openModal, settings, hydrated } = useApp();
  if ((hydrated && !settings.hasCompletedOnboarding) || pathname === '/focus-session') return null;

  return (
    <>
      <aside className="hidden md:flex flex-col w-64 border-r border-outline-variant bg-surface-container-low px-5 py-7 fixed inset-y-0 left-0 z-30">
        <Link href="/" className="flex items-center gap-3 mb-9 px-2" aria-label="Next home">
          <span className="w-10 h-10 rounded-2xl bg-primary text-on-primary flex items-center justify-center"><span className="font-semibold text-xl">N</span></span>
          <span><span className="block text-lg font-semibold tracking-tight">Next</span><span className="block text-xs text-on-surface-variant">One thing at a time</span></span>
        </Link>
        <button type="button" onClick={() => openModal('create_task')} className="min-h-12 flex items-center justify-center gap-2 mb-7 rounded-xl bg-primary px-4 text-on-primary font-semibold hover:opacity-90"><Plus size={18} /> Add a task</button>
        <nav aria-label="Main navigation" className="flex-1 space-y-1">
          {navItems.map(({ label, href, Icon }) => {
            const active = pathname === href;
            return <Link key={href} href={href} aria-current={active ? 'page' : undefined} className={`min-h-12 flex items-center gap-3 px-3 rounded-xl font-medium transition-colors ${active ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'}`}><Icon size={19} strokeWidth={active ? 2.2 : 1.8} />{label}</Link>;
          })}
          <Link href="/settings" aria-current={pathname === '/settings' ? 'page' : undefined} className={`min-h-12 flex items-center gap-3 px-3 rounded-xl font-medium ${pathname === '/settings' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'}`}><Settings2 size={19} />Settings</Link>
        </nav>
        <p className="border-t border-outline-variant pt-4 text-sm leading-relaxed text-on-surface-variant">The minimum counts. Rest is allowed.</p>
      </aside>

      <nav aria-label="Main navigation" className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-surface/95 backdrop-blur-lg border-t border-outline-variant pb-safe">
        <div className="flex items-center justify-around h-16 max-w-xl mx-auto px-1">
          {navItems.map(({ label, href, Icon }) => {
            const active = pathname === href;
            return <Link key={href} href={href} aria-current={active ? 'page' : undefined} className={`flex-1 h-full flex flex-col items-center justify-center gap-1 transition-colors active:bg-surface-container-high ${active ? 'text-primary' : 'text-on-surface-variant'}`}>
              <Icon size={21} strokeWidth={active ? 2.2 : 1.8} />
              <span className="text-xs font-medium">{label}</span>
            </Link>;
          })}
        </div>
      </nav>
    </>
  );
}
