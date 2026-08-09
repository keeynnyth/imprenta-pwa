import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import { AuthContext } from "./AuthContext";
import type { UsuarioAutenticado } from "./AuthContext";

import { supabase } from "../config/supabase";

interface Props {
  children: ReactNode;
}

export default function AuthProvider({
  children,
}: Props) {
  const [usuario, setUsuario] =
    useState<UsuarioAutenticado | null>(null);

  const [loading, setLoading] = useState(true);

  async function cargarUsuario(
    userId: string
  ) {
    try {
      const { data, error } = await supabase
        .from("usuarios")
        .select(
          "id,email,nombre,rol,activo"
        )
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error(
          "Error cargando usuario:",
          error
        );

        setUsuario(null);
        return;
      }

      if (!data) {
        console.warn(
          "No existe registro en la tabla usuarios."
        );

        setUsuario(null);
        return;
      }

      console.log(
        "Usuario cargado:",
        data
      );

      setUsuario(
        data as UsuarioAutenticado
      );
    } catch (error) {
      console.error(
        "Error inesperado cargando usuario:",
        error
      );

      setUsuario(null);
    }
  }

  useEffect(() => {
    let montado = true;

    async function inicializar() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!montado) return;

        if (!session) {
          setUsuario(null);
          setLoading(false);
          return;
        }

        await cargarUsuario(
          session.user.id
        );

        if (montado) {
          setLoading(false);
        }
      } catch (error) {
        console.error(
          "Error inicializando autenticación:",
          error
        );

        if (montado) {
          setUsuario(null);
          setLoading(false);
        }
      }
    }

    inicializar();

    const {
      data: { subscription },
    } =
      supabase.auth.onAuthStateChange(
        (event, session) => {
          /*
           * Dejamos que Supabase termine de
           * procesar el cambio de autenticación
           * antes de consultar la tabla usuarios.
           */
          setTimeout(async () => {
            if (!montado) return;

            if (!session) {
              setUsuario(null);
              setLoading(false);
              return;
            }

            setLoading(true);

            await cargarUsuario(
              session.user.id
            );

            if (montado) {
              setLoading(false);
            }
          }, 0);
        }
      );

    return () => {
      montado = false;
      subscription.unsubscribe();
    };
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