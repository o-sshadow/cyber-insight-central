
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { 
  AlertCircle, 
  AlertTriangle, 
  CheckCircle, 
  ChevronDown,
  Plus,
  Search, 
  Shield, 
  ShieldAlert
} from "lucide-react";
import { fetchIncidents, Incident } from "@/utils/supabaseData";
import { toast } from "sonner";

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const loadIncidents = async () => {
      try {
        setLoading(true);
        const incidentsData = await fetchIncidents();
        setIncidents(incidentsData);
      } catch (error) {
        console.error("Error loading incidents:", error);
        toast.error("Failed to load incidents data");
      } finally {
        setLoading(false);
      }
    };

    loadIncidents();
  }, []);

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

  const filteredIncidents = incidents.filter(incident => {
    // Apply status filter
    if (filter !== "all" && incident.status !== filter) {
      return false;
    }
    
    // Apply search query
    const query = searchQuery.toLowerCase();
    return (
      incident.name.toLowerCase().includes(query) ||
      incident.description?.toLowerCase().includes(query) ||
      incident.source_ip?.toLowerCase().includes(query) ||
      incident.severity.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-cyber-background">
      <Navbar />
      
      <div className="container py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Incidents</h1>
            <p className="text-muted-foreground">Manage and track security incidents</p>
          </div>
          
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Create Incident</span>
          </Button>
        </div>
        
        <Card className="cyber-card border-0 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search incidents..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant={filter === "all" ? "default" : "outline"} 
                  onClick={() => setFilter("all")}
                >
                  All
                </Button>
                <Button 
                  variant={filter === "open" ? "default" : "outline"} 
                  onClick={() => setFilter("open")}
                >
                  Open
                </Button>
                <Button 
                  variant={filter === "investigating" ? "default" : "outline"} 
                  onClick={() => setFilter("investigating")}
                >
                  Investigating
                </Button>
                <Button 
                  variant={filter === "resolved" ? "default" : "outline"} 
                  onClick={() => setFilter("resolved")}
                >
                  Resolved
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cyber-card border-0">
          <CardHeader className="pb-0">
            <CardTitle>Incident List</CardTitle>
            <CardDescription>
              {loading ? "Loading incidents..." : 
               filteredIncidents.length === 0 ? "No incidents found" : 
              `Showing ${filteredIncidents.length} of ${incidents.length} incidents`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="p-8 flex justify-center">
                <div className="animate-pulse flex flex-col items-center">
                  <Shield className="h-12 w-12 text-muted-foreground mb-4" />
                  <p>Loading incidents...</p>
                </div>
              </div>
            ) : filteredIncidents.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <ShieldAlert className="h-12 w-12 mx-auto mb-4" />
                <p className="mb-2">No incidents found</p>
                <p className="text-sm">Try changing your search criteria</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Source IP</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIncidents.map((incident) => (
                      <TableRow key={incident.id}>
                        <TableCell className="font-medium">{incident.name}</TableCell>
                        <TableCell>{getStatusBadge(incident.status)}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={`bg-${
                              incident.severity === "Critical" ? "cyber-critical" : 
                              incident.severity === "High" ? "cyber-high" : 
                              incident.severity === "Medium" ? "cyber-medium" : 
                              "cyber-low"
                            }/20 text-${
                              incident.severity === "Critical" ? "cyber-critical" : 
                              incident.severity === "High" ? "cyber-high" : 
                              incident.severity === "Medium" ? "cyber-medium" : 
                              "cyber-low"
                            }`}
                          >
                            {incident.severity}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(incident.created_at).toLocaleString(undefined, {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {incident.source_ip}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            asChild
                            className="flex items-center gap-1"
                          >
                            <Link to={`/incidents/${incident.id}`}>
                              View Details
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
