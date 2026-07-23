
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "../../components/ui/Modal";

import {
  obtenerCotizacionPorId,
} from "../../services/quotes.service";

import {
  crearOrdenTrabajo,
} from "../../services/ordenes-trabajo.service";

import {
  generarPdfCotizacion,
} from "../../components/quotes/QuotePdf";

function QuoteDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [cotizacion, setCotizacion] = useState<any>(null);
  const [cargando, setCargando] = useState(true);
  const [modalAprobacionAbierto, setModalAprobacionAbierto] = useState(false);
  const [pagoCompleto, setPagoCompleto] = useState(false);
  const [abonoBs, setAbonoBs] = useState("");
  const [observacionesProduccion, setObservacionesProduccion] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");
 const saldoPendiente =
  Number(cotizacion?.total_bs ?? 0) - (Number(abonoBs) || 0);
  const saldoPendienteUsd =
  Number(cotizacion?.total_usd ?? 0) *
  (saldoPendiente / Number(cotizacion?.total_bs ?? 1));
  useEffect(() => {
    if (id) {
      cargarCotizacion(id);
    }
  }, [id]);

  async function cargarCotizacion(id: string) {
    try {
      setCargando(true);

      const data = await obtenerCotizacionPorId(id);

      console.log(data);

      setCotizacion(data);
    }catch (error: any) {
  console.error(error);

  alert(
    JSON.stringify(error, null, 2)
  );
} finally {
      setCargando(false);
    }
  }

  function descargarPdf() {
    if (!cotizacion) return;

    generarPdfCotizacion({
      numero: cotizacion.numero,

      fecha: new Date(
        cotizacion.created_at
      ).toLocaleDateString(),

      cliente: cotizacion.cliente ?? "",

      documento: cotizacion.documento ?? "",

      observaciones:
        cotizacion.observaciones ?? "",

      subtotalUsd: Number(
        cotizacion.subtotal_usd
      ),

      subtotalBs: Number(
        cotizacion.subtotal_bs
      ),

      ivaUsd: Number(
        cotizacion.iva_usd
      ),

      ivaBs: Number(
        cotizacion.iva_bs
      ),

      totalUsd: Number(
        cotizacion.total_usd
      ),

      totalBs: Number(
        cotizacion.total_bs
      ),

      productos:
        cotizacion.detalle_cotizacion.map(
          (item: any) => ({
            sku: item.productos.sku,

            nombre: item.productos.nombre,

            cantidad: item.cantidad,

            precioUsd: Number(
              item.precio_usd
            ),

            precioBs: Number(
              item.precio_bs
            ),

            subtotalUsd: Number(
              item.subtotal_usd
            ),

            subtotalBs: Number(
              item.subtotal_bs
            ),
          })
        ),
    });
  }

  async function aprobarCotizacion() {
  if (!fechaEntrega) {
    alert("Debe seleccionar una fecha de entrega.");
    return;
  }

  try {
    console.log(cotizacion);
    await crearOrdenTrabajo({
      cotizacion_id: cotizacion.id,
      cliente_id: cotizacion.cliente_id,
      fecha_entrega: fechaEntrega,
      total: Number(cotizacion.total_bs),
      abono: Number(abonoBs),
      observaciones: observacionesProduccion,
    });

    alert("Orden de Trabajo creada correctamente.");

    setModalAprobacionAbierto(false);
  } catch (error) {
    console.error(error);
    alert("No fue posible crear la Orden de Trabajo.");
  }
}

  if (cargando) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold">
          Cargando cotización...
        </h1>
      </div>
    );
  }

  if (!cotizacion) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold">
          Cotización no encontrada
        </h1>

        <button
          onClick={() =>
            navigate("/cotizaciones")
          }
          className="mt-6 rounded-lg bg-slate-600 px-4 py-2 text-white"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div>

      <div className="mb-6 flex items-center justify-between">

        <h1 className="text-3xl font-bold text-slate-800">
          {cotizacion.numero}
        </h1>

        <div className="flex gap-3">
         
          <button
            onClick={descargarPdf}
            className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            PDF
          </button>
<button
  onClick={() => setModalAprobacionAbierto(true)}
  className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
>
  Aprobar cotización
