

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import type { UsuarioAutenticado } from "./AuthContext";
import { supabase } from "../config/supabase";

interface Props {
  children: ReactNode;
}

export default function AuthProvider({ children }: Props) {
  const [usuario, setUsuario] = useState<UsuarioAutenticado | null>(null);
  const [loading, setLoading] = useState(true);

  async function cargarUsuario() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      setUsuario(null);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("usuarios")
      .select("id,email,nombre,rol,activo")
      .eq("id", session.user.id)
      .maybeSingle();

  if (error) {
  console.error("Error cargando usuario:", error);
  setUsuario(null);
  setLoading(false);
  return;
}

if (!data) {
  console.warn("No existe registro en la tabla usuarios.");
  setUsuario(null);
  setLoading(false);
  return;
}
console.log("Usuario cargado:", data);
    setUsuario(data as UsuarioAutenticado);
    setLoading(false);
  }

  useEffect(() => {
    cargarUsuario();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      cargarUsuario();
    });

    return () => subscription.unsubscribe();
  }, []);

  async function cerrarSesion() {
    await supabase.auth.signOut();
    setUsuario(null);
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        loading,
        cerrarSesion,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}