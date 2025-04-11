
import { useState, useEffect } from "react";
import { Shield, ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { AlertsBySeverityChart } from "@/components/Dashboard/AlertsBySeverityChart";
import { RecentAlerts } from "@/components/Dashboard/RecentAlerts";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Dashboard() {
  const { supabase } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    totalAlerts: 0,
    unresolvedAlerts: 0,
    totalIncidents: 0,
    criticalAlerts: 0
  });
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [alertsBySeverity, setAlertsBySeverity] = useState([
    { severity: "Critical", count: 0 },
    { severity: "High", count: 0 },
    { severity: "Medium", count: 0 },
    { severity: "Low", count: 0 }
  ]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // In a real app, these would be actual Supabase queries
        // For demo purposes, we're using mock data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data for dashboard
        setDashboardStats({
          totalAlerts: 167,
          unresolvedAlerts: 32,
          totalIncidents: 15,
          criticalAlerts: 8
        });
        
        setAlertsBySeverity([
          { severity: "Critical", count: 8 },
          { severity: "High", count: 24 },
          { severity: "Medium", count: 63 },
          { severity: "Low", count: 72 }
        ]);
        
        setRecentAlerts([
          {
            id: "1",
            name: "Suspicious Login Attempt",
            severity: "Critical",
            timestamp: "2025-04-10T15:30:00",
            sourceIp: "45.123.45.67"
          },
          {
            id: "2",
            name: "Unusual File Access Pattern",
            severity: "High",
            timestamp: "2025-04-10T14:15:00",
            sourceIp: "192.168.1.105"
          },
          {
            id: "3",
            name: "Failed Authentication",
            severity: "Medium",
            timestamp: "2025-04-10T13:45:00",
            sourceIp: "10.0.0.15"
          },
          {
            id: "4",
            name: "Network Scan Detected",
            severity: "High",
            timestamp: "2025-04-10T12:20:00",
            sourceIp: "78.45.123.210"
          },
          {
            id: "5",
            name: "Resource Usage Spike",
            severity: "Low",
            timestamp: "2025-04-10T11:10:00",
            sourceIp: "192.168.1.42"
          }
        ]);
        
        toast.success("Dashboard data refreshed");
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Enable Supabase real-time subscriptions
    // In a real app, this would be implemented
    const alertsSubscription = supabase
      .channel('alerts-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'alerts' }, (payload) => {
        // Handle real-time updates
        console.log('Real-time update:', payload);
        // In a real app, we would update the state here based on the payload
      })
      .subscribe();

    return () => {
      // Clean up the subscription
      supabase.removeChannel(alertsSubscription);
    };
  }, [supabase]);

  return (
    <div className="min-h-screen bg-cyber-background">
      <Navbar />
      
      <div className="container py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Security Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your security posture and recent activity
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Alerts"
            value={dashboardStats.totalAlerts}
            icon={<Shield className="h-4 w-4" />}
            description="Across all systems"
            trend={{ value: 12, isPositive: false }}
          />
          <StatsCard
            title="Unresolved Alerts"
            value={dashboardStats.unresolvedAlerts}
            icon={<ShieldAlert className="h-4 w-4" />}
            description="Requiring attention"
            className="border-l-cyber-high"
          />
          <StatsCard
            title="Open Incidents"
            value={dashboardStats.totalIncidents}
            icon={<ShieldX className="h-4 w-4" />}
            description="Under investigation"
          />
          <StatsCard
            title="Critical Alerts"
            value={dashboardStats.criticalAlerts}
            icon={<ShieldCheck className="h-4 w-4" />}
            description="High priority"
            className="border-l-cyber-critical"
          />
        </div>

        <div className="grid gap-6 mt-6 md:grid-cols-2">
          <Card className="cyber-card border-0">
            <CardHeader>
              <CardTitle>Alert Severity Distribution</CardTitle>
              <CardDescription>
                Breakdown of alerts by severity level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AlertsBySeverityChart data={alertsBySeverity} />
            </CardContent>
          </Card>

          <RecentAlerts alerts={recentAlerts} />
        </div>
        
        <div className="mt-6">
          <Card className="cyber-card border-0">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Security Status</CardTitle>
                  <CardDescription>System-wide security posture</CardDescription>
                </div>
                <Button>Run Security Scan</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-cyber-low" />
                    Network Security
                  </h3>
                  <div className="w-full bg-secondary rounded-full h-2.5">
                    <div className="bg-cyber-low h-2.5 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    85% - Firewall operational
                  </p>
                </div>
                
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-cyber-medium" />
                    Endpoint Security
                  </h3>
                  <div className="w-full bg-secondary rounded-full h-2.5">
                    <div className="bg-cyber-medium h-2.5 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    72% - 3 systems need updates
                  </p>
                </div>
                
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <ShieldX className="h-4 w-4 text-cyber-high" />
                    Cloud Security
                  </h3>
                  <div className="w-full bg-secondary rounded-full h-2.5">
                    <div className="bg-cyber-high h-2.5 rounded-full" style={{ width: '58%' }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    58% - IAM policies need review
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
