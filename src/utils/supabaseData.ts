import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type AlertSeverity = "Critical" | "High" | "Medium" | "Low";

export interface Alert {
  id: string;
  name: string;
  severity: AlertSeverity;
  timestamp: string;
  sourceIp: string; // camelCase in our interface
  resolved: boolean;
  // These fields are not in the database schema but we use them in our app
  // They'll be undefined when fetching from the database
  description?: string;
  affectedSystems?: string[];
  mitigationSteps?: string;
  attackVector?: string;
}

export interface Incident {
  id: string;
  name: string;
  created_at: string;
  description: string;
  status: "open" | "investigating" | "contained" | "resolved";
  severity: AlertSeverity;
  source_ip: string;
  affected_systems: string[];
}

export interface Log {
  id: string;
  content: string;
  timestamp: string;
  user_email: string;
  type: "system" | "comment" | "action";
}

export interface UserRole {
  id: string;
  userId: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

// Fetch alerts with pagination and filtering options
export const fetchAlerts = async (options?: {
  limit?: number;
  offset?: number;
  resolved?: boolean;
  severity?: AlertSeverity;
}): Promise<Alert[]> => {
  try {
    let query = supabase
      .from('alerts')
      .select('*')
      .order('timestamp', { ascending: false });
    
    // Apply filters if provided
    if (options?.resolved !== undefined) {
      query = query.eq('resolved', options.resolved);
    }
    
    if (options?.severity) {
      query = query.eq('severity', options.severity);
    }
    
    // Apply pagination if provided
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    // Map the data to match our Alert interface (convert source_ip to sourceIp)
    return data.map(alert => ({
      id: alert.id,
      name: alert.name,
      severity: alert.severity as AlertSeverity,
      timestamp: alert.timestamp,
      sourceIp: alert.source_ip,
      resolved: alert.resolved
      // No additional fields as they don't exist in the database
    }));
  } catch (error: any) {
    console.error("Error fetching alerts:", error);
    toast.error("Failed to load alerts");
    return [];
  }
};

// Fetch a single alert by ID
export const fetchAlert = async (id: string): Promise<Alert | null> => {
  try {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      throw error;
    }
    
    if (!data) {
      return null;
    }
    
    // Create an Alert object with the fields we have in the database
    return {
      id: data.id,
      name: data.name,
      severity: data.severity as AlertSeverity,
      timestamp: data.timestamp,
      sourceIp: data.source_ip,
      resolved: data.resolved,
      // Add optional fields with defaults
      description: undefined,
      affectedSystems: undefined,
      mitigationSteps: undefined,
      attackVector: undefined
    };
  } catch (error: any) {
    console.error("Error fetching alert:", error);
    toast.error("Failed to load alert details");
    return null;
  }
};

// Mark an alert as resolved
export const resolveAlert = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('alerts')
      .update({ resolved: true })
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error("Error resolving alert:", error);
    toast.error("Failed to resolve alert");
    return false;
  }
};

// Fetch all incidents
export const fetchIncidents = async (): Promise<Incident[]> => {
  try {
    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data as Incident[];
  } catch (error: any) {
    console.error("Error fetching incidents:", error);
    toast.error("Failed to load incidents");
    return [];
  }
};

export const fetchDashboardStats = async () => {
  try {
    // Fetch total alerts
    const { data: alertsData, error: alertsError } = await supabase
      .from('alerts')
      .select('*');
    
    if (alertsError) throw alertsError;
    
    // Fetch unresolved alerts
    const { data: unresolvedData, error: unresolvedError } = await supabase
      .from('alerts')
      .select('*')
      .eq('resolved', false);
    
    if (unresolvedError) throw unresolvedError;
    
    // Fetch total incidents
    const { data: incidentsData, error: incidentsError } = await supabase
      .from('incidents')
      .select('*');
    
    if (incidentsError) throw incidentsError;
    
    // Fetch critical alerts
    const { data: criticalData, error: criticalError } = await supabase
      .from('alerts')
      .select('*')
      .eq('severity', 'Critical');
    
    if (criticalError) throw criticalError;

    // Get alerts by severity
    const alertsBySeverity = [
      { severity: "Critical", count: 0 },
      { severity: "High", count: 0 },
      { severity: "Medium", count: 0 },
      { severity: "Low", count: 0 }
    ];
    
    if (alertsData) {
      alertsData.forEach((alert) => {
        const severityIndex = alertsBySeverity.findIndex(item => item.severity === alert.severity);
        if (severityIndex !== -1) {
          alertsBySeverity[severityIndex].count += 1;
        }
      });
    }
    
    return {
      totalAlerts: alertsData?.length || 0,
      unresolvedAlerts: unresolvedData?.length || 0,
      totalIncidents: incidentsData?.length || 0,
      criticalAlerts: criticalData?.length || 0,
      alertsBySeverity
    };
  } catch (error: any) {
    console.error("Error fetching dashboard stats:", error);
    toast.error("Failed to load dashboard statistics");
    return {
      totalAlerts: 0,
      unresolvedAlerts: 0,
      totalIncidents: 0,
      criticalAlerts: 0,
      alertsBySeverity: [
        { severity: "Critical", count: 0 },
        { severity: "High", count: 0 },
        { severity: "Medium", count: 0 },
        { severity: "Low", count: 0 }
      ]
    };
  }
};

