
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  obtenerCotizacionPorId,
} from "../../services/quotes.service";

import {
  generarPdfCotizacion,
} from "../../components/quotes/QuotePdf";

function QuoteDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [cotizacion, setCotizacion] = useState<any>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (id) {
      cargarCotizacion(id);
    }
  }, [id]);

  async function cargarCotizacion(id: string) {
    try {
      setCargando(true);

      const data = await obtenerCotizacionPorId(id);

      setCotizacion(data);
    } catch (error) {
      console.error(error);
      alert("No fue posible cargar la cotización.");
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

    </div>
  );
}

export default QuoteDetailPage;