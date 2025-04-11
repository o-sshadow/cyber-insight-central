import { HeroSection } from "@/components/blocks/hero-section"
import { Icons } from "@/components/ui/icons"
import { Logo } from "@/components/Logo"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ShieldCheck, ArrowRight, MenuIcon, Shield, Eye, GitBranch, Check, User, UserPlus, ChevronRight, Bell, X, AlertTriangle } from "lucide-react"
import { useState, useRef, useEffect } from "react"

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const featuresRef = useRef<HTMLElement>(null);
  const howItWorksRef = useRef<HTMLElement>(null);
  
  // Track the active timeline step
  const [activeTimelineStep, setActiveTimelineStep] = useState(1);
  
  // States for interactive elements
  const [showInvestigatePopup, setShowInvestigatePopup] = useState(false);
  const [showConnectorPopup, setShowConnectorPopup] = useState({ visible: false, type: "" });
  const [showRemediationOptions, setShowRemediationOptions] = useState(false);
  
  // Timeline step references
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);

  // Handle smooth scrolling to sections
  const scrollToSection = (sectionRef: React.RefObject<HTMLElement>) => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Handle timeline step selection
  const selectTimelineStep = (step: number) => {
    setActiveTimelineStep(step);
  };

  // Handle scroll from anchor links
  useEffect(() => {
    if (window.location.hash === '#features' && featuresRef.current) {
      setTimeout(() => {
        scrollToSection(featuresRef);
      }, 100);
    }
    if (window.location.hash === '#how-it-works' && howItWorksRef.current) {
      setTimeout(() => {
        scrollToSection(howItWorksRef);
      }, 100);
    }
    
    // Set up intersection observer for timeline steps
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === step1Ref.current) setActiveTimelineStep(1);
            else if (entry.target === step2Ref.current) setActiveTimelineStep(2);
            else if (entry.target === step3Ref.current) setActiveTimelineStep(3);
          }
        });
      },
      { threshold: 0.6 } // When element is 60% visible
    );
    
    // Observe each step
    if (step1Ref.current) observer.observe(step1Ref.current);
    if (step2Ref.current) observer.observe(step2Ref.current);
    if (step3Ref.current) observer.observe(step3Ref.current);
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background antialiased">
      {/* Header with modern styling */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo size="large" />
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => scrollToSection(featuresRef)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection(howItWorksRef)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </button>
            <Link to="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Log in
            </Link>
            <Button asChild variant="default" className="rounded-full shadow-md" size="sm">
              <Link to="/login">Get Started</Link>
            </Button>
          </nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <MenuIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-md animate-in slide-in-from-top-5">
            <div className="container py-4 space-y-3">
              <button
                onClick={() => {
                  scrollToSection(featuresRef);
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-sm font-medium rounded-md hover:bg-muted"
              >
                Features
              </button>
              <button
                onClick={() => {
                  scrollToSection(howItWorksRef);
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-sm font-medium rounded-md hover:bg-muted"
              >
                How It Works
              </button>
              <Link to="/pricing" className="block px-3 py-2 text-sm font-medium rounded-md hover:bg-muted">
                Pricing
              </Link>
              <Link to="/login" className="block px-3 py-2 text-sm font-medium rounded-md hover:bg-muted">
                Log in
              </Link>
              <Button asChild variant="default" className="w-full rounded-full mt-2">
                <Link to="/login">Get Started</Link>
              </Button>
            </div>
          </div>
        )}
      </header>
      
      <main className="flex-1">
        {/* Hero Section with improved badge */}
        <HeroSection
          badge={{
            text: "Real-time Threat Intelligence",
            action: {
              text: "Learn more",
              href: "#features",
            },
          }}
          title="Proactive Cybersecurity For The Modern Enterprise"
          description="Monitor, track, and visualize security incidents in real-time. Make data-driven decisions with powerful analytics to keep your organization secure."
          actions={[
            {
              text: "Start Free Trial",
              href: "/login",
              variant: "default",
            },
            {
              text: "See How It Works",
              href: "#how-it-works",
              variant: "outline",
            },
          ]}
          image={{
            light: "/placeholder.svg",
            dark: "/placeholder.svg",
            alt: "Cyber Insight Central Dashboard Preview",
          }}
        />

        {/* Stats Section - Volta-inspired */}
        <section className="border-y border-border/40 bg-muted/30">
          <div className="container py-12 md:py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <p className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">99.9%</p>
                <p className="text-sm text-muted-foreground mt-2">Uptime</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">3min</p>
                <p className="text-sm text-muted-foreground mt-2">Avg. Response</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">500+</p>
                <p className="text-sm text-muted-foreground mt-2">Organizations</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">24/7</p>
                <p className="text-sm text-muted-foreground mt-2">Monitoring</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Modern & Volta-inspired */}
        <section id="features" ref={featuresRef} className="py-24 md:py-32 scroll-mt-20">
          <div className="container">
            <div className="text-center space-y-4 mb-16 animate-appear-zoom opacity-0" style={{ animationDelay: "100ms" }}>
              <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
                Features
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">Complete visibility into your security posture</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground text-lg md:text-xl">
                Our platform provides comprehensive tools to detect, analyze, and respond to security incidents.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group relative rounded-2xl border border-border/50 bg-background p-6 shadow-md transition-all hover:shadow-lg hover:border-primary/50 animate-appear opacity-0 hover:-translate-y-1 duration-300" style={{ animationDelay: "200ms" }}>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                <div className="mb-5 rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Shield className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-xl font-bold mb-3">Real-time Monitoring</h3>
                <p className="text-muted-foreground mb-4">
                  Continuous monitoring of your infrastructure for potential security threats with instant alerts and detailed analytics.
                </p>
                <Link to="/login" className="inline-flex items-center text-sm text-primary font-medium hover:text-primary/80 transition-colors">
                  Learn more <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              
              {/* Feature 2 */}
              <div className="group relative rounded-2xl border border-border/50 bg-background p-6 shadow-md transition-all hover:shadow-lg hover:border-primary/50 animate-appear opacity-0 hover:-translate-y-1 duration-300" style={{ animationDelay: "300ms" }}>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                <div className="mb-5 rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Eye className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-xl font-bold mb-3">Incident Management</h3>
                <p className="text-muted-foreground mb-4">
                  Streamlined workflows for handling security incidents from detection to resolution with full audit trails and team collaboration.
                </p>
                <Link to="/login" className="inline-flex items-center text-sm text-primary font-medium hover:text-primary/80 transition-colors">
                  Learn more <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              
              {/* Feature 3 */}
              <div className="group relative rounded-2xl border border-border/50 bg-background p-6 shadow-md transition-all hover:shadow-lg hover:border-primary/50 animate-appear opacity-0 hover:-translate-y-1 duration-300" style={{ animationDelay: "400ms" }}>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                <div className="mb-5 rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <GitBranch className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-xl font-bold mb-3">Intelligent Analytics</h3>
                <p className="text-muted-foreground mb-4">
                  Advanced data visualization and analysis to identify patterns and prevent future security breaches through AI-powered insights.
                </p>
                <Link to="/login" className="inline-flex items-center text-sm text-primary font-medium hover:text-primary/80 transition-colors">
                  Learn more <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section id="how-it-works" ref={howItWorksRef} className="py-24 md:py-32 bg-muted/30 scroll-mt-20">
          <div className="container">
            <div className="text-center space-y-4 mb-20 animate-appear-zoom opacity-0" style={{ animationDelay: "100ms" }}>
              <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
                How It Works
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">Simplify your security operations</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground text-lg md:text-xl">
                Our platform integrates seamlessly into your workflow, making security management intuitive and efficient.
              </p>
            </div>
            
            <div className="relative mt-16">
              {/* Timeline line */}
              <div className="absolute left-12 md:left-1/2 top-0 h-full w-px bg-border/60 -translate-x-1/2"></div>
              
              {/* Step 1 */}
              <div ref={step1Ref} className={`relative mb-28 md:mb-32 transition-all duration-500 hover:scale-[1.02] ${activeTimelineStep === 1 ? 'scale-100 opacity-100' : 'scale-[0.98] opacity-80'}`}>
                <div className="absolute left-12 md:left-1/2 top-24 -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold shadow-[0_0_15px_rgba(var(--primary),0.4)] hover:shadow-[0_0_20px_rgba(var(--primary),0.6)] transition-shadow cursor-pointer z-10 text-xl">
                  1
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="md:text-right md:pr-16 order-2 md:order-1 animate-appear opacity-0" style={{ animationDelay: "200ms" }}>
                    <h3 className="text-2xl font-bold mb-3">Connect Your Systems</h3>
                    <p className="text-muted-foreground">Easily integrate with your existing security tools and data sources using our pre-built connectors.</p>
                  </div>
                  <div className="order-1 md:order-2 bg-background rounded-xl border border-border/40 shadow-lg overflow-hidden animate-appear opacity-0 hover:shadow-xl transition-all" style={{ animationDelay: "300ms" }}>
                    <div className="aspect-[16/9] bg-muted flex items-center justify-center p-8">
                      <div className="grid grid-cols-3 gap-4 w-full">
                        {/* Server connector */}
                        <div 
                          className="flex flex-col items-center justify-center p-2 bg-background/80 rounded-lg border border-border/50 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer hover:scale-105"
                          onClick={() => setShowConnectorPopup({ visible: true, type: "server" })}
                        >
                          <Icons.server className="h-8 w-8 text-primary/70 mb-2" />
                          <span className="text-xs text-center">Servers</span>
                        </div>
                        
                        {/* API connector */}
                        <div 
                          className="flex flex-col items-center justify-center p-2 bg-background/80 rounded-lg border border-border/50 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer hover:scale-105"
                          onClick={() => setShowConnectorPopup({ visible: true, type: "api" })}
                        >
                          <Icons.layers className="h-8 w-8 text-primary/70 mb-2" />
                          <span className="text-xs text-center">APIs</span>
                        </div>
                        
                        {/* Cloud connector */}
                        <div 
                          className="flex flex-col items-center justify-center p-2 bg-background/80 rounded-lg border border-border/50 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer hover:scale-105"
                          onClick={() => setShowConnectorPopup({ visible: true, type: "cloud" })}
                        >
                          <Icons.cloud className="h-8 w-8 text-primary/70 mb-2" />
                          <span className="text-xs text-center">Cloud</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Connector Popup */}
                {showConnectorPopup.visible && (
                  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
                    <div className="bg-background border border-border rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl animate-in zoom-in-90 duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          {showConnectorPopup.type === "server" && <Icons.server className="h-6 w-6 text-primary mr-2" />}
                          {showConnectorPopup.type === "api" && <Icons.layers className="h-6 w-6 text-primary mr-2" />}
                          {showConnectorPopup.type === "cloud" && <Icons.cloud className="h-6 w-6 text-primary mr-2" />}
                          <h3 className="text-xl font-bold">
                            {showConnectorPopup.type === "server" && "Server Connector"}
                            {showConnectorPopup.type === "api" && "API Integration"}
                            {showConnectorPopup.type === "cloud" && "Cloud Services"}
                          </h3>
                        </div>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => setShowConnectorPopup({ visible: false, type: "" })}
                          className="h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-4 mb-6">
                        <p className="text-muted-foreground text-sm">
                          {showConnectorPopup.type === "server" && "Connect your on-premise servers to monitor system health, detect vulnerabilities, and track access patterns."}
                          {showConnectorPopup.type === "api" && "Integrate with third-party security services via REST APIs to enhance threat detection capabilities."}
                          {showConnectorPopup.type === "cloud" && "Secure your cloud infrastructure across AWS, Azure, and Google Cloud with unified monitoring."}
                        </p>
                        
                        <div className="p-3 bg-muted/50 rounded-lg border border-border space-y-2">
                          <div className="flex items-center">
                            <Check className="h-4 w-4 text-primary mr-2" />
                            <span className="text-sm">Real-time data collection</span>
                          </div>
                          <div className="flex items-center">
                            <Check className="h-4 w-4 text-primary mr-2" />
                            <span className="text-sm">Automated vulnerability scanning</span>
                          </div>
                          <div className="flex items-center">
                            <Check className="h-4 w-4 text-primary mr-2" />
                            <span className="text-sm">Smart anomaly detection</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button className="w-full">Connect Now</Button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Step 2 */}
              <div ref={step2Ref} className={`relative mb-28 md:mb-32 transition-all duration-500 hover:scale-[1.02] ${activeTimelineStep === 2 ? 'scale-100 opacity-100' : 'scale-[0.98] opacity-80'}`}>
                <div className="absolute left-12 md:left-1/2 top-24 -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold shadow-[0_0_15px_rgba(var(--primary),0.4)] hover:shadow-[0_0_20px_rgba(var(--primary),0.6)] transition-shadow cursor-pointer z-10 text-xl">
                  2
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="bg-background rounded-xl border border-border/40 shadow-lg overflow-hidden animate-appear opacity-0 hover:shadow-xl transition-all" style={{ animationDelay: "400ms" }}>
                    <div className="aspect-[16/9] bg-muted flex items-center justify-center p-8">
                      <div className="bg-background/80 w-full max-w-xs mx-auto rounded-lg border border-border/50 p-4 hover:shadow-md transition-all cursor-pointer">
                        <div className="flex justify-between items-center pb-2 mb-2 border-b border-border/30">
                          <div className="flex items-center">
                            <div className="h-3 w-3 rounded-full bg-destructive mr-2 animate-pulse"></div>
                            <span className="text-sm font-medium">Critical Alert</span>
                          </div>
                          <span className="text-xs text-muted-foreground">Just now</span>
                        </div>
                        <div className="text-xs text-muted-foreground mb-3">
                          Unusual login attempt detected from unrecognized location
                        </div>
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => setShowInvestigatePopup(true)} 
                            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded hover:bg-primary/20 transition-colors hover:scale-105"
                          >
                            Investigate
                          </button>
                          <button className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded hover:bg-muted/70 transition-colors">Dismiss</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="md:pl-16 animate-appear opacity-0" style={{ animationDelay: "500ms" }}>
                    <h3 className="text-2xl font-bold mb-3">Monitor & Detect</h3>
                    <p className="text-muted-foreground">Our platform continuously monitors your environment, identifying potential threats in real-time.</p>
                  </div>
                </div>
                
                {/* Investigate Alert Popup */}
                {showInvestigatePopup && (
                  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
                    <div className="bg-background border border-border rounded-xl p-6 max-w-lg w-full mx-4 shadow-2xl animate-in zoom-in-90 duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <AlertTriangle className="h-5 w-5 text-destructive mr-2" />
                          <h3 className="text-xl font-bold">Critical Alert Details</h3>
                        </div>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => setShowInvestigatePopup(false)}
                          className="h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-4 mb-6">
                        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-foreground">
                          <p className="font-medium mb-1">Unusual login attempt detected</p>
                          <p className="text-muted-foreground">Unauthorized access attempt from IP: 185.22.153.71 (Moscow, Russia)</p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">April 11, 2025 - 10:32 AM</span>
                            <span className="text-xs font-medium px-2 py-0.5 bg-destructive/20 text-destructive rounded-full">High Risk</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium">Affected User</h4>
                          <div className="flex items-center p-2 rounded-md border border-border">
                            <div className="h-8 w-8 bg-primary/20 rounded-full flex items-center justify-center text-primary mr-3">JD</div>
                            <div>
                              <p className="text-sm font-medium">John Doe</p>
                              <p className="text-xs text-muted-foreground">Administrator - IT Department</p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Notify Team Members</h4>
                          <div className="flex gap-2 flex-wrap">
                            <div className="flex items-center gap-1 px-2 py-1 bg-muted rounded-full text-xs">
                              <User className="h-3 w-3" />
                              <span>Security Analyst</span>
                              <button className="hover:text-destructive"><X className="h-3 w-3" /></button>
                            </div>
                            <button className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs hover:bg-primary/20 transition-colors">
                              <UserPlus className="h-3 w-3" />
                              <span>Add Responder</span>
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 justify-end">
                        <Button variant="outline" onClick={() => setShowInvestigatePopup(false)}>
                          Dismiss
                        </Button>
                        <Button>
                          Begin Investigation
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Step 3 */}
              <div ref={step3Ref} className={`relative transition-all duration-500 hover:scale-[1.02] ${activeTimelineStep === 3 ? 'scale-100 opacity-100' : 'scale-[0.98] opacity-80'}`}>
                <div className="absolute left-12 md:left-1/2 top-24 -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold shadow-[0_0_15px_rgba(var(--primary),0.4)] hover:shadow-[0_0_20px_rgba(var(--primary),0.6)] transition-shadow cursor-pointer z-10 text-xl">
                  3
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="md:text-right md:pr-16 order-2 md:order-1 animate-appear opacity-0" style={{ animationDelay: "600ms" }}>
                    <h3 className="text-2xl font-bold mb-3">Respond & Remediate</h3>
                    <p className="text-muted-foreground">Quickly investigate incidents, collaborate with your team, and implement remediation plans from a single dashboard.</p>
                  </div>
                  <div className="order-1 md:order-2 bg-background rounded-xl border border-border/40 shadow-lg overflow-hidden animate-appear opacity-0 hover:shadow-xl transition-all" style={{ animationDelay: "700ms" }}>
                    <div className="aspect-[16/9] bg-muted flex items-center justify-center p-8">
                      <div className="w-full max-w-xs hover:shadow-md transition-all cursor-pointer">
                        <div className="flex items-center mb-4">
                          <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                          <div className="h-1 bg-green-500/30 rounded-full flex-1"></div>
                          <div className="mx-2 text-xs font-medium">1/3</div>
                        </div>
                        <div className="bg-background/80 rounded-lg border border-border/50 p-3 mb-3">
                          <h4 className="text-sm font-medium mb-2">Incident Response Checklist</h4>
                          <div className="space-y-2">
                            <div className="flex items-start gap-2">
                              <div className="h-4 w-4 rounded border border-border bg-muted flex-shrink-0 mt-0.5 flex items-center justify-center">
                                <Check className="h-3 w-3 text-primary" />
                              </div>
                              <span className="text-xs">Identify affected systems</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div onClick={() => setShowRemediationOptions(!showRemediationOptions)} className="h-4 w-4 rounded border border-border bg-muted flex-shrink-0 mt-0.5 hover:border-primary/60 transition-colors cursor-pointer"></div>
                              <span className="text-xs">Isolate affected resources</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="h-4 w-4 rounded border border-border bg-muted flex-shrink-0 mt-0.5 hover:border-primary/60 transition-colors cursor-pointer"></div>
                              <span className="text-xs">Implement remediation plan</span>
                            </div>
                          </div>
                        </div>
                        
                        {showRemediationOptions && (
                          <div className="p-3 bg-background border border-primary/20 shadow-lg rounded-lg mb-3 animate-in slide-in-from-top-5 duration-200">
                            <h4 className="text-xs font-medium text-primary mb-2 flex items-center">
                              <Bell className="h-3 w-3 mr-1" />
                              Recommended Actions
                            </h4>
                            <ul className="space-y-2">
                              <li className="flex justify-between items-center">
                                <span className="text-xs">Revoke active sessions</span>
                                <ChevronRight className="h-3 w-3 text-muted-foreground" />
                              </li>
                              <li className="flex justify-between items-center">
                                <span className="text-xs">Force password reset</span>
                                <ChevronRight className="h-3 w-3 text-muted-foreground" />
                              </li>
                              <li className="flex justify-between items-center">
                                <span className="text-xs">Restrict login attempts</span>
                                <ChevronRight className="h-3 w-3 text-muted-foreground" />
                              </li>
                            </ul>
                          </div>
                        )}
                        
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="w-full text-xs hover:shadow-md transition-shadow group"
                        >
                          Continue Remediation
                          <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="relative overflow-hidden py-24 md:py-32">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 blur-3xl">
              <div className="aspect-square w-[40rem] rounded-full bg-gradient-to-br from-primary to-purple-600" />
            </div>
          </div>
          
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Ready to strengthen your security posture?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join organizations worldwide using Cyber Insight Central to protect their digital assets and respond to threats faster.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="rounded-full px-8 hover:scale-105 transition-transform" asChild>
                  <Link to="/login">
                    Start Free Trial
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-8 hover:scale-105 transition-transform" asChild>
                  <Link to="/pricing">
                    View Pricing
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/30">
        <div className="container py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            <div className="col-span-2 md:col-span-1">
              <Logo size="large" />
              <p className="mt-4 text-sm text-muted-foreground max-w-xs">
                Your comprehensive platform for proactive cybersecurity monitoring and incident response.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => scrollToSection(featuresRef)} 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection(howItWorksRef)} 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    How It Works
                  </button>
                </li>
                <li><Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link to="/roadmap" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Roadmap</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Resources</h4>
              <ul className="space-y-2">
                <li><Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link to="/documentation" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Documentation</Link></li>
                <li><Link to="/help" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link to="/community" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Community</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link></li>
                <li><Link to="/careers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Careers</Link></li>
                <li><Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</Link></li>
                <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-border/20 flex flex-col-reverse md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Cyber Insight Central. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Icons.twitter className="h-5 w-5" />
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Icons.gitHub className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}