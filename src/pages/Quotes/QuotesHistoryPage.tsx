import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  obtenerCotizaciones,
  type Cotizacion,
} from "../../services/quotes.service";

import Pagination from "../../components/ui/Pagination";
import SearchInput from "../../components/ui/SearchInput";
import DataTable from "../../components/ui/DataTable";
import PrimaryButton from "../../components/ui/PrimaryButton";

function QuotesHistoryPage() {
  const navigate = useNavigate();

  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const PAGE_SIZE = 30;

  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarCotizaciones();
  }, [page]);

  async function cargarCotizaciones() {
    try {
      setCargando(true);

      const resultado = await obtenerCotizaciones(
        page,
        PAGE_SIZE
      );

      setCotizaciones(resultado.data);
      setTotal(resultado.total);
    } catch (error) {
      console.error(error);
      alert("No fue posible cargar las cotizaciones.");
    } finally {
      setCargando(false);
    }
  }

  const cotizacionesFiltradas = cotizaciones.filter(
    (cotizacion) => {
      const texto = busqueda.toLowerCase().trim();

      return (
        cotizacion.numero
          .toLowerCase()
          .includes(texto) ||
        (cotizacion.cliente ?? "")
          .toLowerCase()
          .includes(texto)
      );
    }
  );

  const inicio =
    total === 0
      ? 0
      : (page - 1) * PAGE_SIZE + 1;

  const fin = Math.min(
    page * PAGE_SIZE,
    total
  );

  return (
    <DataTable
      title="Historial de Cotizaciones"
      action={
        <PrimaryButton
          onClick={() =>
            navigate("/cotizaciones/nueva")
          }
        >
          + Nueva Cotización
        </PrimaryButton>
      }
      search={
        <SearchInput
          value={busqueda}
          onChange={setBusqueda}
          placeholder="Buscar por número o cliente..."
        />
      }
      info={
        <div className="text-sm font-medium text-slate-500">
          Mostrando {inicio}-{fin} de {total} cotizaciones
        </div>
      }
      pagination={
        <Pagination
          page={page}
          total={total}
          pageSize={PAGE_SIZE}
          onPrevious={() =>
            setPage((p) => Math.max(1, p - 1))
          }
          onNext={() =>
            setPage((p) => p + 1)
          }
        />
      }
      mobileContent={
        <>
          {cargando ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
              Cargando cotizaciones...
            </div>
          ) : cotizacionesFiltradas.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
              No existen cotizaciones.
            </div>
          ) : (
            cotizacionesFiltradas.map(
              (cotizacion) => (
                <div
                  key={cotizacion.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >

                  {/* Encabezado */}
                  <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">

                    <div className="min-w-0">

                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Cotización
                      </p>

                      <p className="mt-1 break-words text-lg font-bold text-slate-800">
                        {cotizacion.numero}
                      </p>

                    </div>

                    <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      {cotizacion.estado}
                    </span>

                  </div>

                  {/* Cliente */}
                  <div className="mt-4">

                    <p className="text-xs font-medium text-slate-500">
                      Cliente
                    </p>

                    <p className="mt-1 break-words font-semibold text-slate-800">
                      {cotizacion.cliente || "-"}
                    </p>

                  </div>

                  {/* Fecha */}
                  <div className="mt-3">

                    <p className="text-xs font-medium text-slate-500">
                      Fecha
                    </p>

                    <p className="mt-1 text-sm text-slate-700">
                      {new Date(
                        cotizacion.created_at
                      ).toLocaleDateString()}
                    </p>

                  </div>

                  {/* Totales */}
                  <div className="mt-4 grid grid-cols-2 gap-3">

                    <div className="rounded-lg bg-slate-50 p-3">

                      <p className="text-xs font-medium text-slate-500">
                        Total USD
                      </p>

                      <p className="mt-1 font-semibold text-slate-800">
                        USD{" "}
                        {Number(
                          cotizacion.total_usd
                        ).toFixed(2)}
                      </p>

                    </div>

                    <div className="rounded-lg bg-green-50 p-3">

                      <p className="text-xs font-medium text-slate-500">
                        Total Bs
                      </p>

                      <p className="mt-1 font-semibold text-green-700">
                        Bs{" "}
                        {Number(
                          cotizacion.total_bs
                        ).toLocaleString(
                          "es-VE",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                      </p>

                    </div>

                  </div>

                  {/* Acción */}
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/cotizaciones/${cotizacion.id}`
                      )
                    }
                    className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Ver cotización
                  </button>

                </div>
              )
            )
          )}
        </>
      }
    >
      {/* ========================= */}
      {/* TABLA DESKTOP */}
      {/* ========================= */}

      <table className="min-w-[900px] w-full">

        <thead className="border-b border-slate-200 bg-slate-50">

          <tr>

            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-600">
              Número
            </th>

            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-600">
              Cliente
            </th>

            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-600">
              Fecha
            </th>

            <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-slate-600">
              USD
            </th>

            <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-slate-600">
              Bs
            </th>

            <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-slate-600">
              Estado
            </th>

            <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-slate-600">
              Acciones
            </th>

          </tr>

        </thead>

        <tbody>

          {cargando ? (

            <tr>
              <td
                colSpan={7}
                className="p-8 text-center text-slate-500"
              >
                Cargando cotizaciones...
              </td>
            </tr>

          ) : cotizacionesFiltradas.length === 0 ? (

            <tr>
              <td
                colSpan={7}
                className="p-8 text-center text-slate-500"
              >
                No existen cotizaciones.
              </td>
            </tr>

          ) : (

            cotizacionesFiltradas.map(
              (cotizacion) => (

                <tr
                  key={cotizacion.id}
                  className="border-t border-slate-100 transition-colors hover:bg-orange-50/40"
                >

                  <td className="px-4 py-3 font-semibold text-slate-800">
                    {cotizacion.numero}
                  </td>

                  <td className="px-4 py-3">
                    {cotizacion.cliente || "-"}
                  </td>

                  <td className="px-4 py-3">
                    {new Date(
                      cotizacion.created_at
                    ).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3 text-right font-medium">
                    {Number(
                      cotizacion.total_usd
                    ).toFixed(2)}
                  </td>

                  <td className="px-4 py-3 text-right font-medium text-green-700">
                    {Number(
                      cotizacion.total_bs
                    ).toLocaleString(
                      "es-VE",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </td>

                  <td className="px-4 py-3 text-center">

                    <span className="inline-flex rounded-md bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                      {cotizacion.estado}
                    </span>

                  </td>

                  <td className="px-4 py-3 text-center">

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/cotizaciones/${cotizacion.id}`
                        )
                      }
                      className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                      Ver
                    </button>

                  </td>

                </tr>

              )
            )

          )}

        </tbody>

      </table>

    </DataTable>
  );
}

export default QuotesHistoryPage;