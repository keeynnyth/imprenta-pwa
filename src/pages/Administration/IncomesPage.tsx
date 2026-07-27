

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  obtenerMovimientos,
  eliminarMovimiento,
} from "../../services/movimientos.service";

import Card from "../../components/ui/Card";
import { useNavigate } from "react-router-dom";

import PageHeader from "../../components/ui/PageHeader";

import type { Movimiento } from "../../services/movimientos.service";

function IncomesPage() {
  const [ingresos, setIngresos] = useState<Movimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    cargarIngresos();
  }, []);

  async function cargarIngresos()
   {
    try {
      const data = await obtenerMovimientos("Ingreso");
      setIngresos(data ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function formatearMonto(
  monto: number,
  moneda: string
) {
  return (
    new Intl.NumberFormat("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(monto) + ` ${moneda}`
  );
}

  async function handleEliminar(id: string) {
  const confirmar = window.confirm(
    "¿Está seguro de eliminar este ingreso?"
  );

  if (!confirmar) return;

  try {
    await eliminarMovimiento(id);
    await cargarIngresos();
  } catch (error) {
    console.error(error);
    alert("No se pudo eliminar el ingreso.");
  }
}

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <Card>
      <PageHeader
  title="Ingresos"
  subtitle="Administra todos los ingresos registrados."
  buttonText="+ Nuevo ingreso"
  buttonLink="/ingresos/nuevo"
/>

      {ingresos.length === 0 ? (
        <p>No hay ingresos registrados.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead className="bg-slate-100">
  <tr>
    <th className="border p-2 text-center">Fecha</th>
    <th className="border p-2 text-center">Categoría</th>
    <th className="border p-2 text-center">Concepto</th>
    <th className="border p-2 text-center">Monto Original</th>
    <th className="border p-2 text-center">Tasa</th>
    <th className="border p-2 text-center">Equiv. Bs</th>
    <th className="border p-2 text-center">Equiv. USD</th>
    <th className="border p-2 text-center">Método</th>
    <th className="border p-2 text-center">Acciones</th>
  </tr>
</thead>

          <tbody>
            {ingresos.map((ingreso) => (
              <tr key={ingreso.id} className="border-b">
                <td className="border p-2">
  {ingreso.fecha}
</td>
                <td className="border p-2">
  {ingreso.categoria}
</td>

<td className="border p-2">
  {ingreso.concepto}
</td>

<td className="border p-2 text-right">
  {formatearMonto(
    ingreso.monto_original,
    ingreso.moneda
  )}
</td>

<td className="border p-2 text-right">
  {ingreso.tasa.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}
</td>

<td className="border p-2 text-right">
  {formatearMonto(
    ingreso.monto_bs,
    "Bs"
  )}
</td>

<td className="border p-2 text-right">
  {formatearMonto(
    ingreso.monto_usd,
    "USD"
  )}
</td>

<td className="border p-2 text-center">
  {ingreso.metodo_pago}
</td>
         <td className="p-2 text-center">
  <div className="flex justify-center gap-2">
    <button
      onClick={() => navigate(`/ingresos/${ingreso.id}`)}
      className="rounded bg-amber-500 px-3 py-1 text-sm text-white hover:bg-amber-600"
    >
      ✏️ Editar
    </button>

    <button
      onClick={() => handleEliminar(ingreso.id)}
      className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
    >
      🗑 Eliminar
    </button>
  </div>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
}

export default IncomesPage;