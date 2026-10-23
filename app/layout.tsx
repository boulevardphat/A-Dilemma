import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'A Dilemma - Trò chơi Lịch sử Báo chí',
  description: 'Trò chơi phân bổ đồng tiền Đại lộ và cán cân quyết định thời gian thực phục vụ môn Lịch sử Báo chí.',
  openGraph: {
    title: 'A Dilemma - Trò chơi Lịch sử Báo chí',
    description: 'Trò chơi phân bổ đồng tiền Đại lộ và cán cân quyết định thời gian thực phục vụ môn Lịch sử Báo chí.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={plusJakarta.className}>
      <body className="antialiased selection:bg-amber-300 selection:text-black bg-[#FBF9F5] text-[#18181B] min-h-screen" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
