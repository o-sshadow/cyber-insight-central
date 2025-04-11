
import { Link } from "react-router-dom";
import { AlertCircle, ArrowUpRight, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Alert {
  id: string;
  name: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  timestamp: string;
  sourceIp: string;
}

interface RecentAlertsProps {
  alerts: Alert[];
}

export function RecentAlerts({ alerts }: RecentAlertsProps) {
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
      case "High":
        return <AlertCircle className="h-3 w-3" />;
      default:
        return <Shield className="h-3 w-3" />;
    }
  };

  return (
    <Card className="cyber-card border-0">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>Latest security events detected</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/alerts" className="flex items-center gap-1">
              <span>View all</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.length === 0 ? (
            <div className="py-6 text-center text-muted-foreground">
              <p>No recent alerts found</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-secondary/50 transition-colors"
              >
                <div className="flex-shrink-0">
                  <Badge
                    variant="outline"
                    className={`${getSeverityColor(
                      alert.severity
                    )} flex items-center gap-1`}
                  >
                    {getSeverityIcon(alert.severity)}
                    <span>{alert.severity}</span>
                  </Badge>
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-sm font-medium truncate">{alert.name}</p>
                  <div className="flex gap-3 text-xs text-muted-foreground">
                    <p>{alert.sourceIp}</p>
                    <p>
                      {new Date(alert.timestamp).toLocaleString(undefined, {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Button size="icon" variant="ghost" asChild>
                    <Link to={`/alerts/${alert.id}`}>
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
