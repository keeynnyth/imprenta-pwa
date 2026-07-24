
import { supabase } from "../config/supabase";

export interface Expense {
  id?: string;
  fecha: string;
  concepto: string;
  monto: number;
  moneda: string;
  metodo_pago: string;
  observaciones?: string;
}

export async function crearEgreso(expense: Expense) {
  const { error } = await supabase
    .from("egresos")
    .insert(expense);

  if (error) throw error;
}

export async function obtenerEgresos() {
  const { data, error } = await supabase
    .from("egresos")
    .select("*")
    .order("fecha", { ascending: false });

  if (error) throw error;

  return data as Expense[];
}

export async function obtenerEgresoPorId(id: string) {
  const { data, error } = await supabase
    .from("egresos")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data as Expense;
}

export async function actualizarEgreso(
  id: string,
  expense: Expense
) {
  const { error } = await supabase
    .from("egresos")
    .update(expense)
    .eq("id", id);

  if (error) throw error;
}

export async function eliminarEgreso(id: string) {
  const { error } = await supabase
    .from("egresos")
    .delete()
    .eq("id", id);

  if (error) throw error;
}