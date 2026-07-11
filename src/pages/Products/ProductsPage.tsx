
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { obtenerProductos } from "../../services/products.service";
import type { Producto } from "../../services/products.service";

function ProductsPage() {
  const navigate = useNavigate();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarProductos();
  }, []);

  async function cargarProductos() {
    try {
      setCargando(true);
      setError("");

      const data = await obtenerProductos();

      setProductos(data);
    } catch (err) {
      console.error(err);
      setError("No fue posible cargar los productos.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">
          Productos
        </h1>

        <button
          onClick={() => navigate("/productos/nuevo")}
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
        >
          + Nuevo Producto
        </button>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">

        {error && (
          <div className="border-b border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <table className="min-w-full">

          <thead className="bg-slate-100">

            <tr>
              <th className="px-4 py-3 text-left">SKU</th>

              <th className="px-4 py-3 text-left">
                Producto
              </th>

              <th className="px-4 py-3 text-right">
                Costo USD
              </th>

              <th className="px-4 py-3 text-center">
                Estado
              </th>

              <th className="px-4 py-3 text-center">
                Acciones
              </th>
            </tr>

          </thead>

          <tbody>

            {cargando ? (

              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-slate-500"
                >
                  Cargando productos...
                </td>
              </tr>

            ) : productos.length === 0 ? (

              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-slate-500"
                >
                  No hay productos registrados.
                </td>
              </tr>

            ) : (

              productos.map((producto) => (

                <tr
                  key={producto.id}
                  className="border-t hover:bg-slate-50"
                >

                  <td className="px-4 py-3">
                    {producto.sku ?? "-"}
                  </td>

                  <td className="px-4 py-3">
                    {producto.nombre}
                  </td>

                  <td className="px-4 py-3 text-right">
                    USD {Number(producto.costo_usd).toFixed(2)}
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
                      className="rounded bg-yellow-500 px-3 py-1 text-sm text-white transition hover:bg-yellow-600"
                    >
                      Editar
                    </button>

                    <button
                      className="rounded bg-red-600 px-3 py-1 text-sm text-white transition hover:bg-red-700"
                    >
                      Eliminar
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