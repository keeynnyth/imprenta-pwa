import { supabase } from "../config/supabase";

export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  rol: "admin" | "operador";
  activo: boolean;
  created_at: string;
}

export async function obtenerUsuarios(
  page = 1,
  pageSize = 30
) {
  const desde = (page - 1) * pageSize;
  const hasta = desde + pageSize - 1;

  const {
    data,
    error,
    count,
  } = await supabase
    .from("usuarios")
    .select("*", {
      count: "exact",
    })
    .order("nombre")
    .range(desde, hasta);

  if (error) {
    throw error;
  }

  return {
    data: (data ?? []) as Usuario[],
    total: count ?? 0,
  };
}

export async function obtenerUsuario(id: string): Promise<Usuario> {
  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

interface CrearUsuarioRequest {
  nombre: string;
  email: string;
  password: string;
  rol: "admin" | "operador";
}

export async function crearUsuario(
  usuario: CrearUsuarioRequest
) {
  const { data, error } = await supabase.functions.invoke(
    "create-user",
    {
      body: usuario,
    }
  );

  if (error) throw error;

  if (!data.success) {
    throw new Error(data.message);
  }

  return data;
}

interface ActualizarUsuarioRequest {
  nombre: string;
  rol: "admin" | "operador";
  activo: boolean;
}

export async function actualizarUsuario(
  id: string,
  usuario: ActualizarUsuarioRequest
) {
  const { error } = await supabase
    .from("usuarios")
    .update(usuario)
    .eq("id", id);

  if (error) throw error;
}

export async function resetearPassword(
  email: string
) {
  const { error } =
    await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo:
          "http://localhost:5173/reset-password",
      }
    );

  if (error) {
    throw error;
  }
}