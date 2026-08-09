import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  actualizarEstadoOrdenTrabajo,
  obtenerOrdenTrabajoPorId,
} from "../../services/ordenes-trabajo.service";

import { generarPdfOrdenTrabajo } from "../../components/workorders/WorkOrderPdf";

export default function WorkOrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [orden, setOrden] = useState<any>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (id) {
      cargarOrden(id);
    }
  }, [id]);

  async function cargarOrden(id: string) {
    try {
      setCargando(true);

      const data = await obtenerOrdenTrabajoPorId(id);

      console.log(data);
      setOrden(data);
    } catch (error) {
      console.error(error);
      alert("No fue posible cargar la Orden de Trabajo.");
    } finally {
      setCargando(false);
    }
  }

  async function cambiarEstado(nuevoEstado: string) {
    if (!id) return;

    try {
      await actualizarEstadoOrdenTrabajo(
        id,
        nuevoEstado
      );

      await cargarOrden(id);
    } catch (error) {
      console.error(error);
      alert("No fue posible actualizar el estado.");
    }
  }

  function descargarPdf() {
    generarPdfOrdenTrabajo({
      numero: `OT-${orden.numero}`,

      fecha: orden.fecha_creacion,

      fechaEntrega: orden.fecha_entrega,

      cliente: orden.cotizaciones.cliente,

      documento: orden.cotizaciones.documento,

      telefono:
        orden.cotizaciones.clientes?.telefono ?? "",

      correo:
        orden.cotizaciones.clientes?.correo ?? "",

      observaciones: orden.observaciones,

      totalBs: Number(orden.total),

      abono: Number(orden.abono),

      saldoPendiente:
        Number(orden.total) -
        Number(orden.abono),

      productos:
        orden.cotizaciones.detalle_cotizacion.map(
          (item: any) => ({
            nombre: item.productos.nombre,
            cantidad: item.cantidad,
            precioUsd: item.precio_usd,
            precioBs: item.precio_bs,
            subtotalUsd: item.subtotal_usd,
            subtotalBs: item.subtotal_bs,
          })
        ),
    });
  }

  if (cargando) {
    return (
      <div className="p-4 sm:p-6">
        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
          Cargando Orden de Trabajo...
        </h1>
      </div>
    );
  }

  if (!orden) {
    return (
      <div className="p-4 sm:p-6">
        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
          Orden de Trabajo no encontrada
        </h1>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-6 rounded-lg bg-slate-600 px-4 py-2 font-semibold text-white transition hover:bg-slate-700"
        >
          ← Volver
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">

      {/* ========================= */}
      {/* ENCABEZADO */}
      {/* ========================= */}

      <div className="mb-5">

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          ← Volver
        </button>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Orden de Trabajo
              </p>

              <h1 className="mt-1 break-words text-2xl font-bold text-slate-800 sm:text-3xl">
                OT-{orden.numero}
              </h1>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">

              <button
                type="button"
                onClick={descargarPdf}
                className="w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 sm:w-auto"
              >
                Descargar PDF
              </button>

              {orden.estado === "Pendiente" && (
                <button
                  type="button"
                  onClick={() =>
                    cambiarEstado("En producción")
                  }
                  className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
                >
                  Iniciar producción
                </button>
              )}

              {orden.estado === "En producción" && (
                <button
                  type="button"
                  onClick={() =>
                    cambiarEstado("Lista")
                  }
                  className="w-full rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 sm:w-auto"
                >
                  Marcar como lista
                </button>
              )}

              {orden.estado === "Lista" && (
                <button
                  type="button"
                  onClick={() =>
                    cambiarEstado("Entregada")
                  }
                  className="w-full rounded-lg bg-slate-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto"
                >
                  Marcar como entregada
                </button>
              )}

              {orden.estado !== "Pendiente" && (
                <button
                  type="button"
                  onClick={() =>
                    cambiarEstado("Pendiente")
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:w-auto"
                >
                  Volver a pendiente
                </button>
              )}

            </div>

          </div>

        </div>
      </div>

      {/* ========================= */}
      {/* INFORMACIÓN GENERAL */}
      {/* ========================= */}

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-500">
              Estado
            </p>

            <div className="mt-2">

              <span
                className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                  orden.estado === "Pendiente"
                    ? "bg-yellow-100 text-yellow-800"
                    : orden.estado === "En producción"
                    ? "bg-blue-100 text-blue-800"
                    : orden.estado === "Lista"
                    ? "bg-green-100 text-green-800"
                    : orden.estado === "Entregada"
                    ? "bg-slate-200 text-slate-800"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {orden.estado}
              </span>

            </div>
          </div>

          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-500">
              Fecha de entrega
            </p>

            <p className="mt-1 break-words font-semibold text-slate-800">
              {orden.fecha_entrega}
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-500">
              Total Bs
            </p>

            <p className="mt-1 font-semibold text-slate-800">
              {Number(
                orden.total
              ).toLocaleString("es-VE", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-500">
              Abono recibido
            </p>

            <p className="mt-1 font-semibold text-slate-800">
              {Number(
                orden.abono
              ).toLocaleString("es-VE", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>

        </div>

        {/* ========================= */}
        {/* CLIENTE */}
        {/* ========================= */}

        <div className="mt-6 rounded-xl border border-slate-200 p-4">

          <h2 className="mb-4 text-lg font-semibold text-slate-800">
            Cliente
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div>
              <p className="text-sm text-slate-500">
                Nombre
              </p>

              <p className="mt-1 break-words font-semibold text-slate-800">
                {orden.cotizaciones.cliente || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Documento
              </p>

              <p className="mt-1 break-words font-semibold text-slate-800">
                {orden.cotizaciones.documento || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Teléfono
              </p>

              <p className="mt-1 break-words font-semibold text-slate-800">
                {orden.cotizaciones.clientes?.telefono ||
                  "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Correo
              </p>

              <p className="mt-1 break-words font-semibold text-slate-800">
                {orden.cotizaciones.clientes?.correo ||
                  "-"}
              </p>
            </div>

          </div>

        </div>

        {/* ========================= */}
        {/* OBSERVACIONES */}
        {/* ========================= */}

        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">

          <h2 className="mb-2 text-lg font-semibold text-slate-800">
            Observaciones
          </h2>

          <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
            {orden.observaciones ||
              "Sin observaciones"}
          </p>

        </div>

      </div>

      {/* ========================= */}
      {/* PRODUCTOS DESKTOP */}
      {/* ========================= */}

      <div className="mt-6 hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 md:block">

        <h2 className="mb-4 text-lg font-semibold text-slate-800">
          Productos
        </h2>

        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead className="bg-slate-100">

              <tr>

                <th className="px-4 py-3 text-left">
                  SKU
                </th>

                <th className="px-4 py-3 text-left">
                  Producto
                </th>

                <th className="px-4 py-3 text-center">
                  Cantidad
                </th>

              </tr>

            </thead>

            <tbody>

              {orden.cotizaciones.detalle_cotizacion.map(
                (item: any) => (
                  <tr
                    key={item.id}
                    className="border-t border-slate-100"
                  >

                    <td className="px-4 py-3">
                      {item.productos.sku}
                    </td>

                    <td className="px-4 py-3">
                      {item.productos.nombre}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {item.cantidad}
                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* ========================= */}
      {/* PRODUCTOS MOBILE */}
      {/* ========================= */}

      <div className="mt-6 space-y-3 md:hidden">

        <h2 className="text-lg font-semibold text-slate-800">
          Productos
        </h2>

        {orden.cotizaciones.detalle_cotizacion.map(
          (item: any) => (
            <div
              key={item.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >

              <div className="flex items-start justify-between gap-3">

                <div className="min-w-0">

                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    SKU
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {item.productos.sku}
                  </p>

                </div>

                <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  Cant. {item.cantidad}
                </span>

              </div>

              <p className="mt-3 break-words text-sm font-medium text-slate-700">
                {item.productos.nombre}
              </p>

            </div>
          )
        )}

      </div>

    </div>
  );
}