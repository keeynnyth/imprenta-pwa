
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { Movimiento } from "../../services/movimientos.service";

import {
  actualizarMovimiento,
  crearMovimiento,
  obtenerMovimientoPorId,
} from "../../services/movimientos.service";

import { obtenerTasas } from "../../services/rates.service";

function ExpenseFormPage() {
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
      cargarEgreso();
    }
  }, [id]);

  async function cargarTasa() {
    try {
      const tasas = await obtenerTasas();

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

  async function cargarEgreso() {
    try {
      const egreso =
        await obtenerMovimientoPorId(id!);

      setForm({
        fecha: egreso.fecha,
        categoria: egreso.categoria,
        concepto: egreso.concepto,
        referencia: egreso.referencia ?? "",
        monto_original: egreso.monto_original,
        moneda: egreso.moneda,
        tasa: egreso.tasa,
        monto_bs: egreso.monto_bs,
        monto_usd: egreso.monto_usd,
        metodo_pago: egreso.metodo_pago,
        observaciones:
          egreso.observaciones ?? "",
      });
    } catch (error) {
      console.error(error);
      alert("No se pudo cargar el egreso.");
    }
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

  async function usarTasaDeTrabajo() {
    try {
      const tasas = await obtenerTasas();

      const montos = calcularMontos(
        form.moneda,
        form.monto_original,
        tasas.tasa_efectiva
      );

      setForm({
        ...form,
        tasa: tasas.tasa_efectiva,
        monto_bs: montos.monto_bs,
        monto_usd: montos.monto_usd,
      });
    } catch (error) {
      console.error(error);
      alert(
        "No fue posible obtener la tasa de trabajo."
      );
    }
  }

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const movimiento: Movimiento = {
        ...form,
        tipo: "Egreso",
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
      alert("No fue posible guardar el egreso.");
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl">

      {/* ENCABEZADO */}

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-red-600">
            Finanzas / Egresos
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-800 sm:text-3xl">
            {editando
              ? "Editar Egreso"
              : "Nuevo Egreso"}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Registra un pago o salida de dinero y
            sus equivalencias.
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

        {/* DATOS DEL EGRESO */}

        <div className="border-b border-slate-200 p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-800">
              Datos del egreso
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
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
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
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
              >
                <option value="">
                  Seleccione una categoría
                </option>

                <option value="Alquiler">
                  Alquiler
                </option>

                <option value="Impuestos">
                  Impuestos
                </option>

                <option value="Proveedores">
                  Proveedores
                </option>

                <option value="Servicios">
                  Servicios
                </option>

                <option value="Otro egreso">
                  Otro egreso
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
                placeholder="Ej. Pago a proveedor"
                value={form.concepto}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
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
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
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
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                />

                <select
                  name="moneda"
                  value={form.moneda}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
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
                Tasa del proveedor
              </label>

              <input
                type="number"
                step="0.0001"
                name="tasa"
                value={form.tasa}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />

              <button
                type="button"
                onClick={usarTasaDeTrabajo}
                className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
              >
                Usar tasa de trabajo
              </button>
            </div>

          </div>

          {/* EQUIVALENCIAS */}

          <div className="mt-5 grid gap-4 md:grid-cols-2">

            <div className="rounded-xl border border-red-100 bg-red-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-red-700">
                Equivalente en Bs
              </p>

              <p className="mt-2 text-xl font-bold text-red-700">
                Bs{" "}
                {Number(
                  form.monto_bs
                ).toLocaleString("es-VE", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>

            <div className="rounded-xl border border-orange-100 bg-orange-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">
                Equivalente en USD
              </p>

              <p className="mt-2 text-xl font-bold text-orange-700">
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
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
              >
                <option value="Transferencia">
                  Transferencia
                </option>

                <option value="Efectivo">
                  Efectivo
                </option>

                <option value="Zelle">
                  Zelle
                </option>

                <option value="Pago Móvil">
                  Pago Móvil
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
                placeholder="Agrega cualquier información adicional..."
                value={form.observaciones}
                onChange={handleChange}
                rows={4}
                className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
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
              className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
            >
              {editando
                ? "Actualizar egreso"
                : "Guardar egreso"}
            </button>

          </div>
        </div>

      </form>
    </div>
  );
}

export default ExpenseFormPage;