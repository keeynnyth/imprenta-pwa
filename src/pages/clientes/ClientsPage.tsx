
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  obtenerClientes,
  obtenerClienteConHistorial,
  eliminarCliente,
  type Cliente,
} from "../../services/clientes.service";

function ClientsPage() {
  const navigate = useNavigate();

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [clienteExpandido, setClienteExpandido] =
  useState<string | null>(null);
  const [historialCliente, setHistorialCliente] =
  useState<any>(null);
  

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

  async function verHistorial(id: string) {

  if (clienteExpandido === id) {
    setClienteExpandido(null);
    return;
  }

  try {

    const data =
      await obtenerClienteConHistorial(id);

    setHistorialCliente(data);

    setClienteExpandido(id);

  } catch (error) {

    console.error(error);

    alert("No fue posible cargar el historial.");

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

  <>

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
  verHistorial(cliente.id)
}
          className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
        >
          {clienteExpandido === cliente.id
            ? "Ocultar"
            : "Historial"}
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

    {clienteExpandido === cliente.id && (

      <tr>

        <td
          colSpan={4}
          className="bg-slate-50 p-6"
        >

          <div className="rounded-lg border bg-white p-4">

            <h3 className="mb-2 text-lg font-semibold">
              Historial de {cliente.nombre}
            </h3>

      <div className="grid gap-6 lg:grid-cols-3">

  <div className="rounded-lg border bg-slate-50 p-4">

    <h4 className="mb-4 text-lg font-semibold">
      Datos del cliente
    </h4>

    <div className="space-y-2 text-sm">

      <p>
        <span className="font-semibold">Documento:</span>{" "}
        {historialCliente.documento || "-"}
      </p>

      <p>
        <span className="font-semibold">Teléfono:</span>{" "}
        {historialCliente.telefono || "-"}
      </p>

      <p>
        <span className="font-semibold">Correo:</span>{" "}
        {historialCliente.correo || "-"}
      </p>

      <p>
        <span className="font-semibold">Dirección:</span>{" "}
        {historialCliente.direccion || "-"}
      </p>

      <p>
        <span className="font-semibold">Observaciones:</span>{" "}
        {historialCliente.observaciones || "-"}
      </p>

    </div>

  </div>

  <div className="lg:col-span-2 space-y-6">

    <div>

      <h4 className="mb-3 text-lg font-semibold">
        Cotizaciones
      </h4>

      <div className="overflow-x-auto rounded-lg border">

        <table className="min-w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="px-3 py-2 text-left">
                Número
              </th>

              <th className="px-3 py-2 text-left">
                Fecha
              </th>

              <th className="px-3 py-2 text-left">
                Estado
              </th>

              <th className="px-3 py-2 text-right">
                Total
              </th>

              <th className="px-3 py-2 text-center">
                Acción
              </th>

            </tr>

          </thead>

          <tbody>

            {historialCliente.cotizaciones.length === 0 ? (

              <tr>

                <td
                  colSpan={5}
                  className="p-4 text-center text-slate-500"
                >
                  No existen cotizaciones.
                </td>

              </tr>

            ) : (

              historialCliente.cotizaciones.map((cotizacion: any) => (

                <tr
                  key={cotizacion.id}
                  className="border-t"
                >

                  <td className="px-3 py-2">
                    {cotizacion.numero}
                  </td>

                  <td className="px-3 py-2">
                    {new Date(cotizacion.created_at).toLocaleDateString()}
                  </td>

                  <td className="px-3 py-2">
                    {cotizacion.estado}
                  </td>

                  <td className="px-3 py-2 text-right">
                    Bs {cotizacion.total_bs.toFixed(2)}
                  </td>

                  <td className="px-3 py-2 text-center">

                    <button
                      onClick={() =>
                        navigate(`/cotizaciones/${cotizacion.id}`)
                      }
                      className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
                    >
                      Ver
                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>

    <div>

      <h4 className="mb-3 text-lg font-semibold">
        Órdenes de trabajo
      </h4>

      <div className="overflow-x-auto rounded-lg border">

        <table className="min-w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="px-3 py-2 text-left">
                Número
              </th>

              <th className="px-3 py-2 text-left">
                Fecha
              </th>

              <th className="px-3 py-2 text-left">
                Estado
              </th>

              <th className="px-3 py-2 text-right">
                Total
              </th>

              <th className="px-3 py-2 text-center">
                Acción
              </th>

            </tr>

          </thead>

          <tbody>

            {historialCliente.ordenes_trabajo.length === 0 ? (

              <tr>

                <td
                  colSpan={5}
                  className="p-4 text-center text-slate-500"
                >
                  No existen órdenes.
                </td>

              </tr>

            ) : (

              historialCliente.ordenes_trabajo.map((orden: any) => (

                <tr
                  key={orden.id}
                  className="border-t"
                >

                  <td className="px-3 py-2">
                    OT-{orden.numero}
                  </td>

                  <td className="px-3 py-2">
                    {new Date(orden.fecha_creacion).toLocaleDateString()}
                  </td>

                  <td className="px-3 py-2">
                    {orden.estado}
                  </td>

                  <td className="px-3 py-2 text-right">
                    Bs {Number(orden.total).toFixed(2)}
                  </td>

                  <td className="px-3 py-2 text-center">

                   <button
  onClick={() =>
    navigate(`/ordenes-trabajo/${orden.id}`)
  }
  className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
>
  Ver
</button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>

  </div>

</div>

          </div>

        </td>

      </tr>

    )}

  </>

))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default ClientsPage;