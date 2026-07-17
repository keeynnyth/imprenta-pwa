const BINANCE_URL =
  "https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search";

export async function obtenerBinance(): Promise<number> {
  const response = await fetch(BINANCE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      page: 1,
      rows: 10,
      payTypes: [],
      asset: "USDT",
      tradeType: "SELL",
      fiat: "VES",
      publisherType: "merchant",
    }),
  });

  if (!response.ok) {
    throw new Error("No fue posible consultar Binance.");
  }

  const json = await response.json();

  if (!json.data || json.data.length === 0) {
    throw new Error("Binance no devolvió resultados.");
  }

  const precios = json.data.map((item: any) =>
    Number(item.adv.price)
  );

  const promedio =
    precios.reduce((a: number, b: number) => a + b, 0) /
    precios.length;

  return Number(promedio.toFixed(2));
}