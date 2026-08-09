

import { NavLink } from "react-router-dom";
import type { IconType } from "react-icons";

interface MenuItemProps {
  to: string;
  icon: IconType;
  children: React.ReactNode;
  end?: boolean;
}

export default function MenuItem({
  to,
  icon: Icon,
  children,
  end = false,
}: MenuItemProps) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `
        flex items-center gap-3
        rounded-lg
        px-3 py-2.5
        transition-all duration-200

        ${
          isActive
            ? "bg-orange-600 text-white font-semibold shadow-md"
            : "text-white hover:bg-orange-500"
        }
      `
      }
    >
      <Icon size={18} />

      <span>{children}</span>
    </NavLink>
  );
}