import React from 'react';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Header } from '../components/Header';
import { Navigation } from '../components/Navigation';

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Financial Wellness App',
  description: 'Track your finances with AI-powered insights and music',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={plusJakartaSans.className}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <Header />
          <main className="pb-16 px-4 max-w-7xl mx-auto">
            {children}
          </main>
          <Navigation />
        </div>
      </body>
    </html>
  );
} 