import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PageHeader from "../../components/ui/PageHeader";

import {
  obtenerMovimientos,
  eliminarMovimiento,
  obtenerTotalesMovimientos,
  type Movimiento,
} from "../../services/movimientos.service";

import Pagination from "../../components/ui/Pagination";
import DataTable from "../../components/ui/DataTable";

function FinanceMovementsPage() {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalIngresos, setTotalIngresos] = useState(0);
  const [totalEgresos, setTotalEgresos] = useState(0);

  const PAGE_SIZE = 30;

  const [filtro, setFiltro] = useState<
    "Todos" | "Ingreso" | "Egreso"
  >("Todos");

  const navigate = useNavigate();

  useEffect(() => {
    cargarMovimientos();
  }, [filtro, page]);

  async function cargarMovimientos() {
    try {
      setLoading(true);

      const resultado =
        filtro === "Todos"
          ? await obtenerMovimientos(
              undefined,
              page,
              PAGE_SIZE
            )
          : await obtenerMovimientos(
              filtro,
              page,
              PAGE_SIZE
            );

      setMovimientos(resultado.data);
      setTotal(resultado.total);

      const totales =
        await obtenerTotalesMovimientos();

      setTotalIngresos(totales.ingresos);
      setTotalEgresos(totales.egresos);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleEliminar(id: string) {
    const confirmar = window.confirm(
      "¿Está seguro de eliminar este movimiento?"
    );

    if (!confirmar) return;

    try {
      await eliminarMovimiento(id);
      await cargarMovimientos();
    } catch (error) {
      console.error(error);
      alert("No se pudo eliminar.");
    }
  }

  function formatearFecha(fecha: string) {
    return new Date(fecha).toLocaleDateString(
      "es-AR",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );
  }

  function formatearMonto(
    monto: number,
    moneda: string
  ) {
    return (
      new Intl.NumberFormat("es-AR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(monto) + ` ${moneda}`
    );
  }

  function formatearTasa(tasa: number) {
    return tasa.toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  const inicio =
    total === 0
      ? 0
      : (page - 1) * PAGE_SIZE + 1;

  const fin = Math.min(
    page * PAGE_SIZE,
    total
  );

  /*
   * ============================
   * VISTA MÓVIL
   * ============================
   */

  const contenidoMobile = loading ? (
    <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
      Cargando movimientos...
    </div>
  ) : movimientos.length === 0 ? (
    <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
      No hay movimientos registrados.
    </div>
  ) : (
    movimientos.map((movimiento) => (
      <div
        key={movimiento.id}
        className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        {/* Encabezado */}

        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Fecha
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-800">
              {formatearFecha(movimiento.fecha)}
            </p>
          </div>

          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
              movimiento.tipo === "Ingreso"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {movimiento.tipo}
          </span>
        </div>

        {/* Categoría */}

        <div className="mt-4 rounded-lg bg-slate-50 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Categoría
          </p>

          <p className="mt-1 break-words text-sm font-semibold text-slate-800">
            {movimiento.categoria}
          </p>
        </div>

        {/* Concepto */}

        <div className="mt-3 rounded-lg bg-slate-50 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Concepto
          </p>

          <p className="mt-1 break-words text-sm text-slate-800">
            {movimiento.concepto}
          </p>
        </div>

        {/* Monto original + tasa */}

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-blue-50 p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-blue-700">
              Monto original
            </p>

            <p className="mt-1 break-words text-sm font-bold text-blue-700">
              {formatearMonto(
                movimiento.monto_original,
                movimiento.moneda
              )}
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Tasa
            </p>

            <p className="mt-1 break-words text-sm font-bold text-slate-800">
              {formatearTasa(movimiento.tasa)}
            </p>
          </div>
        </div>

        {/* Bs + USD */}

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-green-50 p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-green-700">
              Monto Bs
            </p>

            <p className="mt-1 break-words text-sm font-bold text-green-700">
              {formatearMonto(
                movimiento.monto_bs,
                "Bs"
              )}
            </p>
          </div>

          <div className="rounded-lg bg-blue-50 p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-blue-700">
              Monto USD
            </p>

            <p className="mt-1 break-words text-sm font-bold text-blue-700">
              {formatearMonto(
                movimiento.monto_usd,
                "USD"
              )}
            </p>
          </div>
        </div>

        {/* Método de pago */}

        <div className="mt-3 rounded-lg bg-slate-50 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Método de pago
          </p>

          <p className="mt-1 break-words text-sm font-semibold text-slate-800">
            {movimiento.metodo_pago}
          </p>
        </div>

        {/* Acciones */}

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() =>
              navigate(
                movimiento.tipo === "Ingreso"
                  ? `/ingresos/${movimiento.id}`
                  : `/egresos/${movimiento.id}`
              )
            }
            className="rounded-lg bg-amber-500 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600"
          >
            Editar
          </button>

          <button
            type="button"
            onClick={() =>
              handleEliminar(movimiento.id!)
            }
            className="rounded-lg bg-red-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </div>
    ))
  );

  /*
   * ============================
   * VISTA DESKTOP
   * ============================
   */

  const contenidoDesktop = (
    <table className="min-w-[1100px] w-full">
      <thead className="border-b border-slate-200 bg-slate-50">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-600">
            Fecha
          </th>

          <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-slate-600">
            Tipo
          </th>

          <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-600">
            Categoría
          </th>

          <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-600">
            Concepto
          </th>

          <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-slate-600">
            Monto original
          </th>

          <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-slate-600">
            Tasa
          </th>

          <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-slate-600">
            Bs
          </th>

          <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-slate-600">
            USD
          </th>

          <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-slate-600">
            Método de pago
          </th>

          <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-slate-600">
            Acciones
          </th>
        </tr>
      </thead>

      <tbody>
        {movimientos.length === 0 ? (
          <tr>
            <td
              colSpan={10}
              className="p-8 text-center text-slate-500"
            >
              No hay movimientos registrados.
            </td>
          </tr>
        ) : (
          movimientos.map((movimiento) => (
            <tr
              key={movimiento.id}
              className="border-t border-slate-100 transition-colors hover:bg-orange-50/40"
            >
              <td className="whitespace-nowrap px-4 py-3">
                {formatearFecha(
                  movimiento.fecha
                )}
              </td>

              <td className="px-4 py-3 text-center">
                <span
                  className={`inline-flex rounded-md px-3 py-1 text-xs font-semibold ${
                    movimiento.tipo === "Ingreso"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {movimiento.tipo}
                </span>
              </td>

              <td className="px-4 py-3">
                {movimiento.categoria}
              </td>

              <td className="px-4 py-3">
                {movimiento.concepto}
              </td>

              <td className="whitespace-nowrap px-4 py-3 text-right">
                {formatearMonto(
                  movimiento.monto_original,
                  movimiento.moneda
                )}
              </td>

              <td className="whitespace-nowrap px-4 py-3 text-right">
                {formatearTasa(
                  movimiento.tasa
                )}
              </td>

              <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-green-700">
                {formatearMonto(
                  movimiento.monto_bs,
                  "Bs"
                )}
              </td>

              <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-blue-700">
                {formatearMonto(
                  movimiento.monto_usd,
                  "USD"
                )}
              </td>

              <td className="px-4 py-3 text-center">
                {movimiento.metodo_pago}
              </td>

              <td className="px-4 py-3">
                <div className="flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        movimiento.tipo ===
                          "Ingreso"
                          ? `/ingresos/${movimiento.id}`
                          : `/egresos/${movimiento.id}`
                      )
                    }
                    className="rounded-md bg-amber-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-amber-600"
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleEliminar(
                        movimiento.id!
                      )
                    }
                    className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>

      <tfoot className="border-t border-slate-200 bg-slate-50">
        <tr>
          <td
            colSpan={10}
            className="px-4 py-3 text-sm text-slate-600"
          >
            Total de movimientos en esta página:{" "}
            <strong>
              {movimientos.length}
            </strong>
          </td>
        </tr>
      </tfoot>
    </table>
  );

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 px-4 sm:px-6 lg:px-8">

      <PageHeader
        title="Movimientos"
        subtitle="Consulta todos los ingresos y egresos."
        buttonText="+ Nuevo Movimiento"
        buttonLink="/movimientos/nuevo"
      />

      {/* Filtros */}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setFiltro("Todos");
            setPage(1);
          }}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${
            filtro === "Todos"
              ? "bg-orange-600 text-white shadow-sm"
              : "border border-slate-300 bg-white text-slate-700 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700"
          }`}
        >
          Todos ({total})
        </button>

        <button
          type="button"
          onClick={() => {
            setFiltro("Ingreso");
            setPage(1);
          }}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${
            filtro === "Ingreso"
              ? "bg-green-600 text-white shadow-sm"
              : "border border-slate-300 bg-white text-slate-700 hover:border-green-300 hover:bg-green-50 hover:text-green-700"
          }`}
        >
          Ingresos ({totalIngresos})
        </button>

        <button
          type="button"
          onClick={() => {
            setFiltro("Egreso");
            setPage(1);
          }}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${
            filtro === "Egreso"
              ? "bg-red-600 text-white shadow-sm"
              : "border border-slate-300 bg-white text-slate-700 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
          }`}
        >
          Egresos ({totalEgresos})
        </button>
      </div>

      {/* Contador */}

      <div className="text-sm font-medium text-slate-500">
        Mostrando {inicio}-{fin} de {total} movimientos
      </div>

      {/* Contenido */}

      <DataTable
        title=""
        action={null}
        info={null}
        mobileContent={contenidoMobile}
        pagination={
          <Pagination
            page={page}
            total={total}
            pageSize={PAGE_SIZE}
            onPrevious={() =>
              setPage((p) =>
                Math.max(1, p - 1)
              )
            }
            onNext={() =>
              setPage((p) => p + 1)
            }
          />
        }
      >
        {contenidoDesktop}
      </DataTable>

    </div>
  );
}

export default FinanceMovementsPage;