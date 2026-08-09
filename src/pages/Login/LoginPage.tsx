import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabase";
import logo from "../../assets/images/logo.png";


export default function LoginPage() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const { error } =
        await supabase.auth.signInWithPassword({
          email: usuario.trim(),
          password,
        });

      if (error) {
        throw error;
      }

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "No fue posible iniciar sesión."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Fondo: fachada del local */}

      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/fachada.jpg')",
        }}
      />

      {/* Capa para suavizar la imagen */}

      <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px]" />

      {/* Contenido */}

      <div className="relative flex min-h-screen items-center justify-center px-4 py-8">

        <div className="w-full max-w-md">

          {/* Tarjeta de login */}

          <div className="rounded-2xl border border-white/70 bg-white/95 p-6 shadow-2xl backdrop-blur-sm sm:p-8">

            {/* Encabezado */}

            <div className="mb-8 text-center">

              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-50 p-3 shadow-sm">
                <img
                  src={logo}
                  alt="LagoGraphi"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                LAGOGRAPHI
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Sistema de Gestión de Imprenta
              </p>

            </div>

            {/* Formulario */}

            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Correo electrónico
                </label>

                <input
                  type="email"
                  value={usuario}
                  onChange={(e) =>
                    setUsuario(e.target.value)
                  }
                  placeholder="correo@ejemplo.com"
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Contraseña
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  required
                />
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                  <p className="text-sm text-red-600">
                    {error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-orange-500 py-3 font-semibold text-white shadow-sm transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500/30 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Ingresando..."
                  : "Ingresar"}
              </button>

            </form>

          </div>

          {/* Pie */}

          <p className="mt-5 text-center text-xs text-slate-600">
            Sistema interno de gestión
          </p>

        </div>

      </div>

    </div>
  );
}