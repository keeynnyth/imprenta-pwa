
export type Moneda = "USD" | "Bs";

export interface ConversionMoneda {
  montoOriginal: number;
  monedaOriginal: Moneda;
  tasaUtilizada: number;
  montoUsd: number;
  montoBs: number;
}

export function calcularEquivalencias(
  monto: number,
  moneda: Moneda,
  tasa: number
): ConversionMoneda {
  if (tasa <= 0) {
    throw new Error("La tasa debe ser mayor que cero.");
  }

  const montoRedondeado = Number(monto.toFixed(2));

  if (moneda === "USD") {
    return {
      montoOriginal: montoRedondeado,
      monedaOriginal: "USD",
      tasaUtilizada: tasa,
      montoUsd: montoRedondeado,
      montoBs: Number((montoRedondeado * tasa).toFixed(2)),
    };
  }

  return {
    montoOriginal: montoRedondeado,
    monedaOriginal: "Bs",
    tasaUtilizada: tasa,
    montoUsd: Number((montoRedondeado / tasa).toFixed(2)),
    montoBs: montoRedondeado,
  };
}