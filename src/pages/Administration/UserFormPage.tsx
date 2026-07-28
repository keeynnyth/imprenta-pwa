import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserFormPage() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [rol, setRol] = useState("operador");

  async function guardarUsuario(
    e: React.FormEvent
  ) {
    e.preventDefault();

    // Aquí posteriormente llamaremos
    // a la Edge Function para crear
    // el usuario.

    console.log({
      nombre,
      email,
      password,
      rol,
    });

    navigate("/usuarios");
  }

  return (
    <div className="max-w-3xl space-y-6">

      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Nuevo usuario
        </h1>

        <p className="mt-2 text-slate-500">
          Crea un nuevo usuario para el sistema.
        </p>
      </div>

      <form
        onSubmit={guardarUsuario}
        className="rounded-xl bg-white p-6 shadow space-y-5"
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
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full rounded-lg border border-slate-300 p-3"
            required
          />
        </div>

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
            required
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Rol
          </label>

          <select
            value={rol}
            onChange={(e) =>
              setRol(e.target.value)
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
            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
            Guardar
          </button>

        </div>

      </form>

    </div>
  );
}