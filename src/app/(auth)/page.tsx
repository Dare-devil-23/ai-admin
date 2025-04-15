"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Book, Users } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // For demo purposes, you could add initialization code here
  }, []);

  return (
    <div className="h-[calc(100vh-6rem)] p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/topics" className="block">
          <Card className="h-full cursor-pointer hover:border-primary transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center gap-2">
                <Book className="h-5 w-5" />
                Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Manage educational topics, chapters, and learning materials for students.
              </p>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/users" className="block">
          <Card className="h-full cursor-pointer hover:border-primary transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center gap-2">
                <Users className="h-5 w-5" />
                Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Manage user accounts, roles, and permissions for teachers and students.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
} 