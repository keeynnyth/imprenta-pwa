import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  obtenerClientes,
  obtenerClienteConHistorial,
  eliminarCliente,
  type Cliente,
} from "../../services/clientes.service";

import Pagination from "../../components/ui/Pagination";
import SearchInput from "../../components/ui/SearchInput";
import DataTable from "../../components/ui/DataTable";
import PrimaryButton from "../../components/ui/PrimaryButton";

function ClientsPage() {
  const navigate = useNavigate();

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const PAGE_SIZE = 30;

  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  const [clienteExpandido, setClienteExpandido] =
    useState<string | null>(null);

  const [historialCliente, setHistorialCliente] =
    useState<any>(null);

  useEffect(() => {
    cargarClientes();
  }, [page]);

  async function cargarClientes() {
    try {
      setCargando(true);

      const resultado = await obtenerClientes(
        page,
        PAGE_SIZE
      );

      setClientes(resultado.data);
      setTotal(resultado.total);
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
      const data = await obtenerClienteConHistorial(id);

      setHistorialCliente(data);
      setClienteExpandido(id);
    } catch (error) {
      console.error(error);
      alert("No fue posible cargar el historial.");
    }
  }

  const clientesFiltrados = clientes.filter((cliente) => {
    const texto = busqueda.toLowerCase().trim();

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

  const inicio = (page - 1) * PAGE_SIZE + 1;

  const fin = Math.min(
    page * PAGE_SIZE,
    total
  );

  return (
    <DataTable
      title="Clientes"
      action={
        <PrimaryButton
          onClick={() => navigate("/clientes/nuevo")}
        >
          + Nuevo Cliente
        </PrimaryButton>
      }
      search={
        <SearchInput
          value={busqueda}
          onChange={setBusqueda}
          placeholder="Buscar por nombre, documento o teléfono..."
        />
      }
      info={
        <div className="text-sm font-medium text-slate-500">
          Mostrando {total === 0 ? 0 : inicio}-{fin} de{" "}
          {total} clientes
        </div>
      }
      pagination={
        <Pagination
          page={page}
          total={total}
          pageSize={PAGE_SIZE}
          onPrevious={() =>
            setPage((p) => Math.max(1, p - 1))
          }
          onNext={() =>
            setPage((p) => p + 1)
          }
        />
      }
      mobileContent={
        <>
          {cargando ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
              Cargando clientes...
            </div>
          ) : clientesFiltrados.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
              No se encontraron clientes.
            </div>
          ) : (
            clientesFiltrados.map((cliente) => (
              <div key={cliente.id} className="space-y-2">

                {/* Tarjeta del cliente */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

                  <div className="border-b border-slate-100 pb-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Cliente
                    </p>

                    <p className="mt-1 break-words text-base font-semibold text-slate-800">
                      {cliente.nombre}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 py-4">

                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs font-medium text-slate-500">
                        Documento
                      </p>

                      <p className="mt-1 font-medium text-slate-800">
                        {cliente.documento || "-"}
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs font-medium text-slate-500">
                        Teléfono
                      </p>

                      <p className="mt-1 font-medium text-slate-800">
                        {cliente.telefono || "-"}
                      </p>
                    </div>

                  </div>

                  {/* Acciones */}
                  <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3">

                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/clientes/${cliente.id}`)
                      }
                      className="rounded-lg bg-amber-500 px-2 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        verHistorial(cliente.id)
                      }
                      className="rounded-lg bg-blue-600 px-2 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      {clienteExpandido === cliente.id
                        ? "Ocultar"
                        : "Historial"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        eliminar(cliente.id)
                      }
                      className="rounded-lg bg-red-600 px-2 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                    >
                      Eliminar
                    </button>

                  </div>
                </div>

                {/* Historial móvil */}
                {clienteExpandido === cliente.id &&
                  historialCliente && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">

                      <h3 className="mb-4 text-lg font-semibold text-slate-800">
                        Historial de {cliente.nombre}
                      </h3>

                      {/* Datos del cliente */}
                      <div className="rounded-xl border border-slate-200 bg-white p-4">

                        <h4 className="mb-4 font-semibold text-slate-800">
                          Datos del cliente
                        </h4>

                        <div className="space-y-2 text-sm text-slate-600">

                          <p>
                            <strong>Documento:</strong>{" "}
                            {historialCliente.documento || "-"}
                          </p>

                          <p>
                            <strong>Teléfono:</strong>{" "}
                            {historialCliente.telefono || "-"}
                          </p>

                          <p>
                            <strong>Correo:</strong>{" "}
                            {historialCliente.correo || "-"}
                          </p>

                          <p>
                            <strong>Dirección:</strong>{" "}
                            {historialCliente.direccion || "-"}
                          </p>

                          <p>
                            <strong>Observaciones:</strong>{" "}
                            {historialCliente.observaciones || "-"}
                          </p>

                        </div>
                      </div>

                      {/* Cotizaciones */}
                      <div className="mt-5">

                        <h4 className="mb-3 text-lg font-semibold text-slate-800">
                          Cotizaciones
                        </h4>

                        {historialCliente.cotizaciones?.length ? (
                          <div className="space-y-3">
                            {historialCliente.cotizaciones.map(
                              (cotizacion: any) => (
                                <div
                                  key={cotizacion.id}
                                  className="rounded-xl border border-slate-200 bg-white p-4"
                                >
                                  <div className="flex items-start justify-between gap-3">

                                    <div>
                                      <p className="text-xs text-slate-500">
                                        Número
                                      </p>

                                      <p className="font-semibold text-slate-800">
                                        {cotizacion.numero}
                                      </p>
                                    </div>

                                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                                      {cotizacion.estado}
                                    </span>

                                  </div>

                                  <div className="mt-3 grid grid-cols-2 gap-3">

                                    <div>
                                      <p className="text-xs text-slate-500">
                                        Fecha
                                      </p>

                                      <p className="text-sm text-slate-700">
                                        {new Date(
                                          cotizacion.created_at
                                        ).toLocaleDateString()}
                                      </p>
                                    </div>

                                    <div>
                                      <p className="text-xs text-slate-500">
                                        Total
                                      </p>

                                      <p className="text-sm font-semibold text-slate-700">
                                        Bs{" "}
                                        {Number(
                                          cotizacion.total_bs
                                        ).toFixed(2)}
                                      </p>
                                    </div>

                                  </div>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      navigate(
                                        `/cotizaciones/${cotizacion.id}`
                                      )
                                    }
                                    className="mt-4 w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                                  >
                                    Ver cotización
                                  </button>
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <div className="rounded-xl border border-slate-200 bg-white p-4 text-center text-sm text-slate-500">
                            No existen cotizaciones.
                          </div>
                        )}

                      </div>

                      {/* Órdenes de trabajo */}
                      <div className="mt-6">

                        <h4 className="mb-3 text-lg font-semibold text-slate-800">
                          Órdenes de trabajo
                        </h4>

                        {historialCliente.ordenes_trabajo?.length ? (
                          <div className="space-y-3">
                            {historialCliente.ordenes_trabajo.map(
                              (orden: any) => (
                                <div
                                  key={orden.id}
                                  className="rounded-xl border border-slate-200 bg-white p-4"
                                >
                                  <div className="flex items-start justify-between gap-3">

                                    <div>
                                      <p className="text-xs text-slate-500">
                                        Número
                                      </p>

                                      <p className="font-semibold text-slate-800">
                                        OT-{orden.numero}
                                      </p>
                                    </div>

                                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                                      {orden.estado}
                                    </span>

                                  </div>

                                  <div className="mt-3 grid grid-cols-2 gap-3">

                                    <div>
                                      <p className="text-xs text-slate-500">
                                        Fecha
                                      </p>

                                      <p className="text-sm text-slate-700">
                                        {new Date(
                                          orden.fecha_creacion
                                        ).toLocaleDateString()}
                                      </p>
                                    </div>

                                    <div>
                                      <p className="text-xs text-slate-500">
                                        Total
                                      </p>

                                      <p className="text-sm font-semibold text-slate-700">
                                        Bs{" "}
                                        {Number(
                                          orden.total
                                        ).toFixed(2)}
                                      </p>
                                    </div>

                                  </div>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      navigate(
                                        `/ordenes-trabajo/${orden.id}`
                                      )
                                    }
                                    className="mt-4 w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                                  >
                                    Ver orden
                                  </button>
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <div className="rounded-xl border border-slate-200 bg-white p-4 text-center text-sm text-slate-500">
                            No existen órdenes de trabajo.
                          </div>
                        )}

                      </div>

                    </div>
                  )}

              </div>
            ))
          )}
        </>
      }
    >
      {/* Tabla desktop */}
      <table className="min-w-[900px] w-full">

        <thead className="border-b border-slate-200 bg-slate-50">
          <tr>

            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-600">
              Nombre
            </th>

            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-600">
              Documento
            </th>

            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-600">
              Teléfono
            </th>

            <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-slate-600">
              Acciones
            </th>

          </tr>
        </thead>

        <tbody>

          {cargando ? (
            <tr>
              <td
                colSpan={4}
                className="p-8 text-center text-slate-500"
              >
                Cargando clientes...
              </td>
            </tr>
          ) : clientesFiltrados.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="p-8 text-center text-slate-500"
              >
                No se encontraron clientes.
              </td>
            </tr>
          ) : (
            clientesFiltrados.map((cliente) => (
              <Fragment key={cliente.id}>

                {/* Cliente */}
                <tr className="border-t border-slate-100 transition-colors hover:bg-orange-50/40">

                  <td className="px-4 py-3">
                    {cliente.nombre}
                  </td>

                  <td className="px-4 py-3">
                    {cliente.documento || "-"}
                  </td>

                  <td className="px-4 py-3">
                    {cliente.telefono || "-"}
                  </td>

                  <td className="px-4 py-3">

                    <div className="flex flex-wrap justify-center gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/clientes/${cliente.id}`)
                        }
                        className="rounded-md bg-amber-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-amber-600"
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          verHistorial(cliente.id)
                        }
                        className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700"
                      >
                        {clienteExpandido === cliente.id
                          ? "Ocultar"
                          : "Historial"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          eliminar(cliente.id)
                        }
                        className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-red-700"
                      >
                        Eliminar
                      </button>

                    </div>

                  </td>

                </tr>

                {/* Historial desktop */}
                {clienteExpandido === cliente.id &&
                  historialCliente && (
                    <tr>

                      <td
                        colSpan={4}
                        className="bg-slate-50 p-6"
                      >

                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                          <h3 className="mb-4 text-lg font-semibold text-slate-800">
                            Historial de {cliente.nombre}
                          </h3>

                          <div className="grid gap-6 lg:grid-cols-3">

                            {/* Datos del cliente */}
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                              <h4 className="mb-4 text-lg font-semibold text-slate-800">
                                Datos del cliente
                              </h4>

                              <div className="space-y-2 text-sm text-slate-600">

                                <p>
                                  <strong>Documento:</strong>{" "}
                                  {historialCliente.documento || "-"}
                                </p>

                                <p>
                                  <strong>Teléfono:</strong>{" "}
                                  {historialCliente.telefono || "-"}
                                </p>

                                <p>
                                  <strong>Correo:</strong>{" "}
                                  {historialCliente.correo || "-"}
                                </p>

                                <p>
                                  <strong>Dirección:</strong>{" "}
                                  {historialCliente.direccion || "-"}
                                </p>

                                <p>
                                  <strong>Observaciones:</strong>{" "}
                                  {historialCliente.observaciones || "-"}
                                </p>

                              </div>
                            </div>

                            {/* Historial */}
                            <div className="space-y-6 lg:col-span-2">

                              {/* Cotizaciones */}
                              <div>

                                <h4 className="mb-3 text-lg font-semibold text-slate-800">
                                  Cotizaciones
                                </h4>

                                <div className="overflow-x-auto rounded-xl border border-slate-200">

                                  <table className="min-w-[700px] w-full">

                                    <thead className="bg-slate-50">
                                      <tr>

                                        <th className="px-3 py-3 text-left">
                                          Número
                                        </th>

                                        <th className="px-3 py-3 text-left">
                                          Fecha
                                        </th>

                                        <th className="px-3 py-3 text-left">
                                          Estado
                                        </th>

                                        <th className="px-3 py-3 text-right">
                                          Total
                                        </th>

                                        <th className="px-3 py-3 text-center">
                                          Acción
                                        </th>

                                      </tr>
                                    </thead>

                                    <tbody>

                                      {historialCliente.cotizaciones?.length ? (
                                        historialCliente.cotizaciones.map(
                                          (cotizacion: any) => (
                                            <tr
                                              key={cotizacion.id}
                                              className="border-t border-slate-100"
                                            >

                                              <td className="px-3 py-2">
                                                {cotizacion.numero}
                                              </td>

                                              <td className="px-3 py-2">
                                                {new Date(
                                                  cotizacion.created_at
                                                ).toLocaleDateString()}
                                              </td>

                                              <td className="px-3 py-2">
                                                {cotizacion.estado}
                                              </td>

                                              <td className="px-3 py-2 text-right">
                                                Bs{" "}
                                                {Number(
                                                  cotizacion.total_bs
                                                ).toFixed(2)}
                                              </td>

                                              <td className="px-3 py-2 text-center">

                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    navigate(
                                                      `/cotizaciones/${cotizacion.id}`
                                                    )
                                                  }
                                                  className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                                                >
                                                  Ver
                                                </button>

                                              </td>

                                            </tr>
                                          )
                                        )
                                      ) : (
                                        <tr>

                                          <td
                                            colSpan={5}
                                            className="p-4 text-center text-slate-500"
                                          >
                                            No existen cotizaciones.
                                          </td>

                                        </tr>
                                      )}

                                    </tbody>

                                  </table>

                                </div>

                              </div>

                              {/* Órdenes de trabajo */}
                              <div>

                                <h4 className="mb-3 text-lg font-semibold text-slate-800">
                                  Órdenes de trabajo
                                </h4>

                                <div className="overflow-x-auto rounded-xl border border-slate-200">

                                  <table className="min-w-[700px] w-full">

                                    <thead className="bg-slate-50">
                                      <tr>

                                        <th className="px-3 py-3 text-left">
                                          Número
                                        </th>

                                        <th className="px-3 py-3 text-left">
                                          Fecha
                                        </th>

                                        <th className="px-3 py-3 text-left">
                                          Estado
                                        </th>

                                        <th className="px-3 py-3 text-right">
                                          Total
                                        </th>

                                        <th className="px-3 py-3 text-center">
                                          Acción
                                        </th>

                                      </tr>
                                    </thead>

                                    <tbody>

                                      {historialCliente.ordenes_trabajo?.length ? (
                                        historialCliente.ordenes_trabajo.map(
                                          (orden: any) => (
                                            <tr
                                              key={orden.id}
                                              className="border-t border-slate-100"
                                            >

                                              <td className="px-3 py-2">
                                                OT-{orden.numero}
                                              </td>

                                              <td className="px-3 py-2">
                                                {new Date(
                                                  orden.fecha_creacion
                                                ).toLocaleDateString()}
                                              </td>

                                              <td className="px-3 py-2">
                                                {orden.estado}
                                              </td>

                                              <td className="px-3 py-2 text-right">
                                                Bs{" "}
                                                {Number(
                                                  orden.total
                                                ).toFixed(2)}
                                              </td>

                                              <td className="px-3 py-2 text-center">

                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    navigate(
                                                      `/ordenes-trabajo/${orden.id}`
                                                    )
                                                  }
                                                  className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                                                >
                                                  Ver
                                                </button>

                                              </td>

                                            </tr>
                                          )
                                        )
                                      ) : (
                                        <tr>

                                          <td
                                            colSpan={5}
                                            className="p-4 text-center text-slate-500"
                                          >
                                            No existen órdenes de trabajo.
                                          </td>

                                        </tr>
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

              </Fragment>
            ))
          )}

        </tbody>

      </table>
    </DataTable>
  );
}

export default ClientsPage;