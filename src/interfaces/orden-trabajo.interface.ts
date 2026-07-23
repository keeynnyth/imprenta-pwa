
export interface OrdenTrabajo {
  id: string;
  numero: number;

  cotizacion_id: string;
  cliente_id: string;

  fecha_creacion: string;
  fecha_entrega: string;

  total: number;
  abono: number;

  estado:
    | "Pendiente"
    | "En producción"
    | "Lista para entregar"
    | "Entregada"
    | "Cancelada";

  observaciones: string | null;

  created_at: string;
  updated_at: string;
}