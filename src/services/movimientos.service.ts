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

  if (error) throw error;

  return data;
}

export async function obtenerMovimientos(
  tipo?: "Ingreso" | "Egreso",
  page = 1,
  pageSize = 30
) {
  const desde = (page - 1) * pageSize;
  const hasta = desde + pageSize - 1;

  let query = supabase
    .from("movimientos")
    .select("*", { count: "exact" });

  if (tipo) {
    query = query.eq("tipo", tipo);
  }

  const {
    data,
    error,
    count,
  } = await query
    .order("fecha", { ascending: false })
    .order("created_at", { ascending: false })
    .range(desde, hasta);

  if (error) {
    throw error;
  }

  return {
    data: data ?? [],
    total: count ?? 0,
  };
}

export async function obtenerTotalesMovimientos() {
  const { count: total } = await supabase
    .from("movimientos")
    .select("*", {
      count: "exact",
      head: true,
    });

  const { count: ingresos } = await supabase
    .from("movimientos")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("tipo", "Ingreso");

  const { count: egresos } = await supabase
    .from("movimientos")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("tipo", "Egreso");

  return {
    total: total ?? 0,
    ingresos: ingresos ?? 0,
    egresos: egresos ?? 0,
  };
}

export async function obtenerMovimientoPorId(
  id: string
) {
  const { data, error } = await supabase
    .from("movimientos")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

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

  if (error) throw error;

  return data;
}

export async function eliminarMovimiento(
  id: string
) {
  const { error } = await supabase
    .from("movimientos")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export interface ResumenFinanciero {

  ingresos_hoy_bs: number;
  ingresos_hoy_usd: number;

  egresos_hoy_bs: number;
  egresos_hoy_usd: number;

  ingresos_semana_bs: number;
  ingresos_semana_usd: number;

  egresos_semana_bs: number;
  egresos_semana_usd: number;

  ingresos_mes_bs: number;
  ingresos_mes_usd: number;

  egresos_mes_bs: number;
  egresos_mes_usd: number;

  ingresos_anio_bs: number;
  ingresos_anio_usd: number;

  egresos_anio_bs: number;
  egresos_anio_usd: number;

  saldo_bs: number;
  saldo_usd: number;
}

export async function obtenerResumenFinanciero(): Promise<ResumenFinanciero> {

  const { data, error } = await supabase
    .from("vw_resumen_financiero")
    .select("*")
    .single();

  if (error) throw error;

  return data;
}