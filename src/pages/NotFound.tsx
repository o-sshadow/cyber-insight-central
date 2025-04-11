
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShieldOff } from "lucide-react";
import { Logo } from "@/components/Logo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-background">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <Logo size="large" />
        </div>
        
        <div className="flex justify-center mb-6">
          <div className="cyber-card p-5 rounded-full">
            <ShieldOff className="h-16 w-16 text-cyber-high" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
          This area is secure. Access denied.
        </p>
        
        <Button asChild size="lg">
          <a href="/">Return to Command Center</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