</button>

          <button
            onClick={() =>
              navigate("/cotizaciones")
            }
            className="rounded-lg bg-slate-600 px-4 py-2 text-white hover:bg-slate-700"
          >
            Volver
          </button>

        </div>

      </div>

      <div className="rounded-lg bg-white p-6 shadow">

        <div className="grid grid-cols-2 gap-6">

          <div>
            <p className="text-sm text-slate-500">
              Cliente
            </p>

            <p className="font-semibold">
              {cotizacion.cliente || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Documento
            </p>

            <p className="font-semibold">
              {cotizacion.documento || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Fecha
            </p>

            <p className="font-semibold">
              {new Date(
                cotizacion.created_at
              ).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Estado
            </p>

            <p className="font-semibold">
              {cotizacion.estado}
            </p>
          </div>

        </div>

        <hr className="my-6" />

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

              <th className="px-4 py-3 text-right">
                USD
              </th>

              <th className="px-4 py-3 text-right">
                Bs
              </th>

            </tr>

          </thead>

          <tbody>

            {cotizacion.detalle_cotizacion.map(
              (item: any) => (

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

                  <td className="px-4 py-3 text-right">
                    {Number(
                      item.subtotal_usd
                    ).toFixed(2)}
                  </td>

                  <td className="px-4 py-3 text-right">
                    {Number(
                      item.subtotal_bs
                    ).toLocaleString("es-VE", {
                      minimumFractionDigits: 2,
                    })}
                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

        <hr className="my-6" />

        <div className="space-y-2">

          <div className="flex justify-between">
            <span>Subtotal USD</span>

            <strong>
              {Number(
                cotizacion.subtotal_usd
              ).toFixed(2)}
            </strong>
          </div>

          <div className="flex justify-between">
            <span>Subtotal Bs</span>

            <strong>
              {Number(
                cotizacion.subtotal_bs
              ).toLocaleString("es-VE", {
                minimumFractionDigits: 2,
              })}
            </strong>
          </div>

          <div className="flex justify-between">
            <span>IVA USD</span>

            <strong>
              {Number(
                cotizacion.iva_usd
              ).toFixed(2)}
            </strong>
          </div>

          <div className="flex justify-between">
            <span>IVA Bs</span>

            <strong>
              {Number(
                cotizacion.iva_bs
              ).toLocaleString("es-VE", {
                minimumFractionDigits: 2,
              })}
            </strong>
          </div>

          <div className="mt-5 flex justify-between border-t pt-4 text-xl font-bold">

            <span>TOTAL USD</span>

            <span>
              {Number(
                cotizacion.total_usd
              ).toFixed(2)}
            </span>

          </div>

          <div className="flex justify-between text-xl font-bold text-green-700">

            <span>TOTAL Bs</span>

            <span>
              {Number(
                cotizacion.total_bs
              ).toLocaleString("es-VE", {
                minimumFractionDigits: 2,
              })}
            </span>

          </div>

        </div>

        {cotizacion.observaciones && (

          <>
            <hr className="my-6" />

            <h3 className="mb-2 font-semibold">
              Observaciones
            </h3>

            <p>
              {cotizacion.observaciones}
            </p>

          </>

        )}

      </div>
           <Modal
        abierto={modalAprobacionAbierto}
        titulo="Aprobar cotización"
        onCerrar={() => setModalAprobacionAbierto(false)}
      >
        <div className="space-y-4">
          <div className="rounded-lg bg-slate-100 p-3">

  <div className="flex justify-between">
    <span>Total de la cotización</span>

    <strong>
      {Number(cotizacion.total_bs).toLocaleString("es-VE", {
        minimumFractionDigits: 2,
      })} Bs
    </strong>
  </div>
  <div className="mt-2 flex justify-between border-t pt-2">
  <span>Saldo pendiente</span>

  <strong className="text-orange-600">
    {saldoPendiente.toLocaleString("es-VE", {
      minimumFractionDigits: 2,
    })} Bs
  </strong>
</div>
<div className="mt-2 flex justify-between">
  <span>Saldo pendiente (USD)</span>

  <strong className="text-orange-600">
    {saldoPendienteUsd.toFixed(2)} USD
  </strong>
</div>
</div>

  <div>
    <div className="flex items-center gap-2">

<input
  id="pagoCompleto"
  type="checkbox"
  checked={pagoCompleto}
  onChange={(e) => {
    const checked = e.target.checked;

    setPagoCompleto(checked);

    if (checked) {
      setAbonoBs(String(cotizacion.total_bs));
    } else {
      setAbonoBs("");
    }
  }}
/>

  <label
    htmlFor="pagoCompleto"
    className="font-medium"
  >
    Cliente pagó el total
  </label>

</div>
    <label className="mb-1 block font-medium">
      Fecha de entrega
    </label>

    <input
  type="date"
  value={fechaEntrega}
  onChange={(e) => setFechaEntrega(e.target.value)}
  className="w-full rounded-lg border p-2"
/>
  </div>
<div>
  <label className="mb-1 block font-medium">
    Abono recibido
  </label>

<input
  type="number"
  min="0"
  step="0.01"
  placeholder="0.00"
  value={abonoBs}
  onChange={(e) => setAbonoBs(e.target.value)}
  disabled={pagoCompleto}
  className="w-full rounded-lg border p-2"
/>
</div>
<div>
  <label className="mb-1 block font-medium">
    Observaciones de producción
  </label>

  <textarea
    rows={3}
    value={observacionesProduccion}
    onChange={(e) =>
      setObservacionesProduccion(e.target.value)
    }
    placeholder="Ej.: Entregar antes de las 3:00 pm, papel mate, llamar al cliente..."
    className="w-full rounded-lg border p-2"
  />
</div>
<div className="mt-6 flex justify-end gap-3">

  <button
    type="button"
    onClick={() => setModalAprobacionAbierto(false)}
    className="rounded-lg border border-slate-300 px-4 py-2 hover:bg-slate-100"
  >
    Cancelar
  </button>

  <button
  type="button"
  onClick={aprobarCotizacion}
  className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
>
  Crear Orden de Trabajo
</button>

</div>
</div>
      </Modal>
    </div>
  );
}
;
export default QuoteDetailPage