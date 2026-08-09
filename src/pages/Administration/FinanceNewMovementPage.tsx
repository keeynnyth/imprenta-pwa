import { useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import PageHeader from "../../components/ui/PageHeader";

export default function FinanceNewMovementPage() {
  const navigate = useNavigate();

  return (
    <Card>
      <PageHeader
        title="Nuevo Movimiento"
        subtitle="Selecciona el tipo de movimiento que deseas registrar."
      />

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {/* INGRESO */}

        <button
          type="button"
          onClick={() => navigate("/ingresos/nuevo")}
          className="group rounded-xl border border-green-200 bg-white p-6 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-green-400 hover:bg-green-50 hover:shadow-md"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 text-2xl">
              💰
            </div>

            <div className="min-w-0">
              <h2 className="text-lg font-bold text-slate-800 group-hover:text-green-700">
                Nuevo ingreso
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Registrar dinero recibido por ventas,
                anticipos, pagos pendientes u otros
                ingresos.
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-end">
            <span className="text-sm font-semibold text-green-600">
              Registrar ingreso →
            </span>
          </div>
        </button>

        {/* EGRESO */}

        <button
          type="button"
          onClick={() => navigate("/egresos/nuevo")}
          className="group rounded-xl border border-red-200 bg-white p-6 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-red-400 hover:bg-red-50 hover:shadow-md"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-100 text-2xl">
              💸
            </div>

            <div className="min-w-0">
              <h2 className="text-lg font-bold text-slate-800 group-hover:text-red-700">
                Nuevo egreso
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Registrar pagos a proveedores,
                impuestos, servicios y cualquier otro
                gasto.
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-end">
            <span className="text-sm font-semibold text-red-600">
              Registrar egreso →
            </span>
          </div>
        </button>
      </div>

      <div className="mt-6 flex justify-start">
        <button
          type="button"
          onClick={() =>
            navigate("/finanzas/movimientos")
          }
          className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          ← Volver a movimientos
        </button>
      </div>
    </Card>
  );
}