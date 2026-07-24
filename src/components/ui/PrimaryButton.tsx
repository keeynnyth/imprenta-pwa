
import { Link } from "react-router-dom";
import { ReactNode } from "react";

interface PrimaryButtonProps {
  children: ReactNode;
  to?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}

function PrimaryButton({
  children,
  to,
  onClick,
  type = "button",
  disabled = false,
}: PrimaryButtonProps) {
  const className =
    "inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400";

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