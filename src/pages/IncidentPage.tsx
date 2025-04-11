
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  AlertCircle, 
  AlertTriangle, 
  Calendar, 
  CheckCircle, 
  Clock, 
  FileText, 
  MessageSquare, 
  Send, 
  Shield, 
  ShieldAlert,
  Server, 
  UserCircle 
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Log {
  id: string;
  content: string;
  timestamp: string;
  user: string;
  type: "system" | "comment" | "action";
}

interface Incident {
  id: string;
  name: string;
  created_at: string;
  description: string;
  status: "open" | "investigating" | "contained" | "resolved";
  severity: "Critical" | "High" | "Medium" | "Low";
  source_ip: string;
  affected_systems: string[];
}

export default function IncidentPage() {
  const { supabase, user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [incident, setIncident] = useState<Incident | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [comment, setComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchIncidentDetails = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would be an actual Supabase query
        // For demo purposes, we're using mock data
        
        // Mock API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock incident data
        const mockIncident: Incident = {
          id: id || "1",
          name: "Unauthorized Access Attempt",
          created_at: "2025-04-10T14:30:00",
          description: "Multiple failed login attempts from unusual geographic location followed by successful authentication. Potential credential compromise.",
          status: "investigating",
          severity: "High",
          source_ip: "45.123.45.67",
          affected_systems: ["Authentication Server", "User Database", "Customer Portal"]
        };
        
        // Mock logs data
        const mockLogs: Log[] = [
          {
            id: "1",
            content: "Incident created from alert: Suspicious Login Attempt",
            timestamp: "2025-04-10T14:30:00",
            user: "System",
            type: "system"
          },
          {
            id: "2",
            content: "Initial assessment: Multiple failed login attempts from IP 45.123.45.67 followed by successful login.",
            timestamp: "2025-04-10T14:35:00",
            user: "john.doe@example.com",
            type: "comment"
          },
          {
            id: "3",
            content: "Started investigation",
            timestamp: "2025-04-10T14:40:00",
            user: "john.doe@example.com",
            type: "action"
          },
          {
            id: "4",
            content: "Geo-location of source IP: Eastern Europe (unusual for this user)",
            timestamp: "2025-04-10T14:50:00",
            user: "System",
            type: "system"
          },
          {
            id: "5",
            content: "User account temporarily disabled as a precaution",
            timestamp: "2025-04-10T15:05:00",
            user: "sarah.smith@example.com",
            type: "action"
          },
          {
            id: "6",
            content: "Reviewing access logs for additional suspicious activities",
            timestamp: "2025-04-10T15:15:00",
            user: "james.wilson@example.com",
            type: "comment"
          },
          {
            id: "7",
            content: "Found additional access attempts to other user accounts from same source IP",
            timestamp: "2025-04-10T15:30:00",
            user: "james.wilson@example.com",
            type: "comment"
          }
        ];
        
        setIncident(mockIncident);
        setLogs(mockLogs);
      } catch (error) {
        console.error("Error fetching incident details:", error);
        toast.error("Failed to load incident details");
      } finally {
        setLoading(false);
      }
    };

    fetchIncidentDetails();
  }, [id, supabase]);

  const handleSubmitComment = async () => {
    if (!comment.trim()) return;
    
    try {
      setSubmittingComment(true);
      
      // In a real app, this would actually save to Supabase
      // For demo purposes, we're just updating the local state
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newLog: Log = {
        id: `log-${Date.now()}`,
        content: comment,
        timestamp: new Date().toISOString(),
        user: user?.email || "unknown@example.com",
        type: "comment"
      };
      
      setLogs([...logs, newLog]);
      setComment("");
      toast.success("Comment added to incident timeline");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <Badge variant="outline" className="status-medium">
            <AlertCircle className="mr-1 h-3 w-3" />
            Open
          </Badge>
        );
      case "investigating":
        return (
          <Badge variant="outline" className="status-high">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Investigating
          </Badge>
        );
      case "contained":
        return (
          <Badge variant="outline" className="status-medium">
            <ShieldAlert className="mr-1 h-3 w-3" />
            Contained
          </Badge>
        );
      case "resolved":
        return (
          <Badge variant="outline" className="status-low">
            <CheckCircle className="mr-1 h-3 w-3" />
            Resolved
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <Shield className="mr-1 h-3 w-3" />
            {status}
          </Badge>
        );
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "Critical":
        return <Badge className="bg-cyber-critical/20 text-cyber-critical">{severity}</Badge>;
      case "High":
        return <Badge className="bg-cyber-high/20 text-cyber-high">{severity}</Badge>;
      case "Medium":
        return <Badge className="bg-cyber-medium/20 text-cyber-medium">{severity}</Badge>;
      case "Low":
        return <Badge className="bg-cyber-low/20 text-cyber-low">{severity}</Badge>;
      default:
        return <Badge>{severity}</Badge>;
    }
  };

  const getLogIcon = (type: string) => {
    switch (type) {
      case "system":
        return <Server className="h-5 w-5 text-muted-foreground" />;
      case "comment":
        return <MessageSquare className="h-5 w-5 text-cyber-medium" />;
      case "action":
        return <ShieldAlert className="h-5 w-5 text-cyber-high" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-cyber-background">
      <Navbar />
      
      <div className="container py-6">
        {loading ? (
          <div className="cyber-card p-12 flex justify-center items-center">
            <div className="animate-pulse flex flex-col items-center">
              <Shield className="h-12 w-12 text-muted-foreground mb-4" />
              <p>Loading incident details...</p>
            </div>
          </div>
        ) : incident ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="cyber-card border-0 rounded-lg p-6 mb-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                    <div>
                      <h1 className="text-2xl font-bold">{incident.name}</h1>
                      <div className="flex items-center gap-2 text-muted-foreground mt-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(incident.created_at).toLocaleString(undefined, {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {getStatusBadge(incident.status)}
                      {getSeverityBadge(incident.severity)}
                    </div>
                  </div>
                  
                  <p className="mb-4">{incident.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-secondary/50 p-3 rounded-md">
                      <h3 className="text-sm font-medium mb-2">Source IP</h3>
                      <p className="text-muted-foreground">{incident.source_ip}</p>
                    </div>
                    <div className="bg-secondary/50 p-3 rounded-md">
                      <h3 className="text-sm font-medium mb-2">Affected Systems</h3>
                      <div className="flex flex-wrap gap-1">
                        {incident.affected_systems.map((system, index) => (
                          <Badge key={index} variant="outline" className="bg-secondary/50">
                            {system}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <Card className="cyber-card border-0">
                  <CardHeader>
                    <CardTitle>Incident Timeline</CardTitle>
                    <CardDescription>
                      Chronological record of all activities related to this incident
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      {logs.map((log) => (
                        <div key={log.id} className="relative pl-6 pb-8">
                          <div className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center">
                            {getLogIcon(log.type)}
                          </div>
                          <div className="flex flex-col space-y-2">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <p className="text-sm font-medium leading-none">
                                  {log.user}
                                </p>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <Clock className="mr-1 h-3 w-3" />
                                  {new Date(log.timestamp).toLocaleString(undefined, {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                  })}
                                </div>
                              </div>
                              <Badge variant="outline" className="capitalize">
                                {log.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {log.content}
                            </p>
                          </div>
                          {/* Connector line */}
                          <span className="absolute left-3 top-6 bottom-0 w-px bg-border"></span>
                        </div>
                      ))}
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <UserCircle className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div className="flex-1">
                          <Textarea
                            placeholder="Add your comment or update..."
                            className="min-h-24"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                          />
                          <div className="flex justify-end mt-2">
                            <Button 
                              onClick={handleSubmitComment} 
                              disabled={submittingComment || !comment.trim()}
                              className="flex items-center gap-1"
                            >
                              {submittingComment ? "Adding..." : "Add Comment"}
                              <Send className="h-4 w-4 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="cyber-card border-0 mb-6">
                  <CardHeader>
                    <CardTitle>Incident Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full justify-start" variant="secondary">
                      Update Status
                    </Button>
                    <Button className="w-full justify-start" variant="secondary">
                      Assign to Team Member
                    </Button>
                    <Button className="w-full justify-start" variant="secondary">
                      Generate Report
                    </Button>
                    <Button className="w-full justify-start" variant="secondary">
                      Link Related Alerts
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="cyber-card border-0">
                  <CardHeader>
                    <CardTitle>Related Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">IP Reputation</h3>
                      <div className="w-full bg-secondary rounded-full h-2.5">
                        <div className="bg-cyber-critical h-2.5 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        85% - High risk score
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Geographic Origin</h3>
                      <p className="text-sm">Eastern Europe (Ukraine)</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Similar Incidents</h3>
                      <ul className="text-sm space-y-2">
                        <li className="hover:bg-secondary/50 p-2 rounded">
                          <a href="#" className="text-primary">Brute Force Attack (March 15)</a>
                        </li>
                        <li className="hover:bg-secondary/50 p-2 rounded">
                          <a href="#" className="text-primary">Credential Stuffing (Feb 28)</a>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Recommended Actions</h3>
                      <ul className="text-sm space-y-1">
                        <li className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-muted-foreground" />
                          <span>Force password reset for affected users</span>
                        </li>
                        <li className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-muted-foreground" />
                          <span>Enable MFA for administrator accounts</span>
                        </li>
                        <li className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-muted-foreground" />
                          <span>Update firewall rules to block source IP</span>
                        </li>
                      </ul>
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
              <h2 className="text-xl font-bold mb-2">Incident Not Found</h2>
              <p className="text-muted-foreground mb-4">
                The incident you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <Button onClick={() => window.history.back()}>Go Back</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
