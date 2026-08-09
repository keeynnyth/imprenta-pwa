import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabase";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [guardando, setGuardando] = useState(false);

  async function actualizarPassword(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (password !== confirmacion) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }

    try {
      setGuardando(true);

      const { error } =
        await supabase.auth.updateUser({
          password,
        });

      if (error) {
        throw error;
      }

      toast.success(
        "Contraseña actualizada correctamente."
      );

      navigate("/login", { replace: true });

    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "No fue posible actualizar la contraseña."
      );
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow">

        <h1 className="mb-6 text-center text-2xl font-bold">
          Restablecer contraseña
        </h1>

        <form
          onSubmit={actualizarPassword}
          className="space-y-5"
        >

          <div>
            <label className="mb-2 block">
              Nueva contraseña
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full rounded-lg border p-3"
              minLength={6}
              required
            />
          </div>

          <div>
            <label className="mb-2 block">
              Confirmar contraseña
            </label>

            <input
              type="password"
              value={confirmacion}
              onChange={(e) =>
                setConfirmacion(e.target.value)
              }
              className="w-full rounded-lg border p-3"
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={guardando}
            className="w-full rounded-lg bg-blue-600 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {guardando
              ? "Guardando..."
              : "Actualizar contraseña"}
          </button>

        </form>

      </div>
    </div>
  );
}