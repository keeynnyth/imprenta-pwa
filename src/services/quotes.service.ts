
import { supabase } from "../config/supabase";

export interface DetalleCotizacion {
  productoId: string;
  cantidad: number;
  precioUsd: number;
  precioBs: number;
  subtotalUsd: number;
  subtotalBs: number;
}

export interface NuevaCotizacion {
  cliente_id: string | null;

  cliente: string;
  documento: string;

  observaciones: string;
  agregarIva: boolean;

  subtotalUsd: number;
  subtotalBs: number;

  ivaUsd: number;
  ivaBs: number;

  totalUsd: number;
  totalBs: number;

  detalle: DetalleCotizacion[];
}

async function generarNumeroCotizacion() {

  const { data, error } = await supabase
    .from("cotizaciones")
    .select("numero")
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) {
    throw error;
  }

  if (!data || data.length === 0 || !data[0].numero) {
    return "COT-000001";
  }

  const ultimoNumero = data[0].numero;

  const consecutivo = Number(
    ultimoNumero.replace("COT-", "")
  );

  const siguiente = consecutivo + 1;

  return `COT-${String(siguiente).padStart(6, "0")}`;
}

export async function crearCotizacion(
  cotizacion: NuevaCotizacion
) {
  const numero = await generarNumeroCotizacion();

  const { data, error } = await supabase
    .from("cotizaciones")
    .insert({
  numero,

  cliente_id: cotizacion.cliente_id,

  cliente: cotizacion.cliente,

  documento: cotizacion.documento,

  observaciones: cotizacion.observaciones,

  agregar_iva: cotizacion.agregarIva,

  subtotal_usd: cotizacion.subtotalUsd,
  subtotal_bs: cotizacion.subtotalBs,

  iva_usd: cotizacion.ivaUsd,
  iva_bs: cotizacion.ivaBs,

  total_usd: cotizacion.totalUsd,
  total_bs: cotizacion.totalBs,
})
    .select()
    .single();

  if (error) {
    throw error;
  }

  const detalle = cotizacion.detalle.map((item) => ({
    cotizacion_id: data.id,

    producto_id: item.productoId,

    cantidad: item.cantidad,

    precio_usd: item.precioUsd,
    precio_bs: item.precioBs,

    subtotal_usd: item.subtotalUsd,
    subtotal_bs: item.subtotalBs,
  }));

  const { error: errorDetalle } = await supabase
    .from("detalle_cotizacion")
    .insert(detalle);

  if (errorDetalle) {
    throw errorDetalle;
  }

  return {
  id: data.id,
  numero: data.numero,
};
}
export interface Cotizacion {
  id: string;
  numero: string;
  cliente: string;
  documento: string;
  subtotal_usd: number;
  subtotal_bs: number;
  iva_usd: number;
  iva_bs: number;
  total_usd: number;
  total_bs: number;
  estado: string;
  created_at: string;
  cliente_id: string | null;
}

export async function obtenerCotizaciones(): Promise<Cotizacion[]> {

  const { data, error } = await supabase
    .from("cotizaciones")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];

}
export async function obtenerCotizacionPorId(id: string) {
  const { data, error } = await supabase
    .from("cotizaciones")
    .select(`
      *,
      detalle_cotizacion (
        id,
        cantidad,
        precio_usd,
        precio_bs,
        subtotal_usd,
        subtotal_bs,
        productos (
          nombre,
          sku
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