'use client';

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();

  // Don't show sidebar on auth pages
  if (pathname.startsWith('/auth')) {
    return <>{children}</>;
  }

  // Don't show sidebar if not authenticated
  if (!session) {
    return <>{children}</>;
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' });
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between border-b px-4 py-2 bg-white">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">Verisk </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {session.user?.name || session.user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
        <div className="h-[calc(100vh-65px)] overflow-auto bg-gray-50">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
