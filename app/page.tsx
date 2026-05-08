import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <meta httpEquiv="refresh" content="0; url=dashboard/" />
      <Link
        href="/dashboard"
        className="rounded-polaris-md bg-accent-brand-normal px-5 py-3 text-sm font-semibold text-static-white shadow-polaris-sm"
      >
        대시보드로 이동
      </Link>
    </main>
  );
}
