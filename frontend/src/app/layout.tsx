import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'ThreadCo — Premium T-Shirts',
  description: 'Discover premium quality t-shirts for every style and occasion.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-stone-50 text-stone-900 font-sans">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Toaster position="bottom-right" toastOptions={{
          style: { borderRadius: '4px', background: '#1c1917', color: '#fafaf9' }
        }} />
      </body>
    </html>
  );
}
