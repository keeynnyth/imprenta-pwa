
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`
        rounded-xl
        bg-white
        p-6
        shadow-sm
        border
        border-slate-200
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export default Card;