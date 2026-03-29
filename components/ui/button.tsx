import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles =
      "font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2";

    const variants = {
      primary:
        "bg-gradient-to-r from-amber-500 to-amber-600 text-dark-900 hover:from-amber-400 hover:to-amber-500 focus:ring-amber-400 shadow-lg shadow-amber-500/20",
      secondary:
        "bg-dark-600 text-white hover:bg-dark-500 focus:ring-dark-400 border border-white/10",
      outline:
        "border-2 border-amber-500 text-amber-400 hover:bg-amber-500/10 focus:ring-amber-400",
      ghost:
        "text-slate-300 hover:text-white hover:bg-white/5 focus:ring-white/20",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm rounded-lg",
      md: "px-4 py-2 rounded-xl text-base",
      lg: "px-6 py-3 rounded-xl text-lg",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";