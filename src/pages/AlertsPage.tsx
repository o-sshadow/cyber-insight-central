
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  AlertCircle,
  AlertTriangle,
  Check,
  CheckCircle,
  ChevronDown,
  Filter,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { fetchAlerts, resolveAlert, Alert, AlertSeverity } from "@/utils/supabaseData";

export default function AlertsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSeverity, setFilterSeverity] = useState<AlertSeverity | null>(null);
  const [filterResolved, setFilterResolved] = useState<boolean | null>(null);

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        setLoading(true);
        const alertsData = await fetchAlerts();
        setAlerts(alertsData);
      } catch (error) {
        console.error("Error fetching alerts:", error);
        toast.error("Failed to load alerts");
      } finally {
        setLoading(false);
      }
    };

    loadAlerts();

    // Set up realtime subscription
    const alertsSubscription = supabase
      .channel('alerts-table-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'alerts' }, 
        async () => {
          // Refresh alerts when data changes
          const refreshedAlerts = await fetchAlerts();
          setAlerts(refreshedAlerts);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(alertsSubscription);
    };
  }, []);

  const handleResolveAlert = async (id: string) => {
    const success = await resolveAlert(id);
    if (success) {
      toast.success("Alert marked as resolved");
      // The data will refresh automatically through the realtime subscription
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "Critical":
        return <AlertCircle className="h-4 w-4 text-cyber-critical" />;
      case "High":
        return <AlertTriangle className="h-4 w-4 text-cyber-high" />;
      case "Medium":
        return <ShieldAlert className="h-4 w-4 text-cyber-medium" />;
      case "Low":
        return <ShieldCheck className="h-4 w-4 text-cyber-low" />;
      default:
        return <ShieldQuestion className="h-4 w-4" />;
    }
  };

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "status-critical";
      case "High":
        return "status-high";
      case "Medium":
        return "status-medium";
      case "Low":
        return "status-low";
      default:
        return "";
    }
  };

  // Filter the alerts based on search term and filters
  const filteredAlerts = alerts.filter(alert => {
    let matchesSearch = true;
    let matchesSeverity = true;
    let matchesResolved = true;
    
    if (searchTerm) {
      matchesSearch = 
        alert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.sourceIp.includes(searchTerm);
    }
    
    if (filterSeverity) {
      matchesSeverity = alert.severity === filterSeverity;
    }
    
    if (filterResolved !== null) {
      matchesResolved = alert.resolved === filterResolved;
    }
    
    return matchesSearch && matchesSeverity && matchesResolved;
  });

  return (
    <div className="min-h-screen bg-cyber-background">
      <Navbar />
      
      <div className="container py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Security Alerts</h1>
            <p className="text-muted-foreground">
              Manage and respond to detected security events
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search alerts..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex gap-1">
                    <Filter className="h-4 w-4" />
                    <span>Severity</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFilterSeverity(null)}>
                    <Shield className="mr-2 h-4 w-4" />
                    All Severities
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterSeverity("Critical")}>
                    <AlertCircle className="mr-2 h-4 w-4 text-cyber-critical" />
                    Critical
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterSeverity("High")}>
                    <AlertTriangle className="mr-2 h-4 w-4 text-cyber-high" />
                    High
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterSeverity("Medium")}>
                    <ShieldAlert className="mr-2 h-4 w-4 text-cyber-medium" />
                    Medium
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterSeverity("Low")}>
                    <ShieldCheck className="mr-2 h-4 w-4 text-cyber-low" />
                    Low
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex gap-1">
                    <Check className="h-4 w-4" />
                    <span>Status</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFilterResolved(null)}>
                    All Status
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterResolved(false)}>
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterResolved(true)}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Resolved
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="cyber-card p-12 flex justify-center items-center">
            <div className="animate-pulse flex flex-col items-center">
              <Shield className="h-12 w-12 text-muted-foreground mb-4" />
              <p>Loading alerts...</p>
            </div>
          </div>
        ) : (
          <div className="cyber-card border-0 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alert Name</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Source IP</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAlerts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        No alerts found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAlerts.map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell className="font-medium">{alert.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getSeverityClass(alert.severity)}>
                            <span className="flex items-center gap-1">
                              {getSeverityIcon(alert.severity)}
                              {alert.severity}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell>{alert.sourceIp}</TableCell>
                        <TableCell>
                          {new Date(alert.timestamp).toLocaleString(undefined, {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </TableCell>
                        <TableCell>
                          {alert.resolved ? (
                            <Badge variant="outline" className="status-low">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Resolved
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="status-high">
                              <AlertCircle className="mr-1 h-3 w-3" />
                              Active
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.location.href = `/incidents/${alert.id}`}
                            >
                              View
                            </Button>
                            {!alert.resolved && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleResolveAlert(alert.id)}
                              >
                                Resolve
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
