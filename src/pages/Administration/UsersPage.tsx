
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiEdit, FiKey, FiPlus } from "react-icons/fi";

import {
  obtenerUsuarios,
  resetearPassword,
  type Usuario,
} from "../../services/users.service";

import Pagination from "../../components/ui/Pagination";
import DataTable from "../../components/ui/DataTable";
import PrimaryButton from "../../components/ui/PrimaryButton";

export default function UsersPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const PAGE_SIZE = 30;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarUsuarios();
  }, [page]);

  async function cargarUsuarios() {
    try {
      setLoading(true);

      const resultado = await obtenerUsuarios(
        page,
        PAGE_SIZE
      );

      setUsuarios(resultado.data);
      setTotal(resultado.total);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function enviarResetPassword(
    email: string
  ) {
    try {
      await resetearPassword(email);

      alert(
        "Se envió el correo para restablecer la contraseña."
      );
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "No fue posible enviar el correo."
      );
    }
  }

  const inicio =
    total === 0
      ? 0
      : (page - 1) * PAGE_SIZE + 1;

  const fin = Math.min(
    page * PAGE_SIZE,
    total
  );

  return (
    <div className="w-full px-4 py-2 sm:px-0 sm:py-0">
      {/* Volver al inicio */}

      <div className="mb-4">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-all duration-200 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700"
        >
          <FiArrowLeft size={16} />
          Volver al inicio
        </Link>
      </div>

      <DataTable
        title="Usuarios"
        subtitle="Administra los usuarios del sistema."
        action={
          <PrimaryButton to="/usuarios/nuevo">
            <span className="flex items-center gap-2">
              <FiPlus size={18} />
              Nuevo usuario
            </span>
          </PrimaryButton>
        }
        info={
          <div className="text-sm font-medium text-slate-500">
            Mostrando {inicio}-{fin} de {total} usuarios
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
          loading ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500 shadow-sm">
              Cargando usuarios...
            </div>
          ) : usuarios.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500 shadow-sm">
              No hay usuarios registrados.
            </div>
          ) : (
            usuarios.map((usuario) => (
              <div
                key={usuario.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                {/* Encabezado */}

                <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Usuario
                    </p>

                    <p className="mt-1 break-words font-semibold text-slate-800">
                      {usuario.nombre}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-semibold ${
                      usuario.activo
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {usuario.activo
                      ? "Activo"
                      : "Inactivo"}
                  </span>
                </div>

                {/* Datos */}

                <div className="mt-3 space-y-3">
                  <div>
                    <p className="text-xs font-medium text-slate-400">
                      Correo
                    </p>

                    <p className="mt-1 break-all text-sm text-slate-700">
                      {usuario.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-400">
                      Rol
                    </p>

                    <span
                      className={`mt-1 inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${
                        usuario.rol === "admin"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {usuario.rol}
                    </span>
                  </div>
                </div>

                {/* Acciones */}

                <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() =>
                      enviarResetPassword(
                        usuario.email
                      )
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-amber-300 bg-white px-3 py-2.5 text-sm font-medium text-amber-700 transition hover:bg-amber-50"
                  >
                    <FiKey size={16} />
                    Contraseña
                  </button>

                  <Link
                    to={`/usuarios/${usuario.id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700"
                  >
                    <FiEdit size={16} />
                    Editar
                  </Link>
                </div>
              </div>
            ))
          )
        }
      >
        <div className="overflow-x-auto">
          <table className="min-w-[800px] w-full">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-600">
                  Nombre
                </th>

                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-600">
                  Correo
                </th>

                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-600">
                  Rol
                </th>

                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-600">
                  Estado
                </th>

                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-slate-600">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-slate-500"
                  >
                    Cargando usuarios...
                  </td>
                </tr>
              ) : usuarios.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-slate-500"
                  >
                    No hay usuarios registrados.
                  </td>
                </tr>
              ) : (
                usuarios.map((usuario) => (
                  <tr
                    key={usuario.id}
                    className="border-t border-slate-100 transition-colors hover:bg-orange-50/40"
                  >
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {usuario.nombre}
                    </td>

                    <td className="px-4 py-3">
                      {usuario.email}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-md px-3 py-1 text-sm font-medium ${
                          usuario.rol === "admin"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {usuario.rol}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-md px-3 py-1 text-sm font-medium ${
                          usuario.activo
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {usuario.activo
                          ? "Activo"
                          : "Inactivo"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            enviarResetPassword(
                              usuario.email
                            )
                          }
                          title="Restablecer contraseña"
                          className="inline-flex items-center justify-center rounded-md border border-amber-300 bg-white px-3 py-2 text-amber-700 shadow-sm transition-all duration-200 hover:border-amber-400 hover:bg-amber-50"
                        >
                          <FiKey size={17} />
                        </button>

                        <Link
                          to={`/usuarios/${usuario.id}`}
                          className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700"
                        >
                          <FiEdit size={17} />
                          Editar
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </DataTable>
    </div>
  );
}