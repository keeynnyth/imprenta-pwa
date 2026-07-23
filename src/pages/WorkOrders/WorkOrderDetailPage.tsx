
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  actualizarEstadoOrdenTrabajo,
  obtenerOrdenTrabajoPorId,
} from "../../services/ordenes-trabajo.service";

import { generarPdfOrdenTrabajo } from "../../components/workorders/WorkOrderPdf";

export default function WorkOrderDetailPage() {
  const { id } = useParams();

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

  async function cambiarEstado(
  nuevoEstado: string
) {
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

    observaciones: orden.observaciones,

    totalBs: Number(orden.total),

    abono: Number(orden.abono),

    saldoPendiente:
      Number(orden.total) - Number(orden.abono),

    productos: orden.cotizaciones.detalle_cotizacion.map((item: any) => ({
      nombre: item.productos.nombre,
      cantidad: item.cantidad,
      precioUsd: item.precio_usd,
      precioBs: item.precio_bs,
      subtotalUsd: item.subtotal_usd,
      subtotalBs: item.subtotal_bs,
    })),
  });
}

  if (cargando) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold">
          Cargando Orden de Trabajo...
        </h1>
      </div>
    );
  }

  if (!orden) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold">
          Orden de Trabajo no encontrada
        </h1>
      </div>
    );
  }

  return (
  <div className="p-6">

    <h1 className="mb-6 text-3xl font-bold">
      Orden #{orden.numero}
    </h1>

    <div className="mb-6 flex flex-wrap gap-3">
        <button
  onClick={descargarPdf}
  className="rounded bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
>
  Descargar PDF
</button>

  {orden.estado === "Pendiente" && (
    <button
      onClick={() => cambiarEstado("En producción")}
      className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
    >
      Iniciar producción
    </button>
  )}

  {orden.estado === "En producción" && (
    <button
      onClick={() => cambiarEstado("Lista")}
      className="rounded bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
    >
      Marcar como lista
    </button>
  )}

  {orden.estado === "Lista" && (
    <button
      onClick={() => cambiarEstado("Entregada")}
      className="rounded bg-slate-700 px-4 py-2 font-semibold text-white hover:bg-slate-800"
    >
      Marcar como entregada
    </button>
  )}

  {orden.estado !== "Pendiente" && (
    <button
      onClick={() => cambiarEstado("Pendiente")}
      className="rounded border border-slate-300 bg-white px-4 py-2 font-semibold hover:bg-slate-100"
    >
      Volver a pendiente
    </button>
  )}

</div>

    <div className="rounded-lg bg-white p-6 shadow">
        <div className="mb-6">

  <p className="text-sm text-slate-500">
    Cliente
  </p>

  <p className="text-lg font-semibold">
    {orden.cotizaciones.cliente}
  </p>

  <p className="text-slate-600">
    {orden.cotizaciones.documento}
  </p>

</div>

      <div className="grid grid-cols-2 gap-6">

        <div>
          <p className="text-sm text-slate-500">
            Estado
          </p>

          <p className="font-semibold">
            <span
  className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold
    ${
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
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Fecha de entrega
          </p>

          <p className="font-semibold">
            {orden.fecha_entrega}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Total Bs
          </p>

          <p className="font-semibold">
            {Number(orden.total).toLocaleString(
              "es-VE",
              {
                minimumFractionDigits: 2,
              }
            )}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Abono recibido
          </p>

          <p className="font-semibold">
            {Number(orden.abono).toLocaleString(
              "es-VE",
              {
                minimumFractionDigits: 2,
              }
            )}
          </p>
        </div>

      </div>
      <div className="mt-6">

  <p className="text-sm text-slate-500">
    Observaciones de producción
  </p>

  <div className="mt-2 rounded-md border bg-slate-50 p-4 min-h-24">

    {orden.observaciones || "Sin observaciones"}

  </div>

</div>

    </div>

    <div className="mt-6 rounded-lg bg-white p-6 shadow">

  <h2 className="mb-4 text-xl font-semibold">
    Productos
  </h2>

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

      {orden.cotizaciones.detalle_cotizacion.map((item: any) => (

        <tr
          key={item.id}
          className="border-t"
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

      ))}

    </tbody>

  </table>

</div>

  </div>
);
}