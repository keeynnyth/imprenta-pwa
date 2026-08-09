import { useEffect, useState } from "react";

import {
  obtenerProductosActivos,
  type Producto,
} from "../../services/products.service";

interface QuoteItemData {
  productoId: string;
  cantidad: number;
  precioUsd: number;
  precioBs: number;
  subtotalUsd: number;
  subtotalBs: number;
}

interface Props {
  id: number;
  index: number;
  onEliminar: (id: number) => void;
  onActualizar: (
    id: number,
    data: QuoteItemData
  ) => void;
}

function QuoteItem({
  id,
  index,
  onEliminar,
  onActualizar,
}: Props) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productoId, setProductoId] = useState("");

  const [cantidad, setCantidad] = useState(1);

  const [precioUsd, setPrecioUsd] = useState(0);
  const [precioBs, setPrecioBs] = useState(0);

  const [subtotalUsd, setSubtotalUsd] = useState(0);
  const [subtotalBs, setSubtotalBs] = useState(0);

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    calcularSubtotales();
  }, [cantidad, precioUsd, precioBs]);

  async function cargarDatos() {
    try {
      const listaProductos =
        await obtenerProductosActivos();

      setProductos(listaProductos);
    } catch (error) {
      console.error(error);
    }
  }

  function seleccionarProducto(
    idProducto: string
  ) {
    setProductoId(idProducto);

    const producto = productos.find(
      (p) => p.id === idProducto
    );

    if (!producto) {
      setPrecioUsd(0);
      setPrecioBs(0);
      return;
    }

    const usd = Number(producto.usd_oficial);
    const bs = Number(producto.precio_bs);

    setPrecioUsd(usd);
    setPrecioBs(bs);
  }

  function calcularSubtotales() {
    const usd = precioUsd * cantidad;
    const bs = precioBs * cantidad;

    setSubtotalUsd(usd);
    setSubtotalBs(bs);

    onActualizar(id, {
      productoId,
      cantidad,
      precioUsd,
      precioBs,
      subtotalUsd: usd,
      subtotalBs: bs,
    });
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-5">

      {/* Encabezado del producto */}

      <div className="mb-5 flex items-center justify-between gap-3">

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Producto
          </p>

          <h3 className="text-base font-bold text-slate-800">
            Producto #{index + 1}
          </h3>
        </div>

        <button
          type="button"
          onClick={() => onEliminar(id)}
          className="shrink-0 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700 sm:px-4 sm:text-sm"
        >
          Eliminar
        </button>

      </div>

      {/* Datos principales */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {/* Producto */}

        <div className="sm:col-span-2 lg:col-span-1">

          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Producto
          </label>

          <select
            value={productoId}
            onChange={(e) =>
              seleccionarProducto(
                e.target.value
              )
            }
            className="w-full min-w-0 rounded-lg border border-slate-300 bg-white p-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">
              Seleccione...
            </option>

            {productos.map((producto) => (
              <option
                key={producto.id}
                value={producto.id}
              >
                {producto.nombre}
              </option>
            ))}
          </select>

        </div>

        {/* Cantidad */}

        <div>

          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Cantidad
          </label>

          <input
            type="number"
            min={1}
            value={cantidad}
            onChange={(e) =>
              setCantidad(
                Number(e.target.value)
              )
            }
            className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

        </div>

        {/* Precio USD */}

        <div>

          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Precio Unitario USD
          </label>

          <input
            readOnly
            value={precioUsd.toFixed(2)}
            className="w-full rounded-lg border border-slate-200 bg-slate-100 p-3 text-sm font-medium text-slate-700"
          />

        </div>

      </div>

      {/* Valores calculados */}

      <div className="mt-5 border-t border-slate-200 pt-5">

        <p className="mb-3 text-sm font-semibold text-slate-700">
          Valores calculados
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

          {/* Precio Bs */}

          <div className="rounded-lg border border-slate-200 bg-white p-3">

            <label className="mb-1 block text-xs font-medium text-slate-500">
              Precio Unitario Bs
            </label>

            <p className="break-words text-base font-semibold text-slate-800">
              Bs{" "}
              {precioBs.toLocaleString(
                "es-VE",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}
            </p>

          </div>

          {/* Subtotal USD */}

          <div className="rounded-lg border border-slate-200 bg-white p-3">

            <label className="mb-1 block text-xs font-medium text-slate-500">
              Subtotal USD
            </label>

            <p className="break-words text-base font-semibold text-slate-800">
              USD{" "}
              {subtotalUsd.toFixed(2)}
            </p>

          </div>

          {/* Subtotal Bs */}

          <div className="rounded-lg border border-green-100 bg-green-50 p-3 sm:col-span-2 lg:col-span-1">

            <label className="mb-1 block text-xs font-medium text-green-700">
              Subtotal Bs
            </label>

            <p className="break-words text-base font-bold text-green-700">
              Bs{" "}
              {subtotalBs.toLocaleString(
                "es-VE",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default QuoteItem;