import type { Metadata } from 'next';
// 1. Import the fonts you need
import { Poppins, Lato } from 'next/font/google';
import './globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// 2. Configure them
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'], // Add the weights you'll use
  variable: '--font-poppins', // This is for Tailwind
});

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-lato', // This is for Tailwind
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
      <body className={`${poppins.variable} ${lato.variable} font-sans bg-primary`}>
        {/* Your Navbar and Sidebar would go here */}
        {children}
      </body>
    </html>
  );
}