import React from "react"
import { cn } from "@/lib/utils"

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Header({ className, children, ...props }: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
      {...props}
    >
      <div className="container flex h-16 items-center">
        {children}
      </div>
    </header>
  )
}