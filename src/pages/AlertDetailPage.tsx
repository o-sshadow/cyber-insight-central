import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlertCircle, 
  ArrowLeft,
  CheckCircle, 
  Clock, 
  Server, 
  Shield, 
  ShieldAlert,
  AlertTriangle
} from "lucide-react";
import { Alert, fetchAlert, resolveAlert } from "@/utils/supabaseData";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";

export default function AlertDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<Alert | null>(null);
  const [resolvingAlert, setResolvingAlert] = useState(false);

  useEffect(() => {
    const loadAlertData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const alertData = await fetchAlert(id);
        setAlert(alertData);
      } catch (error) {
        console.error("Error fetching alert details:", error);
        toast.error("Failed to load alert details");
      } finally {
        setLoading(false);
      }
    };

    loadAlertData();
    
    // Set up real-time subscription for this specific alert
    const alertSubscription = supabase
      .channel(`alert-${id}-changes`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'alerts', filter: `id=eq.${id}` }, 
        async () => {
          // Refresh alert data when it changes
          const refreshedAlert = await fetchAlert(id as string);
          setAlert(refreshedAlert);
        }
      )
      .subscribe();

    // Clean up subscription when component unmounts
    return () => {
      supabase.removeChannel(alertSubscription);
    };
  }, [id]);

  const handleResolveAlert = async () => {
    if (!alert) return;
    
    try {
      setResolvingAlert(true);
      const success = await resolveAlert(alert.id);
      
      if (success) {
        toast.success("Alert marked as resolved");
        setAlert(prev => prev ? { ...prev, resolved: true } : null);
      }
    } catch (error) {
      console.error("Error resolving alert:", error);
      toast.error("Failed to resolve alert");
    } finally {
      setResolvingAlert(false);
    }
  };

  const getSeverityColor = (severity: string) => {
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
        return "status-low";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "Critical":
        return <AlertCircle className="h-5 w-5" />;
      case "High":
        return <AlertTriangle className="h-5 w-5" />;
      case "Medium":
        return <ShieldAlert className="h-5 w-5" />;
      case "Low":
        return <Shield className="h-5 w-5" />;
      default:
        return <Shield className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-cyber-background">
      <Navbar />
      
      <div className="container py-6">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link to="/alerts" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Alerts
            </Link>
          </Button>
        </div>
        
        {loading ? (
          <div className="cyber-card p-12 flex justify-center items-center">
            <div className="animate-pulse flex flex-col items-center">
              <Shield className="h-12 w-12 text-muted-foreground mb-4" />
              <p>Loading alert details...</p>
            </div>
          </div>
        ) : alert ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card className="cyber-card border-0 mb-6">
                  <CardHeader className="pb-2">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div>
                        <CardTitle className="text-2xl">{alert.name}</CardTitle>
                        <div className="flex items-center gap-2 text-muted-foreground mt-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            {new Date(alert.timestamp).toLocaleString(undefined, {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 items-start">
                        <Badge
                          variant="outline"
                          className={`${getSeverityColor(alert.severity)} flex items-center gap-1 py-1 px-3`}
                        >
                          {getSeverityIcon(alert.severity)}
                          <span>{alert.severity}</span>
                        </Badge>
                        
                        <Badge
                          variant={alert.resolved ? "outline" : "secondary"}
                          className="py-1 px-3"
                        >
                          {alert.resolved ? (
                            <span className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" /> Resolved
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" /> Active
                            </span>
                          )}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Description</h3>
                        <p className="text-muted-foreground">{alert.description || "No description available."}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-secondary/50 p-3 rounded-md">
                          <h3 className="text-sm font-medium mb-2">Source IP</h3>
                          <p className="font-mono text-muted-foreground">{alert.sourceIp}</p>
                        </div>
                        
                        <div className="bg-secondary/50 p-3 rounded-md">
                          <h3 className="text-sm font-medium mb-2">Attack Vector</h3>
                          <p className="text-muted-foreground">{alert.attackVector || "Unknown"}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2">Affected Systems</h3>
                        <div className="flex flex-wrap gap-1">
                          {alert.affectedSystems && alert.affectedSystems.length > 0 ? (
                            alert.affectedSystems.map((system, index) => (
                              <Badge key={index} variant="outline" className="bg-secondary/50">
                                {system}
                              </Badge>
                            ))
                          ) : (
                            <p className="text-muted-foreground">No affected systems identified.</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2">Mitigation Steps</h3>
                        <p className="text-muted-foreground">{alert.mitigationSteps || "No mitigation steps available."}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="cyber-card border-0">
                  <CardHeader>
                    <CardTitle>Related Activity</CardTitle>
                    <CardDescription>Recent events connected to this alert</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Time</TableHead>
                          <TableHead>Event</TableHead>
                          <TableHead>Source</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="text-muted-foreground">
                            {new Date(alert.timestamp).toLocaleString(undefined, {
                              dateStyle: "short",
                              timeStyle: "short",
                            })}
                          </TableCell>
                          <TableCell>Alert created</TableCell>
                          <TableCell>Security Monitoring System</TableCell>
                        </TableRow>
                        {alert.resolved && (
                          <TableRow>
                            <TableCell className="text-muted-foreground">
                              {new Date().toLocaleString(undefined, {
                                dateStyle: "short",
                                timeStyle: "short",
                              })}
                            </TableCell>
                            <TableCell>Alert resolved</TableCell>
                            <TableCell>Security Team</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="cyber-card border-0 mb-6">
                  <CardHeader>
                    <CardTitle>Alert Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!alert.resolved ? (
                      <Button 
                        className="w-full justify-start" 
                        variant="default"
                        onClick={handleResolveAlert}
                        disabled={resolvingAlert}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {resolvingAlert ? "Resolving..." : "Mark as Resolved"}
                      </Button>
                    ) : (
                      <Button className="w-full justify-start" variant="outline" disabled>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Already Resolved
                      </Button>
                    )}
                    
                    <Button className="w-full justify-start" variant="secondary">
                      <Server className="h-4 w-4 mr-2" />
                      Create Incident
                    </Button>
                    
                    <Button className="w-full justify-start" variant="secondary">
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="cyber-card border-0">
                  <CardHeader>
                    <CardTitle>Risk Assessment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Severity Impact</h3>
                      <div className="w-full bg-secondary rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            alert.severity === "Critical" ? "bg-cyber-critical w-[100%]" :
                            alert.severity === "High" ? "bg-cyber-high w-[75%]" :
                            alert.severity === "Medium" ? "bg-cyber-medium w-[50%]" :
                            "bg-cyber-low w-[25%]"
                          }`}
                        ></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {alert.severity === "Critical" ? "Critical risk - immediate action required" :
                         alert.severity === "High" ? "High risk - prioritize remediation" :
                         alert.severity === "Medium" ? "Medium risk - schedule remediation" :
                         "Low risk - address as resources permit"}
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Similar Alerts</h3>
                      <ul className="text-sm space-y-2">
                        <li className="hover:bg-secondary/50 p-2 rounded">
                          <a href="#" className="text-primary">Similar attack vector (15 recent events)</a>
                        </li>
                        <li className="hover:bg-secondary/50 p-2 rounded">
                          <a href="#" className="text-primary">Similar source IP (3 recent events)</a>
                        </li>
                      </ul>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">MITRE ATT&CK</h3>
                      <Badge className="bg-secondary/50 hover:bg-secondary mr-1 mb-1">Initial Access</Badge>
                      {alert.attackVector === "Credential theft" && (
                        <Badge className="bg-secondary/50 hover:bg-secondary mr-1 mb-1">Credential Access</Badge>
                      )}
                      {alert.attackVector === "Data breach" && (
                        <Badge className="bg-secondary/50 hover:bg-secondary mr-1 mb-1">Exfiltration</Badge>
                      )}
                      {alert.attackVector === "Reconnaissance" && (
                        <Badge className="bg-secondary/50 hover:bg-secondary mr-1 mb-1">Discovery</Badge>
                      )}
                      <Badge className="bg-secondary/50 hover:bg-secondary mr-1 mb-1">Tactic</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        ) : (
          <div className="cyber-card p-12 flex justify-center items-center">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-cyber-high mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Alert Not Found</h2>
              <p className="text-muted-foreground mb-4">
                The alert you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <Button onClick={() => window.history.back()}>Go Back</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
