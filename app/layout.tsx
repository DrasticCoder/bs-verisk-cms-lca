import type { Metadata } from 'next';
import { Cabin } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import AuthProvider from '@/components/auth-provider';
import QueryProvider from '@/components/query-provider';
import DashboardLayout from '@/components/dashboard-layout';
import './globals.css';

const cabinFont = Cabin({
  variable: '--font-cabin',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Verisk ',
  description: ' application for Verisk',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cabinFont.variable} antialiased`}>
        <AuthProvider>
          <QueryProvider>
            <DashboardLayout>
              {children}
              <Toaster />
            </DashboardLayout>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
