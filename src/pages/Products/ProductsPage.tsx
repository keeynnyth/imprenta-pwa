
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  obtenerProductos,
  eliminarProducto,
} from "../../services/products.service";

import { obtenerBCV } from "../../services/rates.service";

import type { Producto } from "../../services/products.service";

function ProductsPage() {
  const navigate = useNavigate();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [bcv, setBcv] = useState(0);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarPantalla();
  }, []);

  async function cargarPantalla() {
    try {
      setCargando(true);

      const [listaProductos, tasaBCV] = await Promise.all([
        obtenerProductos(),
        obtenerBCV(),
      ]);

      setProductos(listaProductos);
      setBcv(tasaBCV);
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  }

  async function eliminar(id: string) {
    const confirmar = window.confirm(
      "¿Está seguro que desea eliminar este producto?"
    );

    if (!confirmar) return;

    try {
      await eliminarProducto(id);
      await cargarPantalla();
    } catch (error) {
      console.error(error);
      alert("No fue posible eliminar el producto.");
    }
  }

  async function copiarPrecio(producto: Producto) {
    const precioBs = Number(producto.costo_usd) * bcv;

    const texto = `${producto.nombre}

💵 Precio USD: ${Number(producto.costo_usd).toFixed(2)}

🇻🇪 Precio Bs: ${precioBs.toLocaleString("es-VE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

    try {
      await navigator.clipboard.writeText(texto);
      alert("Precio copiado al portapapeles.");
    } catch (error) {
      console.error(error);
      alert("No fue posible copiar el precio.");
    }
  }

  const productosFiltrados = productos.filter((producto) => {
    const texto = busqueda.toLowerCase();

    return (
      producto.nombre.toLowerCase().includes(texto) ||
      producto.sku.toLowerCase().includes(texto)
    );
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">
          Productos
        </h1>

        <button
          onClick={() => navigate("/productos/nuevo")}
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
        >
          + Nuevo Producto
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por SKU o nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full rounded-lg border border-slate-300 p-3 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="mb-3 text-sm text-slate-500">
        Mostrando {productosFiltrados.length} de {productos.length} productos
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <table className="min-w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-3 text-left">SKU</th>
              <th className="px-4 py-3 text-left">Producto</th>
              <th className="px-4 py-3 text-right">Precio USD</th>
              <th className="px-4 py-3 text-right">Precio Bs</th>
              <th className="px-4 py-3 text-center">Estado</th>
              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {cargando ? (
              <tr>
                <td colSpan={6} className="p-6 text-center">
                  Cargando productos...
                </td>
              </tr>
            ) : productosFiltrados.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-6 text-center text-slate-500"
                >
                  No se encontraron productos.
                </td>
              </tr>
            ) : (
              productosFiltrados.map((producto) => (
                <tr
                  key={producto.id}
                  className="border-t hover:bg-slate-50"
                >
                  <td className="px-4 py-3">
                    {producto.sku}
                  </td>

                  <td className="px-4 py-3">
                    {producto.nombre}
                  </td>

                  <td className="px-4 py-3 text-right">
                    USD {Number(producto.costo_usd).toFixed(2)}
                  </td>

                  <td className="px-4 py-3 text-right font-semibold text-green-700">
                    Bs{" "}
                    {(Number(producto.costo_usd) * bcv).toLocaleString(
                      "es-VE",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {producto.activo ? (
                      <span className="rounded bg-green-100 px-3 py-1 text-green-700">
                        Activo
                      </span>
                    ) : (
                      <span className="rounded bg-red-100 px-3 py-1 text-red-700">
                        Inactivo
                      </span>
                    )}
                  </td>

                  <td className="space-x-2 px-4 py-3 text-center">
                    <button
                      onClick={() =>
                        navigate(`/productos/${producto.id}`)
                      }
                      className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => eliminar(producto.id)}
                      className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                    >
                      Eliminar
                    </button>

                    <button
                      onClick={() => copiarPrecio(producto)}
                      className="rounded bg-sky-600 px-3 py-1 text-white hover:bg-sky-700"
                    >
                      Copiar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductsPage;