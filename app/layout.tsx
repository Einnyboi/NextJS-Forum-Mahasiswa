// app/layout.tsx
import type { Metadata } from 'next';
import { Poppins, Lato } from 'next/font/google';

// 1. IMPORT BOOTSTRAP CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// 2. HAPUS './globals.css' JIKA KOSONG, ATAU BIARKAN
import './globals.css'; 

// initialize font instances so we can read the .variable property
const poppins = Poppins({
  subsets: ['latin'], variable: '--font-poppins',
  weight: '100'
});
const lato = Lato({
  subsets: ['latin'], variable: '--font-lato',
  weight: '100'
});

export const metadata: Metadata = {
  title: 'Foma Student Forum',
  description: 'A forum for university students.',
};

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang="en">
      {/* 3. HAPUS SEMUA KELAS TAILWIND DARI BODY */}
      <body className={`${poppins.variable} ${lato.variable}`}>
        {children}
      </body>
    </html>
  );
}