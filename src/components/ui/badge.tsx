import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80 shadow-sm",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        cyber: 
          "border-transparent bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:from-purple-700 hover:to-blue-600 shadow-[0_0_10px_rgba(139,92,246,0.5)]",
        glow:
          "border-transparent bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.5)] hover:shadow-[0_0_25px_rgba(var(--primary),0.65)]",
      },
      size: {
        default: "text-xs",
        sm: "text-[0.6rem] px-2 py-0.5",
        lg: "text-sm px-3 py-1.5",
      },
      interactive: {
        true: "cursor-pointer",
        false: "",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      interactive: false,
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

function Badge({ className, variant, size, interactive, icon, action, children, ...props }: BadgeProps) {
  return (
    <div 
      className={cn(badgeVariants({ variant, size, interactive }), className)} 
      {...props}
    >
      {icon && <span className="badge-icon">{icon}</span>}
      <span className="badge-content">{children}</span>
      {action && <span className="badge-action">{action}</span>}
    </div>
  )
}

export { Badge, badgeVariants }
