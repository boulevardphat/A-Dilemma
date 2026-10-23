'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center text-[#18181B] bg-[#FBF9F5]">
      <h2 className="text-xl font-bold mb-2">Đã xảy ra lỗi</h2>
      <p className="text-sm text-zinc-500 mb-6">Vui lòng thử tải lại trang.</p>
      <button
        onClick={() => reset()}
        className="pixel-btn px-4 py-2 bg-[#18181B] text-white text-xs font-bold"
      >
        Thử lại
      </button>
    </main>
  );
}
