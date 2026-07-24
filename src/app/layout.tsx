import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cinema Palembang - Jadwal Bioskop XXI, CGV & Cinepolis Palembang',
  description:
    'Website jadwal bioskop terpercaya di Palembang. Lihat daftar film tayang, jam tayang real-time, dan harga tiket di Palembang Square XXI, CGV PTC Mall, Cinepolis Palembang Icon, OPI Mall XXI, PIM XXI, CGV Social Market, CGV Transmart & Internasional XXI.',
  keywords: [
    'Bioskop Palembang',
    'Jadwal Bioskop Palembang',
    'Palembang Square XXI',
    'CGV PTC Mall',
    'Cinepolis Palembang Icon',
    'PIM XXI',
    'OPI Mall XXI',
    'CGV Social Market',
    'Cinema PLG',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <body
        className="bg-background text-text-main antialiased selection:bg-primary selection:text-black"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
