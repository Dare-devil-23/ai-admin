"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "../../components/ui/Layout";
import { isAuthenticated } from "../../services/auth";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);
  
  useEffect(() => {
    // Check for authentication
    const checkAuth = () => {
      const authed = isAuthenticated();
      setIsAuthed(authed);
      setIsLoading(false);
      
      if (!authed) {
        router.push("/login");
      }
    };
    
    checkAuth();
  }, [router]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // If not authenticated, don't render children
  if (!isAuthed) {
    return null;
  }

  return <Layout className="bg-background">{children}</Layout>;
} 