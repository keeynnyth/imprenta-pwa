
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
    <div className="mx-auto max-w-3xl">

      <div className="mb-6 flex items-center justify-between">

        <h1 className="text-3xl font-bold text-slate-800">

          {editando ? "Editar Cliente" : "Nuevo Cliente"}

        </h1>

        <button
          onClick={() => navigate("/clientes")}
          className="rounded-lg bg-slate-600 px-4 py-2 text-white hover:bg-slate-700"
        >
          Volver
        </button>

      </div>

      <div className="rounded-xl bg-white p-6 shadow space-y-5">

        <div>

          <label className="mb-2 block font-medium">
            Nombre *
          </label>

          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full rounded-lg border p-3"
          />

        </div>

        <div className="grid grid-cols-2 gap-5">

          <div>

            <label className="mb-2 block font-medium">
              Teléfono
            </label>

            <input
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full rounded-lg border p-3"
            />

          </div>

          <div>

            <label className="mb-2 block font-medium">
              Documento
            </label>

            <input
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
              className="w-full rounded-lg border p-3"
            />

          </div>

        </div>

        <div>

          <label className="mb-2 block font-medium">
            Correo
          </label>

          <input
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full rounded-lg border p-3"
          />

        </div>

        <div>

          <label className="mb-2 block font-medium">
            Dirección
          </label>

          <textarea
            rows={2}
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            className="w-full rounded-lg border p-3"
          />

        </div>

        <div>

          <label className="mb-2 block font-medium">
            Observaciones
          </label>

          <textarea
            rows={4}
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            className="w-full rounded-lg border p-3"
          />

        </div>

        <div className="flex justify-end gap-3">

          <button
            onClick={() => navigate("/clientes")}
            className="rounded-lg bg-slate-300 px-5 py-3"
          >
            Cancelar
          </button>

          <button
            disabled={guardando}
            onClick={guardar}
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:bg-slate-400"
          >
            {guardando ? "Guardando..." : "Guardar"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default NewClientPage;