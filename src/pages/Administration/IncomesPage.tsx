

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { obtenerIngresos } from "../../services/incomes.service";
import Card from "../../components/ui/Card";
import { useNavigate } from "react-router-dom";
import { eliminarIngreso } from "../../services/incomes.service";
import PageHeader from "../../components/ui/PageHeader";

interface Ingreso {
  id: string;
  fecha: string;
  concepto: string;
  monto: number;
  moneda: string;
  metodo_pago: string;
}

function IncomesPage() {
  const [ingresos, setIngresos] = useState<Ingreso[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    cargarIngresos();
  }, []);

  async function cargarIngresos()
   {
    try {
      const data = await obtenerIngresos();
      setIngresos(data ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleEliminar(id: string) {
  const confirmar = window.confirm(
    "¿Está seguro de eliminar este ingreso?"
  );

  if (!confirmar) return;

  try {
    await eliminarIngreso(id);
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
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Fecha</th>
              <th className="p-2 text-left">Concepto</th>
              <th className="p-2 text-right">Monto</th>
              <th className="p-2 text-center">Moneda</th>
              <th className="p-2 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {ingresos.map((ingreso) => (
              <tr key={ingreso.id} className="border-b">
                <td className="p-2">{ingreso.fecha}</td>
                <td className="p-2">{ingreso.concepto}</td>
                <td className="p-2 text-right">
                  {ingreso.monto}
                </td>
                <td className="p-2 text-center">
                  {ingreso.moneda}
                </td>
                <td className="p-2 text-center">
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