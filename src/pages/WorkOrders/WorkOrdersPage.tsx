import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import type { OrdenTrabajo } from "../../interfaces/orden-trabajo.interface";

import { obtenerOrdenesTrabajo } from "../../services/ordenes-trabajo.service";

export default function WorkOrdersPage() {
  const [ordenes, setOrdenes] = useState<OrdenTrabajo[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarOrdenes();
  }, []);

  async function cargarOrdenes() {
    try {
      setCargando(true);

      const data = await obtenerOrdenesTrabajo();

      setOrdenes(data);
    } catch (error) {
      console.error(error);
      alert("No fue posible cargar las órdenes.");
    } finally {
      setCargando(false);
    }
  }

  if (cargando) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold">
          Cargando órdenes...
        </h1>
      </div>
    );
  }

  return (
    <div className="p-6">

      <h1 className="mb-6 text-3xl font-bold">
        Órdenes de Trabajo
      </h1>

      <table className="min-w-full rounded-lg bg-white shadow">

        <thead className="bg-slate-100">

          <tr>
            <th className="px-4 py-3 text-left">
              Número
            </th>

            <th className="px-4 py-3 text-left">
              Estado
            </th>

            <th className="px-4 py-3 text-left">
              Entrega
            </th>

            <th className="px-4 py-3 text-right">
              Total Bs
            </th>

            <th className="px-4 py-3"></th>
          </tr>

        </thead>

        <tbody>

          {ordenes.map((orden) => (

            <tr
              key={orden.id}
              className="border-t"
            >
              <td className="px-4 py-3">
                {orden.numero}
              </td>

              <td className="px-4 py-3">
                {orden.estado}
              </td>

              <td className="px-4 py-3">
                {orden.fecha_entrega}
              </td>

              <td className="px-4 py-3 text-right">
                {Number(orden.total).toLocaleString(
                  "es-VE",
                  {
                    minimumFractionDigits: 2,
                  }
                )}
              </td>

              <td className="px-4 py-3 text-right">

                <Link
                  to={`/ordenes-trabajo/${orden.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Ver
                </Link>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}