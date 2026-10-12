'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';

export function AndroidBackHandler() {
  const { activeModal, closeModal } = useApp();
  const pathname = usePathname();
  const router = useRouter();

  const activeModalRef = useRef(activeModal);
  activeModalRef.current = activeModal;

  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  useEffect(() => {
    // Interceptor called by Capacitor MainActivity OnBackPressedCallback
    (window as any).__handleAndroidBack = () => {
      // 1. If any modal is active, dismiss the modal
      if (activeModalRef.current) {
        closeModal();
        return true;
      }

      // 2. If user is in a sub-view (routines, plan, settings, etc.), go back
      if (pathnameRef.current && pathnameRef.current !== '/') {
        router.back();
        return true;
      }

      // 3. At root view with no modal open: return false to allow native backgrounding
      return false;
    };

    return () => {
      delete (window as any).__handleAndroidBack;
    };
  }, [closeModal, router]);

  return null;
}
