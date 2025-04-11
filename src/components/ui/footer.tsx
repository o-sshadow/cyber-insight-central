import React from "react"
import { cn } from "@/lib/utils"

interface FooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Footer({ className, children, ...props }: FooterProps) {
  return (
    <footer
      className={cn("border-t bg-muted/40", className)}
      {...props}
    >
      <div className="container py-8 md:py-12">
        {children}
      </div>
    </footer>
  )
}