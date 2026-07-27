
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
      monto_usd: Number((monto / tasa).toFixed(2)),
    };
  }

  return {
    monto_bs: Number((monto * tasa).toFixed(2)),
    monto_usd: monto,
  };
}

async function cargarEgreso() {
  try {
    const egreso = await obtenerMovimientoPorId(id!);

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
      observaciones: egreso.observaciones ?? "",
    });
  } catch (error) {
    console.error(error);
    alert("No se pudo cargar el egreso.");
  }
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
      await actualizarMovimiento(id!, movimiento);
    } else {
      await crearMovimiento(movimiento);
    }

    navigate("/egresos", {
      replace: true,
    });
  } catch (error) {
    console.error(error);
    alert("No fue posible guardar el egreso.");
  }
};

  return (
    <div className="max-w-3xl p-6">
      <h1 className="mb-6 text-2xl font-bold">
        {editando ? "Editar Egreso" : "Nuevo Egreso"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
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
>
  <option value="">Seleccione una categoría</option>

  <option value="Materiales">Materiales</option>
  <option value="Servicios">Servicios</option>
  <option value="Equipos">Equipos</option>
  <option value="Nómina">Nómina</option>
  <option value="Impuestos">Impuestos</option>
  <option value="Alquiler">Alquiler</option>
  <option value="Transporte">Transporte</option>
  <option value="Publicidad">Publicidad</option>
  <option value="Mantenimiento">Mantenimiento</option>
  <option value="Otros">Otros</option>
</select>

        <input
          type="text"
          name="concepto"
          placeholder="Concepto"
          value={form.concepto}
          onChange={handleChange}
          className="w-full rounded border p-2"
        />

        <input
  type="number"
  step="0.01"
  name="monto_original"
  placeholder="Monto"
  value={form.monto_original}
  onChange={handleChange}
  className="w-full rounded border p-2"
/>

        <select
          name="moneda"
          value={form.moneda}
          onChange={handleChange}
          className="w-full rounded border p-2"
        >
          <option>Bs</option>
          <option>USD</option>
        </select>
        <label className="block font-medium">
  Tasa del proveedor
</label>

<input
  type="number"
  step="0.0001"
  name="tasa"
  value={form.tasa}
  onChange={handleChange}
  className="w-full rounded border p-2"
/>

<button
  type="button"
  onClick={async () => {
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
  }}
  className="text-sm text-blue-600 hover:underline"
>
  Usar tasa de trabajo
</button>
<div className="rounded bg-slate-100 p-3 text-sm">
  <p>
    Equivalente Bs:
    <strong>{form.monto_bs.toFixed(2)}</strong>
  </p>

  <p>
    Equivalente USD:
    <strong>{form.monto_usd.toFixed(2)}</strong>
  </p>
</div>

        <select
          name="metodo_pago"
          value={form.metodo_pago}
          onChange={handleChange}
          className="w-full rounded border p-2"
        >
          <option>Transferencia</option>
          <option>Efectivo</option>
          <option>Zelle</option>
          <option>Pago Móvil</option>
        </select>

        <textarea
          name="observaciones"
          placeholder="Observaciones"
          value={form.observaciones}
          onChange={handleChange}
          rows={4}
          className="w-full rounded border p-2"
        />

        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          {editando ? "Actualizar egreso" : "Guardar egreso"}
        </button>
      </form>
    </div>
  );
}

export default ExpenseFormPage;