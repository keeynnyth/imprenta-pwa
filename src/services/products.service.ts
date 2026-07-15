
import { supabase } from "../config/supabase";

export interface Producto {
  id: string;
  sku: string;
  nombre: string;
  costo_usd: number;
  activo: boolean;
  created_at: string;
}

export interface NuevoProducto {
  sku: string;
  nombre: string;
  costo_usd: number;
}

export async function obtenerProductos(): Promise<Producto[]> {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .order("nombre");

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function crearProducto(
  producto: NuevoProducto
): Promise<void> {

  const { error } = await supabase
    .from("productos")
    .insert({
      sku: producto.sku,
      nombre: producto.nombre,
      costo_usd: producto.costo_usd,
      activo: true,
    });

  if (error) {
    throw error;
  }
}

export async function obtenerProductoPorId(id: string): Promise<Producto> {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function actualizarProducto(
  id: string,
  producto: NuevoProducto
): Promise<void> {
  const { error } = await supabase
    .from("productos")
    .update({
      sku: producto.sku,
      nombre: producto.nombre,
      costo_usd: producto.costo_usd,
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
}
export async function eliminarProducto(
  id: string
): Promise<void> {

  const { error } = await supabase
    .from("productos")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}
export async function obtenerProductosActivos(): Promise<Producto[]> {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("activo", true)
    .order("nombre");

  if (error) {
    throw error;
  }

  return data ?? [];
}