import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  obtenerMovimientos,
  eliminarMovimiento,
} from "../../services/movimientos.service";

import Card from "../../components/ui/Card";
import PageHeader from "../../components/ui/PageHeader";

import type { Movimiento } from "../../services/movimientos.service";

function IncomesPage() {
  const [ingresos, setIngresos] = useState<Movimiento[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    cargarIngresos();
  }, []);

  async function cargarIngresos() {
    try {
      const resultado =
        await obtenerMovimientos("Ingreso");

      setIngresos(resultado.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function formatearFecha(fecha: string) {
    return new Date(fecha).toLocaleDateString("es-AR");
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
    return (
      <div className="py-10 text-center text-slate-500">
        Cargando ingresos...
      </div>
    );
  }

  return (
    <Card>
      <PageHeader
        title="Ingresos"
        subtitle="Consulta los ingresos registrados."
        actions={
          <button
            type="button"
            onClick={() =>
              navigate("/ingresos/nuevo")
            }
            className="rounded-lg bg-green-600 px-5 py-2 font-semibold text-white transition hover:bg-green-700"
          >
            + Nuevo Ingreso
          </button>
        }
      />

      {ingresos.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
          No hay ingresos registrados.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-slate-100">
              <tr>
                <th className="border px-4 py-3 text-left text-sm font-semibold">
                  Fecha
                </th>

                <th className="border px-4 py-3 text-left text-sm font-semibold">
                  Categoría
                </th>

                <th className="border px-4 py-3 text-left text-sm font-semibold">
                  Concepto
                </th>

                <th className="border px-4 py-3 text-right text-sm font-semibold">
                  Monto
                </th>

                <th className="border px-4 py-3 text-right text-sm font-semibold">
                  Bs
                </th>

                <th className="border px-4 py-3 text-right text-sm font-semibold">
                  USD
                </th>

                <th className="border px-4 py-3 text-left text-sm font-semibold">
                  Método de pago
                </th>

                <th className="border px-4 py-3 text-center text-sm font-semibold">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {ingresos.map((ingreso) => (
                <tr
                  key={ingreso.id}
                  className="border-b transition hover:bg-green-50/40"
                >
                  <td className="border px-4 py-3">
                    {formatearFecha(
                      ingreso.fecha
                    )}
                  </td>

                  <td className="border px-4 py-3">
                    <span className="rounded bg-green-100 px-2 py-1 text-sm font-medium text-green-700">
                      {ingreso.categoria}
                    </span>
                  </td>

                  <td className="border px-4 py-3">
                    {ingreso.concepto}
                  </td>

                  <td className="border px-4 py-3 text-right font-medium">
                    {formatearMonto(
                      ingreso.monto_original,
                      ingreso.moneda
                    )}
                  </td>

                  <td className="border px-4 py-3 text-right font-medium text-green-700">
                    {formatearMonto(
                      ingreso.monto_bs,
                      "Bs"
                    )}
                  </td>

                  <td className="border px-4 py-3 text-right font-medium">
                    {formatearMonto(
                      ingreso.monto_usd,
                      "USD"
                    )}
                  </td>

                  <td className="border px-4 py-3">
                    {ingreso.metodo_pago}
                  </td>

                  <td className="border px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/ingresos/${ingreso.id}`
                          )
                        }
                        className="rounded-md bg-amber-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-amber-600"
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleEliminar(
                            ingreso.id!
                          )
                        }
                        className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-red-700"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

export default IncomesPage;