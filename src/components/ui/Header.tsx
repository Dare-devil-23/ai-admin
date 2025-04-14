import React from 'react';
import Link from 'next/link';
import { User, Settings, Book, Users } from 'lucide-react';
import { cn } from '../../lib/utils';

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {}

const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <header 
        ref={ref}
        className={cn("sticky top-0 z-40 w-full border-b border-border bg-card", className)} 
        {...props}
      >
        <div className="mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/" className="text-xl font-bold flex items-center gap-2 text-primary">
                <Book className="w-5 h-5" />
                <span>AI Tutor Admin</span>
              </Link>
            </div>
            
            <nav className="flex items-center space-x-6">
              <Link 
                href="/topics" 
                className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1.5"
              >
                <Book className="w-4 h-4" />
                <span>Topics</span>
              </Link>
              <Link 
                href="/users" 
                className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1.5"
              >
                <Users className="w-4 h-4" />
                <span>Users</span>
              </Link>
              <div className="flex items-center space-x-2">
                <button 
                  className="p-2 rounded-full bg-accent/50 text-primary hover:bg-accent focus:outline-none"
                  aria-label="Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button 
                  className="p-2 rounded-full bg-accent/50 text-primary hover:bg-accent focus:outline-none"
                  aria-label="User Profile"
                >
                  <User className="w-4 h-4" />
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>
    );
  }
);

Header.displayName = "Header";

export default Header;
