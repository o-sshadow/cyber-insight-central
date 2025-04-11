
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Table,
  TableBody,
  TableCell, 
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  AlertTriangle, 
  CheckCircle, 
  KeyRound, 
  Lock, 
  Search, 
  Shield, 
  UserCog, 
  X 
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { getUserRoles, setUserAdminStatus, UserRole } from "@/utils/supabaseData";

export default function AdminPage() {
  const { user } = useAuth();
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [updating, setUpdating] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadUserRoles = async () => {
      try {
        setLoading(true);
        const roles = await getUserRoles();
        setUserRoles(roles);
        
        // Find current user's role
        if (user) {
          const currentRole = roles.find(role => role.userId === user.id) || null;
          setCurrentUserRole(currentRole);
        }
      } catch (error) {
        console.error("Error loading user roles:", error);
        toast.error("Failed to load user roles");
      } finally {
        setLoading(false);
      }
    };

    loadUserRoles();
  }, [user]);

  const handleToggleAdmin = async (userId: string, isCurrentlyAdmin: boolean) => {
    try {
      setUpdating(prev => ({ ...prev, [userId]: true }));
      
      // Don't allow removing admin status from yourself
      if (userId === user?.id && isCurrentlyAdmin) {
        toast.error("You cannot remove your own admin privileges");
        return;
      }
      
      const success = await setUserAdminStatus(userId, !isCurrentlyAdmin);
      
      if (success) {
        setUserRoles(prev => 
          prev.map(role => 
            role.userId === userId 
              ? { ...role, isAdmin: !isCurrentlyAdmin } 
              : role
          )
        );
        
        toast.success(`User is now ${!isCurrentlyAdmin ? 'an admin' : 'no longer an admin'}`);
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Failed to update user role");
    } finally {
      setUpdating(prev => ({ ...prev, [userId]: false }));
    }
  };

  const filteredUsers = userRoles.filter(role => 
    role.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Check if current user is an admin
  const isAdmin = currentUserRole?.isAdmin || false;

  return (
    <div className="min-h-screen bg-cyber-background">
      <Navbar />
      
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage user roles and system settings</p>
          </div>
        </div>
        
        {!isAdmin ? (
          <Card className="cyber-card border-0">
            <CardHeader className="pb-0">
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>You do not have administrator privileges</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center p-6 text-center">
                <Lock className="h-12 w-12 text-muted-foreground mb-4" />
                <h2 className="text-xl font-bold mb-2">Administrator Access Required</h2>
                <p className="text-muted-foreground mb-4">
                  You need administrator privileges to access this page. Please contact an administrator if you believe you should have access.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="cyber-card border-0 mb-6">
              <CardHeader className="pb-0">
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user roles and permissions</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users by email..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                {loading ? (
                  <div className="p-8 flex justify-center">
                    <div className="animate-pulse flex flex-col items-center">
                      <UserCog className="h-12 w-12 text-muted-foreground mb-4" />
                      <p>Loading user data...</p>
                    </div>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    <UserCog className="h-12 w-12 mx-auto mb-4" />
                    <p className="mb-2">No users found</p>
                    <p className="text-sm">Try changing your search criteria</p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User Email</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Admin Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((role) => (
                          <TableRow key={role.userId} className={role.userId === user?.id ? "bg-secondary/20" : ""}>
                            <TableCell className="font-medium flex items-center gap-2">
                              {role.userId === user?.id && (
                                <Badge variant="outline" className="bg-primary/10 text-primary">
                                  You
                                </Badge>
                              )}
                              {role.email}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-green-500/10 text-green-500">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Active
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline" 
                                className={role.isAdmin ? "bg-cyber-high/20 text-cyber-high" : ""}
                              >
                                {role.isAdmin ? (
                                  <span className="flex items-center gap-1">
                                    <Shield className="h-3 w-3" /> Admin
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1">
                                    <KeyRound className="h-3 w-3" /> User
                                  </span>
                                )}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={role.isAdmin}
                                  disabled={updating[role.userId]}
                                  onCheckedChange={() => handleToggleAdmin(role.userId, role.isAdmin)}
                                />
                                <span className="text-xs text-muted-foreground">
                                  {role.isAdmin ? "Admin" : "User"}
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="cyber-card border-0">
              <CardHeader className="pb-0">
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure global system settings</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-secondary/50 p-4 rounded-md">
                    <h3 className="text-md font-medium mb-4">Security Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Email Alerts</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>SMS Notifications</span>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Critical Alert Push Notifications</span>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-secondary/50 p-4 rounded-md">
                    <h3 className="text-md font-medium mb-4">Authentication Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Require MFA for Admins</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Password Expiry (90 days)</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>IP-based Login Restrictions</span>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button>Save Settings</Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
