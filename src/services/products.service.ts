
import { supabase } from "../config/supabase";
import { obtenerTasas } from "./rates.service";

export interface Producto {
  id: string;
  sku: string;
  nombre: string;

  costo_usd: number;

  precio_bs: number | null;
  usd_oficial: number | null;

  activo: boolean;
  created_at: string;
}

export interface NuevoProducto {
  sku: string;
  nombre: string;
  costo_usd: number;
}

interface PreciosCalculados {
  precio_bs: number;
  usd_oficial: number;
}

async function calcularPrecios(
  costoUsd: number
): Promise<PreciosCalculados> {
  const tasas = await obtenerTasas();

  const precioBs = Number(
    (costoUsd * tasas.tasa_efectiva).toFixed(2)
  );

  const usdOficial = Number(
    (precioBs / tasas.bcv).toFixed(2)
  );

  return {
    precio_bs: precioBs,
    usd_oficial: usdOficial,
  };
}

export async function obtenerProductos(): Promise<Producto[]> {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .order("nombre");

  if (error) throw error;

  return data ?? [];
}

export async function crearProducto(
  producto: NuevoProducto
): Promise<void> {

  const precios = await calcularPrecios(
    producto.costo_usd
  );

  const nuevoProducto = {
    sku: producto.sku,
    nombre: producto.nombre,
    costo_usd: producto.costo_usd,
    precio_bs: precios.precio_bs,
    usd_oficial: precios.usd_oficial,
    activo: true,
  };

  console.log("Objeto a insertar:", nuevoProducto);

  const { data, error } = await supabase
  .from("productos")
  .insert(nuevoProducto)
  .select();

console.log("Registro insertado:", data);

if (error) {
  console.error(error);
  throw error;
}
}

export async function obtenerProductoPorId(
  id: string
): Promise<Producto> {

  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

export async function actualizarProducto(
  id: string,
  producto: NuevoProducto
): Promise<void> {

  const precios = await calcularPrecios(
    producto.costo_usd
  );

  const { error } = await supabase
    .from("productos")
    .update({
      sku: producto.sku,
      nombre: producto.nombre,
      costo_usd: producto.costo_usd,
      precio_bs: precios.precio_bs,
      usd_oficial: precios.usd_oficial,
    })
    .eq("id", id);

  if (error) throw error;
}

export async function eliminarProducto(
  id: string
): Promise<void> {

  const { error } = await supabase
    .from("productos")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function obtenerProductosActivos(): Promise<Producto[]> {

  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("activo", true)
    .order("nombre");

  if (error) throw error;

  return data ?? [];
}

export async function actualizarPreciosProductos(): Promise<void> {

  const { data: productos, error } = await supabase
    .from("productos")
    .select("*");

  if (error) throw error;

  for (const producto of productos ?? []) {

    const precios = await calcularPrecios(
      producto.costo_usd
    );

    const { error: updateError } = await supabase
      .from("productos")
      .update({
        precio_bs: precios.precio_bs,
        usd_oficial: precios.usd_oficial,
      })
      .eq("id", producto.id);

    if (updateError) throw updateError;
  }
}

export async function obtenerSiguienteSku(): Promise<string> {
  const { data, error } = await supabase
    .from("productos")
    .select("sku");

  if (error) {
    throw error;
  }

  const mayorSku = Math.max(
    0,
    ...(data ?? [])
      .map((p) => Number(p.sku))
      .filter((n) => !isNaN(n))
  );

  return String(mayorSku + 1);
}