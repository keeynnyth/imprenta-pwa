
interface PaginationProps {
  page: number;
  total: number;
  pageSize: number;
  onPrevious: () => void;
  onNext: () => void;
}

export default function Pagination({
  page,
  total,
  pageSize,
  onPrevious,
  onNext,
}: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);

  const desde =
    total === 0 ? 0 : (page - 1) * pageSize + 1;

  const hasta = Math.min(
    page * pageSize,
    total
  );

  return (
    <div className="mt-4 flex items-center justify-between border-t pt-4">

      <span className="text-sm text-slate-600">
        Mostrando {desde}-{hasta} de {total.toLocaleString("es-AR")} registros
      </span>

      <div className="flex items-center gap-4">

        <button
          onClick={onPrevious}
          disabled={page === 1}
          className="rounded border px-3 py-1 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ◀ Anterior
        </button>

        <span className="font-medium">
          Página {page} de {totalPages || 1}
        </span>

        <button
          onClick={onNext}
          disabled={page >= totalPages}
          className="rounded border px-3 py-1 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Siguiente ▶
        </button>

      </div>

    </div>
  );
}