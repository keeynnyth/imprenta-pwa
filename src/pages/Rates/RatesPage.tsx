import { useEffect, useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import toast from "react-hot-toast";
import {
  obtenerTasas,
  actualizarTasas,
  actualizarTasasAutomaticamente,
  type Tasas,
} from "../../services/rates.service";

function RatesPage() {
  const [tasas, setTasas] = useState<Tasas | null>(null);

  const [factor, setFactor] = useState("");

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

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

  async function guardarFactor() {
    if (!tasas) return;

    try {
      setGuardando(true);

      await actualizarTasas({
        ...tasas,
        factor_binance: Number(factor),
      });

      await cargarTasas();

      alert("Factor actualizado correctamente.");
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

    await cargarTasas();

    toast.success("Tasas actualizadas correctamente.");
  } catch (error) {
    console.error(error);
    setError("No fue posible actualizar las tasas.");
  } finally {
    setGuardando(false);
  }
}

  if (cargando) {
    return <div className="p-8">Cargando tasas...</div>;
  }

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Tasas
        </h1>

        <p className="mt-2 text-slate-500">
          Tasas utilizadas por todo el sistema.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">
            Tasa BCV
          </p>

          <p className="mt-3 text-4xl font-bold text-slate-800">
            {tasas?.bcv.toFixed(4)}
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">
            Binance
          </p>

          <p className="mt-3 text-4xl font-bold text-slate-800">
            {tasas?.binance.toFixed(4)}
          </p>
        </div>

      </div>

      <div className="rounded-xl bg-white p-6 shadow">

        <h2 className="mb-5 text-lg font-semibold">
          Configuración
        </h2>

        <label className="mb-2 block font-medium">
          Factor Binance
        </label>

        <input
          type="number"
          step="0.01"
          value={factor}
          onChange={(e) => setFactor(e.target.value)}
          className="w-full rounded-lg border border-slate-300 p-3"
        />

        <div className="mt-6 flex justify-end">

        <button
  onClick={actualizarAhora}
  disabled={guardando}
  className="mr-3 flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2 text-white hover:bg-emerald-700 disabled:bg-emerald-300"
>
  <FiRefreshCw
    className={guardando ? "animate-spin" : ""}
    size={18}
  />

  {guardando ? "Actualizando..." : "Actualizar tasas"}
</button>

          <button
            onClick={guardarFactor}
            disabled={guardando}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:bg-blue-300"
          >
            {guardando
              ? "Guardando..."
              : "Guardar factor"}
          </button>

        </div>

      </div>

      <div className="rounded-xl bg-white p-6 shadow">

        <h2 className="mb-4 text-lg font-semibold">
          Información
        </h2>

        <p>
          <strong>Última actualización:</strong>{" "}
          {tasas &&
            new Date(
              tasas.ultima_actualizacion
            ).toLocaleString()}
        </p>

        <p className="mt-2">
          <strong>Origen:</strong> {tasas?.origen}
        </p>

        <p className="mt-5 text-sm text-slate-500">
          Las tasas se actualizan automáticamente
          todos los días a las 09:00, 12:00, 14:00
          y 17:00.
        </p>

      </div>

    </div>
  );
}

export default RatesPage;