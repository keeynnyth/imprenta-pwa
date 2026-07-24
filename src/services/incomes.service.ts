import { supabase } from "../config/supabase";

export interface Ingreso {
  id?: string;
  fecha: string;
  concepto: string;
  monto: number;
  moneda: string;
  metodo_pago: string;
  observaciones?: string;
}

export async function crearIngreso(ingreso: Ingreso) {
  const { data, error } = await supabase
    .from("ingresos")
    .insert([ingreso])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function obtenerIngresos() {
  const { data, error } = await supabase
    .from("ingresos")
    .select("*")
    .order("fecha", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

export async function eliminarIngreso(id: string) {
  const { error } = await supabase
    .from("ingresos")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function obtenerIngresoPorId(id: string) {
  const { data, error } = await supabase
    .from("ingresos")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function actualizarIngreso(
  id: string,
  ingreso: Ingreso
) {
  const { data, error } = await supabase
    .from("ingresos")
    .update(ingreso)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}