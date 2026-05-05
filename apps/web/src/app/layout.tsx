import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Comment Bot',
  description: 'Comment Bot web app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