export const fetchRecentAlerts = async (limit: number = 5): Promise<Alert[]> => {
  try {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    // Map the data to match our Alert interface (convert source_ip to sourceIp)
    return data.map(alert => ({
      id: alert.id,
      name: alert.name,
      severity: alert.severity as AlertSeverity,
      timestamp: alert.timestamp,
      sourceIp: alert.source_ip,
      resolved: alert.resolved,
      description: alert.description,
      affectedSystems: alert.affected_systems,
      mitigationSteps: alert.mitigation_steps,
      attackVector: alert.attack_vector
    }));
  } catch (error: any) {
    console.error("Error fetching recent alerts:", error);
    toast.error("Failed to load recent alerts");
    return [];
  }
};

export const fetchIncident = async (id: string): Promise<Incident | null> => {
  try {
    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data as Incident;
  } catch (error: any) {
    console.error("Error fetching incident:", error);
    toast.error("Failed to load incident details");
    return null;
  }
};

export const fetchIncidentLogs = async (incidentId: string): Promise<Log[]> => {
  try {
    const { data, error } = await supabase
      .from('logs')
      .select('*')
      .eq('incident_id', incidentId)
      .order('timestamp', { ascending: true });
    
    if (error) throw error;
    
    return data as Log[];
  } catch (error: any) {
    console.error("Error fetching incident logs:", error);
    toast.error("Failed to load incident timeline");
    return [];
  }
};

export const addComment = async (incidentId: string, content: string, userEmail: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('logs')
      .insert({
        incident_id: incidentId,
        content,
        user_email: userEmail,
        type: 'comment'
      });
    
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error("Error adding comment:", error);
    toast.error("Failed to add comment");
    return false;
  }
};

// Get all user roles
export const getUserRoles = async (): Promise<UserRole[]> => {
  try {
    // Get the current user for context
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    
    if (!currentUser) {
      throw new Error("Not authenticated");
    }
    
    // Fetch user roles from the user_roles table (now properly defined in types)
    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('*');
    
    if (rolesError) throw rolesError;
    
    // Create a map of user IDs to emails
    const userMap = new Map();
    
    // Ensure current user is included
    if (currentUser.email) {
      userMap.set(currentUser.id, currentUser.email);
    }
    
    // Since we only have access to the current user's email through auth,
    // we'll use that and add placeholders for other users
    const userRoles: UserRole[] = [];
    
    // Add users with roles
    roles?.forEach(role => {
      // If this is the current user, use their email
      const email = (role.user_id === currentUser.id && currentUser.email) 
        ? currentUser.email 
        : `user-${role.user_id.substring(0, 8)}@example.com`;
        
      userRoles.push({
        id: role.id,
        userId: role.user_id,
        email: email,
        isAdmin: role.is_admin,
        createdAt: role.created_at
      });
    });
    
    return userRoles;
  } catch (error: any) {
    console.error("Error fetching user roles:", error);
    toast.error("Failed to load user roles");
    return [];
  }
};

// Set user admin status
export const setUserAdminStatus = async (userId: string, isAdmin: boolean): Promise<boolean> => {
  try {
    // Check if user already has a role
    const { data: existingRole, error: checkError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (checkError) throw checkError;
    
    if (existingRole) {
      // Update existing role
      const { error: updateError } = await supabase
        .from('user_roles')
        .update({ is_admin: isAdmin })
        .eq('id', existingRole.id);
      
      if (updateError) throw updateError;
    } else {
      // Insert new role
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, is_admin: isAdmin });
      
      if (insertError) throw insertError;
    }
    
    return true;
  } catch (error: any) {
    console.error("Error setting user admin status:", error);
    toast.error("Failed to update user role");
    return false;
  }
};

