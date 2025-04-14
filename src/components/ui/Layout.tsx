import React from 'react';
import Header from './Header';
import { cn } from '../../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <div className={cn("min-h-screen flex flex-col", className)}>
      <Header />
      <main className="flex-1 w-full mx-auto p-3 bg-secondary">
        {children}
      </main>
    </div>
  );
};

export default Layout;
