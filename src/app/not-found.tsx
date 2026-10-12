import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 space-y-4">
      <h2 className="text-2xl font-bold text-ink-primary dark:text-linen">Page not found</h2>
      <p className="text-sm text-ink-muted dark:text-linen-subtle max-w-sm">
        The screen you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm shadow-sm transition-all"
      >
        Return Home
      </Link>
    </div>
  );
}
