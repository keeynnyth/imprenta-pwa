import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  obtenerCotizaciones,
  type Cotizacion,
} from "../../services/quotes.service";

function QuotesHistoryPage() {
  const navigate = useNavigate();

  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarCotizaciones();
  }, []);

  async function cargarCotizaciones() {
    try {
      setCargando(true);

      const data = await obtenerCotizaciones();

      setCotizaciones(data);
    } catch (error) {
      console.error(error);
      alert("No fue posible cargar las cotizaciones.");
    } finally {
      setCargando(false);
    }
  }

  const cotizacionesFiltradas = cotizaciones.filter((cotizacion) => {
    const texto = busqueda.toLowerCase();

    return (
      cotizacion.numero.toLowerCase().includes(texto) ||
      (cotizacion.cliente ?? "")
        .toLowerCase()
        .includes(texto)
    );
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">

        <h1 className="text-3xl font-bold text-slate-800">
          Historial de Cotizaciones
        </h1>

        <button
          onClick={() => navigate("/cotizaciones/nueva")}
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
        >
          + Nueva Cotización
        </button>

      </div>

      <div className="mb-4">

        <input
          type="text"
          placeholder="Buscar por número o cliente..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full rounded-lg border border-slate-300 p-3"
        />

      </div>

      <div className="mb-3 text-sm text-slate-500">
        Mostrando {cotizacionesFiltradas.length} de {cotizaciones.length} cotizaciones
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">

        <table className="min-w-full">

          <thead className="bg-slate-100">

            <tr>
              <th className="px-4 py-3 text-left">
                Número
              </th>

              <th className="px-4 py-3 text-left">
                Cliente
              </th>

              <th className="px-4 py-3 text-left">
                Fecha
              </th>

              <th className="px-4 py-3 text-right">
                USD
              </th>

              <th className="px-4 py-3 text-right">
                Bs
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
                  colSpan={7}
                  className="p-6 text-center"
                >
                  Cargando...
                </td>
              </tr>

            ) : cotizacionesFiltradas.length === 0 ? (

              <tr>
                <td
                  colSpan={7}
                  className="p-6 text-center text-slate-500"
                >
                  No existen cotizaciones.
                </td>
              </tr>

            ) : (

              cotizacionesFiltradas.map((cotizacion) => (

                <tr
                  key={cotizacion.id}
                  className="border-t hover:bg-slate-50"
                >

                  <td className="px-4 py-3 font-semibold">
                    {cotizacion.numero}
                  </td>

                  <td className="px-4 py-3">
                    {cotizacion.cliente || "-"}
                  </td>

                  <td className="px-4 py-3">
                    {new Date(
                      cotizacion.created_at
                    ).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3 text-right">
                    {Number(
                      cotizacion.total_usd
                    ).toFixed(2)}
                  </td>

                  <td className="px-4 py-3 text-right">
                    {Number(
                      cotizacion.total_bs
                    ).toLocaleString("es-VE", {
                      minimumFractionDigits: 2,
                    })}
                  </td>

                  <td className="px-4 py-3 text-center">

                    <span className="rounded bg-green-100 px-3 py-1 text-green-700">
                      {cotizacion.estado}
                    </span>

                  </td>

                  <td className="px-4 py-3 text-center">

                    <button
  onClick={() =>
    navigate(`/cotizaciones/${cotizacion.id}`)
  }
  className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
>
  Ver
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

export default QuotesHistoryPage;