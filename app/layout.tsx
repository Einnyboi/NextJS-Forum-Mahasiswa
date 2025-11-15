// app/layout.tsx
import type { Metadata } from 'next';
import { Poppins, Lato } from 'next/font/google';
import 'bootstrap/dist/css/bootstrap.min.css';
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
      <body className={`${poppins.variable} ${lato.variable}`}>
        {/* Your Navbar and Sidebar would go here */}
        {children}
      </body>
    </html>
  );
}