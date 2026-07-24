
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabase";

export default function LoginPage() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
 const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  setError("");



const { error } = await supabase.auth.signInWithPassword({
  email: usuario.trim(),
  password,
});



  if (error) {
  console.error(error);
  setError(error.message);
  return;
}

  localStorage.setItem("admin", "true");
  navigate("/dashboard");
};

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold">
          Iniciar sesión
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Correo electrónico
            </label>
            <input
              type="email"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="w-full rounded border px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border px-3 py-2"
              required
            />
          </div>
{error && (
  <p className="text-sm text-red-600">
    {error}
  </p>
)}
          <button
            type="submit"
            className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}