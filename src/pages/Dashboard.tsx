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
import { supabase } from "@/integrations/supabase/client";
import { 
  fetchDashboardStats, 
  fetchRecentAlerts, 
  seedDatabaseWithExampleData, 
  type Alert 
} from "@/utils/supabaseData";

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    totalAlerts: 0,
    unresolvedAlerts: 0,
    totalIncidents: 0,
    criticalAlerts: 0
  });
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([]);
  const [alertsBySeverity, setAlertsBySeverity] = useState([
    { severity: "Critical", count: 0 },
    { severity: "High", count: 0 },
    { severity: "Medium", count: 0 },
    { severity: "Low", count: 0 }
  ]);
  const [isSeedingDatabase, setIsSeedingDatabase] = useState(false);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Check if we need to seed the database
        const { data: alertsCheck } = await supabase
          .from('alerts')
          .select('id')
          .limit(1);
          
        if (!alertsCheck || alertsCheck.length === 0) {
          // Auto-seed database if empty
          await seedDatabaseWithExampleData();
        }
        
        // Fetch dashboard stats
        const stats = await fetchDashboardStats();
        setDashboardStats({
          totalAlerts: stats.totalAlerts,
          unresolvedAlerts: stats.unresolvedAlerts,
          totalIncidents: stats.totalIncidents,
          criticalAlerts: stats.criticalAlerts
        });
        setAlertsBySeverity(stats.alertsBySeverity);
        
        // Fetch recent alerts
        const alerts = await fetchRecentAlerts(5);
        setRecentAlerts(alerts);
        
        toast.success("Dashboard data refreshed");
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Set up real-time subscriptions for all relevant tables
    
    // Alerts subscription
    const alertsSubscription = supabase
      .channel('alerts-dashboard-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'alerts' }, async () => {
        console.log('Real-time update: alerts changed');
        
        // Refresh stats and recent alerts
        const stats = await fetchDashboardStats();
        setDashboardStats({
          totalAlerts: stats.totalAlerts,
          unresolvedAlerts: stats.unresolvedAlerts,
          totalIncidents: stats.totalIncidents,
          criticalAlerts: stats.criticalAlerts
        });
        setAlertsBySeverity(stats.alertsBySeverity);
        
        const alerts = await fetchRecentAlerts(5);
        setRecentAlerts(alerts);
      })
      .subscribe();
    
    // Incidents subscription
    const incidentsSubscription = supabase
      .channel('incidents-dashboard-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'incidents' }, async () => {
        console.log('Real-time update: incidents changed');
        
        // Refresh stats only when incidents change
        const stats = await fetchDashboardStats();
        setDashboardStats(prev => ({
          ...prev,
          totalIncidents: stats.totalIncidents
        }));
      })
      .subscribe();
    
    // User roles subscription
    const rolesSubscription = supabase
      .channel('roles-dashboard-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_roles' }, () => {
        console.log('Real-time update: user roles changed');
        // We could refresh user-related metrics here if needed
      })
      .subscribe();

    // Clean up subscriptions on unmount
    return () => {
      supabase.removeChannel(alertsSubscription);
      supabase.removeChannel(incidentsSubscription);
      supabase.removeChannel(rolesSubscription);
    };
  }, []);

  const handleSeedDatabase = async () => {
    setIsSeedingDatabase(true);
    try {
      await seedDatabaseWithExampleData();
      // Refresh data after seeding
      const stats = await fetchDashboardStats();
      setDashboardStats({
        totalAlerts: stats.totalAlerts,
        unresolvedAlerts: stats.unresolvedAlerts,
        totalIncidents: stats.totalIncidents,
        criticalAlerts: stats.criticalAlerts
      });
      setAlertsBySeverity(stats.alertsBySeverity);
      
      const alerts = await fetchRecentAlerts(5);
      setRecentAlerts(alerts);
    } finally {
      setIsSeedingDatabase(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-background">
      <Navbar />
      
      <div className="container py-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Security Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of your security posture and recent activity
            </p>
          </div>
          <Button 
            onClick={handleSeedDatabase} 
            disabled={isSeedingDatabase}
          >
            {isSeedingDatabase ? "Seeding..." : "Seed Example Data"}
          </Button>
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
