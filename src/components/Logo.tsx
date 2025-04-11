
import { ShieldCheck } from "lucide-react";

export function Logo({ size = "default" }: { size?: "small" | "default" | "large" }) {
  const sizeClasses = {
    small: "text-xl",
    default: "text-2xl",
    large: "text-3xl",
  };

  return (
    <div className="flex items-center gap-2">
      <ShieldCheck className="h-6 w-6 text-cyber-accent" />
      <span className={`font-bold ${sizeClasses[size]}`}>CyberInsight</span>
    </div>
  );
}
