import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  crearCliente,
  actualizarCliente,
  obtenerCliente,
} from "../../services/clientes.service";

function NewClientPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const editando = Boolean(id);

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [documento, setDocumento] = useState("");
  const [correo, setCorreo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (editando && id) {
      cargarCliente(id);
    }
  }, []);

  async function cargarCliente(id: string) {
    try {
      const cliente = await obtenerCliente(id);

      setNombre(cliente.nombre);
      setTelefono(cliente.telefono ?? "");
      setDocumento(cliente.documento ?? "");
      setCorreo(cliente.correo ?? "");
      setDireccion(cliente.direccion ?? "");
      setObservaciones(cliente.observaciones ?? "");
    } catch (error) {
      console.error(error);
      alert("No fue posible cargar el cliente.");
    }
  }

  async function guardar() {
    if (!nombre.trim()) {
      alert("Debe ingresar el nombre.");
      return;
    }

    try {
      setGuardando(true);

      if (editando && id) {
        await actualizarCliente({
          id,
          nombre,
          telefono,
          documento,
          correo,
          direccion,
          observaciones,
          created_at: "",
        });
      } else {
        await crearCliente({
          nombre,
          telefono,
          documento,
          correo,
          direccion,
          observaciones,
        });
      }

      navigate("/clientes");
    } catch (error) {
      console.error(error);
      alert("No fue posible guardar el cliente.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="w-full">

      {/* Encabezado */}
      <div className="mb-5 flex items-center justify-between gap-3">

        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
          {editando ? "Editar Cliente" : "Nuevo Cliente"}
        </h1>

        <button
          type="button"
          onClick={() => navigate("/clientes")}
          className="shrink-0 rounded-lg bg-slate-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Volver
        </button>

      </div>

      {/* Formulario */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">

        <div className="space-y-5">

          {/* Nombre */}
          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Nombre *
            </label>

            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre completo o razón social"
              className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>

          {/* Teléfono + Documento */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Teléfono
              </label>

              <input
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="Ej: 0414-1234567"
                className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Documento
              </label>

              <input
                value={documento}
                onChange={(e) => setDocumento(e.target.value)}
                placeholder="Ej: V-12345678"
                className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

          </div>

          {/* Correo */}
          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Correo
            </label>

            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="correo@ejemplo.com"
              className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>

          {/* Dirección */}
          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Dirección
            </label>

            <textarea
              rows={3}
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Dirección del cliente"
              className="w-full resize-none rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>

          {/* Observaciones */}
          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Observaciones
            </label>

            <textarea
              rows={4}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Información adicional del cliente..."
              className="w-full resize-none rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>

          {/* Acciones */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() => navigate("/clientes")}
              className="w-full rounded-lg bg-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-300 sm:w-auto"
            >
              Cancelar
            </button>

            <button
              type="button"
              disabled={guardando}
              onClick={guardar}
              className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400 sm:w-auto"
            >
              {guardando ? "Guardando..." : "Guardar"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default NewClientPage;