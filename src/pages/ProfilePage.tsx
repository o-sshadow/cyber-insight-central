import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  UserCircle, 
  Mail, 
  ShieldCheck, 
  CalendarDays, 
  Key, 
  AlertTriangle,
  CheckCircle,
  LogIn,
  ExternalLink,
  Shield
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  fullName: string;
  jobTitle: string;
  department: string;
  email: string;
  avatarUrl: string | null;
}

interface ActivityLog {
  id: string;
  date: Date;
  action: string;
  ipAddress: string;
  successful: boolean;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    fullName: "",
    jobTitle: "",
    department: "",
    email: user?.email || "",
    avatarUrl: null
  });
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Generate initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };
  
  const initials = getInitials(profile.fullName || user?.email?.split('@')[0] || "User");
  
  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Fetch profile data from Supabase user_profiles table
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (error && error.code !== 'PGRST116') {
          console.error("Error fetching profile:", error);
          toast.error("Failed to load profile data");
          return;
        }
        
        // If profile exists, update the state
        if (data) {
          setProfile({
            fullName: data.full_name || "",
            jobTitle: data.job_title || "",
            department: data.department || "",
            email: user.email || "",
            avatarUrl: data.avatar_url
          });
        }
        
        // Fetch recent activity (mock data remains unchanged)
        const mockActivity: ActivityLog[] = [
          {
            id: "1",
            date: new Date(Date.now() - 20 * 60000), // 20 minutes ago
            action: "Login",
            ipAddress: "192.168.1.105",
            successful: true
          },
          {
            id: "2",
            date: new Date(Date.now() - 2 * 24 * 60 * 60000), // 2 days ago
            action: "Password Change",
            ipAddress: "192.168.1.105",
            successful: true
          },
          {
            id: "3",
            date: new Date(Date.now() - 3 * 24 * 60 * 60000), // 3 days ago
            action: "Login",
            ipAddress: "157.240.223.35",
            successful: false
          },
          {
            id: "4",
            date: new Date(Date.now() - 5 * 24 * 60 * 60000), // 5 days ago
            action: "Login",
            ipAddress: "192.168.1.105",
            successful: true
          }
        ];
        
        setActivityLogs(mockActivity);
        
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [user]);
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      setUpdatingProfile(true);
      
      // First, check if the profile exists
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      let result;
      
      if (existingProfile) {
        // If profile exists, update it
        result = await supabase
          .from('user_profiles')
          .update({
            full_name: profile.fullName,
            job_title: profile.jobTitle,
            department: profile.department,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
      } else {
        // If profile doesn't exist, insert it
        result = await supabase
          .from('user_profiles')
          .insert({
            user_id: user.id,
            full_name: profile.fullName,
            job_title: profile.jobTitle,
            department: profile.department,
            updated_at: new Date().toISOString()
          });
      }
      
      if (result.error) {
        throw result.error;
      }
      
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setUpdatingProfile(false);
    }
  };
  
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    
    try {
      setUpdatingPassword(true);
      
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword 
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast.error(error.message || "Failed to update password");
    } finally {
      setUpdatingPassword(false);
    }
  };
  
  const getActivityIcon = (action: string, successful: boolean) => {
    if (!successful) return <AlertTriangle className="h-4 w-4 text-cyber-high" />;
    
    switch (action) {
      case "Login":
        return <LogIn className="h-4 w-4 text-cyber-medium" />;
      case "Password Change":
        return <Key className="h-4 w-4 text-cyber-medium" />;
      default:
        return <CheckCircle className="h-4 w-4 text-cyber-low" />;
    }
  };
  
  return (
    <div className="min-h-screen bg-cyber-background">
      <Navbar />
      
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        
        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Summary Card */}
          <Card className="cyber-card border-0 md:col-span-1">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary">
                <AvatarImage src={profile.avatarUrl || ""} alt={profile.fullName} />
                <AvatarFallback className="text-lg bg-primary/20">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{profile.fullName || "User"}</CardTitle>
                <CardDescription>{profile.jobTitle || "Account Member"}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{profile.email}</span>
              </div>
              {profile.department && (
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{profile.department}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Joined {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "Recently"}
                </span>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Role & Permissions</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    <Shield className="mr-1 h-3 w-3" />
                    User
                  </Badge>
                  <Badge variant="outline">Dashboard</Badge>
                  <Badge variant="outline">Alerts</Badge>
                  <Badge variant="outline">Incidents</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Profile Settings */}
          <div className="md:col-span-2">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="profile" className="flex-1">Profile Settings</TabsTrigger>
                <TabsTrigger value="security" className="flex-1">Security</TabsTrigger>
                <TabsTrigger value="activity" className="flex-1">Activity</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="mt-4 space-y-4">
                <Card className="cyber-card border-0">
                  <CardHeader>
                    <CardTitle className="text-xl">Profile Information</CardTitle>
                    <CardDescription>
                      Update your profile information
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={handleUpdateProfile}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="fullName" className="text-sm font-medium">
                          Full Name
                        </label>
                        <Input
                          id="fullName"
                          value={profile.fullName}
                          onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                          placeholder="Your full name"
                          className="bg-secondary"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email
                        </label>
                        <Input
                          id="email"
                          value={profile.email}
                          disabled
                          className="bg-secondary opacity-70"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="jobTitle" className="text-sm font-medium">
                            Job Title
                          </label>
                          <Input
                            id="jobTitle"
                            value={profile.jobTitle}
                            onChange={(e) => setProfile({...profile, jobTitle: e.target.value})}
                            placeholder="Your job title"
                            className="bg-secondary"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="department" className="text-sm font-medium">
                            Department
                          </label>
                          <Input
                            id="department"
                            value={profile.department}
                            onChange={(e) => setProfile({...profile, department: e.target.value})}
                            placeholder="Your department"
                            className="bg-secondary"
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        type="submit"
                        disabled={updatingProfile}
                      >
                        {updatingProfile ? "Saving..." : "Save Changes"}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
              
              <TabsContent value="security" className="mt-4 space-y-4">
                <Card className="cyber-card border-0">
                  <CardHeader>
                    <CardTitle className="text-xl">Change Password</CardTitle>
                    <CardDescription>
                      Update your account password
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={handlePasswordChange}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="currentPassword" className="text-sm font-medium">
                          Current Password
                        </label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="••••••••"
                          className="bg-secondary"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="newPassword" className="text-sm font-medium">
                          New Password
                        </label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          className="bg-secondary"
                          required
                          minLength={6}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="text-sm font-medium">
                          Confirm New Password
                        </label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="bg-secondary"
                          required
                          minLength={6}
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        type="submit"
                        disabled={updatingPassword || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                      >
                        {updatingPassword ? "Updating..." : "Update Password"}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
                
                <Card className="cyber-card border-0">
                  <CardHeader>
                    <CardTitle className="text-xl">Two-Factor Authentication</CardTitle>
                    <CardDescription>
                      Add an extra layer of security to your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <h3 className="font-medium">Authenticator App</h3>
                        <p className="text-sm text-muted-foreground">
                          Use an authenticator app to generate one-time codes
                        </p>
                      </div>
                      <Button variant="outline">Enable</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="activity" className="mt-4 space-y-4">
                <Card className="cyber-card border-0">
                  <CardHeader>
                    <CardTitle className="text-xl">Recent Activity</CardTitle>
                    <CardDescription>
                      Recent login and account activity
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activityLogs.map(log => (
                        <div key={log.id} className="flex items-start gap-3 pb-4 border-b border-border/40 last:border-0">
                          <div className="mt-1">
                            {getActivityIcon(log.action, log.successful)}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h3 className="font-medium text-sm">{log.action}</h3>
                              <span className="text-xs text-muted-foreground">
                                {log.date.toLocaleDateString()} {log.date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-muted-foreground">
                                IP: {log.ipAddress}
                              </p>
                              {log.successful ? (
                                <Badge variant="outline" className="text-cyber-low bg-cyber-low/10">
                                  Successful
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-cyber-high bg-cyber-high/10">
                                  Failed
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Full Activity Log
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}