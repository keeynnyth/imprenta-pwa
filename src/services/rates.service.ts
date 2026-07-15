
import { supabase } from "../config/supabase";

export interface Tasas {
  id: string;
  bcv: number;
  binance: number;
  factor_binance: number;
  updated_at: string;
}

export async function obtenerTasas(): Promise<Tasas> {
  const { data, error } = await supabase
    .from("tasas")
    .select("*")
    .limit(1)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function obtenerBCV(): Promise<number> {
  const tasas = await obtenerTasas();
  return tasas.bcv;
}

export async function actualizarTasas(
  tasas: Tasas
): Promise<void> {
  const { error } = await supabase
    .from("tasas")
    .update({
      bcv: tasas.bcv,
      binance: tasas.binance,
      factor_binance: tasas.factor_binance,
      updated_at: new Date().toISOString(),
    })
    .eq("id", tasas.id);

  if (error) {
    throw error;
  }
}