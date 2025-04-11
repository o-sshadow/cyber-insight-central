import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";

import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import AlertsPage from "./pages/AlertsPage";
import AlertDetailPage from "./pages/AlertDetailPage";
import IncidentsPage from "./pages/IncidentsPage";
import IncidentPage from "./pages/IncidentPage";
import AdminPage from "./pages/AdminPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import PricingPage from "./pages/PricingPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
            <Route path="/alerts" element={<AuthGuard><AlertsPage /></AuthGuard>} />
            <Route path="/alerts/:id" element={<AuthGuard><AlertDetailPage /></AuthGuard>} />
            <Route path="/incidents" element={<AuthGuard><IncidentsPage /></AuthGuard>} />
            <Route path="/incidents/:id" element={<AuthGuard><IncidentPage /></AuthGuard>} />
            <Route path="/admin" element={<AuthGuard><AdminPage /></AuthGuard>} />
            <Route path="/profile" element={<AuthGuard><ProfilePage /></AuthGuard>} />
            <Route path="/settings" element={<AuthGuard><SettingsPage /></AuthGuard>} />
            
            {/* Catch-all Route */}
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
