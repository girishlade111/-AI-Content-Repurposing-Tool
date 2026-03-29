import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = "", hover = false }: CardProps) {
  return (
    <div className={`glass rounded-2xl ${hover ? "hover-lift cursor-pointer" : ""} ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }: CardProps) {
  return (
    <div className={`px-6 py-5 border-b border-white/5 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }: CardProps) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = "" }: CardProps) {
  return (
    <div className={`px-6 py-4 border-t border-white/5 bg-white/[0.02] ${className}`}>
      {children}
    </div>
  );
}