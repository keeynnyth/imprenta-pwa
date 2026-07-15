
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  obtenerClientes,
  eliminarCliente,
  type Cliente,
} from "../../services/clientes.service";

function ClientsPage() {
  const navigate = useNavigate();

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarClientes();
  }, []);

  async function cargarClientes() {
    try {
      setCargando(true);

      const data = await obtenerClientes();
      setClientes(data);

    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  }

  async function eliminar(id: string) {
    const confirmar = window.confirm(
      "¿Está seguro que desea eliminar este cliente?"
    );

    if (!confirmar) return;

    try {
      await eliminarCliente(id);
      await cargarClientes();
    } catch (error) {
      console.error(error);
      alert("No fue posible eliminar el cliente.");
    }
  }

  const clientesFiltrados = clientes.filter((cliente) => {

    const texto = busqueda.toLowerCase();

    return (
      cliente.nombre.toLowerCase().includes(texto) ||
      (cliente.documento ?? "")
        .toLowerCase()
        .includes(texto) ||
      (cliente.telefono ?? "")
        .toLowerCase()
        .includes(texto)
    );

  });

  return (
    <div>

      <div className="mb-6 flex items-center justify-between">

        <h1 className="text-3xl font-bold text-slate-800">
          Clientes
        </h1>

        <button
          onClick={() => navigate("/clientes/nuevo")}
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
        >
          + Nuevo Cliente
        </button>

      </div>

      <div className="mb-5">

        <input
          type="text"
          placeholder="Buscar por nombre, documento o teléfono..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full rounded-lg border border-slate-300 p-3 focus:border-blue-500 focus:outline-none"
        />

      </div>

      <div className="mb-3 text-sm text-slate-500">

        Mostrando {clientesFiltrados.length} de {clientes.length} clientes

      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">

        <table className="min-w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="px-4 py-3 text-left">
                Nombre
              </th>

              <th className="px-4 py-3 text-left">
                Documento
              </th>

              <th className="px-4 py-3 text-left">
                Teléfono
              </th>

              <th className="px-4 py-3 text-center">
                Acciones
              </th>

            </tr>

          </thead>

          <tbody>

            {cargando ? (

              <tr>

                <td
                  colSpan={4}
                  className="p-6 text-center"
                >
                  Cargando clientes...
                </td>

              </tr>

            ) : clientes.length === 0 ? (

              <tr>

                <td
                  colSpan={4}
                  className="p-6 text-center text-slate-500"
                >
                  No hay clientes registrados.
                </td>

              </tr>

            ) : (

              clientesFiltrados.map((cliente) => (

                <tr
                  key={cliente.id}
                  className="border-t hover:bg-slate-50"
                >

                  <td className="px-4 py-3">
                    {cliente.nombre}
                  </td>

                  <td className="px-4 py-3">
                    {cliente.documento || "-"}
                  </td>

                  <td className="px-4 py-3">
                    {cliente.telefono || "-"}
                  </td>

                  <td className="space-x-2 px-4 py-3 text-center">

                    <button
                      onClick={() =>
                        navigate(`/clientes/${cliente.id}`)
                      }
                      className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() =>
                        eliminar(cliente.id)
                      }
                      className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                    >
                      Eliminar
                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default ClientsPage;