import { InputHTMLAttributes, forwardRef, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, id, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={`w-full px-4 py-3 ${icon ? "pl-10" : ""} bg-[var(--bg-secondary)] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all hover:border-white/20 ${
              error ? "border-red-500" : ""
            } ${className}`}
            {...props}
          />
        </div>
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";