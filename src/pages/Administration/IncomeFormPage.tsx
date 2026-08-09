import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  actualizarMovimiento,
  crearMovimiento,
  obtenerMovimientoPorId,
} from "../../services/movimientos.service";

import { obtenerTasas } from "../../services/rates.service";

import type { Movimiento } from "../../services/movimientos.service";

function IncomeFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const editando = Boolean(id);

  const [form, setForm] = useState({
    fecha: new Date().toISOString().split("T")[0],
    categoria: "",
    concepto: "",
    referencia: "",
    monto_original: 0,
    moneda: "Bs" as "Bs" | "USD",
    tasa: 0,
    monto_bs: 0,
    monto_usd: 0,
    metodo_pago: "Transferencia",
    observaciones: "",
  });

  useEffect(() => {
    cargarTasa();

    if (id) {
      cargarMovimiento();
    }
  }, [id]);

  async function cargarTasa() {
    try {
      const tasas = await obtenerTasas();

      setForm((prev) => ({
        ...prev,
        tasa: tasas.tasa_efectiva,
      }));

      setForm((prev) => {
        const montos = calcularMontos(
          prev.moneda,
          prev.monto_original,
          tasas.tasa_efectiva
        );

        return {
          ...prev,
          tasa: tasas.tasa_efectiva,
          monto_bs: montos.monto_bs,
          monto_usd: montos.monto_usd,
        };
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function cargarMovimiento() {
    try {
      const movimiento =
        await obtenerMovimientoPorId(id!);

      setForm({
        fecha: movimiento.fecha,
        categoria: movimiento.categoria,
        concepto: movimiento.concepto,
        referencia: movimiento.referencia ?? "",
        monto_original: movimiento.monto_original,
        moneda: movimiento.moneda,
        tasa: movimiento.tasa,
        monto_bs: movimiento.monto_bs,
        monto_usd: movimiento.monto_usd,
        metodo_pago: movimiento.metodo_pago,
        observaciones:
          movimiento.observaciones ?? "",
      });
    } catch (error) {
      console.error(error);
      alert("No se pudo cargar el ingreso.");
    }
  }

  function calcularMontos(
    moneda: "Bs" | "USD",
    monto: number,
    tasa: number
  ) {
    if (tasa <= 0) {
      return {
        monto_bs: 0,
        monto_usd: 0,
      };
    }

    if (moneda === "Bs") {
      return {
        monto_bs: monto,
        monto_usd: Number(
          (monto / tasa).toFixed(2)
        ),
      };
    }

    return {
      monto_bs: Number(
        (monto * tasa).toFixed(2)
      ),
      monto_usd: monto,
    };
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
        HTMLSelectElement |
        HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    let nuevoFormulario = {
      ...form,
      [name]:
        name === "monto_original" ||
        name === "tasa"
          ? Number(value)
          : value,
    };

    if (
      name === "monto_original" ||
      name === "moneda" ||
      name === "tasa"
    ) {
      const montos = calcularMontos(
        nuevoFormulario.moneda,
        Number(
          nuevoFormulario.monto_original
        ),
        Number(nuevoFormulario.tasa)
      );

      nuevoFormulario = {
        ...nuevoFormulario,
        monto_bs: montos.monto_bs,
        monto_usd: montos.monto_usd,
      };
    }

    setForm(nuevoFormulario);
  };

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      const movimiento: Movimiento = {
        ...form,
        tipo: "Ingreso",
      };

      if (editando) {
        await actualizarMovimiento(
          id!,
          movimiento
        );
      } else {
        await crearMovimiento(movimiento);
      }

      navigate("/finanzas/movimientos", {
  replace: true,
});
    } catch (error) {
      console.error(error);
      alert("No fue posible guardar el ingreso.");
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl">

      {/* ENCABEZADO */}

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-green-600">
            Finanzas / Ingresos
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-800 sm:text-3xl">
            {editando
              ? "Editar Ingreso"
              : "Nuevo Ingreso"}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Registra el dinero recibido y sus
            equivalencias.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="self-start rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
        >
          ← Volver
        </button>
      </div>

      {/* FORMULARIO */}

      <form
        onSubmit={handleSubmit}
        className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
      >

        {/* DATOS DEL MOVIMIENTO */}

        <div className="border-b border-slate-200 p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-800">
              Datos del ingreso
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Información básica del movimiento.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">

            {/* FECHA */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Fecha
              </label>

              <input
                type="date"
                name="fecha"
                value={form.fecha}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

            {/* CATEGORÍA */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Categoría
              </label>

              <select
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              >
                <option value="">
                  Seleccione una categoría
                </option>

                <option value="Venta">
                  Venta
                </option>

                <option value="Anticipo">
                  Anticipo
                </option>

                <option value="Cobro pendiente">
                  Cobro pendiente
                </option>

                <option value="Otro ingreso">
                  Otro ingreso
                </option>
              </select>
            </div>

            {/* CONCEPTO */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Concepto
              </label>

              <input
                type="text"
                name="concepto"
                placeholder="Ej. Pago de cliente"
                value={form.concepto}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

            {/* REFERENCIA */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Referencia
                <span className="ml-1 font-normal text-slate-400">
                  (opcional)
                </span>
              </label>

              <input
                type="text"
                name="referencia"
                placeholder="Número de referencia"
                value={form.referencia}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

          </div>
        </div>

        {/* INFORMACIÓN MONETARIA */}

        <div className="border-b border-slate-200 p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-800">
              Información monetaria
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Ingresa el monto y la moneda del
              movimiento.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">

            {/* MONTO */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Monto original
              </label>

              <div className="grid grid-cols-[1fr_110px] gap-2">
                <input
                  type="number"
                  step="0.01"
                  name="monto_original"
                  placeholder="0.00"
                  value={form.monto_original}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />

                <select
                  name="moneda"
                  value={form.moneda}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                >
                  <option value="Bs">
                    Bs
                  </option>

                  <option value="USD">
                    USD
                  </option>
                </select>
              </div>
            </div>

            {/* TASA */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Tasa utilizada
              </label>

              <input
                type="number"
                step="0.0001"
                name="tasa"
                value={form.tasa}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />

              <p className="mt-1 text-xs text-slate-400">
                Tasa aplicada al cálculo del
                movimiento.
              </p>
            </div>

          </div>

          {/* EQUIVALENCIAS */}

          <div className="mt-5 grid gap-4 md:grid-cols-2">

            <div className="rounded-xl border border-green-100 bg-green-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                Equivalente en Bs
              </p>

              <p className="mt-2 text-xl font-bold text-green-700">
                Bs{" "}
                {Number(
                  form.monto_bs
                ).toLocaleString("es-VE", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                Equivalente en USD
              </p>

              <p className="mt-2 text-xl font-bold text-blue-700">
                USD{" "}
                {Number(
                  form.monto_usd
                ).toFixed(2)}
              </p>
            </div>

          </div>
        </div>

        {/* PAGO Y OBSERVACIONES */}

        <div className="p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-800">
              Detalles adicionales
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Completa la información del pago.
            </p>
          </div>

          <div className="space-y-5">

            {/* MÉTODO DE PAGO */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Método de pago
              </label>

              <select
                name="metodo_pago"
                value={form.metodo_pago}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              >
                <option value="Transferencia">
                  Transferencia
                </option>

                <option value="Pago móvil">
                  Pago móvil
                </option>

                <option value="Efectivo">
                  Efectivo
                </option>

                <option value="Zelle">
                  Zelle
                </option>

                <option value="Binance">
                  Binance
                </option>

                <option value="Otro">
                  Otro
                </option>
              </select>
            </div>

            {/* OBSERVACIONES */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Observaciones
              </label>

              <textarea
                name="observaciones"
                value={form.observaciones}
                onChange={handleChange}
                placeholder="Agrega cualquier información adicional..."
                rows={4}
                className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

          </div>

          {/* BOTONES */}

          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
            >
              {editando
                ? "Actualizar ingreso"
                : "Guardar ingreso"}
            </button>

          </div>
        </div>

      </form>
    </div>
  );
}

export default IncomeFormPage;