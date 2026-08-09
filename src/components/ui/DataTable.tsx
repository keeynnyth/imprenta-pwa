
import type { ReactNode } from "react";

interface DataTableProps {
  title: string;
  action?: ReactNode;
  search?: ReactNode;
  info?: ReactNode;
  children: ReactNode;
  mobileContent?: ReactNode;
  pagination?: ReactNode;
}

export default function DataTable({
  title,
  action,
  search,
  info,
  children,
  mobileContent,
  pagination,
}: DataTableProps) {
  return (
    <div className="w-full space-y-4">

      {/* Encabezado */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
          {title}
        </h1>

        {action}
      </div>

      {/* Buscador */}
      {search}

      {/* Información */}
      {info}

      {/* Tabla - escritorio */}
      <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
        <div className="overflow-x-auto">
          {children}
        </div>
      </div>

      {/* Vista móvil */}
      {mobileContent && (
        <div className="space-y-3 md:hidden">
          {mobileContent}
        </div>
      )}

      {/* Paginación */}
      {pagination}

    </div>
  );
}