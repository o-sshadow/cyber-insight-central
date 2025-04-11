import React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Link } from "react-router-dom"

interface HeroSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description: string
  primaryActionLabel: string
  primaryActionHref: string
  secondaryActionLabel?: string
  secondaryActionHref?: string
  imageUrl?: string
  imageAlt?: string
}

export function HeroSection({
  className,
  title,
  description,
  primaryActionLabel,
  primaryActionHref,
  secondaryActionLabel,
  secondaryActionHref,
  imageUrl,
  imageAlt,
  ...props
}: HeroSectionProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-background pb-16 pt-24 md:pb-20 lg:pb-32 xl:pb-48 lg:pt-32",
        className
      )}
      {...props}
    >
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                {title}
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                {description}
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link to={primaryActionHref}>{primaryActionLabel}</Link>
              </Button>
              {secondaryActionLabel && secondaryActionHref && (
                <Button asChild variant="outline" size="lg">
                  <Link to={secondaryActionHref}>{secondaryActionLabel}</Link>
                </Button>
              )}
            </div>
          </div>
          {imageUrl && (
            <div className="flex items-center justify-center">
              <img
                alt={imageAlt || "Hero Image"}
                className="aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                height="550"
                src={imageUrl}
                width="550"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}