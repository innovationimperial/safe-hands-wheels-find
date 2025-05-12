
import React, { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, UserPlus, Search, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface User {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
  };
  last_sign_in_at: string | null;
  role?: 'admin' | 'editor' | 'user';
  created_at: string;
}

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const { session } = useAuth();
  const [isInviting, setIsInviting] = useState(false);

  // Fetch users from Supabase
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      // In a real app, we'd use a Supabase Edge Function to fetch users as the client can't directly
      // access the auth.users table. For demo purposes, we'll return mock data.
      
      // Simulating real data
      const mockUsers: User[] = [
        { 
          id: "1", 
          email: "admin@example.com", 
          user_metadata: { full_name: "Admin User" },
          role: "admin",
          last_sign_in_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        },
        { 
          id: "2", 
          email: "editor@example.com", 
          user_metadata: { full_name: "Editor User" },
          role: "editor",
          last_sign_in_at: new Date(Date.now() - 86400000).toISOString(), // yesterday
          created_at: new Date().toISOString()
        },
        { 
          id: "3", 
          email: "user@example.com", 
          user_metadata: { full_name: "Regular User" },
          role: "user",
          last_sign_in_at: null,
          created_at: new Date().toISOString()
        }
      ];
      
      return mockUsers;
    },
    enabled: !!session
  });
  
  // Filter users based on search
  const filteredUsers = users?.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.user_metadata.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Format relative time for last active
  const formatLastActive = (timestamp: string | null) => {
    if (!timestamp) return "Never";
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 5) return "Just now";
    if (diffMins < 60) return `${diffMins} mins ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString();
  };

  // Invite user function
  const handleInviteUser = async () => {
    if (!inviteEmail || !inviteEmail.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    setIsInviting(true);

    try {
      // In a real app, this would use Supabase Auth Admin API via an Edge Function
      // For now, simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Invitation sent",
        description: `An invitation has been sent to ${inviteEmail}.`
      });
      
      setInviteEmail("");
      setInviteOpen(false);
    } catch (error) {
      toast({
        title: "Error sending invitation",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h1 className="text-2xl font-bold">User Management</h1>
          <Button onClick={() => setInviteOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite User
          </Button>
        </div>
        
        <div className="bg-white rounded-md border shadow-sm">
          <div className="p-4 border-b">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="py-8 text-center flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p>Loading users...</p>
              </div>
            ) : error ? (
              <div className="py-8 text-center flex flex-col items-center gap-2 text-red-500">
                <AlertCircle className="h-8 w-8" />
                <p>Failed to load users. Please try again.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.user_metadata.full_name || "N/A"}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === "admin" ? "default" : "outline"}>
                          {user.role || "User"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={
                            user.last_sign_in_at ? "border-green-500 text-green-500" : "border-amber-500 text-amber-500"
                          }
                        >
                          {user.last_sign_in_at ? "Active" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatLastActive(user.last_sign_in_at)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit User</DropdownMenuItem>
                            <DropdownMenuItem>Change Role</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </div>
      
      {/* Invite User Sheet */}
      <Sheet open={inviteOpen} onOpenChange={setInviteOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Invite User</SheetTitle>
            <SheetDescription>
              Send an invitation email to add a new user to the system.
            </SheetDescription>
          </SheetHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                placeholder="user@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <select 
                id="role" 
                className="w-full px-3 py-2 border rounded-md"
                defaultValue="user"
              >
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="user">User</option>
              </select>
              <p className="text-sm text-muted-foreground">
                This determines what permissions the user will have.
              </p>
            </div>
          </div>
          
          <SheetFooter>
            <Button 
              onClick={handleInviteUser} 
              disabled={isInviting || !inviteEmail}
            >
              {isInviting ? "Sending..." : "Send Invitation"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </AdminLayout>
  );
};

export default AdminUsers;
