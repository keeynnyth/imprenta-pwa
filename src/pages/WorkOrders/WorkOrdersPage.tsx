import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import type { OrdenTrabajo } from "../../interfaces/orden-trabajo.interface";

import { obtenerOrdenesTrabajo } from "../../services/ordenes-trabajo.service";

import Pagination from "../../components/ui/Pagination";
import DataTable from "../../components/ui/DataTable";
import PrimaryButton from "../../components/ui/PrimaryButton";

export default function WorkOrdersPage() {
  const [ordenes, setOrdenes] = useState<OrdenTrabajo[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const PAGE_SIZE = 30;

  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarOrdenes();
  }, [page]);

  async function cargarOrdenes() {
    try {
      setCargando(true);

      const resultado = await obtenerOrdenesTrabajo(
        page,
        PAGE_SIZE
      );

      setOrdenes(resultado.data);
      setTotal(resultado.total);
    } catch (error) {
      console.error(error);
      alert("No fue posible cargar las órdenes.");
    } finally {
      setCargando(false);
    }
  }

  const inicio =
    total === 0
      ? 0
      : (page - 1) * PAGE_SIZE + 1;

  const fin = Math.min(
    page * PAGE_SIZE,
    total
  );

  const contenidoDesktop = (
    <table className="min-w-full">
      <thead className="border-b border-slate-200 bg-slate-50">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-600">
            Número
          </th>

          <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-600">
            Estado
          </th>

          <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-600">
            Entrega
          </th>

          <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-slate-600">
            Total Bs
          </th>

          <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-slate-600">
            Acción
          </th>
        </tr>
      </thead>

      <tbody>
        {cargando ? (
          <tr>
            <td
              colSpan={5}
              className="p-8 text-center text-slate-500"
            >
              Cargando órdenes...
            </td>
          </tr>
        ) : ordenes.length === 0 ? (
          <tr>
            <td
              colSpan={5}
              className="p-8 text-center text-slate-500"
            >
              No existen órdenes de trabajo.
            </td>
          </tr>
        ) : (
          ordenes.map((orden) => (
            <tr
              key={orden.id}
              className="border-t border-slate-100 transition-colors hover:bg-orange-50/40"
            >
              <td className="px-4 py-3 font-semibold text-slate-800">
                {orden.numero}
              </td>

              <td className="px-4 py-3">
                <span className="inline-flex rounded-md bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700">
                  {orden.estado}
                </span>
              </td>

              <td className="px-4 py-3">
                {orden.fecha_entrega}
              </td>

              <td className="px-4 py-3 text-right font-medium text-green-700">
                Bs{" "}
                {Number(orden.total).toLocaleString(
                  "es-VE",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </td>

              <td className="px-4 py-3 text-center">
                <Link
                  to={`/ordenes-trabajo/${orden.id}`}
                  className="inline-flex rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  Ver
                </Link>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );

  const contenidoMobile = cargando ? (
    <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
      Cargando órdenes...
    </div>
  ) : ordenes.length === 0 ? (
    <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
      No existen órdenes de trabajo.
    </div>
  ) : (
    ordenes.map((orden) => (
      <div
        key={orden.id}
        className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Orden
            </p>

            <p className="mt-1 text-lg font-bold text-slate-800">
              #{orden.numero}
            </p>
          </div>

          <span className="shrink-0 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            {orden.estado}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs font-medium text-slate-500">
              Fecha de entrega
            </p>

            <p className="mt-1 break-words text-sm font-semibold text-slate-800">
              {orden.fecha_entrega}
            </p>
          </div>

          <div className="rounded-lg bg-green-50 p-3">
            <p className="text-xs font-medium text-green-700">
              Total Bs
            </p>

            <p className="mt-1 break-words text-sm font-bold text-green-700">
              Bs{" "}
              {Number(orden.total).toLocaleString(
                "es-VE",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}
            </p>
          </div>
        </div>

        <Link
          to={`/ordenes-trabajo/${orden.id}`}
          className="mt-4 flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Ver orden
        </Link>
      </div>
    ))
  );

  return (
    <DataTable
      title="Órdenes de Trabajo"
      action={
        <PrimaryButton to="/cotizaciones">
          Ver Cotizaciones
        </PrimaryButton>
      }
      info={
        <>
          Mostrando {inicio}-{fin} de {total} órdenes
        </>
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
      mobileContent={contenidoMobile}
    >
      {contenidoDesktop}
    </DataTable>
  );
}