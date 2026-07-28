
import { supabase } from "../config/supabase";

export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  rol: "admin" | "operador";
  activo: boolean;
  created_at: string;
}

export async function obtenerUsuarios(): Promise<Usuario[]> {
  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .order("nombre");

  if (error) {
    throw error;
  }

  return data ?? [];
}