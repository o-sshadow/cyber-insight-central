import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const mockupFrameVariants = cva("relative overflow-hidden rounded-xl border bg-background", {
  variants: {
    size: {
      small: "p-2",
      default: "p-3",
      large: "p-4",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

interface MockupFrameProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof mockupFrameVariants> {}

const MockupFrame = React.forwardRef<HTMLDivElement, MockupFrameProps>(
  ({ className, size, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(mockupFrameVariants({ size }), className)}
      {...props}
    >
      <div className="mb-2 flex items-center">
        <div className="flex gap-1">
          <div className="size-2 rounded-full bg-red-500" />
          <div className="size-2 rounded-full bg-yellow-500" />
          <div className="size-2 rounded-full bg-green-500" />
        </div>
        <div className="ml-auto rounded-md bg-muted px-2 text-[0.6rem]">
          app.cybersightcentral.com
        </div>
      </div>
      {children}
    </div>
  )
)
MockupFrame.displayName = "MockupFrame"

const mockupVariants = cva("overflow-hidden", {
  variants: {
    type: {
      browser: "rounded-md border",
      responsive: "",
      window: "rounded-md border",
      terminal: "rounded-md border bg-black p-4 font-mono text-white",
      code: "rounded-md border bg-muted p-4 font-mono",
    },
  },
  defaultVariants: {
    type: "browser",
  },
})

interface MockupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof mockupVariants> {}

const Mockup = React.forwardRef<HTMLDivElement, MockupProps>(
  ({ className, type, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(mockupVariants({ type }), className)}
      {...props}
    >
      {children}
    </div>
  )
)
Mockup.displayName = "Mockup"

export { Mockup, MockupFrame }