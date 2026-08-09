
import { Link } from "react-router-dom";
import type { ReactNode } from "react";

interface PrimaryButtonProps {
  children: ReactNode;
  to?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;

  variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "success";
}

function PrimaryButton({
  children,
  to,
  onClick,
  type = "button",
  disabled = false,
  variant = "primary"
}: PrimaryButtonProps) {
  const variants = {
  primary:
    "bg-blue-600 hover:bg-blue-700 text-white",

  secondary:
    "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100",

  danger:
    "bg-red-600 hover:bg-red-700 text-white",

  success:
    "bg-green-600 hover:bg-green-700 text-white",
};

const className = `
inline-flex
items-center
justify-center
rounded-xl
px-5
py-2.5
font-medium
transition
disabled:cursor-not-allowed
disabled:bg-slate-400

${variants[variant]}
`;

  if (to) {
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </button>
  );
}

export default PrimaryButton;