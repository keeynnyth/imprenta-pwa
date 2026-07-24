import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  actualizarIngreso,
  crearIngreso,
  obtenerIngresoPorId,
} from "../../services/incomes.service";

function IncomeFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const editando = Boolean(id);

  const [form, setForm] = useState({
    fecha: new Date().toISOString().split("T")[0],
    concepto: "",
    monto: 0,
    moneda: "Bs",
    metodo_pago: "Transferencia",
    observaciones: "",
  });

  useEffect(() => {
    if (id) {
      cargarIngreso();
    }
  }, [id]);

  async function cargarIngreso() {
    try {
      const ingreso = await obtenerIngresoPorId(id!);

      setForm({
        fecha: ingreso.fecha,
        concepto: ingreso.concepto,
        monto: ingreso.monto,
        moneda: ingreso.moneda,
        metodo_pago: ingreso.metodo_pago,
        observaciones: ingreso.observaciones ?? "",
      });
    } catch (error) {
      console.error(error);
      alert("No se pudo cargar el ingreso.");
    }
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.name === "monto"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
     if (editando) {
  await actualizarIngreso(id!, form);
} else {
  await crearIngreso(form);
}

navigate("/ingresos", { replace: true });
    } catch (error) {
  console.error(error);
  alert("No fue posible guardar el ingreso.");
}
  };

  return (
    <div className="max-w-3xl p-6">
      <h1 className="mb-6 text-2xl font-bold">
        {editando ? "Editar Ingreso" : "Nuevo Ingreso"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="date"
          name="fecha"
          value={form.fecha}
          onChange={handleChange}
          className="w-full rounded border p-2"
        />

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
          name="monto"
          placeholder="Monto"
          value={form.monto}
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
          {editando ? "Actualizar ingreso" : "Guardar ingreso"}
        </button>
      </form>
    </div>
  );
}

export default IncomeFormPage;