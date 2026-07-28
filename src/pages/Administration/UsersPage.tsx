import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiEdit, FiPlus } from "react-icons/fi";

import {
  obtenerUsuarios,
  type Usuario,
} from "../../services/users.service";

export default function UsersPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  async function cargarUsuarios() {
    try {
      const data = await obtenerUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Usuarios
          </h1>

          <p className="mt-2 text-slate-500">
            Administra los usuarios del sistema.
          </p>
        </div>

        <Link
          to="/usuarios/nuevo"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
        >
          <FiPlus size={18} />
          Nuevo usuario
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow">
        <table className="min-w-full">
          <thead className="border-b bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left">
                Nombre
              </th>

              <th className="px-4 py-3 text-left">
                Correo
              </th>

              <th className="px-4 py-3 text-left">
                Rol
              </th>

              <th className="px-4 py-3 text-left">
                Estado
              </th>

              <th className="px-4 py-3 text-right">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center"
                >
                  Cargando...
                </td>
              </tr>
            ) : usuarios.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-slate-500"
                >
                  No hay usuarios registrados.
                </td>
              </tr>
            ) : (
              usuarios.map((usuario) => (
                <tr
                  key={usuario.id}
                  className="border-b last:border-b-0"
                >
                  <td className="px-4 py-3">
                    {usuario.nombre}
                  </td>

                  <td className="px-4 py-3">
                    {usuario.email}
                  </td>

                  <td className="px-4 py-3">
                    <span className="rounded bg-slate-100 px-2 py-1 text-sm">
                      {usuario.rol}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`rounded px-2 py-1 text-sm text-white ${
                        usuario.activo
                          ? "bg-green-600"
                          : "bg-red-600"
                      }`}
                    >
                      {usuario.activo
                        ? "Activo"
                        : "Inactivo"}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/usuarios/${usuario.id}`}
                      className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 hover:bg-slate-100"
                    >
                      <FiEdit />
                      Editar
                    </Link>
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