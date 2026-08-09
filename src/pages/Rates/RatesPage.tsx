
import { useEffect, useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import toast from "react-hot-toast";

import {
  obtenerTasas,
  actualizarTasas,
  actualizarTasasAutomaticamente,
  type Tasas,
} from "../../services/rates.service";

import { actualizarPreciosProductos } from "../../services/products.service";
import { useAuth } from "../../contexts/AuthContext";

function RatesPage() {
  const [tasas, setTasas] = useState<Tasas | null>(null);

  const [factor, setFactor] = useState("");

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [estadoProceso, setEstadoProceso] = useState("");

  const { usuario } = useAuth();

  const esAdmin = usuario?.rol === "admin";

  useEffect(() => {
    cargarTasas();
  }, []);

  async function cargarTasas() {
    try {
      setCargando(true);

      const data = await obtenerTasas();

      setTasas(data);
      setFactor(data.factor_binance.toString());
    } catch (error) {
      console.error("Error al actualizar tasas:", error);
      alert(JSON.stringify(error, null, 2));
      setError("No fue posible actualizar las tasas.");
    } finally {
      setCargando(false);
    }
  }

  async function recalcularCatalogo() {
    setEstadoProceso("Recalculando catálogo...");

    await actualizarPreciosProductos();

    setEstadoProceso("Actualizando tasas...");

    await cargarTasas();

    setEstadoProceso("");
  }

  async function guardarFactor() {
    if (!tasas) return;

    try {
      setGuardando(true);

      await actualizarTasas({
        ...tasas,
        factor_binance: Number(factor),
      });

      await recalcularCatalogo();

      toast.success(
        "Factor actualizado y catálogo recalculado."
      );
    } catch (error) {
      console.error(error);
      setError("No fue posible guardar el factor.");
    } finally {
      setGuardando(false);
    }
  }

  async function actualizarAhora() {
    try {
      setGuardando(true);

      await actualizarTasasAutomaticamente();

      await recalcularCatalogo();

      toast.success(
        "Tasas actualizadas y catálogo recalculado."
      );
    } catch (error) {
      console.error(error);
      setError("No fue posible actualizar las tasas.");
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-slate-500">
            Cargando tasas...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-2 sm:px-6 lg:px-8">

      {/* Encabezado */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Tasas
        </h1>

        <p className="mt-2 text-slate-500">
          Tasas utilizadas por todo el sistema.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* Tasas principales */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

        {/* BCV */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Tasa BCV
          </p>

          <p className="mt-3 text-3xl font-bold text-slate-800 sm:text-4xl">
            {tasas?.bcv.toFixed(4)}
          </p>

          <p className="mt-2 text-xs text-slate-400">
            Tasa oficial
          </p>
        </div>

        {/* Binance */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Binance
          </p>

          <p className="mt-3 text-3xl font-bold text-slate-800 sm:text-4xl">
            {tasas?.binance.toFixed(4)}
          </p>

          <p className="mt-2 text-xs text-slate-400">
            Referencia de mercado
          </p>
        </div>

        {/* Tasa efectiva */}
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-6 shadow-sm transition-shadow hover:shadow-md sm:col-span-2 lg:col-span-1">
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-700">
            Tasa de Trabajo
          </p>

          <p className="mt-3 text-3xl font-bold text-orange-800 sm:text-4xl">
            {tasas?.tasa_efectiva.toFixed(4)}
          </p>

          <p className="mt-2 text-xs text-orange-600">
            Binance × Factor Binance
          </p>
        </div>

      </div>

      {/* Configuración */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800">
            Configuración
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Parámetros utilizados para el cálculo de la tasa de trabajo.
          </p>
        </div>

        {esAdmin && (
          <div className="max-w-md">

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Factor Binance
            </label>

            <input
              type="number"
              step="0.0001"
              value={factor}
              onChange={(e) =>
                setFactor(e.target.value)
              }
              className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />

            <p className="mt-2 text-xs text-slate-500">
              Este valor se utiliza para calcular la tasa de trabajo.
            </p>

          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">

          <button
            type="button"
            onClick={actualizarAhora}
            disabled={guardando}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
          >
            <FiRefreshCw
              className={
                guardando
                  ? "animate-spin"
                  : ""
              }
              size={18}
            />

            {guardando
              ? "Actualizando..."
              : "Actualizar tasas"}
          </button>

          {esAdmin && (
            <button
              type="button"
              onClick={guardarFactor}
              disabled={guardando}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {guardando
                ? "Guardando..."
                : "Guardar factor"}
            </button>
          )}

        </div>

        {estadoProceso && (
          <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm font-medium text-slate-600">
            {estadoProceso}
          </div>
        )}

      </div>

      {/* Información */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="mb-5 text-xl font-bold text-slate-800">
          Información
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">

          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-500">
              Última actualización
            </p>

            <p className="mt-1 font-medium text-slate-800">
              {tasas &&
                new Date(
                  tasas.ultima_actualizacion
                ).toLocaleString()}
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-500">
              Origen
            </p>

            <p className="mt-1 font-medium text-slate-800">
              {tasas?.origen}
            </p>
          </div>

        </div>

        <div className="mt-5 rounded-lg border border-orange-100 bg-orange-50 p-4">
          <p className="text-sm leading-6 text-orange-800">
            Las tasas se actualizan automáticamente
            todos los días a las 09:00, 12:00, 14:00
            y 17:00.
          </p>
        </div>

      </div>

    </div>
  );
}

export default RatesPage;