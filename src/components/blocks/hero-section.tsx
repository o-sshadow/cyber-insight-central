import React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import { Mockup, MockupFrame } from "@/components/ui/mockup"
import { Glow } from "@/components/ui/glow"
import { Link } from "react-router-dom"

interface HeroAction {
  text: string;
  href: string;
  icon?: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "glow";
}

interface HeroBadge {
  text: string;
  action?: {
    text: string;
    href: string;
  };
}

interface HeroImage {
  light: string;
  dark: string;
  alt: string;
}

interface HeroSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  badge?: HeroBadge;
  title: string;
  description: string;
  actions?: HeroAction[];
  image?: HeroImage;
}

export function HeroSection({
  className,
  badge,
  title,
  description,
  actions,
  image,
  ...props
}: HeroSectionProps) {
  // For a real app, you'd use a useEffect to check system or user preference
  const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const imageSrc = image ? (isDarkMode ? image.dark : image.light) : null;

  return (
    <section
      className={cn(
        "relative bg-background text-foreground",
        "py-16 px-4 overflow-hidden md:py-24 lg:py-32",
        className
      )}
      {...props}
    >
      {/* Background gradient effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 opacity-20 blur-3xl">
          <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#9089fc] to-[#ff80b5]" />
        </div>
        <div className="absolute top-1/2 right-1/4 opacity-20 blur-3xl">
          <div className="aspect-square w-[30rem] rounded-full bg-gradient-to-br from-primary to-purple-600" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center gap-8">
          {/* Badge */}
          {badge && (
            <div className="w-full max-w-md mx-auto mb-6 mt-2">
              <Badge 
                variant="secondary" 
                className="w-full justify-center py-2 px-4 text-base rounded-full animate-fadeIn backdrop-blur-sm bg-background/80 border border-border/50 shadow-lg hover:shadow-xl transition-shadow"
              >
                <span className="mr-2">{badge.text}</span>
                {badge.action && (
                  <Link to={badge.action.href} className="flex items-center text-primary font-medium transition-colors hover:text-primary/80">
                    {badge.action.text}
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                )}
              </Badge>
            </div>
          )}

          {/* Title with gradient */}
          <h1 className="text-4xl font-bold tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 md:text-5xl lg:text-6xl max-w-4xl mx-auto">
            {title}
          </h1>

          {/* Description */}
          <p className="text-lg text-center text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>

          {/* Actions */}
          {actions && actions.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {actions.map((action, index) => (
                <Button 
                  key={index} 
                  variant={action.variant === "glow" ? "default" : action.variant || "default"} 
                  size="lg" 
                  className={cn(
                    "rounded-full transition-all",
                    action.variant === "glow" && "shadow-[0_0_15px_rgba(var(--primary),0.5)]"
                  )}
                  asChild
                >
                  <Link to={action.href} className="flex items-center gap-2">
                    {action.text}
                    {action.icon || <ArrowRight className="h-4 w-4" />}
                  </Link>
                </Button>
              ))}
            </div>
          )}

          {/* Image with mockup frame */}
          {image && imageSrc && (
            <div className="relative w-full max-w-5xl mt-12">
              <MockupFrame className="w-full shadow-2xl">
                <Mockup type="responsive">
                  <img
                    src={imageSrc}
                    alt={image.alt}
                    className="w-full h-auto"
                  />
                </Mockup>
              </MockupFrame>
              <Glow variant="center" className="opacity-80" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}