
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