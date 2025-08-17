import './globals.css';
import { Navbar } from '@/components/Navbar';
import { AuthProvider } from '@/context/AuthContext';
import React from 'react';
import { Inter, Fira_Code } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira-code',
});

export const metadata = {
  title: 'Blogify.dev',
  description: 'A decentralized hub for developers, thinkers, and innovators.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${firaCode.variable} bg-[#0f172a] text-slate-300 font-sans`}>
        <AuthProvider>
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {children}
          </main>
          <footer className="text-center py-8 border-t border-slate-800 mt-12">
            <p className="text-sm text-slate-500 font-mono">Compiled with React & Tailwind. Hosted on the decentralized web.</p>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}