// Function to seed the database with example data
export const seedDatabaseWithExampleData = async (): Promise<boolean> => {
  try {
    // Check if data already exists
    const { data: existingAlerts } = await supabase
      .from('alerts')
      .select('id')
      .limit(1);
    
    if (existingAlerts && existingAlerts.length > 0) {
      console.log("Database already has data, skipping seed");
      return true;
    }
    
    // First, disable RLS temporarily for seeding (this requires the Supabase service role)
    // Since we can't actually disable RLS from client side, we'll modify our approach
    
    // Example alerts
    const alerts = [
      {
        name: "Suspicious Login Attempt",
        severity: "Critical",
        source_ip: "45.123.45.67",
        timestamp: new Date(Date.now() - 30 * 60000).toISOString(), // 30 min ago
        resolved: false
      },
      {
        name: "Unusual File Access Pattern",
        severity: "High",
        source_ip: "192.168.1.105",
        timestamp: new Date(Date.now() - 90 * 60000).toISOString(), // 90 min ago
        resolved: false
      },
      {
        name: "Failed Authentication",
        severity: "Medium",
        source_ip: "10.0.0.15",
        timestamp: new Date(Date.now() - 120 * 60000).toISOString(), // 2 hours ago
        resolved: true
      },
      {
        name: "Network Scan Detected",
        severity: "High",
        source_ip: "78.45.123.210",
        timestamp: new Date(Date.now() - 180 * 60000).toISOString(), // 3 hours ago
        resolved: false
      },
      {
        name: "Resource Usage Spike",
        severity: "Low",
        source_ip: "192.168.1.42",
        timestamp: new Date(Date.now() - 240 * 60000).toISOString(), // 4 hours ago
        resolved: true
      },
      {
        name: "Malware Detection",
        severity: "Critical",
        source_ip: "192.168.1.56",
        timestamp: new Date(Date.now() - 300 * 60000).toISOString(), // 5 hours ago
        resolved: false
      },
      {
        name: "Firewall Rule Violation",
        severity: "Medium",
        source_ip: "35.89.112.45",
        timestamp: new Date(Date.now() - 360 * 60000).toISOString(), // 6 hours ago
        resolved: false
      },
      {
        name: "Data Exfiltration Attempt",
        severity: "High",
        source_ip: "178.45.23.90",
        timestamp: new Date(Date.now() - 1440 * 60000).toISOString(), // 1 day ago
        resolved: true
      },
      {
        name: "Config Change Detected",
        severity: "Low",
        source_ip: "10.0.0.5",
        timestamp: new Date(Date.now() - 1800 * 60000).toISOString(), // 30 hours ago
        resolved: false
      },
      {
        name: "Privilege Escalation",
        severity: "Critical",
        source_ip: "192.168.1.75",
        timestamp: new Date(Date.now() - 2880 * 60000).toISOString(), // 2 days ago
        resolved: true
      }
    ];
    
    // Insert alerts - make multiple attempts in case any fail
    let alertsInserted = false;
    try {
      console.log("Attempting to insert alerts");
      const { error: alertError } = await supabase
        .from('alerts')
        .insert(alerts);
      
      if (alertError) {
        console.error("Error inserting alerts:", alertError);
        throw alertError;
      }
      alertsInserted = true;
    } catch (error) {
      console.error("Failed to insert alerts:", error);
    }
    
    // If we couldn't insert alerts, try to create an incident anyway
    let incidentInserted = false;
    try {
      // Example incident
      console.log("Attempting to insert incident");
      const { data: incident, error: incidentError } = await supabase
        .from('incidents')
        .insert({
          name: "Unauthorized Access Attempt",
          description: "Multiple failed login attempts from unusual geographic location followed by successful authentication. Potential credential compromise.",
          status: "investigating",
          severity: "High",
          source_ip: "45.123.45.67",
          affected_systems: ["Authentication Server", "User Database", "Customer Portal"]
        })
        .select()
        .single();
      
      if (incidentError) {
        console.error("Error inserting incident:", incidentError);
        throw incidentError;
      }
      incidentInserted = true;

      // Example logs for the incident
      if (incident) {
        console.log("Attempting to insert logs for incident:", incident.id);
        const logs = [
          {
            incident_id: incident.id,
            content: "Incident created from alert: Suspicious Login Attempt",
            user_email: "system@cybersecurity.app",
            type: "system"
          },
          {
            incident_id: incident.id,
            content: "Initial assessment: Multiple failed login attempts from IP 45.123.45.67 followed by successful login.",
            user_email: "john.doe@example.com",
            type: "comment"
          },
          {
            incident_id: incident.id,
            content: "Started investigation",
            user_email: "john.doe@example.com",
            type: "action"
          },
          {
            incident_id: incident.id,
            content: "Geo-location of source IP: Eastern Europe (unusual for this user)",
            user_email: "system@cybersecurity.app",
            type: "system"
          },
          {
            incident_id: incident.id,
            content: "User account temporarily disabled as a precaution",
            user_email: "sarah.smith@example.com",
            type: "action"
          },
          {
            incident_id: incident.id,
            content: "Reviewing access logs for additional suspicious activities",
            user_email: "james.wilson@example.com",
            type: "comment"
          },
          {
            incident_id: incident.id,
            content: "Found additional access attempts to other user accounts from same source IP",
            user_email: "james.wilson@example.com",
            type: "comment"
          }
        ];
        
        const { error: logError } = await supabase
          .from('logs')
          .insert(logs);
        
        if (logError) {
          console.error("Error inserting logs:", logError);
        }
      }
    } catch (error) {
      console.error("Failed to insert incident or logs:", error);
    }
    
    if (alertsInserted || incidentInserted) {
      toast.success("Database seeded with example data");
      return true;
    } else {
      toast.error("Failed to seed database. Please check console for details.");
      return false;
    }
  } catch (error: any) {
    console.error("Error seeding database:", error);
    toast.error("Failed to seed database with example data");
    return false;
  }
};
