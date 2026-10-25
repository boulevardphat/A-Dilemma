import './globals.css';

export interface Metadata {
  title: string;
  description: string;
  openGraph?: {
    title: string;
    description: string;
    type: string;
  };
}

export const metadata: Metadata = {
  title: 'A Dilemma - Nhóm NONAME',
  description: 'Trò chơi phân bổ 100 Giá Đại lộ và cán cân quyết định thời gian thực trong lớp học môn Lịch sử Báo chí.',
  openGraph: {
    title: 'A Dilemma - Nhóm NONAME',
    description: 'Trò chơi phân bổ 100 Giá Đại lộ và cán cân quyết định thời gian thực trong lớp học môn Lịch sử Báo chí.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="antialiased selection:bg-amber-300 selection:text-black bg-[#FBF9F5] text-[#18181B] min-h-screen" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
