import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`glass rounded-2xl ${className}`}>{children}</div>
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