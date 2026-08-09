
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

export async function obtenerClientes(
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
    .from("clientes")
    .select("*", {
      count: "exact",
    })
    .order("nombre")
    .range(desde, hasta);

  if (error) {
    throw error;
  }

  return {
    data: data ?? [],
    total: count ?? 0,
  };
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

export async function obtenerClienteConHistorial(
  id: string
) {
  const { data, error } = await supabase
    .from("clientes")
    .select(`
      *,
      cotizaciones (
        id,
        numero,
        created_at,
        estado,
        total_bs
      ),
      ordenes_trabajo (
        id,
        numero,
        fecha_creacion,
        estado,
        total
      )
    `)
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