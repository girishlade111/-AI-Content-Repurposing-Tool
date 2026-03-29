import { ReactNode } from "react";

interface BadgeProps {
  variant?: "default" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md";
  children: ReactNode;
  className?: string;
}

export function Badge({ variant = "default", size = "md", children, className = "" }: BadgeProps) {
  const variants = {
    default: "bg-slate-500/20 text-slate-300",
    success: "bg-green-500/20 text-green-400",
    warning: "bg-yellow-500/20 text-yellow-400",
    error: "bg-red-500/20 text-red-400",
    info: "bg-amber-500/20 text-amber-400",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
}

interface StatusBadgeProps {
  status: "pending" | "processing" | "completed" | "failed";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    pending: { variant: "default" as const, label: "Pending" },
    processing: { variant: "warning" as const, label: "Processing" },
    completed: { variant: "success" as const, label: "Completed" },
    failed: { variant: "error" as const, label: "Failed" },
  };

  const { variant, label } = config[status];

  return <Badge variant={variant}>{label}</Badge>;
}