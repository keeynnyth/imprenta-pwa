
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  obtenerProductos,
  eliminarProducto,
} from "../../services/products.service";

import type { Producto } from "../../services/products.service";

function ProductsPage() {
  const navigate = useNavigate();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarProductos();
  }, []);

  async function cargarProductos() {
    try {
      setCargando(true);

      const data = await obtenerProductos();
      setProductos(data);
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

    if (!confirmar) {
      return;
    }

    try {
      await eliminarProducto(id);

      // Recargar la lista
      await cargarProductos();
    } catch (error) {
      console.error(error);
      alert("No fue posible eliminar el producto.");
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
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
        >
          + Nuevo Producto
        </button>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <table className="min-w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-3 text-left">SKU</th>
              <th className="px-4 py-3 text-left">Producto</th>
              <th className="px-4 py-3 text-right">Costo USD</th>
              <th className="px-4 py-3 text-center">Estado</th>
              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {cargando ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-6 text-center"
                >
                  Cargando productos...
                </td>
              </tr>
            ) : productos.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-6 text-center text-slate-500"
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
                    {producto.sku}
                  </td>

                  <td className="px-4 py-3">
                    {producto.nombre}
                  </td>

                  <td className="px-4 py-3 text-right">
                    USD{" "}
                    {Number(producto.costo_usd).toFixed(2)}
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
                        navigate(
                          `/productos/${producto.id}`
                        )
                      }
                      className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() =>
                        eliminar(producto.id)
                      }
                      className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
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