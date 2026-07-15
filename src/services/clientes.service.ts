
import { supabase } from "../config/supabase";

export interface Cliente {
  id: string;
  nombre: string;
  documento: string | null;
  telefono: string | null;
  correo: string | null;
  direccion: string | null;
  observaciones: string | null;
  created_at: string;
}

//========================================
// Obtener todos los clientes
//========================================

export async function obtenerClientes(): Promise<Cliente[]> {
  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .order("nombre");

  if (error) throw error;

  return data ?? [];
}

//========================================
// Obtener un cliente
//========================================

export async function obtenerCliente(
  id: string
): Promise<Cliente> {
  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

//========================================
// Crear cliente
//========================================

export async function crearCliente(
  cliente: Omit<Cliente, "id" | "created_at">
): Promise<void> {
  const { error } = await supabase
    .from("clientes")
    .insert(cliente);

  if (error) throw error;
}

//========================================
// Actualizar cliente
//========================================

export async function actualizarCliente(
  cliente: Cliente
): Promise<void> {
  const { error } = await supabase
    .from("clientes")
    .update({
      nombre: cliente.nombre,
      documento: cliente.documento,
      telefono: cliente.telefono,
      correo: cliente.correo,
      direccion: cliente.direccion,
      observaciones: cliente.observaciones,
    })
    .eq("id", cliente.id);

  if (error) throw error;
}

//========================================
// Eliminar cliente
//========================================

export async function eliminarCliente(
  id: string
): Promise<void> {
  const { error } = await supabase
    .from("clientes")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
//========================================
// Buscar clientes
//========================================

export async function buscarClientes(
  texto: string
): Promise<Cliente[]> {

  if (!texto.trim()) {
    return [];
  }

  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .or(
      `nombre.ilike.%${texto}%,documento.ilike.%${texto}%`
    )
    .order("nombre")
    .limit(10);

  if (error) {
    throw error;
  }

  return data ?? [];
}