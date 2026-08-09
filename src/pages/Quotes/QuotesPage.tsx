import { useMemo, useState } from "react";
import QuoteItem from "../../components/quotes/QuoteItem";
import { crearCotizacion } from "../../services/quotes.service";
import { useNavigate } from "react-router-dom";
import ClientSelector from "../../components/clients/ClientSelector";

interface ItemCotizacion {
  id: number;
}

interface QuoteItemData {
  productoId: string;
  cantidad: number;
  precioUsd: number;
  precioBs: number;
  subtotalUsd: number;
  subtotalBs: number;
}

function QuotesPage() {
  const navigate = useNavigate();

  const [items, setItems] = useState<ItemCotizacion[]>([
    { id: 1 },
  ]);

  const [detalleCotizacion, setDetalleCotizacion] =
    useState<Record<number, QuoteItemData>>({});

  const [cliente, setCliente] = useState("");
  const [clienteId, setClienteId] = useState<string | null>(null);
  const [documento, setDocumento] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [agregarIva, setAgregarIva] = useState(false);

  function agregarProducto() {
    setItems((actual) => [
      ...actual,
      {
        id: Date.now(),
      },
    ]);
  }

  function eliminarProducto(id: number) {
    if (items.length === 1) {
      alert(
        "La cotización debe tener al menos un producto."
      );
      return;
    }

    setItems((actual) =>
      actual.filter((item) => item.id !== id)
    );

    setDetalleCotizacion((actual) => {
      const copia = { ...actual };
      delete copia[id];
      return copia;
    });
  }

  function actualizarItem(
    id: number,
    data: QuoteItemData
  ) {
    setDetalleCotizacion((actual) => ({
      ...actual,
      [id]: data,
    }));
  }

  const subtotalUsd = useMemo(() => {
    return Object.values(detalleCotizacion).reduce(
      (acum, item) =>
        acum + item.subtotalUsd,
      0
    );
  }, [detalleCotizacion]);

  const subtotalBs = useMemo(() => {
    return Object.values(detalleCotizacion).reduce(
      (acum, item) =>
        acum + item.subtotalBs,
      0
    );
  }, [detalleCotizacion]);

  const ivaUsd = agregarIva
    ? subtotalUsd * 0.16
    : 0;

  const ivaBs = agregarIva
    ? subtotalBs * 0.16
    : 0;

  const totalUsd = subtotalUsd + ivaUsd;
  const totalBs = subtotalBs + ivaBs;

  async function generarCotizacion() {
    try {
      const detalle =
        Object.values(detalleCotizacion);

      if (detalle.length === 0) {
        alert(
          "Debe agregar al menos un producto."
        );
        return;
      }

      if (
        detalle.some(
          (item) => !item.productoId
        )
      ) {
        alert(
          "Todos los productos deben estar seleccionados."
        );
        return;
      }

      const cotizacion =
        await crearCotizacion({
          cliente_id: clienteId,

          cliente,
          documento,

          observaciones,
          agregarIva,

          subtotalUsd,
          subtotalBs,

          ivaUsd,
          ivaBs,

          totalUsd,
          totalBs,

          detalle,
        });

      alert(
        `Cotización ${cotizacion.numero} creada correctamente.`
      );

      navigate("/cotizaciones");
    } catch (error) {
      console.error(error);

      alert(
        "No fue posible guardar la cotización."
      );
    }
  }

  return (
    <div className="w-full">

      {/* Encabezado */}

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <p className="text-sm font-medium text-slate-500">
            Cotizaciones
          </p>

          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
            Nueva Cotización
          </h1>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/cotizaciones")
          }
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:w-auto"
        >
          ← Volver
        </button>

      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">

        {/* Cliente */}

        <div className="mb-6">

          <h2 className="mb-4 text-lg font-semibold text-slate-800">
            Datos del cliente
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Cliente (Opcional)
              </label>

              <ClientSelector
                value={cliente}
                onChange={(texto) => {
                  setCliente(texto);

                  if (!texto.trim()) {
                    setClienteId(null);
                    setDocumento("");
                  }
                }}
                onSelect={(clienteSeleccionado) => {
                  if (!clienteSeleccionado) {
                    setClienteId(null);
                    return;
                  }

                  setClienteId(
                    clienteSeleccionado.id
                  );

                  setCliente(
                    clienteSeleccionado.nombre
                  );

                  setDocumento(
                    clienteSeleccionado.documento ??
                      ""
                  );
                }}
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                RIF / Cédula (Opcional)
              </label>

              <input
                value={documento}
                onChange={(e) =>
                  setDocumento(e.target.value)
                }
                className="w-full rounded-lg border border-slate-300 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

          </div>

        </div>

        <div className="mb-6 border-t border-slate-200" />

        {/* Productos */}

        <div>

          <div className="mb-4">

            <h2 className="text-lg font-semibold text-slate-800">
              Productos
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Agrega los productos que deseas incluir en la cotización.
            </p>

          </div>

          <div className="space-y-4">

            {items.map((item, index) => (
              <QuoteItem
                key={item.id}
                id={item.id}
                index={index}
                onEliminar={eliminarProducto}
                onActualizar={actualizarItem}
              />
            ))}

          </div>

          <button
            type="button"
            onClick={agregarProducto}
            className="mt-4 w-full rounded-lg bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700 sm:w-auto"
          >
            + Agregar producto
          </button>

        </div>

        <div className="my-6 border-t border-slate-200" />

        {/* Observaciones */}

        <div>

          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Observaciones
          </label>

          <textarea
            rows={5}
            value={observaciones}
            onChange={(e) =>
              setObservaciones(e.target.value)
            }
            className="w-full resize-y rounded-lg border border-slate-300 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

        </div>

        {/* IVA */}

        <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">

          <label className="flex cursor-pointer items-center gap-3">

            <input
              type="checkbox"
              checked={agregarIva}
              onChange={(e) =>
                setAgregarIva(
                  e.target.checked
                )
              }
              className="h-5 w-5 rounded border-slate-300"
            />

            <span className="font-medium text-slate-700">
              Agregar IVA (16%)
            </span>

          </label>

        </div>

        {/* Resumen */}

        <div className="mt-6 rounded-xl bg-slate-100 p-4 sm:p-5">

          <h2 className="mb-4 text-lg font-semibold text-slate-800">
            Resumen
          </h2>

          <div className="space-y-3">

            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-slate-600">
                Subtotal USD
              </span>

              <strong className="text-right text-slate-800">
                USD {subtotalUsd.toFixed(2)}
              </strong>
            </div>

            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-slate-600">
                Subtotal Bs
              </span>

              <strong className="text-right text-slate-800">
                Bs{" "}
                {subtotalBs.toLocaleString(
                  "es-VE",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </strong>
            </div>

            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-slate-600">
                IVA USD
              </span>

              <strong className="text-right text-slate-800">
                USD {ivaUsd.toFixed(2)}
              </strong>
            </div>

            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-slate-600">
                IVA Bs
              </span>

              <strong className="text-right text-slate-800">
                Bs{" "}
                {ivaBs.toLocaleString(
                  "es-VE",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </strong>
            </div>

          </div>

          <div className="mt-5 border-t border-slate-300 pt-4">

            <div className="flex items-center justify-between gap-4 text-lg font-bold">

              <span>
                TOTAL USD
              </span>

              <span className="text-right">
                USD {totalUsd.toFixed(2)}
              </span>

            </div>

            <div className="mt-3 flex items-center justify-between gap-4 text-lg font-bold text-green-700">

              <span>
                TOTAL Bs
              </span>

              <span className="text-right">
                Bs{" "}
                {totalBs.toLocaleString(
                  "es-VE",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </span>

            </div>

          </div>

        </div>

        {/* Acción final */}

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={() =>
              navigate("/cotizaciones")
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 sm:w-auto"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={generarCotizacion}
            className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
          >
            Generar Cotización
          </button>

        </div>

      </div>

    </div>
  );
}

export default QuotesPage;