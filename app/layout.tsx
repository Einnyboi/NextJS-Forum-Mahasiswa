import type { Metadata } from 'next';

import { Poppins, Lato } from 'next/font/google';
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';

import Navbar from "@/components/layout/navbar"; 
import Sidebar from "@/components/layout/sidebar";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
});

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-lato',
});

export const metadata: Metadata = {
  title: 'Foma Student Forum',
  description: 'A forum for university students.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${lato.variable}`}>
        {/* Your Navbar and Sidebar would go here */}
        {children}
      </body>
    </html>
  );
}