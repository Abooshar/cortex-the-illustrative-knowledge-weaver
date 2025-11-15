import React from 'react';
import { CortexSidebar } from '@/components/CortexSidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
type MainLayoutProps = {
  children: React.ReactNode;
};
export function MainLayout({ children }: MainLayoutProps): JSX.Element {
  return (
    <div className="flex h-screen bg-cortex-light dark:bg-cortex-dark">
      <CortexSidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="relative flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
      <ThemeToggle className="absolute top-4 right-4" />
    </div>
  );
}