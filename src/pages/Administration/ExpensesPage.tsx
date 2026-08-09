
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import PageHeader from "../../components/ui/PageHeader";


import type { Movimiento } from "../../services/movimientos.service";

import {
  eliminarMovimiento,
  obtenerMovimientos,
} from "../../services/movimientos.service";

function ExpensesPage() {
  const [expenses, setExpenses] = useState<Movimiento[]>([]);

 async function cargarEgresos() {
  try {
    const resultado =
  await obtenerMovimientos("Egreso");

setExpenses(resultado.data);
  } catch (error) {
    console.error(error);
  }
}

  useEffect(() => {
    cargarEgresos();
  }, []);

  async function handleDelete(id: string) {
    const confirmar = window.confirm(
      "¿Desea eliminar este egreso?"
    );

    if (!confirmar) return;

    await eliminarMovimiento(id);
    cargarEgresos();
  }
function formatearFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString("es-AR");
}

function formatearMonto(
  monto: number,
  moneda: string
) {
  return new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(monto) + ` ${moneda}`;
}
  

  return (
    <Card>
      <PageHeader
        title="Egresos"
        subtitle="Administra todos los egresos registrados."
        buttonText="+ Nuevo egreso"
        buttonLink="/egresos/nuevo"
      />

      <table className="min-w-full border border-slate-200">
        <thead className="bg-slate-100">
          <tr>
  <th className="border p-2">Fecha</th>
  <th className="border p-2">Categoría</th>
  <th className="border p-2">Concepto</th>
  <th className="border p-2">Monto Original</th>
  <th className="border p-2">Tasa</th>
  <th className="border p-2">Equiv. Bs</th>
  <th className="border p-2">Equiv. USD</th>
  <th className="border p-2">Método</th>
  <th className="border p-2">Acciones</th>
</tr>
        </thead>

        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id}>
            <td className="border p-2">
  {formatearFecha(expense.fecha)}
</td>

              <td className="border p-2 text-center">
  {expense.categoria}
</td>

<td className="border p-2">
  {expense.concepto}
</td>

<td className="border p-2">
  {formatearMonto(
    expense.monto_original,
    expense.moneda
  )}
</td>

<td className="border p-2">
  {expense.tasa.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}
</td>

<td className="border p-2">
  {formatearMonto(expense.monto_bs, "Bs")}
</td>

<td className="border p-2">
  {formatearMonto(expense.monto_usd, "USD")}
</td>

<td className="border p-2">
  {expense.metodo_pago}
</td>

              <td className="border p-2">
                <div className="flex gap-2">
                  <Link
                    to={`/egresos/${expense.id}`}
                    className="rounded bg-yellow-500 px-3 py-1 text-white"
                  >
                    Editar
                  </Link>

                  <button
                    onClick={() =>
                      handleDelete(expense.id!)
                    }
                    className="rounded bg-red-600 px-3 py-1 text-white"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {expenses.length === 0 && (
            <tr>
              <td
                colSpan={9}
                className="p-6 text-center text-slate-500"
              >
                No existen egresos registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Card>
  );
}

export default ExpensesPage;