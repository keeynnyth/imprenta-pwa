import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  obtenerProductos,
  eliminarProducto,
} from "../../services/products.service";

import { obtenerBCV } from "../../services/rates.service";

import type { Producto } from "../../services/products.service";

import Pagination from "../../components/ui/Pagination";
import SearchInput from "../../components/ui/SearchInput";
import DataTable from "../../components/ui/DataTable";
import PrimaryButton from "../../components/ui/PrimaryButton";

function ProductsPage() {
  const navigate = useNavigate();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const PAGE_SIZE = 30;

  const [busqueda, setBusqueda] = useState("");
  const [, setBcv] = useState(0);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarPantalla();
  }, [page]);

  async function cargarPantalla() {
    try {
      setCargando(true);

      const [resultado, tasaBCV] = await Promise.all([
        obtenerProductos(page, PAGE_SIZE),
        obtenerBCV(),
      ]);

      setProductos(resultado.data);
      setTotal(resultado.total);
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
    const precioBs = Number(producto.precio_bs ?? 0);

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
    const texto = busqueda.toLowerCase().trim();

    return (
      producto.nombre.toLowerCase().includes(texto) ||
      producto.sku.toLowerCase().includes(texto)
    );
  });

  const inicio = (page - 1) * PAGE_SIZE + 1;
  const fin = Math.min(page * PAGE_SIZE, total);

  return (
    <DataTable
      title="Productos"
      action={
        <PrimaryButton
          onClick={() => navigate("/productos/nuevo")}
        >
          + Nuevo Producto
        </PrimaryButton>
      }
      search={
        <SearchInput
          value={busqueda}
          onChange={setBusqueda}
          placeholder="Buscar por SKU o nombre..."
        />
      }
      info={
        <div className="text-sm text-slate-500">
          Mostrando {total === 0 ? 0 : inicio}-{fin} de{" "}
          {total} productos
        </div>
      }
      pagination={
        <Pagination
          page={page}
          total={total}
          pageSize={PAGE_SIZE}
          onPrevious={() =>
            setPage((p) => Math.max(1, p - 1))
          }
          onNext={() =>
            setPage((p) => p + 1)
          }
        />
      }
      mobileContent={
        <>
          {cargando ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
              Cargando productos...
            </div>
          ) : productosFiltrados.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
              No se encontraron productos.
            </div>
          ) : (
            productosFiltrados.map((producto) => (
              <div
                key={producto.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                {/* Producto */}
                <div className="border-b border-slate-100 pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        SKU
                      </p>

                      <p className="mt-1 font-semibold text-slate-700">
                        {producto.sku}
                      </p>
                    </div>

                    {producto.activo ? (
                      <span className="shrink-0 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                        Activo
                      </span>
                    ) : (
                      <span className="shrink-0 rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
                        Inactivo
                      </span>
                    )}
                  </div>

                  <p className="mt-3 break-words text-base font-semibold leading-5 text-slate-800">
                    {producto.nombre}
                  </p>
                </div>

                {/* Precios */}
                <div className="grid grid-cols-2 gap-3 py-4">

                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs font-medium text-slate-500">
                      USD Trabajo
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      USD{" "}
                      {Number(
                        producto.costo_usd
                      ).toFixed(2)}
                    </p>
                  </div>

                  <div className="rounded-lg bg-green-50 p-3">
                    <p className="text-xs font-medium text-green-700">
                      Precio Bs
                    </p>

                    <p className="mt-1 font-semibold text-green-700">
                      Bs{" "}
                      {Number(
                        producto.precio_bs ?? 0
                      ).toLocaleString("es-VE", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>

                  <div className="col-span-2 rounded-lg bg-blue-50 p-3">
                    <p className="text-xs font-medium text-blue-700">
                      USD Oficial
                    </p>

                    <p className="mt-1 font-semibold text-blue-700">
                      USD{" "}
                      {Number(
                        producto.usd_oficial ?? 0
                      ).toFixed(2)}
                    </p>
                  </div>

                </div>

                {/* Acciones */}
                <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3">

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/productos/${producto.id}`
                      )
                    }
                    className="rounded-lg bg-amber-500 px-2 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      eliminar(producto.id)
                    }
                    className="rounded-lg bg-red-600 px-2 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                  >
                    Eliminar
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      copiarPrecio(producto)
                    }
                    className="rounded-lg bg-sky-600 px-2 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
                  >
                    Copiar
                  </button>

                </div>
              </div>
            ))
          )}
        </>
      }
    >
      {/* Tabla desktop */}
      <table className="min-w-[900px] w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              SKU
            </th>

            <th className="px-4 py-3 text-left text-sm font-semibold">
              Producto
            </th>

            <th className="px-4 py-3 text-right text-sm font-semibold">
              USD Trabajo
            </th>

            <th className="px-4 py-3 text-right text-sm font-semibold">
              Precio Bs
            </th>

            <th className="px-4 py-3 text-right text-sm font-semibold">
              USD Oficial
            </th>

            <th className="px-4 py-3 text-center text-sm font-semibold">
              Estado
            </th>

            <th className="px-4 py-3 text-center text-sm font-semibold">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody>
          {cargando ? (
            <tr>
              <td
                colSpan={7}
                className="p-8 text-center text-slate-500"
              >
                Cargando productos...
              </td>
            </tr>
          ) : productosFiltrados.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="p-8 text-center text-slate-500"
              >
                No se encontraron productos.
              </td>
            </tr>
          ) : (
            productosFiltrados.map((producto) => (
              <tr
                key={producto.id}
                className="border-t border-slate-100 transition-colors hover:bg-orange-50/40"
              >
                <td className="px-4 py-3">
                  {producto.sku}
                </td>

                <td className="px-4 py-3">
                  {producto.nombre}
                </td>

                <td className="px-4 py-3 text-right">
                  USD{" "}
                  {Number(
                    producto.costo_usd
                  ).toFixed(2)}
                </td>

                <td className="px-4 py-3 text-right font-semibold text-green-700">
                  Bs{" "}
                  {Number(
                    producto.precio_bs ?? 0
                  ).toLocaleString("es-VE", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>

                <td className="px-4 py-3 text-right font-semibold text-blue-700">
                  USD{" "}
                  {Number(
                    producto.usd_oficial ?? 0
                  ).toFixed(2)}
                </td>

                <td className="px-4 py-3 text-center">
                  {producto.activo ? (
                    <span className="rounded bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                      Activo
                    </span>
                  ) : (
                    <span className="rounded bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
                      Inactivo
                    </span>
                  )}
                </td>

                <td className="px-4 py-3">
                  <div className="flex flex-wrap justify-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/productos/${producto.id}`
                        )
                      }
                      className="rounded-md bg-amber-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-amber-600"
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        eliminar(producto.id)
                      }
                      className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-red-700"
                    >
                      Eliminar
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        copiarPrecio(producto)
                      }
                      className="rounded-md bg-sky-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-sky-700"
                    >
                      Copiar
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </DataTable>
  );
}

export default ProductsPage;