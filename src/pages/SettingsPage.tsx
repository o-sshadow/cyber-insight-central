import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import { 
  Bell, 
  Moon, 
  Sun, 
  Mail, 
  Phone, 
  Shield, 
  CloudOff,
  Clock,
  Globe,
  HelpCircle,
  RefreshCw,
  AlertTriangle,
  Trash2,
  XCircle,
  Save,
  Download
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface SystemSettings {
  appearance: {
    theme: string;
    dashboardLayout: string;
    colorScheme: string;
  };
  notifications: {
    emailAlerts: boolean;
    smsAlerts: boolean;
    pushNotifications: boolean;
    criticalAlertsOnly: boolean;
    digestEmails: boolean;
  };
  privacy: {
    dataSharing: boolean;
    anonymizedAnalytics: boolean;
    incidentReporting: boolean;
  };
  display: {
    timeFormat: string;
    dateFormat: string;
    timezone: string;
    language: string;
  };
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<SystemSettings>({
    appearance: {
      theme: "System",
      dashboardLayout: "Default",
      colorScheme: "Default",
    },
    notifications: {
      emailAlerts: true,
      smsAlerts: false,
      pushNotifications: true,
      criticalAlertsOnly: false,
      digestEmails: true,
    },
    privacy: {
      dataSharing: true,
      anonymizedAnalytics: true,
      incidentReporting: true,
    },
    display: {
      timeFormat: "12-hour",
      dateFormat: "MM/DD/YYYY",
      timezone: "Auto",
      language: "English"
    }
  });
  
  // Save settings
  const saveSettings = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success("Settings saved successfully");
      
      // In a real application, you would save to a database
      // e.g., using Supabase
      // const { error } = await supabase
      //   .from('user_settings')
      //   .upsert({ 
      //     user_id: user?.id,
      //     settings: settings
      //   })
    }, 1000);
  };
  
  const handleToggleNotification = (
    setting: keyof SystemSettings["notifications"],
    value: boolean
  ) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [setting]: value,
      },
    });
  };
  
  const handleTogglePrivacy = (
    setting: keyof SystemSettings["privacy"],
    value: boolean
  ) => {
    setSettings({
      ...settings,
      privacy: {
        ...settings.privacy,
        [setting]: value,
      },
    });
  };
  
  const handleAppearanceChange = (
    setting: keyof SystemSettings["appearance"],
    value: string
  ) => {
    setSettings({
      ...settings,
      appearance: {
        ...settings.appearance,
        [setting]: value,
      },
    });
  };
  
  const handleDisplayChange = (
    setting: keyof SystemSettings["display"],
    value: string
  ) => {
    setSettings({
      ...settings,
      display: {
        ...settings.display,
        [setting]: value,
      },
    });
  };
  
  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'cyber-insight-settings.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success("Settings exported successfully");
  };
  
  const confirmDangerousAction = (actionType: string) => {
    const isConfirmed = window.confirm(`Are you sure you want to ${actionType}? This action cannot be undone.`);
    
    if (isConfirmed) {
      toast.success(`${actionType} request submitted`);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-background">
      <Navbar />
      
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your application preferences</p>
          </div>
          <Button onClick={saveSettings} disabled={loading}>
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </div>
        
        <Tabs defaultValue="appearance" className="w-full">
          <div className="mb-4 overflow-x-auto">
            <TabsList className="inline-flex min-w-max">
              <TabsTrigger value="appearance">
                <Sun className="mr-2 h-4 w-4" />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="privacy">
                <Shield className="mr-2 h-4 w-4" />
                Privacy & Security
              </TabsTrigger>
              <TabsTrigger value="display">
                <Globe className="mr-2 h-4 w-4" />
                Regional
              </TabsTrigger>
              <TabsTrigger value="advanced">
                <HelpCircle className="mr-2 h-4 w-4" />
                Advanced
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="cyber-card border-0">
                <CardHeader>
                  <CardTitle>Theme Settings</CardTitle>
                  <CardDescription>
                    Customize the look and feel of the application
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Application Theme</label>
                    <Select 
                      value={settings.appearance.theme} 
                      onValueChange={(value) => handleAppearanceChange('theme', value)}
                    >
                      <SelectTrigger className="w-full bg-secondary">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="System">System</SelectItem>
                        <SelectItem value="Light">Light</SelectItem>
                        <SelectItem value="Dark">Dark</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      {settings.appearance.theme === "System" 
                        ? "Automatically match your system's theme" 
                        : `Use ${settings.appearance.theme.toLowerCase()} mode regardless of system settings`}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Dashboard Layout</label>
                    <Select 
                      value={settings.appearance.dashboardLayout} 
                      onValueChange={(value) => handleAppearanceChange('dashboardLayout', value)}
                    >
                      <SelectTrigger className="w-full bg-secondary">
                        <SelectValue placeholder="Select layout" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Default">Default</SelectItem>
                        <SelectItem value="Compact">Compact</SelectItem>
                        <SelectItem value="Expanded">Expanded</SelectItem>
                        <SelectItem value="Grid">Grid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Color Scheme</label>
                    <Select 
                      value={settings.appearance.colorScheme} 
                      onValueChange={(value) => handleAppearanceChange('colorScheme', value)}
                    >
                      <SelectTrigger className="w-full bg-secondary">
                        <SelectValue placeholder="Select color scheme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Default">Default</SelectItem>
                        <SelectItem value="Blue">Blue</SelectItem>
                        <SelectItem value="Green">Green</SelectItem>
                        <SelectItem value="Purple">Purple</SelectItem>
                        <SelectItem value="Orange">Orange</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="cyber-card border-0">
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>
                    See how your settings would look
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[280px] flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      {settings.appearance.theme === "Light" ? (
                        <Sun className="h-12 w-12 text-primary" />
                      ) : settings.appearance.theme === "Dark" ? (
                        <Moon className="h-12 w-12 text-primary" />
                      ) : (
                        <div className="flex gap-2">
                          <Sun className="h-12 w-12 text-primary" />
                          <Moon className="h-12 w-12 text-primary" />
                        </div>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {settings.appearance.theme === "System" 
                        ? "System Preference" 
                        : `${settings.appearance.theme} Mode`}
                    </p>
                    <p className="text-primary font-medium">
                      {settings.appearance.colorScheme} Color Scheme
                    </p>
                    <p>
                      {settings.appearance.dashboardLayout} Layout
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="cyber-card border-0">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how and when you want to be notified about security events
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Channels</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <label className="text-sm font-medium">Email Notifications</label>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Receive security alerts via email
                      </p>
                    </div>
                    <Switch 
                      checked={settings.notifications.emailAlerts}
                      onCheckedChange={(checked) => 
                        handleToggleNotification('emailAlerts', checked)
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <label className="text-sm font-medium">SMS Notifications</label>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Receive security alerts via text message
                      </p>
                    </div>
                    <Switch 
                      checked={settings.notifications.smsAlerts}
                      onCheckedChange={(checked) => 
                        handleToggleNotification('smsAlerts', checked)
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-muted-foreground" />
                        <label className="text-sm font-medium">Push Notifications</label>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Receive in-browser notifications
                      </p>
                    </div>
                    <Switch 
                      checked={settings.notifications.pushNotifications}
                      onCheckedChange={(checked) => 
                        handleToggleNotification('pushNotifications', checked)
                      }
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Preferences</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        <label className="text-sm font-medium">Critical Alerts Only</label>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Only notify for high and critical severity alerts
                      </p>
                    </div>
                    <Switch 
                      checked={settings.notifications.criticalAlertsOnly}
                      onCheckedChange={(checked) => 
                        handleToggleNotification('criticalAlertsOnly', checked)
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <label className="text-sm font-medium">Daily Digest Emails</label>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Receive a daily summary of all security events
                      </p>
                    </div>
                    <Switch 
                      checked={settings.notifications.digestEmails}
                      onCheckedChange={(checked) => 
                        handleToggleNotification('digestEmails', checked)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Privacy Tab */}
          <TabsContent value="privacy">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="cyber-card border-0">
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>
                    Control your data sharing preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Data Sharing</label>
                      <p className="text-xs text-muted-foreground">
                        Share security data for improved threat detection
                      </p>
                    </div>
                    <Switch 
                      checked={settings.privacy.dataSharing}
                      onCheckedChange={(checked) => 
                        handleTogglePrivacy('dataSharing', checked)
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Anonymized Analytics</label>
                      <p className="text-xs text-muted-foreground">
                        Share anonymous usage statistics to improve the service
                      </p>
                    </div>
                    <Switch 
                      checked={settings.privacy.anonymizedAnalytics}
                      onCheckedChange={(checked) => 
                        handleTogglePrivacy('anonymizedAnalytics', checked)
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Incident Reporting</label>
                      <p className="text-xs text-muted-foreground">
                        Automatically report incidents to community threat intelligence
                      </p>
                    </div>
                    <Switch 
                      checked={settings.privacy.incidentReporting}
                      onCheckedChange={(checked) => 
                        handleTogglePrivacy('incidentReporting', checked)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="cyber-card border-0">
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your account security preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Session Timeout</label>
                      <p className="text-xs text-muted-foreground">
                        Automatically log out after period of inactivity
                      </p>
                    </div>
                    <Select defaultValue="30">
                      <SelectTrigger className="w-[180px] bg-secondary">
                        <SelectValue placeholder="Select timeout" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                        <SelectItem value="0">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Login Notification</label>
                      <p className="text-xs text-muted-foreground">
                        Get notified of new login activities
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">API Token Access</label>
                      <p className="text-xs text-muted-foreground">
                        Allow API token access to your account
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Display Tab */}
          <TabsContent value="display">
            <Card className="cyber-card border-0">
              <CardHeader>
                <CardTitle>Regional & Format Settings</CardTitle>
                <CardDescription>
                  Customize display formats and regional preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Time Format</label>
                    <Select 
                      value={settings.display.timeFormat}
                      onValueChange={(value) => handleDisplayChange('timeFormat', value)}
                    >
                      <SelectTrigger className="w-full bg-secondary">
                        <SelectValue placeholder="Select time format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12-hour">12-hour (AM/PM)</SelectItem>
                        <SelectItem value="24-hour">24-hour</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Example: {settings.display.timeFormat === "12-hour" ? "3:45 PM" : "15:45"}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date Format</label>
                    <Select 
                      value={settings.display.dateFormat}
                      onValueChange={(value) => handleDisplayChange('dateFormat', value)}
                    >
                      <SelectTrigger className="w-full bg-secondary">
                        <SelectValue placeholder="Select date format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Example: {settings.display.dateFormat === "MM/DD/YYYY" 
                        ? "04/11/2025" 
                        : settings.display.dateFormat === "DD/MM/YYYY" 
                          ? "11/04/2025" 
                          : "2025-04-11"}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Timezone</label>
                    <Select 
                      value={settings.display.timezone}
                      onValueChange={(value) => handleDisplayChange('timezone', value)}
                    >
                      <SelectTrigger className="w-full bg-secondary">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Auto">Auto (System timezone)</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="EST">Eastern Time (EST)</SelectItem>
                        <SelectItem value="CST">Central Time (CST)</SelectItem>
                        <SelectItem value="MST">Mountain Time (MST)</SelectItem>
                        <SelectItem value="PST">Pacific Time (PST)</SelectItem>
                        <SelectItem value="GMT">Greenwich Mean Time (GMT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Language</label>
                    <Select 
                      value={settings.display.language}
                      onValueChange={(value) => handleDisplayChange('language', value)}
                    >
                      <SelectTrigger className="w-full bg-secondary">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Spanish">Spanish</SelectItem>
                        <SelectItem value="French">French</SelectItem>
                        <SelectItem value="German">German</SelectItem>
                        <SelectItem value="Japanese">Japanese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Advanced Tab */}
          <TabsContent value="advanced">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="cyber-card border-0">
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                  <CardDescription>
                    Manage technical settings and data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Data Management</AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-sm font-medium">Export Settings</h4>
                            <p className="text-xs text-muted-foreground">
                              Download your current settings as JSON
                            </p>
                          </div>
                          <Button variant="outline" onClick={exportSettings}>
                            <Download className="mr-2 h-4 w-4" />
                            Export
                          </Button>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-sm font-medium">Clear Local Cache</h4>
                            <p className="text-xs text-muted-foreground">
                              Clear browser storage and cached data
                            </p>
                          </div>
                          <Button variant="outline">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Clear
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-2">
                      <AccordionTrigger>Connection Options</AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-sm font-medium">Offline Mode</h4>
                            <p className="text-xs text-muted-foreground">
                              Work with cached data when offline
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium">Auto-refresh Interval</h4>
                            <p className="text-xs text-muted-foreground">
                              Data refresh frequency
                            </p>
                          </div>
                          <Select defaultValue="60">
                            <SelectTrigger className="w-[120px] bg-secondary">
                              <SelectValue placeholder="Select interval" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="30">30 seconds</SelectItem>
                              <SelectItem value="60">1 minute</SelectItem>
                              <SelectItem value="300">5 minutes</SelectItem>
                              <SelectItem value="0">Manual</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
              
              <Card className="cyber-card border-0 border-destructive/20">
                <CardHeader className="text-destructive">
                  <CardTitle>Danger Zone</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Irreversible actions that affect your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 border border-destructive/20 rounded-lg">
                      <div>
                        <h4 className="text-sm font-medium">Reset Application</h4>
                        <p className="text-xs text-muted-foreground">
                          Reset all settings to default values
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => confirmDangerousAction("reset all settings")}
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reset
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 border border-destructive/20 rounded-lg">
                      <div>
                        <h4 className="text-sm font-medium">Clear All Data</h4>
                        <p className="text-xs text-muted-foreground">
                          Delete all your saved data and settings
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => confirmDangerousAction("clear all data")}
                      >
                        <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                        Clear
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 border border-destructive/20 rounded-lg">
                      <div>
                        <h4 className="text-sm font-medium">Delete Account</h4>
                        <p className="text-xs text-muted-foreground">
                          Permanently delete your account and all data
                        </p>
                      </div>
                      <Button 
                        variant="destructive"
                        onClick={() => confirmDangerousAction("delete your account")}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}