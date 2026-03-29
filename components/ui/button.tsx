import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", children, loading, disabled, ...props }, ref) => {
    const baseStyles =
      "font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 relative overflow-hidden";

    const variants = {
      primary:
        "bg-gradient-to-r from-amber-500 to-amber-600 text-dark-900 hover:from-amber-400 hover:to-amber-500 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-dark-900",
      secondary:
        "bg-[var(--bg-secondary)] text-white hover:bg-dark-500 border border-white/10 hover:border-white/20 focus:ring-2 focus:ring-dark-400 focus:ring-offset-2 focus:ring-offset-dark-900",
      outline:
        "border-2 border-amber-500/50 text-amber-400 hover:bg-amber-500/10 hover:border-amber-400 focus:ring-2 focus:ring-amber-400",
      ghost:
        "text-slate-300 hover:text-white hover:bg-white/5 focus:ring-1 focus:ring-white/20",
      danger:
        "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 hover:border-red-500/50 focus:ring-2 focus:ring-red-400",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm rounded-lg",
      md: "px-4 py-2.5 rounded-xl text-base",
      lg: "px-6 py-3 rounded-xl text-lg",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";