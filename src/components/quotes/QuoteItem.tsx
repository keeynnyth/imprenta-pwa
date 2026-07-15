
import { useEffect, useState } from "react";

import {
  obtenerProductosActivos,
  type Producto,
} from "../../services/products.service";

import { obtenerBCV } from "../../services/rates.service";

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
  const [bcv, setBcv] = useState(0);

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
      const [listaProductos, tasaBCV] = await Promise.all([
        obtenerProductosActivos(),
        obtenerBCV(),
      ]);

      setProductos(listaProductos);
      setBcv(tasaBCV);
    } catch (error) {
      console.error(error);
    }
  }

  function seleccionarProducto(idProducto: string) {
    setProductoId(idProducto);

    const producto = productos.find(
      (p) => p.id === idProducto
    );

    if (!producto) {
      setPrecioUsd(0);
      setPrecioBs(0);
      return;
    }

    const usd = Number(producto.costo_usd);
    const bs = usd * bcv;

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
    <div className="mb-5 rounded-lg border border-slate-200 p-4">

      <div className="mb-4 flex items-center justify-between">

        <h3 className="font-semibold">
          Producto #{index + 1}
        </h3>

        <button
          type="button"
          onClick={() => onEliminar(id)}
          className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
        >
          Eliminar
        </button>

      </div>

      <div className="grid grid-cols-3 gap-4">

        <div>
          <label className="mb-2 block">
            Producto
          </label>

          <select
            value={productoId}
            onChange={(e) =>
              seleccionarProducto(e.target.value)
            }
            className="w-full rounded border p-3"
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

        <div>
          <label className="mb-2 block">
            Cantidad
          </label>

          <input
            type="number"
            min={1}
            value={cantidad}
            onChange={(e) =>
              setCantidad(Number(e.target.value))
            }
            className="w-full rounded border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block">
            Precio Unitario USD
          </label>

          <input
            readOnly
            value={precioUsd.toFixed(2)}
            className="w-full rounded border bg-slate-100 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block">
            Precio Unitario Bs
          </label>

          <input
            readOnly
            value={precioBs.toLocaleString("es-VE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            className="w-full rounded border bg-slate-100 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block">
            Subtotal USD
          </label>

          <input
            readOnly
            value={subtotalUsd.toFixed(2)}
            className="w-full rounded border bg-slate-100 p-3 font-semibold"
          />
        </div>

        <div>
          <label className="mb-2 block">
            Subtotal Bs
          </label>

          <input
            readOnly
            value={subtotalBs.toLocaleString("es-VE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            className="w-full rounded border bg-slate-100 p-3 font-semibold text-green-700"
          />
        </div>

      </div>

    </div>
  );
}

export default QuoteItem;