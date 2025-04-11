import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, HelpCircle, X } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

export default function PricingPage() {
  const [billingInterval, setBillingInterval] = useState<"monthly" | "annually">("monthly")

  const tiers = [
    {
      name: "Starter",
      id: "starter",
      description: "Essential security monitoring for small teams",
      features: [
        "Up to 5 users",
        "Basic security alerts",
        "24/7 monitoring",
        "7-day data retention",
        "Email notifications",
        "Basic dashboard",
      ],
      missingFeatures: [
        "Custom integrations",
        "Advanced analytics",
        "Priority support",
        "Custom reporting",
      ],
      priceMonthly: "$99",
      priceAnnually: "$79",
      popular: false,
    },
    {
      name: "Professional",
      id: "professional",
      description: "Complete security solution for growing businesses",
      features: [
        "Up to 20 users",
        "Advanced alert detection",
        "24/7 monitoring",
        "30-day data retention",
        "Multi-channel notifications",
        "Full analytics dashboard",
        "Basic API access",
        "8-hour support response",
      ],
      missingFeatures: [
        "Custom integrations",
        "Custom reporting",
      ],
      priceMonthly: "$249",
      priceAnnually: "$199",
      popular: true,
    },
    {
      name: "Enterprise",
      id: "enterprise",
      description: "Comprehensive security for large organizations",
      features: [
        "Unlimited users",
        "Advanced threat intelligence",
        "24/7 monitoring with live dashboard",
        "90-day data retention",
        "Multi-channel notifications with escalation",
        "Advanced analytics and reporting",
        "Full API access",
        "Custom integrations",
        "2-hour support response",
        "Dedicated account manager",
      ],
      missingFeatures: [],
      priceMonthly: "$599",
      priceAnnually: "$499",
      popular: false,
    },
    {
      name: "Custom",
      id: "custom",
      description: "Tailored solutions for your unique security needs",
      features: [
        "Customizable user limits",
        "Tailored security rules and alerts",
        "Custom retention policies",
        "Dedicated support team",
        "On-premise deployment options",
        "Custom SLA",
        "White-labeled reporting",
        "Custom integrations",
      ],
      missingFeatures: [],
      priceMonthly: "Custom",
      priceAnnually: "Custom",
      popular: false,
      isCustom: true,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                <div className="h-3 w-3 rounded-full bg-primary-foreground" />
              </div>
              <span className="font-bold">Cyber Insight Central</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link to="/#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </Link>
            <Link to="/pricing" className="text-sm font-medium text-foreground">
              Pricing
            </Link>
            <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Log in
            </Link>
            <Button asChild variant="default" size="sm">
              <Link to="/login">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32">
          <div className="container">
            <div className="text-center space-y-4 mb-12">
              <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
                Pricing
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">Transparent pricing for every organization</h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground text-lg md:text-xl">
                Choose the perfect plan to help secure your digital infrastructure with our comprehensive platform.
              </p>
              
              {/* Billing toggle */}
              <div className="flex items-center justify-center space-x-4 mt-8">
                <div className="flex items-center space-x-2 rounded-full border border-border/60 p-1 bg-background/80 shadow-sm">
                  <Button 
                    variant={billingInterval === "monthly" ? "default" : "ghost"}
                    size="sm"
                    className={`rounded-full px-5 ${billingInterval === "monthly" ? "" : "text-muted-foreground"}`}
                    onClick={() => setBillingInterval("monthly")}
                  >
                    Monthly
                  </Button>
                  <Button 
                    variant={billingInterval === "annually" ? "default" : "ghost"}
                    size="sm"
                    className={`rounded-full px-5 ${billingInterval === "annually" ? "" : "text-muted-foreground"}`}
                    onClick={() => setBillingInterval("annually")}
                  >
                    Annually
                    <Badge variant="outline" className="ml-2 -mr-1 bg-primary/10 text-primary border-0 px-2 text-xs font-normal">
                      Save 20%
                    </Badge>
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Pricing cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {tiers.map((tier) => (
                <div key={tier.id} className="relative animate-appear opacity-0" style={{ animationDelay: `${tiers.indexOf(tier) * 100}ms` }}>
                  <Card className={`h-full flex flex-col overflow-hidden transition-all ${tier.popular ? "border-primary shadow-lg shadow-primary/20" : ""}`}>
                    {tier.popular && (
                      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 rotate-12">
                        <Badge className="bg-primary text-primary-foreground px-3 py-1">Popular</Badge>
                      </div>
                    )}
                    
                    <CardHeader className="flex flex-col space-y-1.5">
                      <CardTitle>{tier.name}</CardTitle>
                      <CardDescription>{tier.description}</CardDescription>
                      <div className="mt-4 pt-4 border-t">
                        <div className="text-3xl font-bold">
                          {billingInterval === "monthly" ? tier.priceMonthly : tier.priceAnnually}
                          {!tier.isCustom && <span className="text-base font-normal text-muted-foreground ml-1">/{billingInterval === "monthly" ? "month" : "month, billed annually"}</span>}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="flex-1">
                      <ul className="space-y-2">
                        {tier.features.map((feature) => (
                          <li key={feature} className="flex items-start">
                            <Check className="h-4 w-4 text-primary mr-2 mt-1 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                        
                        {tier.missingFeatures && tier.missingFeatures.map((feature) => (
                          <li key={feature} className="flex items-start opacity-60">
                            <X className="h-4 w-4 text-muted-foreground mr-2 mt-1 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    
                    <CardFooter>
                      {tier.isCustom ? (
                        <Button variant="outline" className="w-full" asChild>
                          <Link to="/contact">
                            Contact Sales
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      ) : (
                        <Button 
                          variant={tier.popular ? "default" : "outline"}
                          className="w-full" 
                          asChild
                        >
                          <Link to="/login">
                            Get Started
                          </Link>
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Features comparison table */}
        <section className="py-24 bg-muted/30">
          <div className="container">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-2xl md:text-3xl font-bold">Compare plan features</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground">
                A detailed overview of what each plan includes to help you make the right choice.
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full">
                <div className="border rounded-lg overflow-hidden bg-background">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr className="bg-muted/50">
                        <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-foreground">Feature</th>
                        <th scope="col" className="px-6 py-4 text-center text-sm font-medium text-foreground">Starter</th>
                        <th scope="col" className="px-6 py-4 text-center text-sm font-medium text-foreground">Professional</th>
                        <th scope="col" className="px-6 py-4 text-center text-sm font-medium text-foreground">Enterprise</th>
                        <th scope="col" className="px-6 py-4 text-center text-sm font-medium text-foreground">Custom</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center">
                          Users
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="ml-1 h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="w-56">Number of user accounts that can access the platform</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">Up to 5</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">Up to 20</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">Unlimited</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">Custom</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center">
                          Data Retention
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="ml-1 h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="w-56">How long we store your security data</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">7 days</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">30 days</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">90 days</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">Custom</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">Security Alerts</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">Basic</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">Advanced</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">Advanced+</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">Custom</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">Notifications</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">Email</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">Multi-channel</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">Multi-channel with escalation</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">Custom</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">API Access</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          <X className="h-5 w-5 text-muted-foreground mx-auto" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">Basic</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">Full</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">Custom</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">Support Response</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">24 hours</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">8 hours</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">2 hours</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">Custom SLA</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">Custom Integrations</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          <X className="h-5 w-5 text-muted-foreground mx-auto" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          <X className="h-5 w-5 text-muted-foreground mx-auto" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          <Check className="h-5 w-5 text-primary mx-auto" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          <Check className="h-5 w-5 text-primary mx-auto" />
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">Dedicated Account Manager</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          <X className="h-5 w-5 text-muted-foreground mx-auto" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          <X className="h-5 w-5 text-muted-foreground mx-auto" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          <Check className="h-5 w-5 text-primary mx-auto" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          <Check className="h-5 w-5 text-primary mx-auto" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ */}
        <section className="py-24">
          <div className="container">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-2xl md:text-3xl font-bold">Frequently asked questions</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground">
                Everything you need to know about our pricing and plans.
              </p>
            </div>
            
            <div className="mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Can I change my plan later?</h3>
                <p className="text-muted-foreground text-sm">
                  Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Is there a free trial?</h3>
                <p className="text-muted-foreground text-sm">
                  Yes, we offer a 14-day free trial on all plans. No credit card required to start.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Do you offer discounts for non-profits?</h3>
                <p className="text-muted-foreground text-sm">
                  Yes, we offer special pricing for non-profit organizations. Please contact our sales team for details.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">What payment methods do you accept?</h3>
                <p className="text-muted-foreground text-sm">
                  We accept all major credit cards, PayPal, and wire transfers for annual plans.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Do you offer refunds?</h3>
                <p className="text-muted-foreground text-sm">
                  We offer a 30-day money-back guarantee on all plans. If you're not satisfied, contact support for a full refund.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Can I customize my plan?</h3>
                <p className="text-muted-foreground text-sm">
                  Absolutely! Our Custom plan allows for full customization to meet your specific security needs.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-24 bg-muted/30">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to get started?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Sign up in minutes and start protecting your digital assets today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="rounded-full px-8" asChild>
                  <Link to="/login">
                    Start Free Trial
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-8" asChild>
                  <Link to="/contact">
                    Contact Sales
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/30">
        <div className="container py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                  <div className="h-3 w-3 rounded-full bg-primary-foreground" />
                </div>
                <span className="font-bold">Cyber Insight Central</span>
              </Link>
              <p className="mt-4 text-sm text-muted-foreground max-w-xs">
                Your comprehensive platform for proactive cybersecurity monitoring and incident response.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2">
                <li><Link to="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</Link></li>
                <li><Link to="/#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</Link></li>
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
          </div>
        </div>
      </footer>
    </div>
  )
}