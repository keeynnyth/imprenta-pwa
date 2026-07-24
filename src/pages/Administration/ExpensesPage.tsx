
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import PageHeader from "../../components/ui/PageHeader";
import type { Expense } from "../../services/expenses.service";

import {
  eliminarEgreso,
  obtenerEgresos,
} from "../../services/expenses.service";

function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  async function cargarEgresos() {
    const data = await obtenerEgresos();
    setExpenses(data);
  }

  useEffect(() => {
    cargarEgresos();
  }, []);

  async function handleDelete(id: string) {
    const confirmar = window.confirm(
      "¿Desea eliminar este egreso?"
    );

    if (!confirmar) return;

    await eliminarEgreso(id);
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
            <th className="border p-2">Concepto</th>
            <th className="border p-2">Monto</th>
            <th className="border p-2">Moneda</th>
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

              <td className="border p-2">
                {expense.concepto}
              </td>

              <td className="border p-2">
  {expense.monto}
</td>

              <td className="border p-2">
                {expense.moneda}
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
                colSpan={6}
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