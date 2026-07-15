
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
      (acum, item) => acum + item.subtotalUsd,
      0
    );
  }, [detalleCotizacion]);

  const subtotalBs = useMemo(() => {
    return Object.values(detalleCotizacion).reduce(
      (acum, item) => acum + item.subtotalBs,
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
    const detalle = Object.values(detalleCotizacion);

    if (detalle.length === 0) {
      alert("Debe agregar al menos un producto.");
      return;
    }

    if (detalle.some((item) => !item.productoId)) {
      alert("Todos los productos deben estar seleccionados.");
      return;
    }

   const cotizacion = await crearCotizacion({
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

    alert("No fue posible guardar la cotización.");
  }
}

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800">
        Nueva Cotización
      </h1>

      <div className="mt-6 rounded-lg bg-white p-6 shadow">

        <div className="mb-6 grid grid-cols-2 gap-4">

          <div>
            <label className="mb-2 block font-medium">
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

    setClienteId(clienteSeleccionado.id);
    setCliente(clienteSeleccionado.nombre);
    setDocumento(clienteSeleccionado.documento ?? "");
  }}
/>
          </div>

          <div>
            <label className="mb-2 block font-medium">
              RIF / Cédula (Opcional)
            </label>

            <input
              value={documento}
              onChange={(e) =>
                setDocumento(e.target.value)
              }
              className="w-full rounded-lg border border-slate-300 p-3"
            />
          </div>

        </div>

        <hr className="mb-6" />

        {items.map((item, index) => (
          <QuoteItem
            key={item.id}
            id={item.id}
            index={index}
            onEliminar={eliminarProducto}
            onActualizar={actualizarItem}
          />
        ))}

        <button
          type="button"
          onClick={agregarProducto}
          className="mt-2 rounded-lg bg-green-600 px-5 py-3 text-white hover:bg-green-700"
        >
          + Agregar producto
        </button>

        <hr className="my-6" />

        <div>

          <label className="mb-2 block font-medium">
            Observaciones
          </label>

          <textarea
            rows={5}
            value={observaciones}
            onChange={(e) =>
              setObservaciones(e.target.value)
            }
            className="w-full rounded-lg border border-slate-300 p-3"
          />

        </div>

        <div className="mt-6">

          <label className="flex items-center gap-3">

            <input
              type="checkbox"
              checked={agregarIva}
              onChange={(e) =>
                setAgregarIva(e.target.checked)
              }
            />

            Agregar IVA (16%)

          </label>

        </div>

        <div className="mt-8 rounded-lg bg-slate-100 p-5">

          <div className="flex justify-between">
            <span>Subtotal USD</span>
            <strong>{subtotalUsd.toFixed(2)}</strong>
          </div>

          <div className="mt-2 flex justify-between">
            <span>Subtotal Bs</span>
            <strong>
              {subtotalBs.toLocaleString("es-VE", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </strong>
          </div>

          <div className="mt-2 flex justify-between">
            <span>IVA USD</span>
            <strong>{ivaUsd.toFixed(2)}</strong>
          </div>

          <div className="mt-2 flex justify-between">
            <span>IVA Bs</span>
            <strong>
              {ivaBs.toLocaleString("es-VE", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </strong>
          </div>

          <div className="mt-5 flex justify-between border-t pt-4 text-xl font-bold">

            <span>TOTAL USD</span>

            <span>{totalUsd.toFixed(2)}</span>

          </div>

          <div className="mt-3 flex justify-between text-xl font-bold text-green-700">

            <span>TOTAL Bs</span>

            <span>
              {totalBs.toLocaleString("es-VE", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>

          </div>

        </div>

        <div className="mt-8 flex justify-end">

          <button
            onClick={generarCotizacion}
            className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
          >
            Generar Cotización
          </button>

        </div>

      </div>
    </div>
  );

}

export default QuotesPage;