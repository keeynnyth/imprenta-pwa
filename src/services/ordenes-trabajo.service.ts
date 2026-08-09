
import { supabase } from "../config/supabase";
import type { OrdenTrabajo } from "../interfaces/orden-trabajo.interface";

export async function obtenerOrdenesTrabajo(
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
    .from("ordenes_trabajo")
    .select("*", {
      count: "exact",
    })
    .order("numero", {
      ascending: false,
    })
    .range(desde, hasta);

  if (error) {
    throw error;
  }

  return {
    data: (data ?? []) as OrdenTrabajo[],
    total: count ?? 0,
  };
}

export async function crearOrdenTrabajo(data: {
  cotizacion_id: string;
  cliente_id: string;
  fecha_entrega: string;
  total: number;
  abono: number;
  observaciones: string;
}) {
  const { data: orden, error } = await supabase
    .from("ordenes_trabajo")
    .insert({
      cotizacion_id: data.cotizacion_id,
      cliente_id: data.cliente_id,
      fecha_entrega: data.fecha_entrega,
      total: data.total,
      abono: data.abono,
      observaciones: data.observaciones,
      estado: "Pendiente",
    })
   

  if (error) {
    throw error;
  }

  return true;
}

export async function obtenerOrdenTrabajoPorId(
  id: string
) {
  const { data, error } = await supabase
    .from("ordenes_trabajo")
    .select(`
  *,
  cotizaciones (
    id,
    numero,
    cliente,
    documento,

    clientes (
      telefono,
      correo
    ),

    detalle_cotizacion (
      id,
      cantidad,
      precio_usd,
      precio_bs,
      subtotal_usd,
      subtotal_bs,
      productos (
        sku,
        nombre
      )
    )
  )
`)
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function actualizarEstadoOrdenTrabajo(
  id: string,
  estado: string
) {
  const { error } = await supabase
    .from("ordenes_trabajo")
    .update({
      estado,
    })
    .eq("id", id);

  if (error) {
    throw error;
  }

  return true;
}