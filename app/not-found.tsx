import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center text-[#18181B] bg-[#FBF9F5]">
      <h1 className="text-2xl font-extrabold mb-2">404</h1>
      <p className="text-sm text-zinc-500 mb-6">Trang không tồn tại.</p>
      <Link
        href="/"
        className="pixel-btn px-4 py-2 bg-[#18181B] text-white text-xs font-bold"
      >
        Về trang chủ
      </Link>
    </main>
  );
}
