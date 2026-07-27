import { supabase } from "../config/supabase";

export interface Movimiento {
  id?: string;
  fecha: string;

  tipo: "Ingreso" | "Egreso";

  categoria: string;
  concepto: string;
  referencia?: string;

  monto_original: number;
  moneda: "Bs" | "USD";

  tasa: number;

  monto_bs: number;
  monto_usd: number;

  metodo_pago: string;

  observaciones?: string;

  usuario_id?: string;

  created_at?: string;
  updated_at?: string;
}

export async function crearMovimiento(
  movimiento: Movimiento
) {
  const { data, error } = await supabase
    .from("movimientos")
    .insert([movimiento])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function obtenerMovimientos(
  tipo?: "Ingreso" | "Egreso"
) {
  let query = supabase
    .from("movimientos")
    .select("*");

  if (tipo) {
    query = query.eq("tipo", tipo);
  }

  const { data, error } = await query
    .order("fecha", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

export async function obtenerMovimientoPorId(
  id: string
) {
  const { data, error } = await supabase
    .from("movimientos")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function actualizarMovimiento(
  id: string,
  movimiento: Movimiento
) {
  const { data, error } = await supabase
    .from("movimientos")
    .update(movimiento)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function eliminarMovimiento(
  id: string
) {
  const { error } = await supabase
    .from("movimientos")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}