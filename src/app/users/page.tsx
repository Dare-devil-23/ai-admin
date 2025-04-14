"use client";

import { useState } from "react";
import Layout from "../../components/ui/Layout";
import { Users, Search, UserPlus, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import Link from "next/link";

const DUMMY_USERS = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Teacher", status: "Active" },
  { id: 3, name: "Robert Johnson", email: "robert@example.com", role: "Student", status: "Inactive" },
  { id: 4, name: "Emily Davis", email: "emily@example.com", role: "Teacher", status: "Active" },
  { id: 5, name: "Michael Wilson", email: "michael@example.com", role: "Student", status: "Active" },
];

export default function UsersPage() {
  const [users] = useState(DUMMY_USERS);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout className="bg-background">
      <div className="h-[calc(100vh-6rem)]">
        <Card className="h-full flex flex-col rounded-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link href="/topics" className="p-2 rounded-full hover:bg-secondary">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Users
                </CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-[50%] -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search users..."
                    className="w-64 h-8 pl-8 pr-3 py-1.5 text-sm bg-secondary/50 border border-border rounded focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary"
                  />
                </div>
                <button className="flex items-center space-x-1 px-4 py-2 bg-primary text-primary-foreground text-sm rounded hover:bg-primary/90">
                  <UserPlus className="w-3 h-3" />
                  <span>Add User</span>
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto pb-6">
            <div className="rounded-xl border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="py-3 px-4 text-left text-sm font-medium">Name</th>
                    <th className="py-3 px-4 text-left text-sm font-medium">Email</th>
                    <th className="py-3 px-4 text-left text-sm font-medium">Role</th>
                    <th className="py-3 px-4 text-left text-sm font-medium">Status</th>
                    <th className="py-3 px-4 text-right text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b last:border-0">
                      <td className="py-3 px-4 text-sm">{user.name}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{user.email}</td>
                      <td className="py-3 px-4 text-sm">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === "Admin" ? "bg-blue-100 text-blue-800" :
                          user.role === "Teacher" ? "bg-purple-100 text-purple-800" :
                          "bg-green-100 text-green-800"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                          user.status === "Active" ? "bg-green-500" : "bg-red-500"
                        }`}></span>
                        {user.status}
                      </td>
                      <td className="py-3 px-4 text-sm text-right">
                        <button className="text-primary hover:text-primary/80 font-medium">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && (
                <div className="py-8 text-center text-muted-foreground">
                  No users found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}