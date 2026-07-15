
import { useEffect, useState } from "react";

import {
  obtenerTasas,
  actualizarTasas,
  type Tasas,
} from "../../services/rates.service";

function RatesPage() {
  const [tasas, setTasas] = useState<Tasas | null>(null);

  const [bcv, setBcv] = useState("");
  const [binance, setBinance] = useState("");
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

      setBcv(data.bcv.toString());
      setBinance(data.binance.toString());
      setFactor(data.factor_binance.toString());
    } catch (error) {
      console.error(error);
      setError("No fue posible cargar las tasas.");
    } finally {
      setCargando(false);
    }
  }

  async function guardar(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!tasas) return;

    setError("");

    try {
      setGuardando(true);

      await actualizarTasas({
        ...tasas,
        bcv: Number(bcv),
        binance: Number(binance),
        factor_binance: Number(factor),
      });

      alert("Tasas actualizadas correctamente.");

      await cargarTasas();
    } catch (error) {
      console.error(error);
      setError("No fue posible guardar las tasas.");
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) {
    return (
      <div className="p-8">
        Cargando tasas...
      </div>
    );
  }

  return (
    <div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800">
          Tasas
        </h1>

        <p className="mt-2 text-slate-500">
          Configuración de tasas utilizadas por el sistema.
        </p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <form
          className="space-y-5"
          onSubmit={guardar}
        >

          <div>

            <label className="mb-2 block font-medium">
              BCV
            </label>

            <input
              type="number"
              step="0.0001"
              value={bcv}
              onChange={(e) => setBcv(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-3"
            />

          </div>

          <div>

            <label className="mb-2 block font-medium">
              Binance
            </label>

            <input
              type="number"
              step="0.0001"
              value={binance}
              onChange={(e) => setBinance(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-3"
            />

          </div>

          <div>

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

          </div>

          <div className="flex justify-end">

            <button
              type="submit"
              disabled={guardando}
              className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:bg-blue-300"
            >
              {guardando ? "Guardando..." : "Guardar"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default RatesPage;