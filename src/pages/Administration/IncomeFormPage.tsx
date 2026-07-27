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
      const movimiento = await obtenerMovimientoPorId(id!);

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

        observaciones: movimiento.observaciones ?? "",
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
){
    if (tasa <= 0) {
      return {
        monto_bs: 0,
        monto_usd: 0,
      };
    }

    if (moneda === "Bs") {
      return {
        monto_bs: monto,
        monto_usd: Number((monto / tasa).toFixed(2)),
      };
    }

    return {
      monto_bs: Number((monto * tasa).toFixed(2)),
      monto_usd: monto,
    };
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    let nuevoFormulario = {
      ...form,
      [name]:
        name === "monto_original" || name === "tasa"
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
        Number(nuevoFormulario.monto_original),
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
        await actualizarMovimiento(id!, movimiento);
      } else {
        await crearMovimiento(movimiento);
      }

      navigate("/ingresos", {
        replace: true,
      });
    } catch (error) {
      console.error(error);
      alert("No fue posible guardar el ingreso.");
    }
  }

    return (
    <div className="max-w-3xl p-6">
      <h1 className="mb-6 text-2xl font-bold">
        {editando ? "Editar Ingreso" : "Nuevo Ingreso"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <input
          type="date"
          name="fecha"
          value={form.fecha}
          onChange={handleChange}
          className="w-full rounded border p-2"
        />

        <select
          name="categoria"
          value={form.categoria}
          onChange={handleChange}
          className="w-full rounded border p-2"
          required
        >
          <option value="">Seleccione una categoría</option>

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

        <input
          type="text"
          name="concepto"
          placeholder="Concepto"
          value={form.concepto}
          onChange={handleChange}
          className="w-full rounded border p-2"
          required
        />

        <input
          type="text"
          name="referencia"
          placeholder="Referencia (opcional)"
          value={form.referencia}
          onChange={handleChange}
          className="w-full rounded border p-2"
        />

        <div className="grid grid-cols-2 gap-4">

          <input
            type="number"
            step="0.01"
            name="monto_original"
            placeholder="Monto"
            value={form.monto_original}
            onChange={handleChange}
            className="rounded border p-2"
            required
          />

          <select
            name="moneda"
            value={form.moneda}
            onChange={handleChange}
            className="rounded border p-2"
          >
            <option value="Bs">
              Bs
            </option>

            <option value="USD">
              USD
            </option>
          </select>

        </div>

        <input
          type="number"
          step="0.0001"
          name="tasa"
          placeholder="Tasa utilizada"
          value={form.tasa}
          onChange={handleChange}
          className="w-full rounded border p-2"
          required
        />

                <div className="grid grid-cols-2 gap-4">

          <div>
            <label className="mb-1 block text-sm font-medium">
              Equivalente en Bs
            </label>

            <input
              type="number"
              value={form.monto_bs}
              readOnly
              className="w-full rounded border bg-gray-100 p-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Equivalente en USD
            </label>

            <input
              type="number"
              value={form.monto_usd}
              readOnly
              className="w-full rounded border bg-gray-100 p-2"
            />
          </div>

        </div>

        <select
          name="metodo_pago"
          value={form.metodo_pago}
          onChange={handleChange}
          className="w-full rounded border p-2"
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

        <textarea
          name="observaciones"
          value={form.observaciones}
          onChange={handleChange}
          placeholder="Observaciones"
          rows={4}
          className="w-full rounded border p-2"
        />

        <div className="flex justify-end gap-3">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            {editando
              ? "Actualizar ingreso"
              : "Guardar ingreso"}
          </button>

        </div>

      </form>
    </div>
  );
  }

export default IncomeFormPage;