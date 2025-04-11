
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

interface Alert {
  id: string;
  name: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  timestamp: string;
  sourceIp: string;
  resolved: boolean;
}

export default function AlertsPage() {
  const { supabase } = useAuth();
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSeverity, setFilterSeverity] = useState<string | null>(null);
  const [filterResolved, setFilterResolved] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would be an actual Supabase query
        // For demo purposes, we're using mock data
        
        // Mock API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock alerts data
        const mockAlerts = [
          {
            id: "1",
            name: "Suspicious Login Attempt",
            severity: "Critical",
            timestamp: "2025-04-10T15:30:00",
            sourceIp: "45.123.45.67",
            resolved: false
          },
          {
            id: "2",
            name: "Unusual File Access Pattern",
            severity: "High",
            timestamp: "2025-04-10T14:15:00",
            sourceIp: "192.168.1.105",
            resolved: false
          },
          {
            id: "3",
            name: "Failed Authentication",
            severity: "Medium",
            timestamp: "2025-04-10T13:45:00",
            sourceIp: "10.0.0.15",
            resolved: true
          },
          {
            id: "4",
            name: "Network Scan Detected",
            severity: "High",
            timestamp: "2025-04-10T12:20:00",
            sourceIp: "78.45.123.210",
            resolved: false
          },
          {
            id: "5",
            name: "Resource Usage Spike",
            severity: "Low",
            timestamp: "2025-04-10T11:10:00",
            sourceIp: "192.168.1.42",
            resolved: true
          },
          {
            id: "6",
            name: "Malware Detection",
            severity: "Critical",
            timestamp: "2025-04-10T10:05:00",
            sourceIp: "192.168.1.56",
            resolved: false
          },
          {
            id: "7",
            name: "Firewall Rule Violation",
            severity: "Medium",
            timestamp: "2025-04-10T09:30:00",
            sourceIp: "35.89.112.45",
            resolved: false
          },
          {
            id: "8",
            name: "Data Exfiltration Attempt",
            severity: "High",
            timestamp: "2025-04-09T22:15:00",
            sourceIp: "178.45.23.90",
            resolved: true
          },
          {
            id: "9",
            name: "Config Change Detected",
            severity: "Low",
            timestamp: "2025-04-09T18:40:00",
            sourceIp: "10.0.0.5",
            resolved: false
          },
          {
            id: "10",
            name: "Privilege Escalation",
            severity: "Critical",
            timestamp: "2025-04-09T16:20:00",
            sourceIp: "192.168.1.75",
            resolved: true
          }
        ];
        
        setAlerts(mockAlerts);
      } catch (error) {
        console.error("Error fetching alerts:", error);
        toast.error("Failed to load alerts");
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [supabase]);

  const handleResolveAlert = async (id: string) => {
    try {
      // In a real app, this would update the database
      // For demo purposes, we're just updating the local state
      setAlerts(alerts.map(alert => 
        alert.id === id ? { ...alert, resolved: true } : alert
      ));
      
      toast.success("Alert marked as resolved");
    } catch (error) {
      console.error("Error resolving alert:", error);
      toast.error("Failed to resolve alert");
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
