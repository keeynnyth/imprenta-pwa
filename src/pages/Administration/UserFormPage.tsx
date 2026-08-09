import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import toast from "react-hot-toast";

import {
  actualizarUsuario,
  crearUsuario,
  obtenerUsuario,
} from "../../services/users.service";
import { useAuth } from "../../contexts/AuthContext";

export default function UserFormPage() {
 const navigate = useNavigate();
const { id } = useParams();
const { usuario: usuarioActual } = useAuth();
  const esEdicion = Boolean(id);
  const esMiUsuario =
  esEdicion &&
  usuarioActual?.id === id;

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [rol, setRol] = useState<"admin" | "operador">(
    "operador"
  );

  const [activo, setActivo] = useState(true);

  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!esEdicion) return;

    cargarUsuario();
  }, []);

  async function cargarUsuario() {
    try {
      setCargando(true);

      const usuario = await obtenerUsuario(id!);

      setNombre(usuario.nombre);
      setEmail(usuario.email);
      setRol(usuario.rol);
      setActivo(usuario.activo);
    } catch (error) {
      console.error(error);
      toast.error("No fue posible cargar el usuario.");
    } finally {
      setCargando(false);
    }
  }

  async function guardarUsuario(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setGuardando(true);

      if (esEdicion) {
        await actualizarUsuario(id!, {
          nombre,
          rol,
          activo,
        });

        toast.success("Usuario actualizado.");
      } else {
        await crearUsuario({
          nombre,
          email,
          password,
          rol,
        });

        toast.success("Usuario creado.");
      }

      navigate("/usuarios");
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Ocurrió un error."
      );
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) {
    return (
      <div className="p-10">
        Cargando usuario...
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">

        <div>
  <Link
    to="/usuarios"
    className="inline-flex items-center gap-2 text-blue-600 hover:underline"
  >
    ← Volver
  </Link>
</div>
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          {esEdicion
            ? "Editar usuario"
            : "Nuevo usuario"}
        </h1>

        <p className="mt-2 text-slate-500">
          {esEdicion
            ? "Modifica la información del usuario."
            : "Crea un nuevo usuario para el sistema."}
        </p>
      </div>

      <form
        onSubmit={guardarUsuario}
        className="space-y-5 rounded-xl bg-white p-6 shadow"
      >
        <div>
          <label className="mb-2 block font-medium">
            Nombre
          </label>

          <input
            type="text"
            value={nombre}
            onChange={(e) =>
              setNombre(e.target.value)
            }
            className="w-full rounded-lg border border-slate-300 p-3"
            required
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Correo electrónico
          </label>

          <input
            type="email"
            value={email}
            disabled={esEdicion}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full rounded-lg border border-slate-300 p-3 disabled:bg-slate-100"
            required
          />
        </div>

        {!esEdicion && (
          <div>
            <label className="mb-2 block font-medium">
              Contraseña temporal
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full rounded-lg border border-slate-300 p-3"
              minLength={6}
              required
            />
          </div>
        )}

        <div>
          <label className="mb-2 block font-medium">
            Rol
          </label>

          <select
            value={rol}
            onChange={(e) =>
              setRol(
                e.target.value as
                  | "admin"
                  | "operador"
              )
            }
            className="w-full rounded-lg border border-slate-300 p-3"
          >
            <option value="operador">
              Operador
            </option>

            <option value="admin">
              Administrador
            </option>
          </select>
        </div>

       {esEdicion && !esMiUsuario && (
  <div className="flex items-center gap-3">
    <input
      id="activo"
      type="checkbox"
      checked={activo}
      onChange={(e) =>
        setActivo(e.target.checked)
      }
    />

    <label htmlFor="activo">
      Usuario activo
    </label>
  </div>
)}

{esMiUsuario && (
  <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
    No puedes desactivar tu propio usuario.
  </div>
)}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/usuarios")}
            className="rounded-lg border border-slate-300 px-5 py-2 hover:bg-slate-100"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={guardando}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {guardando
              ? "Guardando..."
              : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}