import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "../../components/ui/Modal";

import {
  obtenerCotizacionPorId,
  actualizarEstadoCotizacion,
} from "../../services/quotes.service";

import {
  crearOrdenTrabajo,
} from "../../services/ordenes-trabajo.service";

import {
  generarPdfCotizacion,
} from "../../components/quotes/QuotePdf";

function QuoteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cotizacion, setCotizacion] = useState<any>(null);
  const [cargando, setCargando] = useState(true);

  const [modalAprobacionAbierto, setModalAprobacionAbierto] =
    useState(false);

  const [pagoCompleto, setPagoCompleto] = useState(false);
  const [abonoBs, setAbonoBs] = useState("");
  const [observacionesProduccion, setObservacionesProduccion] =
    useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");

  const saldoPendiente =
    Number(cotizacion?.total_bs ?? 0) -
    (Number(abonoBs) || 0);

  const saldoPendienteUsd =
    Number(cotizacion?.total_usd ?? 0) *
    (saldoPendiente /
      Number(cotizacion?.total_bs ?? 1));

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
    } catch (error: any) {
      console.error(error);

      alert(
        JSON.stringify(error, null, 2)
      );
    } finally {
      setCargando(false);
    }
  }

  function descargarPdf() {
    const hoy = new Date();

    const fechaCotizacion = new Date(
      cotizacion?.created_at
    );

    const esVencida =
      cotizacion?.estado === "Pendiente" &&
      fechaCotizacion.toDateString() !==
        hoy.toDateString();

    const estadoMostrar = esVencida
      ? "Vencida"
      : cotizacion?.estado;

    console.log(estadoMostrar);

    if (!cotizacion) return;

    generarPdfCotizacion({
      numero: cotizacion.numero,

      fecha: new Date(
        cotizacion.created_at
      ).toLocaleDateString(),

      cliente: cotizacion.cliente ?? "",

      documento:
        cotizacion.documento ?? "",

      telefono:
        cotizacion.clientes?.telefono ?? "",

      correo:
        cotizacion.clientes?.correo ?? "",

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

            nombre:
              item.productos.nombre,

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
      alert(
        "Debe seleccionar una fecha de entrega."
      );
      return;
    }

    try {
      console.log(cotizacion);

      await crearOrdenTrabajo({
        cotizacion_id: cotizacion.id,
        cliente_id: cotizacion.cliente_id,
        fecha_entrega: fechaEntrega,
        total: Number(
          cotizacion.total_bs
        ),
        abono: Number(abonoBs),
        observaciones:
          observacionesProduccion,
      });

      await actualizarEstadoCotizacion(
        cotizacion.id,
        "Aprobada"
      );

      await cargarCotizacion(
        cotizacion.id
      );

      alert(
        "Orden de Trabajo creada correctamente."
      );

      setModalAprobacionAbierto(false);
    } catch (error) {
      console.error(error);

      alert(
        "No fue posible crear la Orden de Trabajo."
      );
    }
  }

  if (cargando) {
    return (
      <div className="p-4 sm:p-6">
        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
          Cargando cotización...
        </h1>
      </div>
    );
  }

  if (!cotizacion) {
    return (
      <div className="p-4 sm:p-6">
        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
          Cotización no encontrada
        </h1>

        <button
          type="button"
          onClick={() =>
            navigate("/cotizaciones")
          }
          className="mt-6 rounded-lg bg-slate-600 px-4 py-2 font-semibold text-white hover:bg-slate-700"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">

      {/* ========================= */}
      {/* ENCABEZADO DESKTOP */}
      {/* ========================= */}

      <div className="mb-6 hidden items-center justify-between gap-4 md:flex">

        <div className="flex items-center gap-4">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-lg bg-slate-600 px-4 py-2 font-semibold text-white transition hover:bg-slate-700"
          >
            ← Volver
          </button>

          <h1 className="text-3xl font-bold text-slate-800">
            Cotización {cotizacion.numero}
          </h1>

        </div>

        <div className="flex gap-3">

          <button
            type="button"
            onClick={descargarPdf}
            className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition hover:bg-green-700"
          >
            PDF
          </button>

          <button
            type="button"
            onClick={() =>
              setModalAprobacionAbierto(true)
            }
            className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
          >
            Aprobar cotización
          </button>

        </div>

      </div>

      {/* ========================= */}
      {/* ENCABEZADO MOBILE */}
      {/* ========================= */}

      <div className="mb-5 md:hidden">

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 rounded-lg bg-slate-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          ← Volver
        </button>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

          <p className="text-sm font-medium text-slate-500">
            Cotización
          </p>

          <h1 className="mt-1 break-words text-2xl font-bold text-slate-800">
            {cotizacion.numero}
          </h1>

          <div className="mt-4 grid grid-cols-2 gap-2">

            <button
              type="button"
              onClick={descargarPdf}
              className="rounded-lg bg-green-600 px-3 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              Descargar PDF
            </button>

            <button
              type="button"
              onClick={() =>
                setModalAprobacionAbierto(true)
              }
              className="rounded-lg bg-blue-600 px-3 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Aprobar
            </button>

          </div>

        </div>

      </div>

      {/* ========================= */}
      {/* INFORMACIÓN COTIZACIÓN */}
      {/* ========================= */}

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Cliente
            </p>

            <p className="mt-1 break-words font-semibold text-slate-800">
              {cotizacion.cliente || "-"}
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Documento
            </p>

            <p className="mt-1 break-words font-semibold text-slate-800">
              {cotizacion.documento || "-"}
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-3 sm:col-span-2 lg:col-span-1">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Fecha
            </p>

            <p className="mt-1 break-words font-semibold text-slate-800">
              {new Date(
                cotizacion.created_at
              ).toLocaleString()}
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Teléfono
            </p>

            <p className="mt-1 break-words font-semibold text-slate-800">
              {cotizacion.clientes?.telefono ||
                "-"}
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Correo
            </p>

            <p className="mt-1 break-words font-semibold text-slate-800">
              {cotizacion.clientes?.correo ||
                "-"}
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Estado
            </p>

            <p className="mt-1 font-semibold text-slate-800">
              {cotizacion.estado}
            </p>
          </div>

        </div>

        <hr className="my-6" />

        {/* ========================= */}
        {/* PRODUCTOS DESKTOP */}
        {/* ========================= */}

        <div className="hidden overflow-x-auto md:block">

          <table className="min-w-full">

            <thead className="bg-slate-100">

              <tr>

                <th className="px-4 py-3 text-left text-sm font-semibold">
                  SKU
                </th>

                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Producto
                </th>

                <th className="px-4 py-3 text-center text-sm font-semibold">
                  Cantidad
                </th>

                <th className="px-4 py-3 text-right text-sm font-semibold">
                  USD
                </th>

                <th className="px-4 py-3 text-right text-sm font-semibold">
                  Bs
                </th>

              </tr>

            </thead>

            <tbody>

              {cotizacion.detalle_cotizacion.map(
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

                    <td className="px-4 py-3 text-right">
                      {Number(
                        item.subtotal_usd
                      ).toFixed(2)}
                    </td>

                    <td className="px-4 py-3 text-right">
                      {Number(
                        item.subtotal_bs
                      ).toLocaleString(
                        "es-VE",
                        {
                          minimumFractionDigits: 2,
                        }
                      )}
                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

        {/* ========================= */}
        {/* PRODUCTOS MOBILE */}
        {/* ========================= */}

        <div className="space-y-3 md:hidden">

          <h2 className="text-lg font-semibold text-slate-800">
            Productos
          </h2>

          {cotizacion.detalle_cotizacion.map(
            (item: any) => (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
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

                  <div className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                    Cant. {item.cantidad}
                  </div>

                </div>

                <p className="mt-3 break-words text-sm font-medium text-slate-700">
                  {item.productos.nombre}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3">

                  <div className="rounded-lg bg-white p-3">
                    <p className="text-xs text-slate-500">
                      USD
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {Number(
                        item.subtotal_usd
                      ).toFixed(2)}
                    </p>
                  </div>

                  <div className="rounded-lg bg-white p-3">
                    <p className="text-xs text-slate-500">
                      Bs
                    </p>

                    <p className="mt-1 font-semibold text-green-700">
                      {Number(
                        item.subtotal_bs
                      ).toLocaleString(
                        "es-VE",
                        {
                          minimumFractionDigits: 2,
                        }
                      )}
                    </p>
                  </div>

                </div>

              </div>
            )
          )}

        </div>

        <hr className="my-6" />

        {/* ========================= */}
        {/* TOTALES */}
        {/* ========================= */}

        <div className="space-y-3">

          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-slate-600">
              Subtotal USD
            </span>

            <strong className="text-slate-800">
              {Number(
                cotizacion.subtotal_usd
              ).toFixed(2)}
            </strong>
          </div>

          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-slate-600">
              Subtotal Bs
            </span>

            <strong className="text-slate-800">
              {Number(
                cotizacion.subtotal_bs
              ).toLocaleString(
                "es-VE",
                {
                  minimumFractionDigits: 2,
                }
              )}
            </strong>
          </div>

          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-slate-600">
              IVA USD
            </span>

            <strong className="text-slate-800">
              {Number(
                cotizacion.iva_usd
              ).toFixed(2)}
            </strong>
          </div>

          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-slate-600">
              IVA Bs
            </span>

            <strong className="text-slate-800">
              {Number(
                cotizacion.iva_bs
              ).toLocaleString(
                "es-VE",
                {
                  minimumFractionDigits: 2,
                }
              )}
            </strong>
          </div>

          <div className="mt-5 flex items-center justify-between gap-4 border-t pt-4 text-lg font-bold sm:text-xl">

            <span>TOTAL USD</span>

            <span className="text-right">
              {Number(
                cotizacion.total_usd
              ).toFixed(2)}
            </span>

          </div>

          <div className="flex items-center justify-between gap-4 text-lg font-bold text-green-700 sm:text-xl">

            <span>TOTAL Bs</span>

            <span className="text-right">
              {Number(
                cotizacion.total_bs
              ).toLocaleString(
                "es-VE",
                {
                  minimumFractionDigits: 2,
                }
              )}
            </span>

          </div>

        </div>

        {/* ========================= */}
        {/* OBSERVACIONES */}
        {/* ========================= */}

        {cotizacion.observaciones && (
          <>
            <hr className="my-6" />

            <h3 className="mb-2 font-semibold text-slate-800">
              Observaciones
            </h3>

            <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
              {cotizacion.observaciones}
            </p>
          </>
        )}

      </div>

      {/* ========================= */}
      {/* MODAL APROBACIÓN */}
      {/* ========================= */}

      <Modal
        abierto={modalAprobacionAbierto}
        titulo="Aprobar cotización"
        onCerrar={() =>
          setModalAprobacionAbierto(false)
        }
      >

        <div className="space-y-4">

          <div className="rounded-lg bg-slate-100 p-3">

            <div className="flex justify-between gap-4">
              <span>
                Total de la cotización
              </span>

              <strong className="text-right">
                {Number(
                  cotizacion.total_bs
                ).toLocaleString(
                  "es-VE",
                  {
                    minimumFractionDigits: 2,
                  }
                )}{" "}
                Bs
              </strong>
            </div>

            <div className="mt-2 flex justify-between gap-4 border-t pt-2">

              <span>
                Saldo pendiente
              </span>

              <strong className="text-right text-orange-600">
                {saldoPendiente.toLocaleString(
                  "es-VE",
                  {
                    minimumFractionDigits: 2,
                  }
                )}{" "}
                Bs
              </strong>

            </div>

            <div className="mt-2 flex justify-between gap-4">

              <span>
                Saldo pendiente (USD)
              </span>

              <strong className="text-right text-orange-600">
                {saldoPendienteUsd.toFixed(2)}{" "}
                USD
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
                  const checked =
                    e.target.checked;

                  setPagoCompleto(
                    checked
                  );

                  if (checked) {
                    setAbonoBs(
                      String(
                        cotizacion.total_bs
                      )
                    );
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

          </div>

          <div>

            <label className="mb-1 block text-sm font-medium">
              Fecha de entrega
            </label>

            <input
              type="date"
              value={fechaEntrega}
              onChange={(e) =>
                setFechaEntrega(
                  e.target.value
                )
              }
              className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>

          <div>

            <label className="mb-1 block text-sm font-medium">
              Abono recibido
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={abonoBs}
              onChange={(e) =>
                setAbonoBs(
                  e.target.value
                )
              }
              disabled={pagoCompleto}
              className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
            />

          </div>

          <div>

            <label className="mb-1 block text-sm font-medium">
              Observaciones de producción
            </label>

            <textarea
              rows={3}
              value={observacionesProduccion}
              onChange={(e) =>
                setObservacionesProduccion(
                  e.target.value
                )
              }
              placeholder="Ej.: Entregar antes de las 3:00 pm, papel mate, llamar al cliente..."
              className="w-full resize-none rounded-lg border border-slate-300 p-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() =>
                setModalAprobacionAbierto(
                  false
                )
              }
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 font-medium transition hover:bg-slate-100 sm:w-auto"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={aprobarCotizacion}
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
            >
              Crear Orden de Trabajo
            </button>

          </div>

        </div>

      </Modal>

    </div>
  );
}

export default QuoteDetailPage;