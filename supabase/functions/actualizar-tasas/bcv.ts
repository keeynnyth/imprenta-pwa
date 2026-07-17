
const BDV_URL =
  "https://www.bancodevenezuela.com/files/tasas/tasas2.json";

export async function obtenerBCV(): Promise<number> {
  const response = await fetch(BDV_URL, {
  method: "GET",
  headers: {
    "Accept": "*/*",
    "Accept-Language": "es-VE,es;q=0.9",
    "Cache-Control": "no-cache",
    "Pragma": "no-cache",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
  },
});
  if (!response.ok) {
  throw new Error(`BDV respondió con HTTP ${response.status}`);
}

  const data = await response.json();

  const tasa = data?.menudeo?.compra?.dolares;

  if (!tasa) {
    throw new Error("No fue posible obtener la tasa BCV.");
  }

  return Number(tasa.replace(",", "."));
}