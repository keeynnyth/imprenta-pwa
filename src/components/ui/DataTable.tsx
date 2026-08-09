import type { ReactNode } from "react";

interface DataTableProps {
  title: string;
  subtitle?: ReactNode;
  action?: ReactNode;
  search?: ReactNode;
  info?: ReactNode;
  children: ReactNode;
  mobileContent?: ReactNode;
  pagination?: ReactNode;
}

export default function DataTable({
  title,
  subtitle,
  action,
  search,
  info,
  children,
  mobileContent,
  pagination,
}: DataTableProps) {
  return (
    <div className="space-y-4">

      {/* Encabezado */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-1 text-sm text-slate-500">
              {subtitle}
            </p>
          )}
        </div>

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